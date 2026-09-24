// The clinic owner's side of practitioner review requests, used by the
// reviews page (/admin/reviews/). Requires a Netlify Identity login whose
// email is in auditConfig.reviews.admins — the same login as the content
// editor — so nobody else can send review emails from the clinic domain.
//
//   GET  /.netlify/functions/review-admin               -> { ok, requests, reviewers }
//   POST /.netlify/functions/review-admin  { action, … } where action is:
//     create   { pageUrl, title?, reviewer: { name, email }, message?, source? }
//              Splits the page into sections and emails the reviewer a link.
//     resend   { id, pageUrl?, message? }
//              After feedback: starts the next round (e.g. with the revised
//              page) and emails the reviewer. Before feedback: re-sends the
//              current round, updating the link/message if given.
//     apply    { id, note? }
//              Asks the Ship-it Claude routine to apply the feedback to the
//              page (docs/audit-shipit-routine.md, "Review revisions").
//     close    { id, outcome: "approved" | "cancelled" }
//     delete   { id }
// Every response is JSON; errors come back as { ok: false, error }.

const { sendNotification } = require("./_lib/email");
const { fireShipItRoutine } = require("./_lib/routine");
const R = require("./_lib/reviews");

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
const ROUTINE_TEXT_LIMIT = 60000;

async function loadReviewers(store) {
  return (await store.get("reviewers", { type: "json" })) || {};
}

async function rememberReviewer(store, reviewer) {
  const all = await loadReviewers(store);
  all[reviewer.name.toLowerCase()] = reviewer;
  await store.setJSON("reviewers", all);
}

async function emailReviewer(base, request, admin) {
  const email = R.reviewerEmail(base, request);
  const sent = await sendNotification({ ...email, to: request.reviewer.email, replyTo: admin.email });
  return sent.ok ? { emailSent: true } : { emailSent: false, emailError: sent.reason };
}

function revisionPayload(request, note) {
  const round = R.currentRound(request);
  const build = (commentLimit) => JSON.stringify({
    type: "review-revision",
    review: {
      id: request.id,
      title: request.title,
      pageUrl: round.pageUrl,
      prNumber: R.previewPrNumber(round.pageUrl),
      round: round.n,
      reviewer: request.reviewer.name,
      decision: round.response.decision,
      general: round.response.general.slice(0, commentLimit * 2),
      comments: round.response.comments.map(c => ({ heading: c.heading, comment: c.comment.slice(0, commentLimit) })),
      source: request.source || null,
    },
    note,
    requestedAt: new Date().toISOString(),
  });
  // The routine's text input is capped, so very long feedback is shortened.
  let text = build(R.LIMITS.comment);
  if (text.length > ROUTINE_TEXT_LIMIT) text = build(1000);
  return text;
}

exports.handler = async (event, context) => {
  const admin = R.adminUser(context);
  if (!admin) return R.json(401, { ok: false, error: "login-required" });

  const store = R.openStore(event);
  const base = R.linkBase(event);

  if (event.httpMethod === "GET") {
    const [requests, reviewers] = await Promise.all([R.listRequests(store), loadReviewers(store)]);
    return R.json(200, { ok: true, requests: requests.map(r => R.adminView(base, r)), reviewers: Object.values(reviewers) });
  }
  if (event.httpMethod !== "POST") return R.json(405, { ok: false, error: "method-not-allowed" });

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch { return R.json(400, { ok: false, error: "invalid-json" }); }
  const now = new Date().toISOString();

  if (body.action === "create") {
    const pageUrl = R.parseHttpsUrl(body.pageUrl);
    if (!pageUrl) return R.json(400, { ok: false, error: "page-link-must-start-with-https" });
    const name = R.clip(body.reviewer && body.reviewer.name, R.LIMITS.name);
    const email = R.clip(body.reviewer && body.reviewer.email, 200).toLowerCase();
    if (!name) return R.json(400, { ok: false, error: "missing-reviewer-name" });
    if (!EMAIL_RE.test(email)) return R.json(400, { ok: false, error: "invalid-reviewer-email" });

    const page = await R.fetchSections(pageUrl.href);
    const n = Number(body.source && body.source.n);
    const request = {
      id: R.newId(),
      token: R.newToken(),
      title: R.clip(body.title, R.LIMITS.title) || page.title || pageUrl.href,
      reviewer: { name, email },
      requestedBy: { name: admin.name, email: admin.email },
      source: Number.isInteger(n) && n > 0 ? { type: "audit", n } : { type: "manual" },
      status: "with-reviewer",
      createdAt: now,
      rounds: [{ n: 1, pageUrl: pageUrl.href, message: R.clip(body.message, R.LIMITS.message), sections: page.sections, sentAt: now, response: null, revision: null }],
      history: [{ at: now, event: "sent", round: 1 }],
    };
    await R.saveRequest(store, request);
    await rememberReviewer(store, { name, email });
    const emailResult = await emailReviewer(base, request, admin);
    return R.json(200, { ok: true, request: R.adminView(base, request), splitIntoSections: page.split, ...emailResult });
  }

  const request = await R.loadRequest(store, body.id);
  if (!request) return R.json(404, { ok: false, error: "not-found" });
  const round = R.currentRound(request);

  if (body.action === "resend") {
    if (!["with-reviewer", "feedback", "revising"].includes(request.status)) {
      return R.json(409, { ok: false, error: "closed" });
    }
    const pageUrl = body.pageUrl ? R.parseHttpsUrl(body.pageUrl) : R.parseHttpsUrl(round.pageUrl);
    if (!pageUrl) return R.json(400, { ok: false, error: "page-link-must-start-with-https" });
    const message = body.message != null ? R.clip(body.message, R.LIMITS.message) : round.message;
    if (round.response) {
      // Feedback was given, so this is the next round: re-read the (revised) page.
      const page = await R.fetchSections(pageUrl.href);
      request.rounds.push({ n: round.n + 1, pageUrl: pageUrl.href, message, sections: page.sections, sentAt: now, response: null, revision: null });
      request.history.push({ at: now, event: "sent", round: round.n + 1 });
    } else {
      // No feedback yet: a reminder, optionally pointing at a new link.
      if (pageUrl.href !== round.pageUrl) round.sections = (await R.fetchSections(pageUrl.href)).sections;
      round.pageUrl = pageUrl.href;
      round.message = message;
      round.sentAt = now;
      request.history.push({ at: now, event: "reminder", round: round.n });
    }
    request.status = "with-reviewer";
    await R.saveRequest(store, request);
    const emailResult = await emailReviewer(base, request, admin);
    return R.json(200, { ok: true, request: R.adminView(base, request), ...emailResult });
  }

  if (body.action === "apply") {
    if (request.status !== "feedback" || !round.response) {
      return R.json(409, { ok: false, error: "no-feedback-to-apply" });
    }
    const note = R.clip(body.note, R.LIMITS.message);
    const fired = await fireShipItRoutine(revisionPayload(request, note));
    if (!fired.ok) return R.json(fired.status >= 400 ? fired.status : 502, { ok: false, error: fired.error, detail: fired.detail });
    round.revision = { requestedAt: now, note, sessionUrl: fired.sessionUrl };
    request.status = "revising";
    request.history.push({ at: now, event: "revision-requested", round: round.n });
    await R.saveRequest(store, request);
    return R.json(200, { ok: true, request: R.adminView(base, request), sessionUrl: fired.sessionUrl });
  }

  if (body.action === "close") {
    if (!["approved", "cancelled"].includes(body.outcome)) return R.json(400, { ok: false, error: "invalid-outcome" });
    request.status = body.outcome;
    request.closedAt = now;
    request.history.push({ at: now, event: body.outcome, round: round.n });
    await R.saveRequest(store, request);
    return R.json(200, { ok: true, request: R.adminView(base, request) });
  }

  if (body.action === "delete") {
    await store.delete(`request/${request.id}`);
    return R.json(200, { ok: true });
  }

  return R.json(400, { ok: false, error: "unknown-action" });
};
