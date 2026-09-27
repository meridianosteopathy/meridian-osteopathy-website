// The reviewer's side of a practitioner review request. The reviewer opens
// the private link from their email (/admin/reviews/respond/?id=…&t=…); the
// id + secret token in that link are the only credentials — no login.
//
//   GET  /.netlify/functions/review-public?id=…&t=…   -> { ok, review }
//   POST /.netlify/functions/review-public            -> { ok }
//        body: { id, t, decision, general, comments: [{ index, comment }] }
//
// Submitting stores the reviewer's feedback on the current round and emails
// the clinic owner, who decides what happens next (review-admin.js).
// Resubmitting is allowed until the owner acts on it.

const { sendNotification } = require("./_lib/email");
const R = require("./_lib/reviews");

const OPEN_FOR_FEEDBACK = ["with-reviewer", "feedback"];

async function findRequest(store, id, token) {
  const request = await R.loadRequest(store, id);
  // Same answer for an unknown id and a wrong token.
  return request && R.tokenMatches(request.token, token) ? request : null;
}

exports.handler = async (event) => {
  const store = R.openStore(event);

  if (event.httpMethod === "GET") {
    const q = event.queryStringParameters || {};
    const request = await findRequest(store, q.id, q.t);
    if (!request) return R.json(404, { ok: false, error: "not-found" });
    return R.json(200, { ok: true, review: R.publicView(request) });
  }

  if (event.httpMethod !== "POST") {
    return R.json(405, { ok: false, error: "method-not-allowed" });
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch { return R.json(400, { ok: false, error: "invalid-json" }); }

  const request = await findRequest(store, body.id, body.t);
  if (!request) return R.json(404, { ok: false, error: "not-found" });
  if (!OPEN_FOR_FEEDBACK.includes(request.status)) {
    return R.json(409, { ok: false, error: request.status === "revising" ? "being-revised" : "closed" });
  }
  if (!R.DECISIONS[body.decision]) {
    return R.json(400, { ok: false, error: "missing-decision" });
  }

  const round = R.currentRound(request);
  const comments = [];
  for (const c of Array.isArray(body.comments) ? body.comments : []) {
    const index = Number(c && c.index);
    const comment = R.clip(c && c.comment, R.LIMITS.comment);
    if (!Number.isInteger(index) || !round.sections[index] || !comment) continue;
    if (comments.some(x => x.index === index)) continue;
    comments.push({ index, heading: round.sections[index].heading, comment });
  }
  comments.sort((a, b) => a.index - b.index);

  const resubmitted = !!round.response;
  round.response = {
    decision: body.decision,
    general: R.clip(body.general, R.LIMITS.general),
    comments,
    submittedAt: new Date().toISOString(),
  };
  request.status = "feedback";
  request.history.push({ at: round.response.submittedAt, event: resubmitted ? "feedback-updated" : "feedback", round: round.n, decision: body.decision });
  await R.saveRequest(store, request);

  const base = R.linkBase(event);
  const email = R.feedbackEmail(base, request);
  const sent = await sendNotification({
    ...email,
    subject: resubmitted ? `${email.subject} (updated)` : email.subject,
    to: request.requestedBy.email || R.config.digest.to,
  });
  if (!sent.ok) console.warn("review feedback email not sent", sent.reason);

  return R.json(200, { ok: true });
};
