// Standalone checks for netlify/functions/submit-referral.js — no test runner,
// no network. Stubs Turnstile / Supabase / Resend and asserts that every
// failure path answers with a JSON body and CORS headers, so the referral form
// can always tell the referrer something specific.
//
//   node scripts/test-submit-referral.js

const Module = require("module");
const path = require("path");
const assert = require("assert");

const LIB = path.resolve(__dirname, "../netlify/functions/_lib");
const FN = path.resolve(__dirname, "../netlify/functions/submit-referral.js");

let stubs;
const realRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  const abs = id.startsWith(".")
    ? path.resolve(path.dirname(this.filename), id)
    : id;
  if (abs === path.join(LIB, "turnstile")) return { verifyTurnstile: stubs.verifyTurnstile };
  if (abs === path.join(LIB, "supabase")) return { getSupabase: stubs.getSupabase };
  if (abs === path.join(LIB, "email")) return { sendNotification: stubs.sendNotification };
  return realRequire.apply(this, arguments);
};

const ORIGIN = "https://meridianosteopathy.co.nz";

const VALID = {
  "bot-field": "",
  "referrer-first-name": "Kim",
  "referrer-last-name": "Huang",
  "referrer-relation": "medical-professional",
  "referrer-phone": "0211234567",
  "referrer-email": "kim@example.com",
  "patient-first-name": "Jane",
  "patient-last-name": "Doe",
  "patient-email": "jane@example.com",
  "patient-phone": "0219876543",
  "patient-dob": "1988-03-04",
  "reason-for-referral": "Low back pain, 6 weeks.",
  consent: "yes",
  signature: "Kim Huang",
  "submission-date": "2026-08-19",
  "cf-turnstile-response": "token",
};

function defaultStubs(overrides = {}) {
  const sent = [];
  const inserted = {};
  return Object.assign(
    {
      sent,
      inserted,
      verifyTurnstile: async () => ({ ok: true }),
      getSupabase: () => ({
        from: () => ({
          insert: (row) => {
            inserted.row = row;
            return { select: () => ({ single: async () => ({ data: { id: "uuid-1" }, error: null }) }) };
          },
        }),
      }),
      sendNotification: async (m) => { sent.push(m); return { ok: true }; },
    },
    overrides
  );
}

function loadHandler() {
  delete require.cache[FN];
  return require(FN).handler;
}

async function invoke({ body, headers = {}, httpMethod = "POST", isBase64Encoded = false }) {
  return loadHandler()({
    httpMethod,
    isBase64Encoded,
    headers: Object.assign(
      { origin: ORIGIN, "x-nf-client-connection-ip": "203.0.113.5", "user-agent": "test" },
      headers
    ),
    body,
  });
}

function parse(res) {
  assert.ok(res.headers["access-control-allow-origin"], "response must carry CORS headers");
  assert.strictEqual(res.headers["content-type"], "application/json");
  return JSON.parse(res.body);
}

const ENV = {
  TURNSTILE_SECRET_KEY: "secret",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role",
};

const tests = [];
const test = (name, fn) => tests.push([name, fn]);

test("valid submission is stored and both notices are sent", async () => {
  stubs = defaultStubs();
  const res = await invoke({ body: JSON.stringify(VALID) });
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(parse(res), { ok: true, id: "uuid-1" });
  assert.strictEqual(stubs.sent.length, 2, "clinic notification + IPP3A patient notice");
  assert.strictEqual(stubs.sent[1].to, "jane@example.com");
});

test("base64-encoded body is decoded rather than rejected as invalid JSON", async () => {
  stubs = defaultStubs();
  const res = await invoke({
    body: Buffer.from(JSON.stringify(VALID), "utf8").toString("base64"),
    isBase64Encoded: true,
  });
  assert.strictEqual(res.statusCode, 200, "isBase64Encoded body must round-trip");
});

test("missing env returns config-error instead of crashing the function", async () => {
  stubs = defaultStubs();
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await invoke({ body: JSON.stringify(VALID) });
  process.env.SUPABASE_SERVICE_ROLE_KEY = ENV.SUPABASE_SERVICE_ROLE_KEY;
  assert.strictEqual(res.statusCode, 500);
  assert.strictEqual(parse(res).error, "config-error");
});

test("an unexpected throw is caught and answered as JSON with CORS headers", async () => {
  stubs = defaultStubs({
    verifyTurnstile: async () => { throw new Error("Turnstile is down"); },
  });
  const res = await invoke({ body: JSON.stringify(VALID) });
  assert.strictEqual(res.statusCode, 500);
  assert.strictEqual(parse(res).error, "server-error");
});

test("a chained x-forwarded-for is narrowed to one inet-castable address", async () => {
  stubs = defaultStubs();
  await invoke({
    body: JSON.stringify(VALID),
    headers: { "x-nf-client-connection-ip": "", "x-forwarded-for": "203.0.113.5, 70.41.3.18, 150.172.238.178" },
  });
  assert.strictEqual(stubs.inserted.row.source_ip, "203.0.113.5");
});

test("a failed Turnstile check reports turnstile-failed", async () => {
  stubs = defaultStubs({
    verifyTurnstile: async () => ({ ok: false, reason: "timeout-or-duplicate" }),
  });
  const res = await invoke({ body: JSON.stringify(VALID) });
  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(parse(res).error, "turnstile-failed");
});

test("an invalid field names the field so the form can point at it", async () => {
  stubs = defaultStubs();
  const res = await invoke({
    body: JSON.stringify(Object.assign({}, VALID, { "patient-dob": "04/03/1988" })),
  });
  assert.strictEqual(res.statusCode, 400);
  assert.deepStrictEqual(parse(res), { error: "invalid-field", field: "patient-dob" });
});

test("a missing consent tick reports consent-required", async () => {
  stubs = defaultStubs();
  const payload = Object.assign({}, VALID);
  delete payload.consent;
  const res = await invoke({ body: JSON.stringify(payload) });
  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(parse(res).error, "consent-required");
});

test("a Supabase insert error reports storage-failed", async () => {
  stubs = defaultStubs({
    getSupabase: () => ({
      from: () => ({
        insert: () => ({
          select: () => ({ single: async () => ({ data: null, error: { message: "boom" } }) }),
        }),
      }),
    }),
  });
  const res = await invoke({ body: JSON.stringify(VALID) });
  assert.strictEqual(res.statusCode, 500);
  assert.strictEqual(parse(res).error, "storage-failed");
});

test("email failures never block a referral that is already stored", async () => {
  stubs = defaultStubs({
    sendNotification: async () => { throw new Error("Resend unavailable"); },
  });
  const res = await invoke({ body: JSON.stringify(VALID) });
  assert.strictEqual(res.statusCode, 200);
});

test("a filled honeypot succeeds silently without storing anything", async () => {
  stubs = defaultStubs();
  const res = await invoke({
    body: JSON.stringify(Object.assign({}, VALID, { "bot-field": "spam" })),
  });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(stubs.inserted.row, undefined);
});

(async () => {
  Object.assign(process.env, ENV);
  const quiet = () => {};
  const realError = console.error;
  let failures = 0;
  for (const [name, fn] of tests) {
    console.error = quiet; // stubs deliberately trigger the function's logging
    try {
      await fn();
      console.error = realError;
      console.log(`  ok   ${name}`);
    } catch (e) {
      console.error = realError;
      failures++;
      console.log(`  FAIL ${name}\n       ${e.message}`);
    }
  }
  console.log(`\n${tests.length - failures}/${tests.length} passed`);
  process.exit(failures ? 1 : 0);
})();
