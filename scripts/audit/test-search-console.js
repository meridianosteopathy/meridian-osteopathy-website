// Standalone checks for scripts/audit/search-console.js — no test runner, no
// network. A throwaway RSA key stands in for the service account and a fake
// fetch plays Google, so the auth flow, request shapes, aggregation and every
// "not connected" message are exercised offline.
//
//   node scripts/audit/test-search-console.js

const assert = require("assert");
const crypto = require("crypto");
const config = require("../../src/_data/auditConfig.json");
const sc = require("./search-console");

const NOW = new Date("2026-09-24T09:00:00Z");
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const PEM = privateKey.export({ type: "pkcs8", format: "pem" });
const KEY_FILE = JSON.stringify({
  type: "service_account",
  client_email: "audit@test-project.iam.gserviceaccount.com",
  // Google's key files store the PEM with literal "\n" escapes.
  private_key: PEM.replace(/\n/g, "\\n"),
});

const row = (keys, clicks, impressions, position) => ({ keys, clicks, impressions, ctr: impressions ? clicks / impressions : 0, position });

// Canned Search Console answers keyed by dimensions + window.
function fakeGoogle({ sites, failWith } = {}) {
  const calls = [];
  const fetchImpl = async (url, opts = {}) => {
    calls.push({ url, opts });
    const reply = (status, body) => ({ ok: status < 400, status, text: async () => JSON.stringify(body) });

    if (url === "https://oauth2.googleapis.com/token") {
      const assertion = new URLSearchParams(opts.body).get("assertion");
      const [h, c, s] = assertion.split(".");
      const valid = crypto.createVerify("RSA-SHA256").update(`${h}.${c}`).verify(publicKey, Buffer.from(s, "base64url"));
      const claims = JSON.parse(Buffer.from(c, "base64url").toString());
      assert.ok(valid, "JWT must be signed with the service account key");
      assert.strictEqual(claims.scope, "https://www.googleapis.com/auth/webmasters.readonly");
      assert.strictEqual(claims.iss, "audit@test-project.iam.gserviceaccount.com");
      return reply(200, { access_token: "tok", expires_in: 3600 });
    }
    assert.strictEqual(opts.headers.authorization, "Bearer tok");

    if (url.endsWith("/webmasters/v3/sites")) {
      return reply(200, { siteEntry: sites || [
        { siteUrl: "sc-domain:other.co.nz", permissionLevel: "siteOwner" },
        { siteUrl: "sc-domain:meridianosteopathy.co.nz", permissionLevel: "siteRestrictedUser" },
      ] });
    }
    if (failWith) return reply(failWith.status, { error: { message: failWith.message } });

    assert.ok(url.includes(encodeURIComponent("sc-domain:meridianosteopathy.co.nz")), "queries the detected property");
    const body = JSON.parse(opts.body);
    assert.deepStrictEqual(body.dimensionFilterGroups, [{ filters: [{ dimension: "country", operator: "equals", expression: "nzl" }] }]);
    const cur = body.startDate === "2026-08-25";
    const dims = body.dimensions.join(",");
    if (dims === "") return reply(200, { rows: [cur ? { clicks: 120, impressions: 4000, position: 14.2 } : { clicks: 100, impressions: 3500, position: 15.9 }] });
    if (dims === "query") return reply(200, { rows: cur ? [
      row(["meridian osteopathy"], 40, 90, 1.1),
      row(["osteopath christchurch"], 6, 600, 11.4),
      row(["sciatica osteopath christchurch"], 3, 150, 7.8),
      row(["pregnancy back pain christchurch"], 9, 80, 2.1),
      row(["concussion osteopath christchurch"], 0, 12, 24.0),
      row(["rare query"], 0, 2, 9.0),
    ] : [
      row(["meridian osteopathy"], 35, 80, 1.2),
      row(["osteopath christchurch"], 4, 500, 13.0),
      row(["pregnancy back pain christchurch"], 5, 60, 4.0),
    ] });
    if (dims === "page") return reply(200, { rows: cur ? [
      row(["https://meridianosteopathy.co.nz/"], 50, 1500, 9.0),
      row(["https://www.meridianosteopathy.co.nz/"], 2, 500, 13.0),
      row(["https://meridianosteopathy.co.nz/conditions/sciatica/"], 3, 150, 7.8),
    ] : [row(["https://meridianosteopathy.co.nz/"], 45, 1400, 10.0)] });
    if (dims === "query,page") return reply(200, { rows: [
      row(["osteopath christchurch", "https://meridianosteopathy.co.nz/"], 6, 550, 11.0),
      row(["osteopath christchurch", "https://meridianosteopathy.co.nz/services/osteopathy/"], 0, 50, 30.0),
      row(["sciatica osteopath christchurch", "https://meridianosteopathy.co.nz/conditions/sciatica/"], 3, 150, 7.8),
    ] });
    if (dims === "date") return reply(200, { rows: [
      row(["2026-06-02"], 5, 100, 12), // first day of the 16-week trend
      row(["2026-06-09"], 1, 10, 12),  // first day of week 2
      row(["2026-09-21"], 7, 200, 12), // last day of the window
      row(["2026-06-01"], 99, 999, 1), // before the trend window — ignored
    ] });
    throw new Error("unexpected request " + url + " " + opts.body);
  };
  return { fetchImpl, calls };
}

(async () => {
  // Date windows: data lags 3 days; current = last 28 days, previous = the 28 before.
  assert.deepStrictEqual(sc.dateWindows(NOW, config.searchConsole), {
    start: "2026-08-25", end: "2026-09-21", prevStart: "2026-07-28", prevEnd: "2026-08-24", trendStart: "2026-06-02", days: 28,
  });

  // Property detection prefers the domain property and ignores unverified entries.
  assert.strictEqual(sc.pickProperty([{ siteUrl: "https://meridianosteopathy.co.nz/", permissionLevel: "siteFullUser" }, { siteUrl: "sc-domain:meridianosteopathy.co.nz", permissionLevel: "siteOwner" }], "meridianosteopathy.co.nz"), "sc-domain:meridianosteopathy.co.nz");
  assert.strictEqual(sc.pickProperty([{ siteUrl: "sc-domain:meridianosteopathy.co.nz", permissionLevel: "siteUnverifiedUser" }], "meridianosteopathy.co.nz"), null);
  assert.strictEqual(sc.pickProperty([{ siteUrl: "https://meridianosteopathy.co.nz/", permissionLevel: "siteFullUser" }], "meridianosteopathy.co.nz", "sc-domain:x"), null);

  assert.strictEqual(sc.isBranded("Nina Hu osteopath", config.searchConsole.brandTerms), true);
  assert.strictEqual(sc.isBranded("osteopath halswell", config.searchConsole.brandTerms), false);
  assert.strictEqual(sc.pageGroup("/conditions/sciatica/", config.searchConsole.pageGroups), "Condition page");
  assert.strictEqual(sc.pageGroup("/", config.searchConsole.pageGroups), "Home page");
  assert.strictEqual(sc.pageGroup("/contact/", config.searchConsole.pageGroups), "Other page");

  // Not configured → friendly message, no network.
  let snap = await sc.fetchSnapshot(config, {}, { fetchImpl: () => { throw new Error("must not fetch"); }, now: NOW });
  assert.strictEqual(snap.connected, false);
  assert.strictEqual(snap.status, "not-configured");

  // Mangled paste → bad-key.
  snap = await sc.fetchSnapshot(config, { GSC_SERVICE_ACCOUNT_JSON: "{ not json" }, { now: NOW });
  assert.strictEqual(snap.status, "bad-key");
  snap = await sc.fetchSnapshot(config, { GSC_CLIENT_EMAIL: "a@b.c", GSC_PRIVATE_KEY: "nonsense" }, { fetchImpl: fakeGoogle().fetchImpl, now: NOW });
  assert.strictEqual(snap.status, "bad-key");

  // Happy path, whole key file pasted.
  const google = fakeGoogle();
  snap = await sc.fetchSnapshot(config, { GSC_SERVICE_ACCOUNT_JSON: `\n${KEY_FILE}\n` }, { fetchImpl: google.fetchImpl, now: NOW });
  assert.strictEqual(snap.status, "ok", snap.message);
  assert.strictEqual(snap.connected, true);
  assert.strictEqual(snap.property, "sc-domain:meridianosteopathy.co.nz");
  assert.strictEqual(google.calls.length, 2 + 8, "token + sites + 8 queries");
  assert.deepStrictEqual(snap.totals, { current: { clicks: 120, impressions: 4000, position: 14.2 }, previous: { clicks: 100, impressions: 3500, position: 15.9 } });
  // Branded = "meridian osteopathy" (40 / 90 now, 35 / 80 before).
  assert.deepStrictEqual(snap.nonBranded, { current: { clicks: 80, impressions: 3910 }, previous: { clicks: 65, impressions: 3420 } });
  // Page 1 (≤ 10, ≥ 5 impressions, non-branded): sciatica + pregnancy now; pregnancy before.
  assert.deepStrictEqual(snap.page1, { current: 2, previous: 1 });

  const oc = snap.queries.find(q => q.query === "osteopath christchurch");
  assert.deepStrictEqual(oc, { query: "osteopath christchurch", clicks: 6, impressions: 600, position: 11.4, prev: { clicks: 4, impressions: 500, position: 13 }, page: "/", branded: false });
  assert.strictEqual(snap.queries.find(q => q.query === "meridian osteopathy").branded, true);

  // Closest wins: non-branded, positions 4–20, ≥ 5 impressions, by impressions.
  assert.deepStrictEqual(snap.closestWins.map(q => q.query), ["osteopath christchurch", "sciatica osteopath christchurch"]);
  assert.strictEqual(snap.closestWins[1].page, "/conditions/sciatica/");

  // www + apex rows merge into one path with impression-weighted position.
  const home = snap.pages.find(p => p.path === "/");
  assert.deepStrictEqual({ clicks: home.clicks, impressions: home.impressions, position: home.position, group: home.group }, { clicks: 52, impressions: 2000, position: 10, group: "Home page" });
  assert.deepStrictEqual(home.prev, { clicks: 45, impressions: 1400, position: 10 });

  // 16 weekly buckets; out-of-window days ignored.
  assert.strictEqual(snap.weekly.length, 16);
  assert.deepStrictEqual(snap.weekly[0], { start: "2026-06-02", clicks: 5, impressions: 100 });
  assert.deepStrictEqual(snap.weekly[1], { start: "2026-06-09", clicks: 1, impressions: 10 });
  assert.deepStrictEqual(snap.weekly[15], { start: "2026-09-15", clicks: 7, impressions: 200 });

  // Separate email + key fields (literal \n in the key) also work.
  snap = await sc.fetchSnapshot(config, { GSC_CLIENT_EMAIL: "audit@test-project.iam.gserviceaccount.com", GSC_PRIVATE_KEY: JSON.parse(KEY_FILE).private_key }, { fetchImpl: fakeGoogle().fetchImpl, now: NOW });
  assert.strictEqual(snap.status, "ok", snap.message);

  // Service account not yet added in Search Console.
  snap = await sc.fetchSnapshot(config, { GSC_SERVICE_ACCOUNT_JSON: KEY_FILE }, { fetchImpl: fakeGoogle({ sites: [] }).fetchImpl, now: NOW });
  assert.strictEqual(snap.status, "no-property");
  assert.ok(snap.message.includes("audit@test-project.iam.gserviceaccount.com"), "tells the owner which email to add");

  // API switched off in Google Cloud.
  snap = await sc.fetchSnapshot(config, { GSC_SERVICE_ACCOUNT_JSON: KEY_FILE }, { fetchImpl: fakeGoogle({ failWith: { status: 403, message: "Google Search Console API has not been used in project 123 before or it is disabled." } }).fetchImpl, now: NOW });
  assert.strictEqual(snap.status, "api-disabled");

  // Token rejected.
  const rejecting = async (url) => ({ ok: false, status: 400, text: async () => JSON.stringify({ error: "invalid_grant", error_description: "Invalid JWT Signature." }) });
  snap = await sc.fetchSnapshot(config, { GSC_SERVICE_ACCOUNT_JSON: KEY_FILE }, { fetchImpl: rejecting, now: NOW });
  assert.strictEqual(snap.status, "auth-failed");
  assert.ok(snap.message.includes("Invalid JWT Signature"));

  // Network failure never throws out of fetchSnapshot.
  snap = await sc.fetchSnapshot(config, { GSC_SERVICE_ACCOUNT_JSON: KEY_FILE }, { fetchImpl: async () => { throw new Error("ECONNRESET"); }, now: NOW });
  assert.strictEqual(snap.status, "error");
  assert.ok(snap.message.includes("ECONNRESET"));

  console.log("search-console: all checks passed");
})().catch(err => {
  console.error(err);
  process.exit(1);
});
