# AI Search Audit — Meridian Osteopathy

**Report date:** 2026-04-22
**Branch:** `claude/optimize-ai-search-NJ32B`
**Scope:** How well the current site is positioned to be cited by ChatGPT, Copilot, Gemini, Perplexity and Google AI Overviews, plus a prioritised punch-list of changes that move the needle most.

---

## 1. TL;DR

The site is in a healthier starting position than most local clinics: it already ships `llms.txt`, `llms-full.txt`, a strict-mode JSON-LD block with `MedicalClinic` + `MedicalBusiness`, FAQ schema on the homepage, and an AI-crawler-friendly `robots.txt`. That covers roughly the top quartile of "table-stakes" GEO hygiene.

The two biggest gaps vs. April-2026 best practice are **authorship / E-E-A-T signals on team and service pages** (no `Physician`/`Person` schema, no "medically reviewed by" block, no `sameAs` links to professional registers), and **content coverage** — there are no condition-specific landing pages ("osteopath for sciatica in Christchurch", "acupuncture for IVF support", etc.) even though the FAQs and service blurbs reference those topics. AI Overviews answer ~89% of healthcare-related queries in 2026, and Google's 2026 core update explicitly rewards pages with clear, qualified authorship — these are the two changes most likely to move citations.

A secondary cluster of high-leverage wins: stack more schema types (`Service`, `Review`, `AggregateRating`, `BreadcrumbList`), add visible `datePublished` / `dateModified` (AI has a strong recency bias — citations drop sharply past ~3 months old), and extend FAQ schema to every service page, not just home.

---

## 2. What's already implemented well

| Area | Where | Status |
|---|---|---|
| `llms.txt` proposed standard | `src/llms.njk` → `/llms.txt` | Implemented, auto-populated from data |
| `llms-full.txt` (long form) | `src/llms-full.njk` → `/llms-full.txt` | Implemented |
| AI-crawler allow-list in robots | `src/robots.txt` | GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Googlebot-Extended, CCBot all explicitly allowed |
| Sitemap | `src/sitemap.njk` → `/sitemap.xml` | Auto-generated with `lastmod` |
| `MedicalClinic` + `MedicalBusiness` JSON-LD | `src/_includes/base.njk` lines 53-122 | Includes address, hours, priceRange, offer catalog |
| `FAQPage` JSON-LD (homepage) | `src/index.njk` lines 134-152 | Seven Q&As, covers high-intent queries |
| Canonical URLs, OG, Twitter Card | `src/_includes/base.njk` lines 10-30 | Per-page, with image dimensions |
| Title / meta-description discipline | Each `.njk` page | All service + team pages have bespoke titles + descriptions |
| Deploy-preview-safe Turnstile | `src/_data/site.js` | Well-done; not AI-search-related but shows the codebase is careful |

This baseline is good. Several clinics much larger than Meridian are still missing half of the above.

---

## 3. Gaps against 2026 GEO / AEO best practice

Numbered so the punch-list in §4 can reference them.

### G1. No `Physician` / `Person` schema on team profiles
`src/team/*.njk` and `src/_includes/team-profile.njk` render rich human-readable bio content (qualifications, approach, special interests, about) but emit no JSON-LD for the practitioners. Schema.org's `Physician` (v24, now the canonical type for individual clinicians) supports `memberOf`, `worksFor`, `medicalSpecialty`, `availableService`, `sameAs`, `hasCredential`, `alumniOf` — all of which AI engines treat as trust signals for YMYL content.

**Why it matters:** 2026 core update explicitly promoted authorship as a medical-ranking factor, and `Person`/`Physician` with `sameAs` → professional register is the machine-readable equivalent of "Medically reviewed by a registered professional."

### G2. No `AggregateRating` / `Review` schema
Homepage already shows "4.9 on Google" and three real testimonials with links to share.google URLs, but none of this is marked up. Adding `AggregateRating` nested under `MedicalBusiness` (or `Physician` for per-practitioner ratings) makes the rating AI-quotable and SERP-rich-result eligible.

### G3. No per-service `Service` / `MedicalTherapy` page schema
The base template includes an `OfferCatalog` at the clinic level, but the individual service pages (`src/services/*.njk`) emit no page-level schema beyond the site-wide block. Each service page should carry its own `MedicalTherapy` or `Service` node with `provider`, `areaServed`, `hasOfferCatalog` of specialties, and a `mainEntityOfPage` link.

### G4. No `BreadcrumbList`
None of the pages expose breadcrumbs (visible or schema). AI engines use these to understand information hierarchy; they also unlock breadcrumb SERP features.

### G5. FAQ schema only on homepage
`src/index.njk` has FAQ JSON-LD, but `src/services/osteopathy.njk`, `.../acupuncture/`, `.../herbal-medicine/` do not — even though service-specific questions are the single most citation-magnet-friendly structure in 2026 (short direct answers under clear questions). Team profile pages likewise have no per-practitioner FAQ.

### G6. No visible `datePublished` / `dateModified`
Critical: Seer Interactive (2026) found 65% of AI citations point to pages published in the last year, and citations drop off sharply past ~3 months old. Meridian's pages have no visible dates, no `dateModified` in schema, and the sitemap's `lastmod` uses the build date rather than true content-change dates.

### G7. No condition-specific pages
Users ask ChatGPT and Gemini things like "best osteopath for sciatica in Christchurch", "acupuncture for IVF support", "TMJ osteopathy New Zealand". These are pure citation bait, and Meridian's FAQs already reference most of them — but there is no indexable URL for any single condition. This is the biggest content-coverage gap.

### G8. No blog / editorial content
No `articles/` or `blog/` collection. Given the 3-month freshness cliff on AI citations, publishing even two short evidence-grounded articles per month (1000–1500 words, single-topic, FAQ-embedded) would materially grow the citable surface area.

### G9. Homepage H1 is not keyword-aligned
`src/index.njk` line 17: `<h1>Our Practitioners at Meridian Osteopathy</h1>`. This is the only H1 on the homepage, which is Meridian's most link-equity-rich page. The H1 should describe the clinic's primary intent ("Osteopathy, Acupuncture & Herbal Medicine in Christchurch") and the practitioners section should be H2.

### G10. `llms.txt` could be richer
Current file lists services, practitioners, and key pages — good. But the 2026 convention is to include short, AI-citable summary blocks for conditions treated, ACC / pricing details, and a "Common Questions" section. `llms-full.txt` does more of this but is still less structured than equivalents on leading clinics (e.g. headings like `## Conditions we treat` with bullet lists).

### G11. No `sameAs` / social profile links
`src/_data/site.js` has empty strings for `facebook`, `instagram`, `linkedin`, `youtube`. AI engines use `sameAs` to disambiguate entities — even a LinkedIn company page and a Google Business Profile URL would help. Practitioner-level `sameAs` to Osteopathy NZ registration pages would be stronger still.

### G12. Team-profile meta descriptions are short; no `speakable` or `MedicalWebPage`
Pages like `src/team/nina-hu.njk` have a fine `description` but emit no per-page JSON-LD at all. Adding `MedicalWebPage` (or `ProfilePage` with `mainEntity` → `Physician`) unlocks rich results and gives AI a single retrievable node per practitioner.

### G13. No `llms.txt` reference in HTML `<head>`
The file is served at `/llms.txt` but there's no `<link rel="llms">` or similar hint in the base template. This is still an emerging convention, but several indexers now check for it.

### G14. Images' alt text + `ImageObject` schema
Haven't audited every image exhaustively, but service-page specialty images look like they rely on the `spec.title` as alt text. For AI-image-grounded models, a slightly longer descriptive alt would help.

### G15. No off-site citation strategy
SE Ranking (2026) finds domains with large Reddit / Quora brand-mention counts are ~4× more likely to be cited by AI systems than those without. This is external to the repo, but worth flagging as a marketing task: a single organic thread on r/chch or r/newzealand answering an osteopathy question with the clinic name can pay back for months.

---

## 4. Prioritised punch-list (file-by-file)

Impact/effort scoring:
- **Impact**: H = likely to move AI citations within 1–2 crawl cycles; M = compounding benefit over months; L = polish.
- **Effort**: S = < 30 min; M = half-day; L = day+ (includes copywriting).

### Tier 1 — Ship this fortnight

| # | Change | File(s) | Impact | Effort |
|---|---|---|---|---|
| 1 | Add `AggregateRating` + 3 `Review` nodes nested under `MedicalBusiness` in base JSON-LD. Use the real 4.9 / N-reviews figure; review text can come from `home.testimonials`. | `src/_includes/base.njk`, `src/_data/home.json` (add `reviewCount`, `ratingValue`) | H | S |
| 2 | Add `Physician` JSON-LD to each team-profile render. Include `name`, `jobTitle`, `worksFor` → `#clinic`, `medicalSpecialty`, `hasCredential` (pull from `qualifications`), `image`, `url`, and `sameAs` (Osteopathy NZ register URL where applicable). Also add a top-of-page "Registered with …" line visible to humans. | `src/_includes/team-profile.njk`, `src/_data/team.json` (add `sameAs`, `registrationBody`, `registrationNumber` fields) | H | M |
| 3 | Add per-page `MedicalTherapy` / `Service` JSON-LD block to each service page, referencing the clinic `@id` and itemising the specialties as `hasOfferCatalog`. | `src/services/osteopathy.njk`, `.../medical-acupuncture.njk` (and its redirect target `acupuncture.njk` if different), `.../herbal-medicine.njk` | H | M |
| 4 | Move the existing `FAQPage` JSON-LD pattern onto each service page (not just home). Three to five service-specific questions per page. The Q&A content itself probably already exists in the service's intro / specialty blocks — pull it out. | `src/services/*.njk`, `src/_data/services.json` (add `faq` arrays per service) | H | M |
| 5 | Fix the homepage H1. `<h1>Our Practitioners at Meridian Osteopathy</h1>` → `<h1>Osteopathy, Acupuncture &amp; Herbal Medicine in Christchurch</h1>` (hero), with `<h2>Our Practitioners</h2>` on the existing block. | `src/index.njk` line 17 | H | S |
| 6 | Add `BreadcrumbList` JSON-LD to the base template, built from `page.url` segments. Also show a visible breadcrumb strip above the hero on non-home pages. | `src/_includes/base.njk` (or a new partial), `src/_includes/header.njk` | M | S |
| 7 | Add visible "Last updated: \<date\>" to service and team pages and expose `dateModified` in page-level schema. Drive it from front-matter `updated` field falling back to `page.date`. | `src/_includes/base.njk`, `src/services/*.njk`, `src/team/*.njk` | H | S |

### Tier 2 — Next sprint

| # | Change | File(s) | Impact | Effort |
|---|---|---|---|---|
| 8 | Fill `site.social` with real URLs (even one — the Google Business Profile URL counts) and emit them as `sameAs` inside the clinic JSON-LD. | `src/_data/site.js`, `src/_includes/base.njk` | M | S |
| 9 | Expand `llms.txt` to include `## Conditions we treat`, `## Pricing & ACC`, and `## Common questions` sections. Keep it ≤ 1500 words total; Perplexity and others truncate. | `src/llms.njk` | M | S |
| 10 | Create four condition-specific pages as a new collection `src/conditions/`: `sciatica.njk`, `headaches-migraines.njk`, `pregnancy-back-pain.njk`, `sports-injury-recovery.njk`. Each 800–1200 words, structured Q→A, `MedicalCondition` + `FAQPage` schema, internal-link to the relevant service page. Add to nav under "What we treat". | `src/conditions/*.njk`, `src/_data/conditions.json`, `src/_includes/header.njk` | H | L |
| 11 | Add `ProfilePage` + `MedicalWebPage` JSON-LD on team-profile layout so each practitioner URL is a standalone retrievable node. | `src/_includes/team-profile.njk` | M | S |
| 12 | Add `speakable` block on service intro paragraphs (for voice assistants / Gemini Live). | `src/services/*.njk` | L | S |
| 13 | Register a GBP (Google Business Profile) reviews fetch so `reviewCount` / `ratingValue` update automatically rather than being hand-edited. Could be a build-time script that hits the Places API with a cached 24h window. | `package.json`, a small build script, `src/_data/reviews.js` | M | M |

### Tier 3 — Editorial / off-site

| # | Change | Where | Impact | Effort |
|---|---|---|---|---|
| 14 | Start a light blog (2 posts/month) with short evidence-based articles per condition. Each post: author byline with `Physician` schema, `datePublished`, `dateModified`, 3–5 FAQs. Posts feed the freshness signal AI engines reward. | `src/blog/` (new collection), Decap CMS collection config in `src/admin/` | H | L (ongoing) |
| 15 | Off-site: seed a handful of genuine, non-spammy answers on r/newzealand / r/chch / r/AskNZ threads about osteopathy, ACC claims, back pain. Do NOT astroturf — this is a long-game brand-mention strategy. | N/A (marketing) | M | M (ongoing) |
| 16 | Encourage new Google reviews monthly (existing 4.9 is good; recency matters to AI engines, which prefer reviews <12 months old). Integrate a post-consultation email nudge via Resend (already wired). | `netlify/functions/*` post-booking flow | M | M |

---

## 5. Quick-win summary (if you only do one thing)

Pick **Tier 1 items 1, 2, 5, and 7** and ship them together. That's: add AggregateRating+Review, add Physician schema on team pages, fix the homepage H1, and surface dateModified everywhere. All four are <1 day of combined work, they all address YMYL-era AI-citation gaps, and none of them require new copy to be written.

---

## 6. Sources consulted (April 2026)

- [Mastering generative engine optimization in 2026: Full guide — Search Engine Land](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [SEO in 2026: Higher standards, AI influence, and a web still catching up — Search Engine Land](https://searchengineland.com/seo-2026-higher-standards-ai-influence-web-catching-up-473540)
- [Update: AI Overviews Reduce Clicks by 58% — Ahrefs](https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/)
- [Update: 38% of AI Overview Citations Pull From The Top 10 — Ahrefs](https://ahrefs.com/blog/ai-overview-citations-top-10/)
- [Google AI Overview Citations From Top-Ranking Pages Drop Sharply — Search Engine Journal](https://www.searchenginejournal.com/google-ai-overview-citations-from-top-ranking-pages-drop-sharply/568637/)
- [Healthcare Schema Markup: Growth of the Physician Rich Result — SchemaApp](https://www.schemaapp.com/schema-markup/healthcare-schema-markup-evolution-of-the-physician-rich-result/)
- [Schema.org v24 release: Changes to Physician Schema Markup — SchemaApp](https://www.schemaapp.com/schema-app-news/schema-org-v24-0-release-changes-to-physician-schema-markup/)
- [Google AI Mode for Medical Clinics: Local SEO Strategy for 2026 — Ranktracker](https://www.ranktracker.com/blog/google-ai-mode-for-medical-clinics/)
- [Healthcare and AI Overviews: How Google Sharpened Its Approach — BrightEdge](https://www.brightedge.com/resources/weekly-ai-search-insights/healthcare-ai-evolution-google-2023-2025)
- [Top healthcare trends of 2026: AI reshapes online search behavior — Definitive Healthcare](https://www.definitivehc.com/blog/ai-search-strategies-for-healthcare-marketers)
- [Meet llms.txt, a proposed standard for AI website content crawling — Search Engine Land](https://searchengineland.com/llms-txt-proposed-standard-453676)
- [LLMs.txt for AI Search Report 2026 — ALLMO](https://www.allmo.ai/articles/llms-txt)
- [E-E-A-T and AI: The Human Edge in Search Authority (2026) — ClickRank](https://www.clickrank.ai/e-e-a-t-and-ai/)
- [The YMYL Playbook for Healthcare AI Search — upGrowth](https://upgrowth.in/ymyl-playbook-healthcare-brands-win-ai-search-trust/)
- [Reddit's Rise in AI Citations: What Marketers Must Know — CMSWire](https://www.cmswire.com/digital-marketing/reddits-rise-in-ai-citations-what-marketers-must-know-about-aeo-strategy/)
- [150+ AI SEO Statistics for 2026 (Updated April) — Position Digital](https://www.position.digital/blog/ai-seo-statistics/)
- [Top 10 Local SEO Strategies for Physiotherapists in 2026 — CausalFunnel](https://www.causalfunnel.com/blog/top-10-local-seo-strategies-for-physiotherapists-in-2026/)

---

## 7. How to read the next report

This file will be re-generated every 3 days (see the accompanying `.github/workflows/ai-search-audit.yml` proposal in the PR). Diff between reports will show:
- New community / industry signals since the last run
- Items from the punch-list that have moved to "implemented"
- Any regressions (e.g. a build that broke the schema block)
