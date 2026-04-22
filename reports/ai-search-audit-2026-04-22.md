# AI Search Audit — Meridian Osteopathy

**Report date:** 2026-04-22
**Run:** weekly refresh (first scheduled run after the initial audit earlier today)
**Branch:** `claude/magical-goldberg-R4J0d`
**Scope:** How well the current site is positioned to be cited by ChatGPT, Copilot, Gemini, Perplexity and Google AI Overviews, plus a prioritised punch-list of changes that move the needle most.

---

## 1. TL;DR

The site remains in a healthier starting position than most local clinics: `llms.txt`, `llms-full.txt`, `MedicalClinic` + `MedicalBusiness` JSON-LD, FAQ schema on the homepage, and an AI-crawler-friendly `robots.txt` are all shipped. That covers roughly the top quartile of table-stakes GEO hygiene.

**Nothing from the Tier 1 punch-list has shipped yet.** All 15 gaps identified earlier today still apply. Two new gaps are added this week (G16, G17) reflecting fresh April 2026 signals.

Fresh signals this week:

- **Google April 2026 core update** explicitly weights author-credentials blocks near the *top* of YMYL pages (not the bottom). Bulk AI-generated medical content with no human reviewer is being actively devalued.
- **AI Overviews** now trigger on ~48% of all searches and ~88% of healthcare queries (up from 72% a year ago).
- **ChatGPT recommends only ~1.2%** of local businesses, and only ~45% overlap with Google rankings. AI usage for local search jumped from 6% (2025) to ~45% (2026) — the off-site / UGC citation lever is no longer optional.
- **Reddit dominance confirmed** — Tinuiti Q1 2026 shows Reddit driving the largest share of AI-citation growth across nine tracked categories; long-form (300+ word) structured comments cited ~3× more than short recommendations.
- **Google publicly stated it does not use `llms.txt`** for AI features (John Mueller); adoption is still only ~10% of crawled sites, and the standard is most useful for dev-tool crawlers (Cursor, Continue, Aider, RAG pipelines). A `<link rel="llms">` hint in the HTML head is now marginal. Keep the file, deprioritise the head-tag work.

The two biggest strategic gaps — qualified machine-readable authorship and condition-level content coverage — are unchanged and still the single highest-leverage moves.

---

## 2. What's already implemented well

| Area | Where | Status |
|---|---|---|
| `llms.txt` + `llms-full.txt` | `src/llms.njk`, `src/llms-full.njk` | Auto-populated from site data |
| AI-crawler allow-list in robots | `src/robots.txt` | GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Googlebot-Extended, CCBot |
| Sitemap with `lastmod` | `src/sitemap.njk` | Auto-generated |
| `MedicalClinic` + `MedicalBusiness` JSON-LD | `src/_includes/base.njk` lines 70-123 | Includes address, hours, priceRange, offer catalog |
| `FAQPage` JSON-LD (homepage) | `src/index.njk` | Seven Q&As |
| Canonical URLs, OG, Twitter Card | `src/_includes/base.njk` | Per-page, with image dimensions |
| Title / meta-description discipline | Each `.njk` page | Bespoke titles + descriptions |
| Deploy-preview-safe Turnstile | `src/_data/site.js` | Non-prod builds use the Cloudflare test key |

Verified against `grep` for `Physician`, `AggregateRating`, `BreadcrumbList`, `MedicalWebPage`, `ProfilePage`, `dateModified`, `speakable`, `Last updated` — none present outside the site-wide block. No Tier 1 items shipped in the last 7 days.

---

## 3. Gaps against April 2026 GEO / AEO best practice

Gap IDs are stable across runs. `G16` and `G17` are new this week.

### G1. No `Physician` / `Person` schema on team profiles
`src/team/*.njk` render rich human-readable bios but emit no JSON-LD for the practitioners. The April 2026 core update explicitly reinforces authorship as a YMYL ranking factor; `Physician` with `sameAs` → professional register is the machine-readable equivalent of "Medically reviewed by a registered professional."

### G2. No `AggregateRating` / `Review` schema
"4.9 on Google" sits on the homepage but is not marked up.

### G3. No per-service `Service` / `MedicalTherapy` / `HealthcareService` schema
Each service page should carry its own node linked to the clinic `@id`. `HealthcareService` is an equally-valid alternative to `MedicalTherapy` and is increasingly the default in 2026 healthcare schema guidance.

### G4. No `BreadcrumbList`
No visible breadcrumbs and no schema.

### G5. FAQ schema only on homepage
Service pages carry none.

### G6. No visible `dateModified` / `datePublished`
Critical — 65% of AI citations point to pages published in the last year.

### G7. No condition-specific pages
No indexable URL for "sciatica osteopath Christchurch", "acupuncture IVF support", "TMJ Christchurch". Biggest content-coverage gap.

### G8. No blog / editorial content
Freshness cliff at ~3 months.

### G9. Homepage H1 not keyword-aligned
Still `<h1>Our Practitioners at Meridian Osteopathy</h1>` (src/index.njk line 15).

### G10. `llms.txt` could be richer
Missing `## Conditions we treat`, `## Pricing & ACC`, `## Common questions` sections.

### G11. No `sameAs` / social profile links
`src/_data/site.js` social fields still empty.

### G12. No `MedicalWebPage` / `ProfilePage` per team profile
Each practitioner URL should be a standalone retrievable node.

### G13. No `llms.txt` reference in HTML `<head>` *(deprioritised this week)*
Google has now publicly said it does not use `llms.txt` for AI features; adoption is ~10%. Still read by dev-tool crawlers (Cursor, Continue, Aider), so a `<link>` hint is harmless, but it has moved to polish tier.

### G14. Image alt text could be richer
AI-image-grounded models prefer descriptive over titular alt text.

### G15. No off-site citation strategy *(strengthened this week)*
Tinuiti Q1 2026 confirms Reddit now dominates AI-citation growth across nine categories; 300+ word structured community answers cited ~3× more than short recommendations.

### G16. No top-of-page "medically reviewed by" byline on service pages *(new)*
The April 2026 core update explicitly moved author-credentials blocks from the bottom of YMYL pages to near the top. Every service page needs an above-the-fold "Medically reviewed by {practitioner}, {registration}, {date}" line, ideally linked to the team profile and mirrored in page schema via `reviewedBy`.

### G17. No long-form structured deep-answer blocks *(new)*
FAQ-length Q&As are the floor, not the ceiling. Perplexity / Tinuiti data (Q1 2026) show 300+ word structured answers with subheadings are cited ~3× more than short FAQ entries. Service pages currently have no long-form deep-answer block for the top-of-funnel question.

---

## 4. Prioritised punch-list

Numbers are stable across runs (decisions in Netlify Blobs are keyed by item `n`). **#17 and #18 are new this week.**

### Tier 1 — Ship this fortnight

| # | Change | File(s) | Impact | Effort |
|---|---|---|---|---|
| 1 | Add `AggregateRating` + 3 `Review` nodes nested under `MedicalBusiness`. | `src/_includes/base.njk`, `src/_data/home.json` | H | S |
| 2 | Add `Physician` JSON-LD to each team profile + visible "Registered with …" line. | `src/_includes/team-profile.njk`, `src/_data/team.json` | H | M |
| 3 | Per-service `MedicalTherapy` / `Service` / `HealthcareService` JSON-LD. | `src/services/*.njk` | H | M |
| 4 | `FAQPage` JSON-LD on every service page (3–5 Qs each). | `src/services/*.njk`, `src/_data/services.json` | H | M |
| 5 | Fix homepage H1. | `src/index.njk` line 15 | H | S |
| 6 | `BreadcrumbList` schema + visible breadcrumb strip on non-home pages. | `src/_includes/base.njk`, `src/_includes/header.njk` | M | S |
| 7 | Visible "Last updated" + `dateModified` in page schema. | `src/_includes/base.njk`, `src/services/*.njk`, `src/team/*.njk` | H | S |
| **17** | **"Medically reviewed by {name}, {registration}, {date}" above-the-fold block on each service page, linked to team profile + `reviewedBy` in schema.** | `src/services/*.njk`, `src/_includes/base.njk` | **H** | **S** |

### Tier 2 — Next sprint

| # | Change | File(s) | Impact | Effort |
|---|---|---|---|---|
| 8 | Fill `site.social` + emit `sameAs`. | `src/_data/site.js`, `src/_includes/base.njk` | M | S |
| 9 | Expand `llms.txt` (Conditions / Pricing-ACC / Common-questions). | `src/llms.njk` | M | S |
| 10 | Four condition pages (sciatica, headaches-migraines, pregnancy-back-pain, sports-injury-recovery). | `src/conditions/*.njk`, `src/_data/conditions.json`, `src/_includes/header.njk` | H | L |
| 11 | `ProfilePage` + `MedicalWebPage` on team layout. | `src/_includes/team-profile.njk` | M | S |
| 12 | `speakable` block on service intros. | `src/services/*.njk` | L | S |
| 13 | Auto-fetch GBP reviews at build time. | `package.json`, `src/_data/reviews.js` | M | M |
| **18** | **300+ word structured deep-answer block per service page targeting the top AI query.** | `src/services/*.njk`, `src/_data/services.json` | **M** | **M** |

### Tier 3 — Editorial / off-site

| # | Change | Where | Impact | Effort |
|---|---|---|---|---|
| 14 | Start a blog (2 posts/month, each with Physician byline + FAQs). | `src/blog/`, Decap collection | H | L (ongoing) |
| 15 | Seed genuine Reddit / community brand mentions — Tinuiti Q1 2026 confirms Reddit dominance; 300+ word answers cited ~3× more. | marketing | M | M (ongoing) |
| 16 | Post-consultation Google-reviews nudge via Resend. | `netlify/functions/*` | M | M |

---

## 5. Quick-win summary (if you only do one thing this fortnight)

Pick **Tier 1 items 1, 2, 5, 7, and 17** and ship them together. Rating/Review schema + Physician schema + homepage H1 + `dateModified` + "Medically reviewed by" byline covers the four concrete 2026 AI-citation levers (E-E-A-T, freshness, quotable rating, qualified-author signal) in one combined change, and none of them require new copy to be written.

---

## 6. What shipped since last run

Nothing from the punch-list. The audit was created earlier today; the 7-day window contains only audit-tooling, image optimisations, Google Analytics, and the referral-hero swap — none of which address items 1–18.

---

## 7. Sources consulted (this run)

- [Google Algorithm Update April 2026: Changed, Impact & Recovery — iCreate Brand](https://icreatebrand.com/google-algorithm-update-april-2026/)
- [How Do Google Algorithm Updates Affect Medical Websites? | 2026 Core Update — DoctorRank](https://doctorrank.com/google-algorithm-updates-medical-websites)
- [Google AI Overviews Surge 58% Across 9 Industries — ALM Corp](https://almcorp.com/blog/google-ai-overviews-surge-9-industries/)
- [Google Drops "What People Suggest" and Expands Health AI Tools in 2026 — ALM Corp](https://almcorp.com/blog/google-removes-what-people-suggest-expands-health-ai-2026/)
- [Google removes AI Overviews for certain medical queries — TechCrunch](https://techcrunch.com/2026/01/11/google-removes-ai-overviews-for-certain-medical-queries/)
- [ChatGPT Recommends Only 1.2% Of Local Businesses — Marketing Code](https://www.marketingcode.com/chatgpt-recommends-1-percent-local-businesses-contractors/)
- [Why your website is now the source of truth in local AI search — Search Engine Land](https://searchengineland.com/why-your-website-is-now-the-source-of-truth-in-local-ai-search-474389)
- [Reddit's Rise in AI Citations — CMSWire](https://www.cmswire.com/digital-marketing/reddits-rise-in-ai-citations-what-marketers-must-know-about-aeo-strategy/)
- [Reddit SEO in 2026: How to Earn AI Overview Citations — NEURONwriter](https://neuronwriter.com/reddit-seo-ai-overview-citations-2026/)
- [Reddit Mentions for AI SEO Citations — Medium / Editoria Agency](https://medium.com/predict/reddit-mentions-for-ai-seo-citations-why-ugc-is-becoming-the-strongest-signal-in-2026-fa7d2f3cb781)
- [The State of llms.txt in 2026 — aeo.press](https://www.aeo.press/ai/the-state-of-llms-txt-in-2026)
- [llms.txt for Websites: Complete 2026 Guide — BigCloudy](https://www.bigcloudy.com/blog/what-is-llms-txt/)
- [Should Websites Implement llms.txt in 2026? — LinkBuildingHQ](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/)
- [Schema Markup for Healthcare Websites: Step-by-Step 2026 Guide — MedRankSEO](https://medrankseo.com/schema-markup-for-healthcare-websites/)
- [How Does Structured Data Improve Healthcare SEO? (2026) — Lead to Conversion](https://leadtoconversion.com/blog/how-does-structured-data-improve-healthcare-seo/)
- [YMYL 20-Point Compliance Checklist for Healthcare SEO — RankVed](https://rankved.com/ymyl-compliance-checklist-healthcare/)
- [150+ AI SEO Statistics for 2026 (Updated April) — Position Digital](https://www.position.digital/blog/ai-seo-statistics/)

---

## 8. Change log vs. previous run

- **Added gaps:** G16 (no "medically reviewed by" block), G17 (no long-form deep-answer blocks).
- **Added items:** #17 (Tier 1), #18 (Tier 2). Numbers are new; existing #1–#16 unchanged.
- **Amended gaps:** G3 now also names `HealthcareService`; G13 (llms.txt head hint) deprioritised after Google's public stance; G15 strengthened with Tinuiti Q1 2026 data.
- **Removed items:** none — nothing has shipped from the punch-list since the previous run.
