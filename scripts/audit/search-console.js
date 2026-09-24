// Google Search Console snapshot for the audit dashboard.
//
// Runs at build time (src/_data/gsc.js) so the numbers are baked into the
// dashboard and published at /admin/audit/gsc.json, instead of being
// committed to the (public) repo. Authenticates as a Google service account
// with read-only Search Console access — see docs/gsc-setup.md.
//
// fetchSnapshot() never throws: a missing key, a Google error or a timeout
// comes back as { connected: false, status, message } so the site build
// always succeeds and the dashboard can say exactly what to fix.
//
// Credentials (Netlify env vars, scoped to Builds):
//   GSC_SERVICE_ACCOUNT_JSON   the whole downloaded key file, pasted as-is
//   — or —
//   GSC_CLIENT_EMAIL + GSC_PRIVATE_KEY   the two fields from that file
//   GSC_PROPERTY               optional; e.g. "sc-domain:example.co.nz".
//                              Auto-detected from the site domain if unset.

const crypto = require("crypto");

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://www.googleapis.com/webmasters/v3";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TIMEOUT_MS = 15000;
const DAY_MS = 24 * 60 * 60 * 1000;

class SetupError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// ---------- credentials + auth ----------

function readCredentials(env) {
  let email = env.GSC_CLIENT_EMAIL;
  let key = env.GSC_PRIVATE_KEY;
  if (env.GSC_SERVICE_ACCOUNT_JSON) {
    let parsed;
    try {
      parsed = JSON.parse(env.GSC_SERVICE_ACCOUNT_JSON.trim());
    } catch (e) {
      throw new SetupError("bad-key", "The GSC_SERVICE_ACCOUNT_JSON value in Netlify isn't valid JSON. Open the downloaded .json key file, select everything, and paste it again.");
    }
    email = parsed.client_email;
    key = parsed.private_key;
  }
  if (!email && !key) return null;
  if (!email || !key) {
    throw new SetupError("bad-key", "The key in Netlify is missing its client_email or private_key. Paste the whole downloaded .json key file into GSC_SERVICE_ACCOUNT_JSON.");
  }
  key = String(key).trim().replace(/^"|"$/g, "").replace(/\\n/g, "\n");
  return { email: String(email).trim(), key };
}

function signJwt(creds, nowSeconds) {
  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const input = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: creds.email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: nowSeconds,
    exp: nowSeconds + 3600,
  })}`;
  let signature;
  try {
    signature = crypto.createSign("RSA-SHA256").update(input).sign(creds.key).toString("base64url");
  } catch (e) {
    throw new SetupError("bad-key", "The private key in Netlify couldn't be read. Paste the whole downloaded .json key file into GSC_SERVICE_ACCOUNT_JSON (don't edit it).");
  }
  return `${input}.${signature}`;
}

async function fetchJson(fetchImpl, url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetchImpl(url, { ...options, signal: controller.signal });
    const text = await res.text();
    let body = {};
    try { body = text ? JSON.parse(text) : {}; } catch (_) { body = { raw: text }; }
    return { ok: res.ok, status: res.status, body };
  } finally {
    clearTimeout(timer);
  }
}

async function getAccessToken(fetchImpl, creds, now) {
  const assertion = signJwt(creds, Math.floor(now.getTime() / 1000));
  const res = await fetchJson(fetchImpl, TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }).toString(),
  });
  if (!res.ok || !res.body.access_token) {
    const detail = res.body.error_description || res.body.error || `HTTP ${res.status}`;
    throw new SetupError("auth-failed", `Google rejected the key (${detail}). The key may have been deleted in Google Cloud — create a new one (guide step 3) and paste it into Netlify again.`);
  }
  return res.body.access_token;
}

function apiError(res, what) {
  const message = (res.body.error && res.body.error.message) || `HTTP ${res.status}`;
  if (res.status === 403 && /has not been used|is disabled/i.test(message)) {
    return new SetupError("api-disabled", "The Google Search Console API is switched off for this Google Cloud project. Turn it on (guide step 2), wait two minutes, then redeploy.");
  }
  if (res.status === 403) {
    return new SetupError("no-access", `Google refused access while ${what} (${message}). Check the service account is added as a user in Search Console (guide step 4).`);
  }
  return new SetupError("api-error", `Google returned an error while ${what}: ${message}`);
}

// ---------- property + queries ----------

function pickProperty(entries, domain, override) {
  const usable = (entries || []).filter(e => e.permissionLevel && e.permissionLevel !== "siteUnverifiedUser");
  const urls = usable.map(e => e.siteUrl);
  if (override) return urls.includes(override) ? override : null;
  const candidates = [
    `sc-domain:${domain}`,
    `https://${domain}/`,
    `https://www.${domain}/`,
    `http://${domain}/`,
    `http://www.${domain}/`,
  ];
  return candidates.find(c => urls.includes(c)) || null;
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

// Search Console data lags by 2–3 days, so the window ends `dataDelayDays`
// ago. "previous" is the same-length window immediately before it.
function dateWindows(now, sc) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const end = today - sc.dataDelayDays * DAY_MS;
  const start = end - (sc.windowDays - 1) * DAY_MS;
  const prevEnd = start - DAY_MS;
  const prevStart = prevEnd - (sc.windowDays - 1) * DAY_MS;
  const trendStart = end - (sc.trendWeeks * 7 - 1) * DAY_MS;
  const d = (ms) => isoDate(new Date(ms));
  return { start: d(start), end: d(end), prevStart: d(prevStart), prevEnd: d(prevEnd), trendStart: d(trendStart), days: sc.windowDays };
}

// ---------- aggregation (pure; unit-tested) ----------

const round1 = (n) => Math.round(n * 10) / 10;

function isBranded(query, brandTerms) {
  const q = String(query).toLowerCase();
  return (brandTerms || []).some(t => q.includes(String(t).toLowerCase()));
}

function pathOf(pageUrl) {
  try { return new URL(pageUrl).pathname; } catch (_) { return pageUrl; }
}

function pageGroup(path, groups) {
  for (const g of groups || []) {
    if (g.exact != null && path === g.exact) return g.label;
    if (g.prefix && path.startsWith(g.prefix)) return g.label;
  }
  return "Other page";
}

function totalsOf(rows) {
  const r = (rows && rows[0]) || {};
  return { clicks: r.clicks || 0, impressions: r.impressions || 0, position: r.position ? round1(r.position) : null };
}

// Merge rows sharing a key (e.g. www + apex versions of one path);
// position is impression-weighted, which is how Search Console averages it.
function mergeRows(rows, keyFn) {
  const map = new Map();
  for (const row of rows || []) {
    const key = keyFn(row);
    const cur = map.get(key) || { key, clicks: 0, impressions: 0, weighted: 0 };
    cur.clicks += row.clicks || 0;
    cur.impressions += row.impressions || 0;
    cur.weighted += (row.position || 0) * (row.impressions || 0);
    map.set(key, cur);
  }
  return [...map.values()].map(m => ({
    key: m.key,
    clicks: m.clicks,
    impressions: m.impressions,
    position: m.impressions ? round1(m.weighted / m.impressions) : null,
  }));
}

function page1Count(rows, minImpressions) {
  return (rows || []).filter(r => r.position && r.position <= 10 && r.impressions >= minImpressions).length;
}

function brandedTotals(rows, brandTerms) {
  const b = { clicks: 0, impressions: 0 };
  for (const r of rows || []) {
    if (isBranded(r.keys[0], brandTerms)) {
      b.clicks += r.clicks || 0;
      b.impressions += r.impressions || 0;
    }
  }
  return b;
}

function weeklyTrend(dailyRows, windows, weeks) {
  const origin = Date.parse(windows.trendStart + "T00:00:00Z");
  const buckets = Array.from({ length: weeks }, (_, i) => ({
    start: isoDate(new Date(origin + i * 7 * DAY_MS)),
    clicks: 0,
    impressions: 0,
  }));
  for (const row of dailyRows || []) {
    const i = Math.floor((Date.parse(row.keys[0] + "T00:00:00Z") - origin) / (7 * DAY_MS));
    if (i < 0 || i >= weeks) continue;
    buckets[i].clicks += row.clicks || 0;
    buckets[i].impressions += row.impressions || 0;
  }
  return buckets;
}

function buildSnapshot(raw, cfg, meta) {
  const sc = cfg.searchConsole;
  const brand = sc.brandTerms;

  const prevQuery = new Map((raw.queriesPrev || []).map(r => [r.keys[0], r]));
  const topPage = new Map();
  for (const r of raw.queryPage || []) {
    const [q, page] = r.keys;
    const best = topPage.get(q);
    if (!best || r.impressions > best.impressions) topPage.set(q, { path: pathOf(page), impressions: r.impressions });
  }

  const queries = (raw.queriesCur || [])
    .slice()
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, sc.maxQueries)
    .map(r => {
      const q = String(r.keys[0]).slice(0, 200);
      const p = prevQuery.get(r.keys[0]);
      const page = topPage.get(r.keys[0]);
      return {
        query: q,
        clicks: r.clicks,
        impressions: r.impressions,
        position: round1(r.position),
        prev: p ? { clicks: p.clicks, impressions: p.impressions, position: round1(p.position) } : null,
        page: page ? page.path : null,
        branded: isBranded(q, brand),
      };
    });

  const pagesPrev = new Map(mergeRows(raw.pagesPrev, r => pathOf(r.keys[0])).map(p => [p.key, p]));
  const pages = mergeRows(raw.pagesCur, r => pathOf(r.keys[0]))
    .sort((a, b) => b.impressions - a.impressions)
    .map(p => {
      const prev = pagesPrev.get(p.key);
      return {
        path: p.key,
        group: pageGroup(p.key, sc.pageGroups),
        clicks: p.clicks,
        impressions: p.impressions,
        position: p.position,
        prev: prev ? { clicks: prev.clicks, impressions: prev.impressions, position: prev.position } : null,
      };
    });

  const closestWins = queries
    .filter(q => !q.branded
      && q.impressions >= sc.minImpressions
      && q.position >= sc.closestWins.minPosition
      && q.position <= sc.closestWins.maxPosition)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, sc.closestWins.limit)
    .map(q => ({ query: q.query, position: q.position, impressions: q.impressions, clicks: q.clicks, page: q.page }));

  const totals = { current: totalsOf(raw.totalsCur), previous: totalsOf(raw.totalsPrev) };
  const bCur = brandedTotals(raw.queriesCur, brand);
  const bPrev = brandedTotals(raw.queriesPrev, brand);

  return {
    connected: true,
    status: "ok",
    message: "",
    fetchedAt: meta.fetchedAt,
    property: meta.property,
    country: sc.country || null,
    window: meta.windows,
    totals,
    // Search Console hides rare queries, so "non-branded" = total minus the
    // branded queries we can see. Hidden queries are long-tail, i.e. almost
    // never someone typing the clinic's name.
    nonBranded: {
      current: { clicks: Math.max(0, totals.current.clicks - bCur.clicks), impressions: Math.max(0, totals.current.impressions - bCur.impressions) },
      previous: { clicks: Math.max(0, totals.previous.clicks - bPrev.clicks), impressions: Math.max(0, totals.previous.impressions - bPrev.impressions) },
    },
    page1: {
      current: page1Count((raw.queriesCur || []).filter(r => !isBranded(r.keys[0], brand)), sc.minImpressions),
      previous: page1Count((raw.queriesPrev || []).filter(r => !isBranded(r.keys[0], brand)), sc.minImpressions),
    },
    weekly: weeklyTrend(raw.daily, meta.windows, sc.trendWeeks),
    queries,
    pages,
    closestWins,
  };
}

// ---------- entry point ----------

function notConnected(status, message, now) {
  return { connected: false, status, message, fetchedAt: now.toISOString() };
}

async function fetchSnapshot(cfg, env, { fetchImpl = globalThis.fetch, now = new Date() } = {}) {
  let creds;
  try {
    creds = readCredentials(env || {});
  } catch (e) {
    return notConnected(e.status || "bad-key", e.message, now);
  }
  if (!creds) {
    return notConnected("not-configured", "Google Search Console isn't connected yet. The setup guide (docs/gsc-setup.md) takes about 15 minutes.", now);
  }
  if (typeof fetchImpl !== "function") {
    return notConnected("error", "This build environment has no fetch(); Node 18 or newer is required.", now);
  }

  try {
    const sc = cfg.searchConsole;
    const token = await getAccessToken(fetchImpl, creds, now);
    const auth = { authorization: `Bearer ${token}` };

    const sites = await fetchJson(fetchImpl, `${API}/sites`, { headers: auth });
    if (!sites.ok) throw apiError(sites, "listing your Search Console properties");
    const property = pickProperty(sites.body.siteEntry, cfg.site.domain, env.GSC_PROPERTY);
    if (!property) {
      throw new SetupError("no-property", `The service account (${creds.email}) can't see ${cfg.site.domain} in Search Console yet. Add that email as a user on the property (guide step 4). It can take a few minutes to apply.`);
    }

    const windows = dateWindows(now, sc);
    const filters = sc.country
      ? [{ filters: [{ dimension: "country", operator: "equals", expression: sc.country }] }]
      : undefined;
    const query = async (startDate, endDate, dimensions, rowLimit) => {
      const res = await fetchJson(fetchImpl, `${API}/sites/${encodeURIComponent(property)}/searchAnalytics/query`, {
        method: "POST",
        headers: { ...auth, "content-type": "application/json" },
        body: JSON.stringify({ startDate, endDate, dimensions, rowLimit, type: "web", dimensionFilterGroups: filters }),
      });
      if (!res.ok) throw apiError(res, "reading search data");
      return res.body.rows || [];
    };

    const w = windows;
    const [totalsCur, totalsPrev, queriesCur, queriesPrev, pagesCur, pagesPrev, queryPage, daily] = await Promise.all([
      query(w.start, w.end, [], 1),
      query(w.prevStart, w.prevEnd, [], 1),
      query(w.start, w.end, ["query"], 1000),
      query(w.prevStart, w.prevEnd, ["query"], 1000),
      query(w.start, w.end, ["page"], 500),
      query(w.prevStart, w.prevEnd, ["page"], 500),
      query(w.start, w.end, ["query", "page"], 2000),
      query(w.trendStart, w.end, ["date"], 500),
    ]);

    return buildSnapshot(
      { totalsCur, totalsPrev, queriesCur, queriesPrev, pagesCur, pagesPrev, queryPage, daily },
      cfg,
      { fetchedAt: now.toISOString(), property, windows },
    );
  } catch (e) {
    if (e instanceof SetupError) return notConnected(e.status, e.message, now);
    const reason = e && e.name === "AbortError" ? "Google didn't answer in time" : String((e && e.message) || e);
    return notConnected("error", `Couldn't fetch Search Console data during this build (${reason}). It will retry on the next deploy.`, now);
  }
}

module.exports = {
  fetchSnapshot,
  // exported for scripts/audit/test-search-console.js
  readCredentials,
  pickProperty,
  dateWindows,
  buildSnapshot,
  isBranded,
  pageGroup,
};
