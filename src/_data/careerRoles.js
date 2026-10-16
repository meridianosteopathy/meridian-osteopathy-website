// Vacancies from careers.json, enriched with each role's slug, page URL,
// PDF URL, content sections and JobPosting markup. See
// scripts/careers/roles.js — the PDF build in .eleventy.js uses the same
// module so pages and downloads always match.
module.exports = () => require("../../scripts/careers/roles").load();
