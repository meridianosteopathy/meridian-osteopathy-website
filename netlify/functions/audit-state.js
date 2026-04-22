// Persists audit punch-list decisions in Netlify Blobs.
//
// Endpoints on this function:
//   GET    /.netlify/functions/audit-state          -> { decisions: { "1": {status, note, updatedAt}, ... } }
//   POST   /.netlify/functions/audit-state          -> { ok: true }   body: { n, decision }
//   DELETE /.netlify/functions/audit-state          -> { ok: true }   (clears all decisions)
//
// Decisions are stored in a single blob under the "audit" store, key "decisions".
// No auth on this endpoint — the /admin/audit/ path is noindex and the decisions
// themselves are low-sensitivity business notes. Add Netlify Identity later if
// needed; see docs/audit-routine-setup.md.

const { getStore } = require("@netlify/blobs");

const STORE_NAME = "audit";
const KEY = "decisions";

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  const store = getStore(STORE_NAME);

  if (event.httpMethod === "GET") {
    const decisions = (await store.get(KEY, { type: "json" })) || {};
    return json(200, { decisions });
  }

  if (event.httpMethod === "POST") {
    let payload;
    try { payload = JSON.parse(event.body || "{}"); }
    catch { return json(400, { ok: false, error: "invalid-json" }); }

    const n = Number(payload.n);
    if (!Number.isFinite(n)) return json(400, { ok: false, error: "missing-n" });

    const current = (await store.get(KEY, { type: "json" })) || {};
    if (payload.decision == null) {
      delete current[n];
    } else {
      const d = payload.decision;
      current[n] = {
        status: d.status || null,
        note: typeof d.note === "string" ? d.note : "",
        updatedAt: d.updatedAt || new Date().toISOString(),
      };
      if (!current[n].status && !current[n].note) delete current[n];
    }
    await store.setJSON(KEY, current);
    return json(200, { ok: true });
  }

  if (event.httpMethod === "DELETE") {
    await store.setJSON(KEY, {});
    return json(200, { ok: true });
  }

  return json(405, { ok: false, error: "method-not-allowed" });
};
