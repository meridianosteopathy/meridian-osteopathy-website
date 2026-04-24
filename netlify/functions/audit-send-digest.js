// Sends the weekly audit digest email.
//
// Called by the Claude routine at the end of each run, via:
//   POST /.netlify/functions/audit-send-digest
//   Authorization: Bearer <AUDIT_DIGEST_TOKEN>
//
// Reads the current audit data file from the live site, pulls decisions
// from Netlify Blobs, computes a concise summary, and emails it to
// nina@meridianosteopathy.co.nz (override with AUDIT_DIGEST_TO).
//
// Required env vars (set in Netlify → Site configuration → Environment):
//   AUDIT_DIGEST_TOKEN    shared secret the routine presents in Authorization
//   RESEND_API_KEY        (already set for the forms)
//   AUDIT_DIGEST_TO       (optional, defaults to nina@meridianosteopathy.co.nz)
//   URL                   set by Netlify automatically (site base URL)

const { getStore } = require("@netlify/blobs");
const { sendNotification } = require("./_lib/email");

// audit.json is bundled into the function at build time by esbuild, so the
// function picks up the latest data on each deploy. The weekly routine
// commits a refreshed audit.json, which triggers a Netlify build, which
// re-bundles this function — so the digest always reads current data.
const audit = require("../../src/_data/audit.json");
// Optional — query-pool data file may not yet exist on older deploys.
let auditQueries = { pool: [], meta: {} };
try { auditQueries = require("../../src/_data/auditQueries.json"); } catch (e) { /* file missing is fine */ }

const DIGEST_TO_DEFAULT = "nina@meridianosteopathy.co.nz";

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

function fmt(items) {
  if (!items.length) return "  (none)";
  return items.map(i => `  • #${i.n} ${i.title} (Tier ${i.tier}, Impact ${i.impact}, Effort ${i.effort})`).join("\n");
}

function fmtQueries(list) {
  if (!list.length) return "  (none — nicely done)";
  return list.map(q => {
    const r = q.lastResult || {};
    const topDomain = (r.topDomains && r.topDomains[0]) || "unknown";
    const rank = r.meridianRank == null || r.meridianRank === 0 ? "absent" : `#${r.meridianRank}`;
    return `  • "${q.q}" — ${rank}, top: ${topDomain}`;
  }).join("\n");
}

function fmtHtml(items) {
  if (!items.length) return "<li><em>none</em></li>";
  return items.map(i => `<li><strong>#${i.n}</strong> ${escapeHtml(i.title)} <span style="color:#6a6a6a;font-size:0.9em;">— Tier ${i.tier}, Impact ${i.impact}, Effort ${i.effort}</span></li>`).join("");
}

function fmtMissedQueriesHtml(list) {
  if (!list.length) return "<li><em>None — you're ranking in top 10 for everything checked this week.</em></li>";
  return list.map(q => {
    const r = q.lastResult || {};
    const topDomain = (r.topDomains && r.topDomains[0]) || "unknown";
    const rank = r.meridianRank == null || r.meridianRank === 0 ? `<span style="color:#B1536D;">absent</span>` : `#${r.meridianRank}`;
    return `<li><strong>"${escapeHtml(q.q)}"</strong> — ${rank}, top result: <code>${escapeHtml(topDomain)}</code></li>`;
  }).join("");
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

exports.handler = async (event) => {
  const expected = process.env.AUDIT_DIGEST_TOKEN;
  const presented = (event.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!expected || presented !== expected) {
    return json(401, { ok: false, error: "unauthorized" });
  }

  const dashboardUrl = "https://audit.meridianosteopathy.co.nz/";

  // Pull decisions from Netlify Blobs.
  const store = getStore("audit");
  const decisions = (await store.get("decisions", { type: "json" })) || {};

  const items = audit.items || [];
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const newItems = items.filter(i => {
    if (!i.firstSeen) return false;
    return new Date(i.firstSeen).getTime() >= sevenDaysAgo;
  });
  const approved = items.filter(i => decisions[i.n] && decisions[i.n].status === "approve");
  const parked = items.filter(i => decisions[i.n] && decisions[i.n].status === "park");
  const pendingTier1 = items.filter(i => i.tier === 1 && !(decisions[i.n] && decisions[i.n].status));
  const quickWins = items.filter(i => i.effort === "S" && i.impact === "H" && !(decisions[i.n] && decisions[i.n].status === "dismiss"));

  // Search-visibility signals: top queries where Meridian isn't in the top 10
  // (or hasn't been detected at all), sorted by priority. Only include queries
  // that were actually checked in a run — unchecked ones are noise.
  const svPool = auditQueries.pool || [];
  const svChecked = svPool.filter(q => q.lastResult);
  const svMissed = svChecked
    .filter(q => {
      const rank = q.lastResult && q.lastResult.meridianRank;
      return rank == null || rank === 0 || rank > 10;
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, 5);
  const svTopN = svChecked.filter(q => q.lastResult.meridianRank != null && q.lastResult.meridianRank > 0 && q.lastResult.meridianRank <= 10).length;

  const subject = `Meridian weekly audit — ${newItems.length} new, ${approved.length} approved, ${pendingTier1.length} Tier 1 pending`;

  const text = [
    `Your weekly AI search audit is refreshed.`,
    ``,
    `Dashboard: ${dashboardUrl}`,
    `Report date: ${audit.meta && audit.meta.reportDate}`,
    ``,
    `NEW this week (${newItems.length}):`,
    fmt(newItems),
    ``,
    `QUICK WINS ready to ship (Impact H, Effort S):`,
    fmt(quickWins),
    ``,
    `TIER 1 still pending your decision (${pendingTier1.length}):`,
    fmt(pendingTier1),
    ``,
    `APPROVED and waiting to be shipped (${approved.length}):`,
    fmt(approved),
    ``,
    `PARKED (${parked.length}):`,
    fmt(parked),
    ``,
    svChecked.length ? `SEARCH VISIBILITY — ${svTopN}/${svChecked.length} queries in top 10` : ``,
    svChecked.length ? `Top missed (priority-ranked, not in top 10):` : ``,
    svChecked.length ? fmtQueries(svMissed) : ``,
    svChecked.length ? `` : ``,
    `Open the dashboard to approve, park, dismiss, or add notes:`,
    dashboardUrl,
  ].filter(Boolean).join("\n");

  const html = `
<!doctype html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #120E0B; max-width: 620px; margin: 0 auto; padding: 24px;">
  <h1 style="font-family: Baskervville, Georgia, serif; font-weight: 400; color: #345E85; border-bottom: 2px solid #345E85; padding-bottom: 8px;">Weekly AI search audit</h1>
  <p style="color: #6a6a6a; font-size: 0.9rem; margin-top: 0;">Report date: ${escapeHtml((audit.meta && audit.meta.reportDate) || "")}</p>
  <p><a href="${dashboardUrl}" style="background: #345E85; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block;">Open the dashboard →</a></p>

  <h2 style="font-family: Baskervville, Georgia, serif; font-weight: 400; color: #120E0B; margin-top: 32px;">New this week (${newItems.length})</h2>
  <ul>${fmtHtml(newItems)}</ul>

  <h2 style="font-family: Baskervville, Georgia, serif; font-weight: 400; color: #120E0B; margin-top: 32px;">Quick wins ready to ship</h2>
  <p style="color:#6a6a6a;font-size:0.88rem;margin-top:0;">High impact, small effort.</p>
  <ul>${fmtHtml(quickWins)}</ul>

  <h2 style="font-family: Baskervville, Georgia, serif; font-weight: 400; color: #120E0B; margin-top: 32px;">Tier 1 pending your decision (${pendingTier1.length})</h2>
  <ul>${fmtHtml(pendingTier1)}</ul>

  <h2 style="font-family: Baskervville, Georgia, serif; font-weight: 400; color: #120E0B; margin-top: 32px;">Approved, waiting to ship (${approved.length})</h2>
  <ul>${fmtHtml(approved)}</ul>

  <h2 style="font-family: Baskervville, Georgia, serif; font-weight: 400; color: #120E0B; margin-top: 32px;">Parked (${parked.length})</h2>
  <ul>${fmtHtml(parked)}</ul>

  ${svChecked.length ? `
  <h2 style="font-family: Baskervville, Georgia, serif; font-weight: 400; color: #120E0B; margin-top: 32px;">Search visibility — ${svTopN}/${svChecked.length} in top 10</h2>
  <p style="color:#6a6a6a;font-size:0.88rem;margin-top:0;">Real user queries for Christchurch osteopathy/acupuncture services. Missed = not in Google top 10 AND not surfaced by AI Overview.</p>
  <ul>${fmtMissedQueriesHtml(svMissed)}</ul>
  ` : ""}

  <hr style="border: 0; border-top: 1px solid #d0d8e0; margin: 32px 0 16px;">
  <p style="color: #6a6a6a; font-size: 0.85rem;">You're receiving this because you subscribed to the weekly audit. Turn it off by deleting or pausing the "Meridian weekly audit" routine at <a href="https://claude.ai/code/routines" style="color:#345E85;">claude.ai/code/routines</a>.</p>
</body>
</html>`;

  const to = process.env.AUDIT_DIGEST_TO || DIGEST_TO_DEFAULT;
  const result = await sendNotification({ subject, text, html, to });

  if (!result.ok) {
    return json(500, { ok: false, error: "email-send-failed", detail: result.reason });
  }

  return json(200, { ok: true, counts: {
    new: newItems.length,
    quickWins: quickWins.length,
    pendingTier1: pendingTier1.length,
    approved: approved.length,
    parked: parked.length,
  }});
};
