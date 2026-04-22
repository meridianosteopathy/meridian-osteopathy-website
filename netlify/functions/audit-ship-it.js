// Forwards a "Ship it" click from the audit dashboard to a Claude routine's
// API trigger. The routine clones the repo, implements the single punch-list
// item described in the payload, and opens a draft PR.
//
// Flow:
//   Dashboard click
//     -> POST /.netlify/functions/audit-ship-it  (origin-restricted)
//       -> POST <AUDIT_SHIPIT_ROUTINE_URL>  with Authorization: Bearer <token>
//         -> Claude routine runs, opens draft PR
//
// Required Netlify env vars:
//   AUDIT_SHIPIT_ROUTINE_URL    The /fire endpoint URL for the ship-it routine.
//                               Format: https://api.anthropic.com/v1/claude_code/routines/trig_.../fire
//   AUDIT_SHIPIT_ROUTINE_TOKEN  Bearer token for the routine's API trigger.
//                               Shown once when the trigger is created; store
//                               it securely and paste here.
//
// Security: accepts POSTs from browsers only if the Origin header matches the
// production audit dashboard OR a Netlify deploy-preview URL. This isn't
// bullet-proof (headers can be forged) but raises the bar enough that casual
// abuse won't burn through your Max-plan routine allowance. For stronger
// protection, gate the dashboard behind Netlify Identity later.

const ALLOWED_ORIGINS = [
  "https://audit.meridianosteopathy.co.nz",
  "https://meridianosteopathy.co.nz",
];
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/deploy-preview-\d+--meridian-osteopathy\.netlify\.app$/,
];
const ROUTINE_BETA_HEADER = "experimental-cc-routine-2026-04-01";

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { "content-type": "application/json", ...extraHeaders },
    body: JSON.stringify(body),
  };
}

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return ALLOWED_ORIGIN_PATTERNS.some(re => re.test(origin));
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || "";

  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    if (!isAllowedOrigin(origin)) return json(403, { ok: false, error: "origin-not-allowed" });
    return {
      statusCode: 204,
      headers: {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "3600",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "method-not-allowed" });
  }

  if (!isAllowedOrigin(origin)) {
    return json(403, { ok: false, error: "origin-not-allowed" });
  }

  const routineUrl = process.env.AUDIT_SHIPIT_ROUTINE_URL;
  const routineToken = process.env.AUDIT_SHIPIT_ROUTINE_TOKEN;
  if (!routineUrl || !routineToken) {
    return json(500, { ok: false, error: "ship-it-routine-not-configured" });
  }

  let payload;
  try { payload = JSON.parse(event.body || "{}"); }
  catch { return json(400, { ok: false, error: "invalid-json" }); }

  const item = payload.item;
  if (!item || typeof item.n !== "number" || !item.title) {
    return json(400, { ok: false, error: "missing-item" });
  }

  // Build the text payload for the routine. It receives this verbatim
  // alongside its saved prompt; the routine's prompt teaches it how to
  // parse the JSON and implement the item.
  const text = JSON.stringify({
    item: {
      n: item.n,
      title: item.title,
      body: item.body || "",
      files: item.files || [],
      tier: item.tier,
      impact: item.impact,
      effort: item.effort,
      addresses: item.addresses || [],
    },
    note: payload.note || "",
    requestedAt: new Date().toISOString(),
  });

  let res;
  try {
    res = await fetch(routineUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${routineToken}`,
        "anthropic-beta": ROUTINE_BETA_HEADER,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ text }),
    });
  } catch (e) {
    return json(502, { ok: false, error: "routine-fetch-failed", detail: String(e) }, {
      "access-control-allow-origin": origin,
    });
  }

  const routineBody = await res.json().catch(() => ({}));
  if (!res.ok) {
    return json(res.status, {
      ok: false,
      error: "routine-rejected",
      routineStatus: res.status,
      routineBody,
    }, { "access-control-allow-origin": origin });
  }

  return json(200, {
    ok: true,
    sessionId: routineBody.claude_code_session_id || null,
    sessionUrl: routineBody.claude_code_session_url || null,
  }, { "access-control-allow-origin": origin });
};
