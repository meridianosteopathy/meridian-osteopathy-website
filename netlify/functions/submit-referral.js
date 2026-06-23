// POST /.netlify/functions/submit-referral
// Body: JSON matching the referral form fields.
// Flow: Turnstile verify → validate → Supabase insert → email notify.

const { verifyTurnstile } = require("./_lib/turnstile");
const { getSupabase } = require("./_lib/supabase");
const { sendNotification } = require("./_lib/email");

const ALLOWED_ORIGINS = [
  "https://meridianosteopathy.co.nz",
  "https://www.meridianosteopathy.co.nz",
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "access-control-allow-origin": allow,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "vary": "origin",
  };
}

function json(statusCode, body, origin) {
  return {
    statusCode,
    headers: { "content-type": "application/json", ...corsHeaders(origin) },
    body: JSON.stringify(body),
  };
}

function nonEmpty(v) {
  return typeof v === "string" && v.trim().length > 0;
}
function looksLikeEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function looksLikeDate(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

// IPP3A (Privacy Act 2020) active-notification to the patient. A referral is
// indirect collection — the patient's health information reaches us from a
// third party — so we must take reasonable steps to make the patient aware.
// This notice covers all six required elements: what we received, from whom,
// why, who else sees it, who we are, any legal basis, and access/correction.
function patientNoticeText({ patientFirst, referrerName }) {
  return [
    `Hi ${patientFirst},`,
    ``,
    `This is a quick note to let you know that Meridian Osteopathy has received a referral about you from ${referrerName}. We're letting you know because, under the Privacy Act 2020, we tell you when we receive your health information from someone other than you.`,
    ``,
    `What we received: your contact details and the reason for your referral.`,
    `Why: so we can arrange and provide your osteopathic care.`,
    `Who sees it: our internal clinical team, and ACC if you have an active ACC claim with us (collection for ACC purposes may be authorised under the Accident Compensation Act 2001).`,
    ``,
    `You don't need to do anything right now — our team will be in touch to arrange your appointment.`,
    ``,
    `You can ask to see the information we hold about you, or ask us to correct it, at any time. Just contact our Privacy Officer, Nina Hu, at info@meridianosteopathy.co.nz or 02108655151. Our full Privacy Policy is at https://meridianosteopathy.co.nz/privacy/.`,
    ``,
    `Meridian Osteopathy Ltd`,
    `21 Coppell Place, Hillmorton, Christchurch 8025`,
    `02108655151 · info@meridianosteopathy.co.nz`,
  ].join("\n");
}

function patientNoticeHtml({ patientFirst, referrerName }) {
  const first = escapeHtml(patientFirst);
  const referrer = escapeHtml(referrerName);
  return `<div style="font-family: Arial, Helvetica, sans-serif; color:#2b2b2b; max-width:560px; margin:0 auto; line-height:1.5;">
  <h2 style="color:#345E85; font-size:20px; margin:0 0 16px;">We've received your referral</h2>
  <p>Hi ${first},</p>
  <p>This is a quick note to let you know that <strong>Meridian Osteopathy</strong> has received a referral about you from <strong>${referrer}</strong>. We're letting you know because, under the Privacy Act 2020, we tell you when we receive your health information from someone other than you.</p>
  <ul style="padding-left:20px;">
    <li><strong>What we received:</strong> your contact details and the reason for your referral.</li>
    <li><strong>Why:</strong> so we can arrange and provide your osteopathic care.</li>
    <li><strong>Who sees it:</strong> our internal clinical team, and ACC if you have an active ACC claim with us (collection for ACC purposes may be authorised under the Accident Compensation Act 2001).</li>
  </ul>
  <p>You don't need to do anything right now — our team will be in touch to arrange your appointment.</p>
  <p>You can ask to see the information we hold about you, or ask us to correct it, at any time. Just contact our Privacy Officer, Nina Hu, at <a href="mailto:info@meridianosteopathy.co.nz">info@meridianosteopathy.co.nz</a> or 02108655151. Our full <a href="https://meridianosteopathy.co.nz/privacy/">Privacy Policy</a> explains more.</p>
  <hr style="border:none; border-top:1px solid #e2e2e2; margin:24px 0;">
  <p style="font-size:13px; color:#666; margin:0;">
    Meridian Osteopathy Ltd<br>
    21 Coppell Place, Hillmorton, Christchurch 8025<br>
    02108655151 · info@meridianosteopathy.co.nz
  </p>
</div>`;
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || "";

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(origin), body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "method-not-allowed" }, origin);
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "invalid-json" }, origin);
  }

  // Honeypot — if bot-field is filled, silently succeed.
  if (nonEmpty(payload["bot-field"])) {
    return json(200, { ok: true }, origin);
  }

  // Turnstile
  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"] ||
    "";
  const ts = await verifyTurnstile(payload["cf-turnstile-response"], ip);
  if (!ts.ok) {
    return json(400, { error: "turnstile-failed", reason: ts.reason }, origin);
  }

  // Validate
  const required = [
    ["referrer-first-name", nonEmpty],
    ["referrer-last-name", nonEmpty],
    ["referrer-relation", nonEmpty],
    ["referrer-phone", nonEmpty],
    ["referrer-email", looksLikeEmail],
    ["patient-first-name", nonEmpty],
    ["patient-last-name", nonEmpty],
    ["patient-email", looksLikeEmail],
    ["patient-phone", nonEmpty],
    ["patient-dob", looksLikeDate],
    ["reason-for-referral", nonEmpty],
    ["signature", nonEmpty],
    ["submission-date", looksLikeDate],
  ];
  for (const [field, check] of required) {
    if (!check(payload[field])) {
      return json(400, { error: "invalid-field", field }, origin);
    }
  }
  if (payload.consent !== "yes" && payload.consent !== true) {
    return json(400, { error: "consent-required" }, origin);
  }

  // Insert
  const row = {
    referrer_first_name: payload["referrer-first-name"].trim(),
    referrer_last_name: payload["referrer-last-name"].trim(),
    referrer_relation: payload["referrer-relation"].trim(),
    referrer_phone: payload["referrer-phone"].trim(),
    referrer_email: payload["referrer-email"].trim().toLowerCase(),
    patient_first_name: payload["patient-first-name"].trim(),
    patient_last_name: payload["patient-last-name"].trim(),
    patient_email: payload["patient-email"].trim().toLowerCase(),
    patient_phone: payload["patient-phone"].trim(),
    patient_dob: payload["patient-dob"],
    reason_for_referral: payload["reason-for-referral"].trim(),
    consent_given: true,
    signature: payload.signature.trim(),
    submission_date: payload["submission-date"],
    source_ip: ip || null,
    user_agent: event.headers["user-agent"] || null,
  };

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("referrals")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("supabase insert failed", error);
    return json(500, { error: "storage-failed" }, origin);
  }

  // Notify (best-effort)
  const patientName = `${row.patient_first_name} ${row.patient_last_name}`;
  const referrerName = `${row.referrer_first_name} ${row.referrer_last_name}`;
  await sendNotification({
    subject: `New patient referral: ${patientName}`,
    text: [
      `A new patient referral has been submitted.`,
      ``,
      `Referrer: ${referrerName} (${row.referrer_relation})`,
      `Email: ${row.referrer_email}`,
      `Phone: ${row.referrer_phone}`,
      ``,
      `Patient: ${patientName}`,
      `DOB: ${row.patient_dob}`,
      `Email: ${row.patient_email}`,
      `Phone: ${row.patient_phone}`,
      ``,
      `Reason: ${row.reason_for_referral}`,
      ``,
      `Submitted: ${row.submission_date}`,
      `Record ID: ${data.id}`,
    ].join("\n"),
  }).catch((e) => console.error("email failed", e));

  // IPP3A: notify the patient that we've received a referral about them.
  // Best-effort — never block the submission on this.
  await sendNotification({
    to: row.patient_email,
    subject: "We've received your referral — Meridian Osteopathy",
    text: patientNoticeText({
      patientFirst: row.patient_first_name,
      referrerName,
    }),
    html: patientNoticeHtml({
      patientFirst: row.patient_first_name,
      referrerName,
    }),
  }).catch((e) => console.error("patient notice email failed", e));

  return json(200, { ok: true, id: data.id }, origin);
};
