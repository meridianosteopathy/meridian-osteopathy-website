// Builds a role's downloadable A4 PDF from the same sections the role page
// shows (see roles.js), in the brand fonts and colours. Called from the
// eleventy.after hook in .eleventy.js, so the PDF is regenerated on every
// build — editing a role in /admin updates the page and the PDF together.
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const SVGtoPDF = require("svg-to-pdfkit");
const site = require("../../src/_data/site.js");

const ROOT = path.join(__dirname, "../..");
const FONT_DIR = path.join(ROOT, "src/css/fonts");
const LOGO = fs.readFileSync(path.join(ROOT, "src/images/logo-primary-dark.svg"), "utf8");

// Brand tokens from src/css/styles.css :root. All text pairings are on
// white (or --light-sky-blue for the apply box) and pass WCAG AA.
const C = {
  primary: "#345E85",
  body: "#3a3a3a",
  light: "#6a6a6a",
  border: "#d0d8e0",
  applyBg: "#D4E3F4",
  dark: "#120E0B",
};

const MARGIN = 56;
const FOOTER_SPACE = 36;

function dateFriendly(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function buildRolePdf(role) {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: MARGIN, left: MARGIN, right: MARGIN, bottom: MARGIN + FOOTER_SPACE },
    bufferPages: true,
    lang: "en-NZ",
    displayTitle: true,
    info: {
      Title: role.title + " — " + site.name,
      Author: site.name,
      Subject: "Role description",
    },
  });
  for (const w of ["Regular", "Medium", "SemiBold", "Bold"]) {
    doc.registerFont(w, path.join(FONT_DIR, "EssentialSans-" + w + ".woff2"));
  }

  const chunks = [];
  doc.on("data", (c) => chunks.push(c));
  const done = new Promise((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  const width = doc.page.width - MARGIN * 2;
  const bottom = () => doc.page.height - doc.page.margins.bottom;
  const ensureSpace = (h) => {
    if (doc.y + h > bottom()) doc.addPage();
  };

  // Header: logo left, label right, hairline rule.
  const logoW = 150;
  SVGtoPDF(doc, LOGO, MARGIN, MARGIN - 8, { width: logoW, preserveAspectRatio: "xMinYMin meet" });
  doc.font("Medium").fontSize(9).fillColor(C.light)
    .text("ROLE DESCRIPTION", MARGIN, MARGIN + 8, { width, align: "right", characterSpacing: 1 });
  const ruleY = MARGIN + 52;
  doc.moveTo(MARGIN, ruleY).lineTo(MARGIN + width, ruleY).lineWidth(0.75).strokeColor(C.border).stroke();

  // Title + meta line.
  doc.font("Bold").fontSize(26).fillColor(C.primary).text(role.title, MARGIN, ruleY + 24, { width });
  const meta = [role.type, site.addressParts.locality + ", " + site.addressParts.country];
  if (role.datePosted) meta.push("Posted " + dateFriendly(role.datePosted));
  doc.moveDown(0.3).font("Medium").fontSize(10.5).fillColor(C.light)
    .text(meta.filter(Boolean).join("   ·   "), { width });

  // Sections.
  for (const s of role.sections) {
    doc.font("SemiBold").fontSize(13);
    ensureSpace(doc.currentLineHeight(true) + 40); // keep heading with its first lines
    doc.moveDown(1.1).fillColor(C.primary).text(s.heading, MARGIN, doc.y, { width });
    doc.moveDown(0.35).font("Regular").fontSize(10.5).fillColor(C.body);
    if (s.items) {
      for (const item of s.items) {
        const h = doc.heightOfString(item, { width: width - 14, lineGap: 2.5 });
        ensureSpace(h + 4);
        const y = doc.y;
        doc.circle(MARGIN + 3, y + 6.5, 1.8).fill(C.primary);
        doc.fillColor(C.body).text(item, MARGIN + 14, y, { width: width - 14, lineGap: 2.5 });
        doc.moveDown(0.25);
      }
    } else {
      s.paragraphs.forEach((p, i) => {
        if (i) doc.moveDown(0.5);
        doc.text(p, MARGIN, doc.y, { width, lineGap: 2.5 });
      });
    }
  }

  // How to apply.
  const applyUrl = site.url.replace(/^https?:\/\//, "") + role.url;
  const pad = 16;
  const innerW = width - pad * 2;
  const lines = [
    { font: "SemiBold", size: 13, color: C.primary, text: "How to apply", gap: 6 },
    { font: "Regular", size: 10.5, color: C.dark, text: "Apply online at " + applyUrl + " and attach your CV and a cover letter.", gap: 4 },
    { font: "Regular", size: 10.5, color: C.dark, text: "Questions? Email " + site.email + " or call " + site.phone + ".", gap: 0 },
  ];
  const boxH = pad * 2 + lines.reduce((sum, l) => {
    doc.font(l.font).fontSize(l.size);
    return sum + doc.heightOfString(l.text, { width: innerW, lineGap: 2.5 }) + l.gap;
  }, 0);
  doc.moveDown(1.4);
  ensureSpace(boxH);
  const boxY = doc.y;
  doc.roundedRect(MARGIN, boxY, width, boxH, 8).fill(C.applyBg);
  doc.y = boxY + pad;
  for (const l of lines) {
    doc.font(l.font).fontSize(l.size).fillColor(l.color)
      .text(l.text, MARGIN + pad, doc.y, { width: innerW, lineGap: 2.5 });
    doc.y += l.gap;
  }
  doc.link(MARGIN, boxY, width, boxH, site.url + role.url);

  // Footer on every page. Drop the bottom margin while writing so pdfkit
  // doesn't treat footer text as overflow and add a blank page.
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const m = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    const y = doc.page.height - MARGIN;
    doc.moveTo(MARGIN, y - 10).lineTo(MARGIN + width, y - 10).lineWidth(0.5).strokeColor(C.border).stroke();
    doc.font("Regular").fontSize(8.5).fillColor(C.light)
      .text(site.name + "  ·  " + site.address + "  ·  " + site.url.replace(/^https?:\/\//, ""), MARGIN, y, { width: width - 60, lineBreak: false });
    doc.text("Page " + (i - range.start + 1) + " of " + range.count, MARGIN, y, { width, align: "right", lineBreak: false });
    doc.page.margins.bottom = m;
  }

  doc.end();
  return done;
}

module.exports = { buildRolePdf };
