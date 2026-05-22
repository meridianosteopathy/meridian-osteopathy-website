# AI Search Audit — 2026-05-22

Weekly AEO/GEO audit for Meridian Osteopathy (meridianosteopathy.co.nz).

## TL;DR

**Shipped this week**

- **Item #17 (closes G16)** — `/services/medical-acupuncture/` renamed to
  "Acupuncture & Dry Needling" across nav, homepage card, JSON-LD,
  breadcrumbs and inter-service cards. Min Jin positioned as TCM lead,
  Nina Hu as Western medical acupuncture / dry needling lead. New FAQ
  entries cover acupuncture-vs-dry-needling, which practitioner to book,
  and what to expect at a first dry-needling session. PR #78. Note: the
  implementation diverged from the original spec (which had been a
  separate `/services/acupuncture/dry-needling/` sub-page) — the rename
  achieves the same G16 goal without splitting authority across two URLs.
- **Item #31 (closes G24)** — Every condition page (back-pain, neck-pain,
  sciatica, headaches-migraines, pregnancy-back-pain,
  sports-injury-recovery) and every service page (osteopathy,
  acupuncture, herbal-medicine) now opens with a 40–60 word
  citation-ready direct answer in the "X treatment at Meridian
  Osteopathy in Christchurch …" format, followed by the existing
  evidence-informed prose. The answer-leading sentence also becomes the
  first sentence of the MedicalCondition / Service JSON-LD description
  field. PR #77.

**Non-audit improvements**

- **PR #80/#81** — Per-practitioner booking pages with Cliniko
  pre-targeted. Each practitioner gets their own `/book/<slug>/` URL;
  homepage practitioner cards repointed at the matching per-practitioner
  `/book/` page. Reduces clicks from "pick a practitioner" to
  "pick a time" from 3 to 1.
- **PR #82** — Min Jin's ACC eligibility correctly distinguished from
  Nina Hu's across acupuncture pages and per-practitioner booking
  pages. Nina is an ACC-registered osteopath who lodges claims; Min is
  registered to treat as an ACC acupuncture provider but does not lodge
  claims herself.
- **PRs #86, #88, #90, #93** — Kaylee Frost team photo updated,
  colour-corrected, and optimised across multiple iterations.
- **PR #91** — `/admin` Decap CMS coverage gaps filled. All editable
  content blocks on the live site now have corresponding CMS controls.

## Search visibility — wins/losses vs 2026-05-15

**MILESTONE — first-ever Meridian top-10 surfacing in any tracked
query.** `meridianosteopathy.co.nz` now sits at position 5 (non-aggregator)
for **"osteopath vs physiotherapist christchurch"** — between
`christchurchosteopath.co.nz` at #4 and `13thbeachhealthservices.com.au`
at #6.

This is almost certainly Google blending our homepage into the
comparison-intent query, not a content-led win — we don't have a
dedicated `/osteopath-vs-physio/` page. But the homepage's broadened
title (now "Osteopathy, Acupuncture, Dry Needling & Herbal Medicine in
Christchurch" after PR #78) plus the apex-domain consolidation from
PR #73 and the citation-ready intros from #31/#77 are starting to
register. Priority held at 30 per the 4-10 rank rule.

Every other tracked query stayed absent from top 10, so the standard
-10 priority decay applies to the remaining 37.

### Notable shifts

| Query | Change |
| --- | --- |
| `acupuncture christchurch` | `chchacupuncture.co.nz` RECLAIMED #1 (was outside top 5 last week — `thehouseofacupuncture.co.nz` had held it). |
| `osteopath hillmorton` | STILL all-UK results (`winchmore-osteopaths.co.uk`, `bostonosteopathichealth.com`, `hillsosteopath.com`, `fionarobertson.net`) 12 days after item #29 added Hillmorton to flowing intro copy. Persistent indexing lag. |
| `osteopath wigram` | STILL hollow on the NZ side. 12 days post-#29 ship, no movement. |
| `osteopath addington` | STILL UK-only on the visible SERP. `health4you.co.nz` aggregator lists Michael Inman in Addington but no NZ clinic page surfaces. |
| `whiplash osteopath christchurch` | First check. Standard NZ-side osteo set wins. Triskelion Osteopathy (Riccarton) is the dedicated player. |
| `concussion osteopath christchurch` | First check. `triskelionconcussioncare.co.nz` dominates (single-condition specialist site). `osteo.co.nz/concussion/` at #2, `triskelionosteopathy.co.nz/concussion/` at #3. HeadWise and Better Health also rank. New punch-list item #32 added. |
| `medical acupuncture christchurch` | No surfacing yet — the "Acupuncture & Dry Needling" rename (PR #78) shipped 5 days ago. Re-check next 2 runs. |
| `dry needling christchurch` | Physios still own every NZ slot. Item #17 shipped 5 days ago — too early to expect movement. |

### Condition-page indexing lag continues

The four item-#10 condition pages (sciatica, headaches-migraines,
pregnancy-back-pain, sports-injury-recovery) are now 6 weeks
post-ship and still not visible. The two follow-up pages (neck-pain,
back-pain — PRs #63, #64) are 4 weeks post-ship and similarly absent.
Internal cross-links from item #30 shipped 2026-05-10 (12 days ago) —
still no movement.

This is consistent with the broader pattern in our SERP set: new pages
on Meridian are not yet inheriting the apex-domain authority that the
homepage now demonstrably has (per the comparison-query milestone
above). The two most likely causes are (a) thin internal-link surface
to each condition page beyond the nav dropdown and the homepage tile
grid — both already shipped — and (b) absence of fresh content cadence
(per item #14 / G8). The latter is the structural blocker. We've shipped
all the schema, all the citation-ready intros, all the entity
disambiguation a static site can ship; freshness is what's left.

## Pool changes

- **Pool size**: 38 → 41 (added 3, none pruned).
- **New queries**: `post concussion osteopath christchurch` (priority
  40), `lower back pain christchurch` (priority 40),
  `tennis elbow osteopath christchurch` (priority 35). All derived from
  this-run SERP gaps; autocomplete fetch (`suggestqueries.google.com`)
  remains blocked by the routine host egress allowlist.
- **At-floor (priority < 20)**: `tmj osteopath christchurch` (15),
  `acupuncture for ivf christchurch` (15), `cranial osteopath
  christchurch` (10). First run below 20 for each — will be PRUNE
  candidates if they stay below 20 for 2 more runs.

## Industry signals this week

- **AI Overviews now trigger on 88% of healthcare queries**, up from
  72% in 2024 (BrightEdge / Healthcare Success May-2026 data). When AI
  Overviews appear, clickthrough rates drop from 1.6% to 0.6% — but
  cited brands earn 35% more clicks and AI visitors convert 4.4×
  higher than organic. Citation eligibility > raw ranking.
- **62% of AI Overview citations go to sources NOT ranking on page
  one** (AEO Engine / Conductor May-2026). Citation and ranking are
  separate outcomes that require separate strategies.
- **ClaudeBot crawl volume grew 800% at the start of 2026** as
  Anthropic scaled its web search API. Our explicit allow-list in
  `robots.txt` (`ClaudeBot`, `anthropic-ai`) means we're not blocking
  the bot that's growing fastest.
- **Tinuiti Q1 2026 AI Citations Trends Report**: social-media share
  of AI citations climbed past 9% Oct-2025 → Jan-2026, with Reddit
  accounting for the dominant share of growth across nine product
  categories. Reinforces item #15 (G15).
- **Healthcare llms.txt adoption** remains under 10% in top-100
  domains (Presenc.ai State of llms.txt 2026 report). We've had
  llms.txt and llms-full.txt since the first audit run — we're in the
  leading 10%.
- **Google Business Profile is the primary data source for AI-driven
  local search** across AI Overviews, ChatGPT and Perplexity location
  queries (PinMeTo / MedRankSEO May-2026). Reinforces items #13
  (auto-fetch GBP reviews) and #16 (review nudge).

## Backlog

7 items pending (down from 8 last run after #17 and #31 shipped; up
1 with the new #32).

| # | Tier | Impact | Effort | Title | Addresses |
| ---: | :---: | :---: | :---: | --- | --- |
| 12 | 2 | L | S | Add speakable blocks on service intros | G7 |
| 13 | 2 | M | M | Auto-fetch Google Business Profile reviews at build time | — |
| 14 | 3 | H | L | Start a blog (2 posts/month) | G8 |
| 15 | 3 | M | M | Seed Reddit / community brand mentions | G15 |
| 16 | 3 | M | M | Encourage monthly Google reviews nudge | — |
| 25 | 2 | M | S | Build `/acc/` landing page | G7 |
| 32 | 2 | M | S | Add `/conditions/concussion/` page | — |

**T1**: none. **T2**: #12, #13, #25, #32. **T3**: #14, #15, #16.

## Closed gaps this run

- **G16 (No Western-framed dry-needling landing URL)** — closed by
  PR #78. `/services/medical-acupuncture/` now leads with "Acupuncture
  & Dry Needling", has Nina Hu's PG Cert credential in the first
  paragraph, names Halswell in the location stack, carries
  MedicalTherapy schema and FAQPage entries on
  acupuncture-vs-dry-needling, and is the single indexable URL
  targeting both intents.
- **G24 (Service + condition intros don't open with a citation-ready
  40–60 word direct answer)** — closed by PR #77. All 6 condition
  pages and all 3 service pages now open with the citation-ready
  pattern; the answer-leading sentence propagates into JSON-LD
  description fields.

## Remaining gaps

- **G7** — No ACC landing page (under #25). Reinforced this week:
  `thehouseofacupuncture.co.nz/our-services/acc-acupuncture-chistchurch`
  owns `acupuncture acc christchurch` for the same structural reason
  `osteo.co.nz` owns `osteopath acc christchurch`.
- **G8** — No blog / editorial content (under #14). `osteopath-christchurch.com`
  still publishing fresh dated posts (most recent 2026-04-02) and
  surfacing across cranial / migraine / baby / arthritis / stress
  queries.
- **G15** — No off-site citation strategy (under #15). Reddit
  continues to grow as an AI citation source; Tinuiti Q1 2026 data
  shows social-media citation share past 9% with Reddit dominant.
