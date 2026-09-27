// Google Search Console snapshot for the audit dashboard, fetched once per
// build. Never fails the build — when Search Console isn't connected (or
// Google errors) this returns { connected: false, message } and the
// dashboard shows what to fix. See docs/gsc-setup.md.
const config = require("./auditConfig.json");
const { fetchSnapshot } = require("../../scripts/audit/search-console");

module.exports = async function () {
  const snapshot = await fetchSnapshot(config, process.env);
  console.log(snapshot.connected
    ? `[gsc] connected to ${snapshot.property}: ${snapshot.totals.current.clicks} clicks, ${snapshot.queries.length} searches (${snapshot.window.start} → ${snapshot.window.end})`
    : `[gsc] ${snapshot.status}: ${snapshot.message}`);
  return snapshot;
};
