// Resend-based email notifier.
// Sends a plain-text notification to the clinic inbox when a form is received.

const RESEND_URL = "https://api.resend.com/emails";

async function sendNotification({ subject, text, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM || "Meridian Website <no-reply@meridianosteopathy.co.nz>";
  const to = process.env.NOTIFY_TO || "info@meridianosteopathy.co.nz";

  if (!apiKey) {
    // Don't fail the submission if email isn't wired up yet — log and move on.
    console.warn("RESEND_API_KEY not configured; skipping email notification");
    return { ok: false, reason: "no-api-key" };
  }

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      ...(html ? { html } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("Resend failed", res.status, body);
    return { ok: false, reason: `resend-${res.status}` };
  }
  return { ok: true };
}

module.exports = { sendNotification };
