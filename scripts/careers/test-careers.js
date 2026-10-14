// Checks the careers data still produces valid role pages, Google
// JobPosting markup and PDFs, and that the copy follows the CLAUDE.md
// rules. Run with: node scripts/careers/test-careers.js
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { load, slugify, paragraphs, sectionsToHtml } = require("./roles");
const { buildRolePdf } = require("./pdf");

const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push(["ok  ", name]);
  } catch (e) {
    results.push(["FAIL", name + " — " + e.message]);
  }
}

(async () => {
  await check("slugify handles spaces, ampersands and accents", () => {
    assert.strictEqual(slugify("Massage Therapist"), "massage-therapist");
    assert.strictEqual(slugify("Osteopath & Acupuncturist"), "osteopath-and-acupuncturist");
    assert.strictEqual(slugify("  Māori Health Lead "), "maori-health-lead");
  });

  await check("paragraphs splits on blank lines and joins wrapped lines", () => {
    assert.deepStrictEqual(paragraphs("One\nline.\n\nTwo."), ["One line.", "Two."]);
    assert.deepStrictEqual(paragraphs(""), []);
  });

  await check("sectionsToHtml escapes text", () => {
    const html = sectionsToHtml([{ heading: "A & B", items: ["<script>x</script>"] }]);
    assert.ok(!html.includes("<script>"));
    assert.ok(html.includes("A &amp; B"));
  });

  const roles = load();

  await check("every role has a unique slug and URL", () => {
    const slugs = roles.map((r) => r.slug);
    assert.strictEqual(new Set(slugs).size, slugs.length);
    for (const r of roles) assert.strictEqual(r.url, "/careers/" + r.slug + "/");
  });

  await check("every role has Google's required JobPosting fields", () => {
    for (const r of roles) {
      const jp = r.jobPosting;
      assert.ok(jp, r.title + ": no JobPosting (is datePosted set?)");
      for (const key of ["title", "description", "datePosted", "hiringOrganization", "jobLocation"]) {
        assert.ok(jp[key], r.title + ": missing " + key);
      }
      assert.match(jp.datePosted, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(jp.jobLocation.address.addressCountry, r.title + ": missing country");
      assert.ok(!("validThrough" in jp), r.title + ": roles are open until filled");
    }
  });

  await check("every role has some content to show", () => {
    for (const r of roles) assert.ok(r.sections.length >= 2, r.title + ": too few sections");
  });

  await check("careers copy follows the site copy rules", () => {
    const raw = fs.readFileSync(path.join(__dirname, "../../src/_data/careers.json"), "utf8");
    assert.ok(!/\bGP\b/.test(raw), 'mentions "GP"');
    assert.ok(!/at no extra charge/i.test(raw), 'uses "at no extra charge"');
  });

  for (const r of roles) {
    await check("PDF builds for " + r.title, async () => {
      const buf = await buildRolePdf(r);
      assert.strictEqual(buf.subarray(0, 5).toString(), "%PDF-");
      assert.ok(buf.length > 5000, "PDF looks empty (" + buf.length + " bytes)");
    });
  }

  for (const [status, name] of results) console.log("  " + status + " " + name);
  const failed = results.filter(([s]) => s === "FAIL").length;
  console.log("\n" + (results.length - failed) + "/" + results.length + " careers checks passed");
  if (failed) process.exit(1);
})();
