// Shared logic for practitioner review requests (review-admin.js for the
// clinic owner, review-public.js for the reviewer). A request asks one
// reviewer to comment on one page, section by section, over one or more
// rounds; the owner reads the feedback and decides what happens next.
//
// Storage: Netlify Blobs store "reviews" — `request/<id>` per request, and
// `reviewers` remembering each reviewer's email after first use.
// Settings: `reviews` + `site` in src/_data/auditConfig.json.
// See docs/practitioner-reviews.md.

const crypto = require("crypto");
const { getStore, connectLambda } = require("@netlify/blobs");
const config = require("../../../src/_data/auditConfig.json");

const STORE = "reviews";
const DECISIONS = {
  approve: "Looks good",
  "approve-with-changes": "Approve with small changes",
  changes: "Needs changes",
};
const STATUS_LABELS = {
  "with-reviewer": "With reviewer",
  feedback: "Feedback received",
  revising: "Claude is revising",
  approved: "Approved",
  cancelled: "Cancelled",
};
const LIMITS = { title: 200, message: 2000, name: 100, comment: 4000, general: 8000, sections: 40, sectionText: 8000, html: 2000000 };
const WHOLE_PAGE = { heading: "The whole page", text: "" };
const FETCH_TIMEOUT_MS = 10000;

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify(body),
  };
}

function openStore(event) {
  // Lambda-compatibility functions receive the Blobs context on the event.
  if (event && event.blobs) connectLambda(event);
  return getStore(STORE);
}

const newId = () => "r_" + crypto.randomBytes(8).toString("hex");
const newToken = () => crypto.randomBytes(24).toString("hex");
const isId = (id) => typeof id === "string" && /^r_[0-9a-f]{16}$/.test(id);

function tokenMatches(expected, presented) {
  if (typeof expected !== "string" || typeof presented !== "string") return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(presented);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const clip = (value, max) => String(value == null ? "" : value).trim().slice(0, max);

// ---------- which URLs belong to this site ----------

function siteHosts() {
  const name = config.site.netlifySiteName;
  return {
    exact: [config.site.domain, `www.${config.site.domain}`, new URL(config.site.dashboardUrl).host, `${name}.netlify.app`],
    suffix: [`--${name}.netlify.app`], // deploy previews and branch deploys
  };
}

function parseHttpsUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    return url.protocol === "https:" ? url : null;
  } catch (_) {
    return null;
  }
}

function isSiteUrl(value) {
  const url = parseHttpsUrl(value);
  if (!url) return false;
  const { exact, suffix } = siteHosts();
  return exact.includes(url.host) || suffix.some(s => url.host.endsWith(s));
}

// deploy-preview-131--meridian-osteopathy.netlify.app → 131
function previewPrNumber(value) {
  const url = parseHttpsUrl(value);
  if (!url) return null;
  const m = url.host.match(/^deploy-preview-(\d+)--(.+)\.netlify\.app$/);
  return m && m[2] === config.site.netlifySiteName ? Number(m[1]) : null;
}

// ---------- page → sections ----------

const NAMED_ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", shy: "",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", sbquo: "‚", bdquo: "„", laquo: "«", raquo: "»", prime: "′", Prime: "″",
  ndash: "–", mdash: "—", hellip: "…", middot: "·", bull: "•",
  rarr: "→", larr: "←", uarr: "↑", darr: "↓", harr: "↔",
  copy: "©", reg: "®", trade: "™", deg: "°", times: "×", divide: "÷", plusmn: "±", frac12: "½", frac14: "¼", frac34: "¾",
  euro: "€", pound: "£", cent: "¢",
  // Te reo Māori macrons and common accented letters
  amacr: "ā", emacr: "ē", imacr: "ī", omacr: "ō", umacr: "ū", Amacr: "Ā", Emacr: "Ē", Imacr: "Ī", Omacr: "Ō", Umacr: "Ū",
  eacute: "é", egrave: "è", aacute: "á", agrave: "à", ouml: "ö", uuml: "ü", auml: "ä", ccedil: "ç", ntilde: "ñ",
};

function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
    }
    return NAMED_ENTITIES[e] ?? NAMED_ENTITIES[e.toLowerCase()] ?? m;
  });
}

// Readable plain text from an HTML fragment: one line per paragraph, list
// item, FAQ question and so on. Never returns markup.
function htmlToText(html) {
  const text = html
    .replace(/<(script|style|svg|noscript|template|form|nav)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<li\b[^>]*>/gi, "\n• ")
    .replace(/<\/?(p|div|section|article|ul|ol|li|h[1-6]|button|summary|details|dt|dd|tr|blockquote|figure|figcaption|header|footer)\b[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(text)
    .split("\n")
    .map(line => line.replace(/\s+/g, " ").trim())
    .filter(line => line && line !== "•")
    .join("\n");
}

// Splits a page into its <h1> intro and one section per <h2>, using the
// page's <main> when there is one (so header/footer/navigation are left out).
function extractSections(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const siteSuffix = new RegExp(`\\s*[—|–-]\\s*${config.site.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  const title = titleMatch ? htmlToText(titleMatch[1]).replace(siteSuffix, "") : null;
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const main = mainMatch ? mainMatch[1] : bodyMatch ? bodyMatch[1] : html;

  const parts = main.split(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i);
  const sections = [];
  const intro = parts[0];
  const h1 = intro.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const introText = htmlToText(intro.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, ""));
  if (h1 || introText) {
    sections.push({ heading: h1 ? `${htmlToText(h1[1])} (introduction)` : "Introduction", text: introText });
  }
  for (let i = 1; i < parts.length; i += 2) {
    const heading = htmlToText(parts[i]);
    if (!heading) continue;
    sections.push({ heading, text: htmlToText(parts[i + 1] || "") });
  }
  return {
    title,
    sections: sections.slice(0, LIMITS.sections).map(s => ({ heading: clip(s.heading, 200), text: s.text.slice(0, LIMITS.sectionText) })),
  };
}

// Pages on this site are split into sections; any other link (a Google Doc,
// a Canva design…) gets a single "whole page" comment box.
async function fetchSections(pageUrl, fetchImpl = globalThis.fetch) {
  if (!isSiteUrl(pageUrl)) return { title: null, sections: [WHOLE_PAGE], split: false };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetchImpl(pageUrl, { signal: controller.signal, redirect: "follow" });
    const type = (res.headers && res.headers.get && res.headers.get("content-type")) || "";
    if (!res.ok || !/text\/html/i.test(type)) return { title: null, sections: [WHOLE_PAGE], split: false };
    const html = (await res.text()).slice(0, LIMITS.html);
    const { title, sections } = extractSections(html);
    return sections.length ? { title, sections, split: true } : { title, sections: [WHOLE_PAGE], split: false };
  } catch (_) {
    return { title: null, sections: [WHOLE_PAGE], split: false };
  } finally {
    clearTimeout(timer);
  }
}

// ---------- auth ----------

// The clinic owner signs in with the site's existing Netlify Identity login
// (the one used for the content editor at /admin/). Netlify verifies the
// token and passes the user in context.clientContext.
function adminUser(context) {
  const user = context && context.clientContext && context.clientContext.user;
  if (!user || !user.email) return null;
  const admins = (config.reviews.admins || []).map(e => e.toLowerCase());
  if (admins.length && !admins.includes(String(user.email).toLowerCase())) return null;
  const meta = user.user_metadata || {};
  return { email: user.email, name: meta.full_name || config.reviews.adminName || user.email };
}

// ---------- storage ----------

async function loadRequest(store, id) {
  if (!isId(id)) return null;
  return store.get(`request/${id}`, { type: "json" });
}

async function saveRequest(store, request) {
  request.updatedAt = new Date().toISOString();
  await store.setJSON(`request/${request.id}`, request);
  return request;
}

async function listRequests(store) {
  const { blobs } = await store.list({ prefix: "request/" });
  const all = await Promise.all(blobs.map(b => store.get(b.key, { type: "json" })));
  return all.filter(Boolean).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

const currentRound = (request) => request.rounds[request.rounds.length - 1];

// ---------- views ----------

// What the reviewer sees: no token, no email addresses, no owner notes.
function publicView(request) {
  const round = currentRound(request);
  const previous = request.rounds.length > 1 ? request.rounds[request.rounds.length - 2] : null;
  return {
    id: request.id,
    title: request.title,
    reviewerName: request.reviewer.name,
    requestedBy: request.requestedBy.name,
    status: request.status,
    round: round.n,
    pageUrl: round.pageUrl,
    message: round.message,
    sections: round.sections,
    response: round.response,
    previousComments: previous && previous.response ? previous.response.comments : [],
  };
}

function reviewerLink(base, request) {
  return `${base}/admin/reviews/respond/?id=${request.id}&t=${request.token}`;
}

function adminView(base, request) {
  const { token, ...rest } = request;
  return { ...rest, reviewerLink: reviewerLink(base, request), prNumber: previewPrNumber(currentRound(request).pageUrl) };
}

// Links in emails point at the host the owner is using (production audit
// site, or a deploy preview while testing) when it belongs to this site.
function linkBase(event) {
  const headers = (event && event.headers) || {};
  const origin = headers.origin || (headers.host ? `https://${headers.host}` : "");
  return isSiteUrl(origin) ? new URL(origin).origin : new URL(config.site.dashboardUrl).origin;
}

// ---------- emails ----------

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const firstName = (name) => String(name || "").trim().split(/\s+/)[0] || "there";

const button = (href, label) =>
  `<p><a href="${escapeHtml(href)}" style="background:#345E85;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:500;display:inline-block;">${escapeHtml(label)}</a></p>`;

const wrap = (inner) =>
  `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#120E0B;max-width:620px;margin:0 auto;padding:24px;line-height:1.5;">${inner}</body></html>`;

function reviewerEmail(base, request) {
  const round = currentRound(request);
  const link = reviewerLink(base, request);
  const who = request.requestedBy.name;
  const again = round.n > 1;
  const subject = again ? `Updated version to review: ${request.title}` : `Please review: ${request.title}`;
  const intro = again
    ? `${who} has updated “${request.title}” after your comments. Your earlier comments are shown under each section so you can check them.`
    : `${who} has asked you to review “${request.title}” before it goes live on the ${config.site.name} website.`;
  const how = "The form shows the page section by section, with a comment box under each one. Leave a comment wherever you'd change something and leave the rest blank. It usually takes 5–10 minutes.";
  const text = [
    `Hi ${firstName(request.reviewer.name)},`,
    "",
    intro,
    round.message ? `\nMessage from ${who}: ${round.message}` : "",
    "",
    how,
    "",
    `Open the review form: ${link}`,
    `See the page itself: ${round.pageUrl}`,
    "",
    "Thank you!",
  ].filter(line => line !== null).join("\n");
  const html = wrap(`
    <p>Hi ${escapeHtml(firstName(request.reviewer.name))},</p>
    <p>${escapeHtml(intro)}</p>
    ${round.message ? `<p style="background:#f4f4f5;padding:12px 16px;border-radius:6px;"><strong>Message from ${escapeHtml(who)}:</strong> ${escapeHtml(round.message)}</p>` : ""}
    <p>${escapeHtml(how)}</p>
    ${button(link, "Open the review form")}
    <p style="color:#6a6a6a;font-size:0.9rem;">See the page itself: <a href="${escapeHtml(round.pageUrl)}" style="color:#345E85;">${escapeHtml(round.pageUrl)}</a></p>
    <p>Thank you!</p>`);
  return { subject, text, html };
}

function feedbackEmail(base, request) {
  const round = currentRound(request);
  const r = round.response;
  const decision = DECISIONS[r.decision] || r.decision;
  const link = `${base}/admin/reviews/#${request.id}`;
  const subject = `${request.reviewer.name} reviewed “${request.title}”: ${decision}`;
  const lines = r.comments.map(c => `• ${c.heading}: ${c.comment}`);
  const text = [
    `${request.reviewer.name} has reviewed “${request.title}” (round ${round.n}).`,
    "",
    `Decision: ${decision}`,
    r.general ? `Overall: ${r.general}` : "",
    lines.length ? `\nComments by section:\n${lines.join("\n")}` : "\nNo comments on individual sections.",
    "",
    `Read the feedback and decide what happens next: ${link}`,
  ].join("\n");
  const html = wrap(`
    <p><strong>${escapeHtml(request.reviewer.name)}</strong> has reviewed “${escapeHtml(request.title)}” (round ${round.n}).</p>
    <p><strong>Decision:</strong> ${escapeHtml(decision)}</p>
    ${r.general ? `<p><strong>Overall:</strong> ${escapeHtml(r.general)}</p>` : ""}
    ${r.comments.length ? `<p><strong>Comments by section:</strong></p><ul>${r.comments.map(c => `<li><strong>${escapeHtml(c.heading)}:</strong> ${escapeHtml(c.comment)}</li>`).join("")}</ul>` : "<p>No comments on individual sections.</p>"}
    ${button(link, "Read the feedback and decide")}`);
  return { subject, text, html };
}

module.exports = {
  config,
  DECISIONS,
  STATUS_LABELS,
  LIMITS,
  WHOLE_PAGE,
  json,
  openStore,
  newId,
  newToken,
  tokenMatches,
  clip,
  parseHttpsUrl,
  isSiteUrl,
  previewPrNumber,
  htmlToText,
  extractSections,
  fetchSections,
  adminUser,
  loadRequest,
  saveRequest,
  listRequests,
  currentRound,
  publicView,
  adminView,
  reviewerLink,
  linkBase,
  reviewerEmail,
  feedbackEmail,
};
