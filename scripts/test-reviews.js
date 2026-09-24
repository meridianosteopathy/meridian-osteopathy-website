// Standalone checks for the practitioner review functions — no test runner,
// no network. Netlify Blobs is an in-memory map, Resend and the Ship-it
// routine are stubs, and the page being reviewed is a small HTML fixture.
//
//   node scripts/test-reviews.js

const Module = require("module");
const path = require("path");
const assert = require("assert");

const LIB = path.resolve(__dirname, "../netlify/functions/_lib");
const blobs = new Map();
const memoryStore = {
  get: async (key) => (blobs.has(key) ? JSON.parse(blobs.get(key)) : null),
  setJSON: async (key, value) => { blobs.set(key, JSON.stringify(value)); },
  delete: async (key) => { blobs.delete(key); },
  list: async ({ prefix }) => ({ blobs: [...blobs.keys()].filter(k => k.startsWith(prefix)).map(key => ({ key })) }),
};
const sent = [];
let routineCalls = [];
const realRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === "@netlify/blobs") return { getStore: () => memoryStore, connectLambda: () => {} };
  const abs = id.startsWith(".") ? path.resolve(path.dirname(this.filename), id) : id;
  if (abs === path.join(LIB, "email")) return { sendNotification: async (m) => { sent.push(m); return { ok: true }; } };
  if (abs === path.join(LIB, "routine")) return { fireShipItRoutine: async (text) => { routineCalls.push(JSON.parse(text)); return { ok: true, status: 200, sessionUrl: "https://claude.ai/code/session_x" }; } };
  return realRequire.apply(this, arguments);
};

const R = require("../netlify/functions/_lib/reviews");
const admin = require("../netlify/functions/review-admin");
const reviewer = require("../netlify/functions/review-public");

const PAGE = `<!doctype html><html><head><title>Postpartum Recovery | Meridian Osteopathy</title></head><body>
<header><nav>Home Services</nav></header>
<main>
  <nav class="breadcrumbs">Home › Conditions</nav>
  <h1>Postpartum Recovery</h1><p>Gentle care after birth &amp; beyond.</p>
  <script type="application/ld+json">{"x":"</p>"}</script>
  <h2>Common signs</h2><ul><li>Back ache</li><li>Pelvic &lsquo;clicking&rsquo;</li></ul>
  <h2>How we treat it</h2><div class="faq-item"><button>Is it safe?</button><div><p>Yes &#8212; always.</p></div></div>
</main><footer>Footer text</footer></body></html>`;

const pageFetch = async (url) => ({
  ok: true,
  headers: { get: () => "text/html; charset=utf-8" },
  text: async () => PAGE,
});

const ADMIN_CTX = { clientContext: { user: { email: "Nina@meridianosteopathy.co.nz", user_metadata: { full_name: "Nina Hu" } } } };
const HOST = { host: "audit.meridianosteopathy.co.nz" };
const call = async (fn, method, { body, query, context } = {}) => {
  const res = await fn.handler({ httpMethod: method, headers: HOST, body: body && JSON.stringify(body), queryStringParameters: query }, context);
  return { status: res.statusCode, body: JSON.parse(res.body) };
};

(async () => {
  // ---- section extraction ----
  const x = R.extractSections(PAGE);
  assert.strictEqual(x.title, "Postpartum Recovery");
  assert.deepStrictEqual(x.sections.map(s => s.heading), ["Postpartum Recovery (introduction)", "Common signs", "How we treat it"]);
  assert.strictEqual(x.sections[0].text, "Gentle care after birth & beyond.", "breadcrumb nav, script and header/footer are dropped");
  assert.strictEqual(x.sections[1].text, "• Back ache\n• Pelvic ‘clicking’");
  assert.strictEqual(x.sections[2].text, "Is it safe?\nYes — always.");
  assert.ok(!/[<>]/.test(x.sections.map(s => s.text).join("")), "sections never contain markup");
  assert.strictEqual(R.htmlToText("<p>Read more &rarr; M&amacr;ori &copy; &#x2019; &unknown;</p>"), "Read more → Māori © ’ &unknown;");

  // ---- which links are this site's ----
  assert.strictEqual(R.isSiteUrl("https://deploy-preview-7--meridian-osteopathy.netlify.app/conditions/x/"), true);
  assert.strictEqual(R.isSiteUrl("https://meridianosteopathy.co.nz/"), true);
  assert.strictEqual(R.isSiteUrl("https://evil--meridian-osteopathy.netlify.app.example.com/"), false);
  assert.strictEqual(R.isSiteUrl("http://meridianosteopathy.co.nz/"), false);
  assert.strictEqual(R.previewPrNumber("https://deploy-preview-131--meridian-osteopathy.netlify.app/x"), 131);
  assert.strictEqual(R.previewPrNumber("https://meridianosteopathy.co.nz/x"), null);

  // Other sites are not fetched: one "whole page" box.
  let fetched = 0;
  const other = await R.fetchSections("https://docs.google.com/document/d/abc", async () => { fetched++; });
  assert.strictEqual(fetched, 0);
  assert.deepStrictEqual(other.sections, [R.WHOLE_PAGE]);

  // ---- auth ----
  assert.strictEqual((await call(admin, "GET", {})).status, 401, "no login");
  assert.strictEqual((await call(admin, "GET", { context: { clientContext: { user: { email: "someone@else.nz" } } } })).status, 401, "not an admin");

  // ---- create ----
  global.fetch = pageFetch;
  let res = await call(admin, "POST", { context: ADMIN_CTX, body: { action: "create", pageUrl: "http://x.nz", reviewer: { name: "Kaylee Frost", email: "k@meridianosteopathy.co.nz" } } });
  assert.strictEqual(res.body.error, "page-link-must-start-with-https");
  res = await call(admin, "POST", { context: ADMIN_CTX, body: { action: "create", pageUrl: "https://meridianosteopathy.co.nz/", reviewer: { name: "Kaylee Frost", email: "not-an-email" } } });
  assert.strictEqual(res.body.error, "invalid-reviewer-email");

  res = await call(admin, "POST", { context: ADMIN_CTX, body: {
    action: "create",
    pageUrl: "https://deploy-preview-131--meridian-osteopathy.netlify.app/conditions/postpartum-recovery/",
    reviewer: { name: "Kaylee Frost", email: "Kaylee@meridianosteopathy.co.nz" },
    message: "Mainly checking the treatment section",
    source: { type: "audit", n: 36 },
  } });
  assert.strictEqual(res.status, 200, JSON.stringify(res.body));
  assert.strictEqual(res.body.splitIntoSections, true);
  assert.strictEqual(res.body.emailSent, true);
  const created = res.body.request;
  assert.strictEqual(created.title, "Postpartum Recovery", "title defaults to the page title");
  assert.strictEqual(created.token, undefined, "admin view never exposes the raw token field");
  assert.strictEqual(created.prNumber, 131);
  assert.deepStrictEqual(created.source, { type: "audit", n: 36 });
  const link = new URL(created.reviewerLink);
  assert.strictEqual(link.origin, "https://audit.meridianosteopathy.co.nz");
  const id = link.searchParams.get("id");
  const t = link.searchParams.get("t");

  const invite = sent.pop();
  assert.strictEqual(invite.to, "kaylee@meridianosteopathy.co.nz");
  assert.strictEqual(invite.replyTo, "Nina@meridianosteopathy.co.nz", "replies go to the owner");
  assert.strictEqual(invite.subject, "Please review: Postpartum Recovery");
  assert.ok(invite.text.startsWith("Hi Kaylee,"));
  assert.ok(invite.text.includes(created.reviewerLink));
  assert.ok(invite.text.includes("Mainly checking the treatment section"));

  // Reviewer email is remembered for next time.
  res = await call(admin, "GET", { context: ADMIN_CTX });
  assert.deepStrictEqual(res.body.reviewers, [{ name: "Kaylee Frost", email: "kaylee@meridianosteopathy.co.nz" }]);
  assert.strictEqual(res.body.requests.length, 1);

  // ---- reviewer: open + submit ----
  assert.strictEqual((await call(reviewer, "GET", { query: { id, t: "0".repeat(48) } })).status, 404, "wrong token");
  assert.strictEqual((await call(reviewer, "GET", { query: { id: "r_0000000000000000", t } })).status, 404, "unknown id");
  res = await call(reviewer, "GET", { query: { id, t } });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.review.sections.length, 3);
  assert.strictEqual(res.body.review.reviewerName, "Kaylee Frost");
  assert.ok(!JSON.stringify(res.body).includes("@"), "reviewer view has no email addresses");

  res = await call(reviewer, "POST", { body: { id, t, general: "Nice" } });
  assert.strictEqual(res.body.error, "missing-decision");
  res = await call(reviewer, "POST", { body: { id, t, decision: "changes", general: " Mostly good ", comments: [
    { index: 2, comment: "We don't say 'always' — say 'at every stage'." },
    { index: 1, comment: "   " },
    { index: 99, comment: "no such section" },
  ] } });
  assert.strictEqual(res.status, 200, JSON.stringify(res.body));
  const feedbackMail = sent.pop();
  assert.strictEqual(feedbackMail.to, "Nina@meridianosteopathy.co.nz");
  assert.strictEqual(feedbackMail.subject, "Kaylee Frost reviewed “Postpartum Recovery”: Needs changes");
  assert.ok(feedbackMail.text.includes("How we treat it: We don't say 'always'"));

  res = await call(admin, "GET", { context: ADMIN_CTX });
  let r = res.body.requests[0];
  assert.strictEqual(r.status, "feedback");
  assert.deepStrictEqual(r.rounds[0].response.comments, [{ index: 2, heading: "How we treat it", comment: "We don't say 'always' — say 'at every stage'." }]);
  assert.strictEqual(r.rounds[0].response.general, "Mostly good");

  // ---- owner: apply with Claude ----
  res = await call(admin, "POST", { context: ADMIN_CTX, body: { action: "apply", id, note: "Keep the intro as is" } });
  assert.strictEqual(res.status, 200, JSON.stringify(res.body));
  assert.strictEqual(res.body.request.status, "revising");
  const payload = routineCalls.pop();
  assert.strictEqual(payload.type, "review-revision");
  assert.strictEqual(payload.review.prNumber, 131);
  assert.strictEqual(payload.review.reviewer, "Kaylee Frost");
  assert.deepStrictEqual(payload.review.comments, [{ heading: "How we treat it", comment: "We don't say 'always' — say 'at every stage'." }]);
  assert.strictEqual(payload.note, "Keep the intro as is");
  assert.ok(!JSON.stringify(payload).includes("@"), "no emails or tokens go to the routine");

  // While Claude revises, the reviewer can't change their feedback.
  res = await call(reviewer, "POST", { body: { id, t, decision: "approve" } });
  assert.strictEqual(res.body.error, "being-revised");
  // …and a second apply is refused.
  res = await call(admin, "POST", { context: ADMIN_CTX, body: { action: "apply", id } });
  assert.strictEqual(res.body.error, "no-feedback-to-apply");

  // ---- owner: send the updated version (round 2) ----
  res = await call(admin, "POST", { context: ADMIN_CTX, body: { action: "resend", id, message: "Updated the treatment section" } });
  assert.strictEqual(res.status, 200, JSON.stringify(res.body));
  r = res.body.request;
  assert.strictEqual(r.status, "with-reviewer");
  assert.strictEqual(r.rounds.length, 2);
  assert.strictEqual(sent.pop().subject, "Updated version to review: Postpartum Recovery");
  res = await call(reviewer, "GET", { query: { id, t } });
  assert.strictEqual(res.body.review.round, 2);
  assert.strictEqual(res.body.review.response, null);
  assert.strictEqual(res.body.review.previousComments[0].heading, "How we treat it", "round 2 shows round-1 comments");

  // A reminder before feedback doesn't start another round.
  res = await call(admin, "POST", { context: ADMIN_CTX, body: { action: "resend", id } });
  assert.strictEqual(res.body.request.rounds.length, 2);

  res = await call(reviewer, "POST", { body: { id, t, decision: "approve" } });
  assert.strictEqual(res.status, 200);

  // ---- owner makes the final call ----
  res = await call(admin, "POST", { context: ADMIN_CTX, body: { action: "close", id, outcome: "approved" } });
  assert.strictEqual(res.body.request.status, "approved");
  res = await call(reviewer, "POST", { body: { id, t, decision: "changes" } });
  assert.strictEqual(res.body.error, "closed", "closed requests take no more feedback");
  res = await call(reviewer, "GET", { query: { id, t } });
  assert.strictEqual(res.body.review.status, "approved", "the reviewer can still open a closed request");

  res = await call(admin, "POST", { context: ADMIN_CTX, body: { action: "delete", id } });
  assert.strictEqual(res.status, 200);
  assert.strictEqual((await call(admin, "GET", { context: ADMIN_CTX })).body.requests.length, 0);

  console.log("reviews: all checks passed");
})().catch(err => {
  console.error(err);
  process.exit(1);
});
