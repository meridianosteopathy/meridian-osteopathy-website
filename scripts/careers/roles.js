// Single source for everything derived from src/_data/careers.json: the
// vacancy table, each role's page, its Google JobPosting markup and its
// downloadable PDF. Keeping the slug, URLs and section wording here means
// the web page, the PDF and what Google reads can't drift apart when a
// role is edited in /admin.
const fs = require("fs");
const path = require("path");
const site = require("../../src/_data/site.js");

const DATA_FILE = path.join(__dirname, "../../src/_data/careers.json");

// Decap's "Employment Type" options → schema.org employmentType values.
const EMPLOYMENT_TYPES = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  "Contractor": "CONTRACTOR",
};

function slugify(text) {
  return String(text || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanList(value) {
  return (Array.isArray(value) ? value : [])
    .map((s) => String(s == null ? "" : s).trim())
    .filter(Boolean);
}

// Decap text fields keep the editor's line breaks: a blank line starts a
// new paragraph, a single line break is just wrapping.
function paragraphs(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

// Accepts "2026-10-15" (what Decap stores) or anything Date can parse;
// returns YYYY-MM-DD, or null when the field is empty or unreadable.
function isoDate(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value);
  const d = new Date(value);
  return isNaN(d) ? null : d.toISOString().slice(0, 10);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// The ordered content blocks shown on the role page and in the PDF. Older
// or minimal entries (title, type and short summary only) still produce a
// usable page: the summary stands in for the requirements list.
function buildSections(v, shared) {
  const overview = paragraphs(v.overview);
  const essential = cleanList(v.essential);
  const summary = String(v.requirements || "").trim();
  const sections = [
    { heading: "About the role", paragraphs: overview },
    { heading: "Key responsibilities", items: cleanList(v.responsibilities) },
    essential.length
      ? { heading: "What you'll need", items: essential }
      : { heading: "What you'll need", paragraphs: summary ? [summary] : [] },
    { heading: "Nice to have", items: cleanList(v.desirable) },
    { heading: "Hours", paragraphs: paragraphs(v.hours) },
    { heading: "What we offer", items: shared.offer },
    { heading: "About " + site.name, paragraphs: shared.about },
  ];
  return sections.filter(
    (s) => (s.items && s.items.length) || (s.paragraphs && s.paragraphs.length)
  );
}

function sectionsToHtml(sections) {
  return sections
    .map((s) => {
      const body = s.items
        ? "<ul>" + s.items.map((i) => "<li>" + escapeHtml(i) + "</li>").join("") + "</ul>"
        : s.paragraphs.map((p) => "<p>" + escapeHtml(p) + "</p>").join("");
      return "<h3>" + escapeHtml(s.heading) + "</h3>" + body;
    })
    .join("");
}

// Google's JobPosting rich result needs title, description, datePosted,
// hiringOrganization and jobLocation. Roles are "open until filled", so
// there's deliberately no validThrough: removing the role in /admin takes
// the page (and with it the listing) down.
function buildJobPosting(role) {
  if (!role.datePosted) return null;
  const a = site.addressParts;
  const posting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: sectionsToHtml(role.sections),
    datePosted: role.datePosted,
    hiringOrganization: {
      "@type": "Organization",
      name: site.name,
      sameAs: site.url + "/",
      logo: site.url + "/images/logomark-dark.svg",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: a.streetAddress,
        addressLocality: a.locality,
        addressRegion: a.region,
        postalCode: a.postalCode,
        addressCountry: a.countryCode,
      },
    },
    directApply: true,
    url: site.url + role.url,
  };
  if (role.employmentType) posting.employmentType = role.employmentType;
  return posting;
}

function load() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const shared = {
    about: paragraphs(data.about),
    offer: cleanList(data.offer),
  };
  const used = new Set();
  return (data.vacancies || [])
    .filter((v) => v && String(v.title || "").trim())
    .map((v) => {
      const title = String(v.title).trim();
      // Two vacancies with the same title (e.g. two osteopath roles) still
      // need distinct URLs.
      let slug = slugify(title) || "role";
      for (let n = 2; used.has(slug); n++) slug = slugify(title) + "-" + n;
      used.add(slug);

      const role = {
        title,
        type: v.type || "",
        summary: String(v.requirements || "").trim(),
        slug,
        url: "/careers/" + slug + "/",
        pdfUrl: "/careers/" + slug + "/meridian-osteopathy-" + slug + ".pdf",
        pdfFileName: site.name + " - " + title + ".pdf",
        datePosted: isoDate(v.datePosted),
        employmentType: EMPLOYMENT_TYPES[v.type] || null,
      };
      role.sections = buildSections(v, shared);
      role.jobPosting = buildJobPosting(role);
      return role;
    });
}

module.exports = { load, slugify, paragraphs, sectionsToHtml };
