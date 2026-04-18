// Cloudflare Turnstile server-side verification
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(token, remoteip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY not configured");
  if (!token) return { ok: false, reason: "missing-token" };

  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteip) body.append("remoteip", remoteip);

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = await res.json();
  if (!data.success) {
    return { ok: false, reason: (data["error-codes"] || []).join(",") || "failed" };
  }
  return { ok: true, data };
}

module.exports = { verifyTurnstile };
