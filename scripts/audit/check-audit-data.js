// Validates the audit data files the weekly routine writes, so a bad run
// fails `npm test` (and the routine's own pre-commit check) instead of
// quietly breaking the dashboard. No network.
//
//   node scripts/audit/check-audit-data.js

const audit = require("../../src/_data/audit.json");
const queries = require("../../src/_data/auditQueries.json");
const config = require("../../src/_data/auditConfig.json");

const OWNERS = ["claude", "practitioner", "you"];
const CONFIDENCE = ["proven", "likely", "experimental"];
const problems = [];
const check = (ok, msg) => { if (!ok) problems.push(msg); };

// audit.json
check(audit.meta && /^\d{4}-\d{2}-\d{2}$/.test(audit.meta.reportDate), "meta.reportDate must be YYYY-MM-DD");
check(Array.isArray(audit.summary) && audit.summary.length >= 1 && audit.summary.length <= 3, "summary must have 1–3 sentences");
check(Array.isArray(audit.topActions) && audit.topActions.length === 3, "topActions must have exactly 3 entries");
for (const [i, a] of (audit.topActions || []).entries()) {
  check(typeof a.text === "string" && a.text.length > 0, `topActions[${i}].text is required`);
  check(OWNERS.includes(a.owner), `topActions[${i}].owner must be one of ${OWNERS.join("/")}`);
  check(a.n === null || (audit.items || []).some(it => it.n === a.n), `topActions[${i}].n must be null or an existing item number`);
}

const seen = new Set();
for (const it of audit.items || []) {
  const id = `item #${it.n}`;
  check(Number.isInteger(it.n), `${id}: n must be an integer`);
  check(!seen.has(it.n), `${id}: duplicate item number`);
  seen.add(it.n);
  check([1, 2, 3].includes(it.tier), `${id}: tier must be 1, 2 or 3`);
  check(["H", "M", "L"].includes(it.impact), `${id}: impact must be H, M or L`);
  check(["S", "M", "L"].includes(it.effort), `${id}: effort must be S, M or L`);
  check(typeof it.title === "string" && it.title.length > 0, `${id}: title is required`);
  check(OWNERS.includes(it.owner), `${id}: owner must be one of ${OWNERS.join("/")}`);
  check(it.owner !== "practitioner" || (typeof it.reviewer === "string" && it.reviewer.length > 0), `${id}: practitioner items need a reviewer`);
  check(CONFIDENCE.includes(it.confidence), `${id}: confidence must be one of ${CONFIDENCE.join("/")}`);
  check(typeof it.why === "string" && it.why.length > 0, `${id}: why is required`);
  check(Array.isArray(it.matchTerms), `${id}: matchTerms must be an array (use [] when not about a search topic)`);
  check(Array.isArray(it.files), `${id}: files must be an array`);
  check(typeof it.body === "string", `${id}: body is required`);
}

// Copy rules from CLAUDE.md, applied to the plain-English fields shown to the owner.
const plain = [...(audit.summary || []), ...(audit.topActions || []).map(a => a.text), ...(audit.items || []).map(it => it.why || "")];
for (const text of plain) {
  check(!/\bGP\b/.test(text), `copy rule: don't use "GP" in plain-English fields: "${text.slice(0, 60)}…"`);
  check(!/at no extra charge/i.test(text), `copy rule: don't use "at no extra charge": "${text.slice(0, 60)}…"`);
}

// auditQueries.json
const pool = queries.pool || [];
const names = pool.map(q => q.q);
check(new Set(names).size === names.length, "auditQueries.pool has duplicate queries");
check(pool.length <= (queries.meta.maxPool || 50), "auditQueries.pool is over meta.maxPool");
check(pool.some(q => q.core), "auditQueries.pool must keep its core (always-checked) queries");

// auditConfig.json
check(config.site && config.site.domain, "auditConfig.site.domain is required");
check(config.searchConsole && config.searchConsole.windowDays > 0, "auditConfig.searchConsole.windowDays is required");

if (problems.length) {
  console.error("audit data: " + problems.length + " problem(s)\n  - " + problems.join("\n  - "));
  process.exit(1);
}
console.log(`audit data: ok (${(audit.items || []).length} items, ${pool.length} queries, ${pool.filter(q => q.core).length} core)`);
