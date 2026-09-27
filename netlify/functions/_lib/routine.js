// Fires the "Meridian audit - Ship it" Claude routine through its API
// trigger. Shared by audit-ship-it.js (implement an audit item) and
// review-admin.js (apply a practitioner's review feedback) — the routine's
// instructions (docs/audit-shipit-routine.md) handle both payload types.
//
// Required Netlify env vars:
//   AUDIT_SHIPIT_ROUTINE_URL    The routine's /fire endpoint URL.
//   AUDIT_SHIPIT_ROUTINE_TOKEN  Bearer token for the routine's API trigger.

const ROUTINE_BETA_HEADER = "experimental-cc-routine-2026-04-01";

// `text` is delivered to the routine verbatim, after its saved prompt.
// Resolves to { ok, status, error?, detail?, routineBody?, sessionId?, sessionUrl? }.
async function fireShipItRoutine(text) {
  const routineUrl = process.env.AUDIT_SHIPIT_ROUTINE_URL;
  const routineToken = process.env.AUDIT_SHIPIT_ROUTINE_TOKEN;
  if (!routineUrl || !routineToken) {
    return { ok: false, status: 500, error: "ship-it-routine-not-configured" };
  }

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
    return { ok: false, status: 502, error: "routine-fetch-failed", detail: String(e) };
  }

  const routineBody = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, status: res.status, error: "routine-rejected", routineBody };
  }
  return {
    ok: true,
    status: 200,
    sessionId: routineBody.claude_code_session_id || null,
    sessionUrl: routineBody.claude_code_session_url || null,
  };
}

module.exports = { fireShipItRoutine };
