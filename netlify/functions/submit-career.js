// POST /.netlify/functions/submit-career
// Accepts multipart/form-data. Parses CV + cover letter, uploads to Supabase
// Storage (private bucket: career-cvs), inserts row into website.career_applications,
// and sends an email notification.

const multipart = require("parse-multipart-data");
const { verifyTurnstile } = require("./_lib/turnstile");
const { getSupabase, getStorageClient } = require("./_lib/supabase");
const { sendNotification } = require("./_lib/email");

const ALLOWED_ORIGINS = [
  "https://meridianosteopathy.co.nz",
  "https://www.meridianosteopathy.co.nz",
];

const BUCKET = "career-cvs";
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB per file
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_EXT = /\.(pdf|doc|docx)$/i;

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

function getBoundary(contentType) {
  const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || "");
  return m ? (m[1] || m[2]).trim() : null;
}

function slugify(s) {
  return String(s || "applicant")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "applicant";
}

function safeFilename(name) {
  return String(name || "file").replace(/[^\w.\-]+/g, "_").slice(0, 80);
}

async function uploadFile({ buffer, filename, contentType, folder }) {
  if (buffer.length === 0) return null;
  if (buffer.length > MAX_FILE_BYTES) {
    throw new Error("file-too-large");
  }
  if (!ALLOWED_EXT.test(filename) && !ALLOWED_MIME.has(contentType)) {
    throw new Error("file-type-not-allowed");
  }

  const path = `${folder}/${Date.now()}-${safeFilename(filename)}`;
  const storage = getStorageClient();
  const { error } = await storage.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: contentType || "application/octet-stream",
      upsert: false,
    });
  if (error) {
    console.error("storage upload failed", error);
    throw new Error("upload-failed");
  }
  return path;
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || "";

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(origin), body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "method-not-allowed" }, origin);
  }

  const contentType =
    event.headers["content-type"] || event.headers["Content-Type"] || "";
  const boundary = getBoundary(contentType);
  if (!boundary) {
    return json(400, { error: "expected-multipart" }, origin);
  }

  const bodyBuffer = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64")
    : Buffer.from(event.body || "", "utf8");

  let parts;
  try {
    parts = multipart.parse(bodyBuffer, boundary);
  } catch (e) {
    console.error("multipart parse failed", e);
    return json(400, { error: "invalid-multipart" }, origin);
  }

  // Split into fields vs files
  const fields = {};
  const files = {};
  for (const p of parts) {
    if (p.filename) {
      files[p.name] = p;
    } else {
      fields[p.name] = (p.data || Buffer.from("")).toString("utf8");
    }
  }

  // Honeypot
  if (fields["bot-field"] && fields["bot-field"].trim()) {
    return json(200, { ok: true }, origin);
  }

  // Turnstile
  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"] ||
    "";
  const ts = await verifyTurnstile(fields["cf-turnstile-response"], ip);
  if (!ts.ok) {
    return json(400, { error: "turnstile-failed", reason: ts.reason }, origin);
  }

  // Validate required fields
  const required = ["applying-position", "name", "email", "phone", "applicant-type"];
  for (const field of required) {
    if (!fields[field] || !fields[field].trim()) {
      return json(400, { error: "invalid-field", field }, origin);
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return json(400, { error: "invalid-field", field: "email" }, origin);
  }

  // Upload files (if present)
  const folder = slugify(fields.name);
  let cvPath = null;
  let coverPath = null;
  try {
    if (files.cv) {
      cvPath = await uploadFile({
        buffer: files.cv.data,
        filename: files.cv.filename,
        contentType: files.cv.type,
        folder,
      });
    }
    if (files["cover-letter"]) {
      coverPath = await uploadFile({
        buffer: files["cover-letter"].data,
        filename: files["cover-letter"].filename,
        contentType: files["cover-letter"].type,
        folder,
      });
    }
  } catch (e) {
    return json(400, { error: e.message || "upload-failed" }, origin);
  }

  // Insert row
  const row = {
    applying_position: fields["applying-position"].trim(),
    name: fields.name.trim(),
    email: fields.email.trim().toLowerCase(),
    phone: fields.phone.trim(),
    applicant_type: fields["applicant-type"].trim(),
    message: fields.message ? fields.message.trim() : null,
    cv_path: cvPath,
    cover_letter_path: coverPath,
    source_ip: ip || null,
    user_agent: event.headers["user-agent"] || null,
  };

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("career_applications")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("supabase insert failed", error);
    return json(500, { error: "storage-failed" }, origin);
  }

  await sendNotification({
    subject: `New career application: ${row.name} — ${row.applying_position}`,
    text: [
      `A new career application has been submitted.`,
      ``,
      `Name: ${row.name}`,
      `Position: ${row.applying_position}`,
      `Applicant type: ${row.applicant_type}`,
      `Email: ${row.email}`,
      `Phone: ${row.phone}`,
      ``,
      row.message ? `Message:\n${row.message}` : `(no message)`,
      ``,
      `CV: ${cvPath ? cvPath : "(none)"}`,
      `Cover letter: ${coverPath ? coverPath : "(none)"}`,
      ``,
      `Record ID: ${data.id}`,
    ].join("\n"),
  }).catch((e) => console.error("email failed", e));

  return json(200, { ok: true, id: data.id }, origin);
};
