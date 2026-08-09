# AI Search Audit — 2026-06-12

Weekly snapshot for meridianosteopathy.co.nz against AEO / GEO signals and a tracked search-visibility pool of 45 queries.

## Shipped this week

- **PR #100 — Jonathan Grice profile card now links to his personal site** (2026-06-11). Optional `website` field on team data, rendered as a small _View more about Jonathan_ external link beneath the Book button on the profile sidebar card. Only renders for members with a `website` set, so the same hook can be reused for Min / Kaylee / Nina later if they get their own personal sites. Not in the audit punch list — small but adds an entity-graph signal (sameAs-equivalent) for the practice's newest practitioner.

**No audit punch-list items shipped this run.** The pending backlog now stands at 9 items.

## Backlog after this run

9 items pending. Tier 1 → #35. Tier 2 → #12, #13, #25, #32, #36. Tier 3 → #14, #15, #16.

| #  | Tier | Impact | Effort | Title |
|----|------|--------|--------|-------|
| 12 | 2 | L | S | Add speakable blocks on service intros |
| 13 | 2 | M | M | Auto-fetch Google Business Profile reviews at build time |
| 14 | 3 | H | L | Start a blog (2 posts/month) |
| 15 | 3 | M | M | Seed Reddit / community brand mentions |
| 16 | 3 | M | M | Encourage monthly Google reviews nudge |
| 25 | 2 | M | S | Build an /acc/ landing page — osteo.co.nz / Active Health own ACC queries |
| 32 | 2 | M | S | Add /conditions/concussion/ page — concussion SERP set continues to harden |
| 35 | 1 | M | S | Enable Google Search Console Generative AI performance report before opt-out toggle (2026-06-17); UK-first rollout means NZ data availability may slip |
| **36** | **2** | **M** | **S** | **Audit Google Business Profile photos — descriptive captions for AI Overview signal (NEW)** |

## Search visibility

30 of 45 pool queries re-checked against live SERPs (top-30 by priority) plus first-checks for the 5 derived queries added last run = 35 SERP samples this run. Autocomplete fetch still blocked by routine host egress allowlist — pool self-expansion via derived queries continues as the workaround.

### Wins vs last run

- **`paediatric osteopath christchurch` — AI summary continues to name Nina Hu directly** (week 2 running). happyspine.co.nz/nina-hu surfaces at SERP position 7; the AI-summary layer pulls Nina's `@meridianosteopathy.co.nz` email and `02108655151` phone into the response text. The entity-disambiguation work from #27 / #28 / #31 keeps paying off at the AI layer.
- **5 of 5 first-time checks completed cleanly** for the queries added last run (`acupuncture for endometriosis christchurch`, `acupuncture for pcos christchurch`, `acupuncture for cancer christchurch`, `headaches osteopath christchurch`, `post concussion syndrome christchurch`) — see "First-check findings" below for the high-value observations.

### Losses vs last run

- **`osteopath vs physiotherapist christchurch` — REGRESSION PERSISTS (week 2).** Last run we noted the drop from non-aggregator #3 → not in top 10 and flagged it might be SERP volatility (Ahrefs 54.5% AIO overlap). This week we're still absent from top 10, with Better Health also dropping from #2 to #5. Two consecutive weeks of identical absence is now beyond plausible volatility — the regression looks structural. Priority dropped 25 → 15 per the −10 rule. No immediate code action because (a) Halswell Clinic's blog-post URL still owns this query, same #14 pattern, and (b) there's no obvious lost link or content swap on our side to attribute it to.

### Shifts worth tracking

- **`osteopath addington` — Performance Plus Physio NEW #1.** Last 5 runs the SERP was hollow / UK-only NZ-side; this week performanceplusphysiochch.co.nz/osteopath-addington-christchurch/ takes the single NZ slot. Confirms the dedicated-URL pattern from items #25, #32 works even from a non-osteo (physio) site for suburb queries. Reinforces #14 / dedicated-page strategy.
- **`concussion osteopath christchurch` — osteo.co.nz/concussion NEW #1** (was Triskelion Concussion Care last run). Triskelion family still holds 3 of top 5 slots; the dominant concussion competitive set hasn't changed, just the leader has rotated. Item #32 still applies.
- **`post concussion osteopath christchurch` — christchurch-osteopathy-acupuncture.co.nz/osteopathy/cranialosteopathy NEW #1** (was osteopath-christchurch.com last run). Same dedicated-URL-wins pattern.
- **`lower back pain christchurch` — Halswell Clinic NEW #1** (was Better Health last run); chiropractor headachetendon.nz NEW #2. The chiropractor entry into the top 5 is new — physio + chiro + osteo intent now blended.
- **`chiropractor vs osteopath christchurch` — christchurch-osteopathy-acupuncture.co.nz NEW #2** with its dedicated /osteopathy/osteopathyVsChiropractic page. The dedicated-comparison-URL pattern keeps validating week after week (Better Health #1 with /resources/osteopath-vs-chiropractor/, Halswell with /blog/what-is-the-difference/).

### First-check findings (5 derived queries added last run)

1. **`acupuncture for endometriosis christchurch`** — Burwood Acupuncture leads with a dedicated `/blog/endometriosis-christchurch-fertility-support` blog post; House of Acupuncture holds TWO endometriosis URLs in top 10 (a women's-health page + a dedicated `/acupuncture-endometriosis-period-pelvic-pain` sub-page). aldebaranhealing.co.nz is a new West Melton competitor we hadn't seen before. 7 days post-PR-#98 (Min Jin's new endometriosis special interest), too early to expect movement. Pattern: dedicated blog posts or dedicated condition sub-pages win — #14 territory.
2. **`acupuncture for pcos christchurch` — HOLLOW SPECIALTY SERP.** House of Acupuncture holds four URLs in top 10 (about-us + women's-health + TCM + root), **but none of them are a dedicated PCOS sub-page** — they only mention PCOS within broader women's-health pages. No Christchurch clinic has a dedicated PCOS sub-page yet. STRONG content-gap opportunity for a Min Jin PCOS sub-page given PR #98 listed PCOS as her new special interest.
3. **`acupuncture for cancer christchurch` — HOLLOW SPECIALTY SERP.** Koru Healing's ACC-subsidised acupuncture page leads (mentions cancer treatment support in passing). No dedicated cancer-acupuncture sub-page exists from any Christchurch clinic. STRONG content-gap opportunity for a Min Jin post-cancer supportive-care sub-page (per PR #98: nausea & vomiting, fatigue, chronic pain, peripheral neuropathy).
4. **`headaches osteopath christchurch`** — same SERP shape as the combined `headaches migraines` query. Better Health holds 2 URLs; osteopath-christchurch.com holds 3 blog-post URLs. Confirms intent splits don't materially change the competitive set — both queries land in the same blog-velocity territory.
5. **`post concussion syndrome christchurch` — DIFFERENT competitive set entirely.** This query brings in PCS specialty clinics (Axis Sports Medicine concussion clinic, Hyperbaric Oxygen Therapy, headachetendon.nz CFR) not osteos at all. Triskelion, Better Health, osteopath-christchurch.com all absent. Confirms intent splits — when item #32's concussion page is built, it needs explicit post-concussion-syndrome symptom language (headaches, dizziness, fatigue, brain fog, sleep difficulties, cognitive symptoms) plus a clear ACC-funded eligibility section to compete on this variant rather than just the `concussion osteopath` variant.

### Pruned (priority < 20 for 3+ consecutive runs)

- `acupuncture vs dry needling` — pure informational; non-NZ authority sites (Cleveland Clinic / Banner Health / Benchmark PT) own the SERP; FAQPage entry on acupuncture-vs-dry-needling (PR #78) 26 days post-ship with no traction.
- `dry needling halswell` — hollow suburb+modality SERP; single NZ slot (Elite Physiotherapy) for 5+ runs; rest US physical-therapy directories.
- `osteopath cashmere` — Cashmere Osteo locks the suburb-name SERP; Better Health /locations/cashmere is the only other non-aggregator slot. Not winnable from copy alone.

The pool can re-derive any of these from future SERP gaps if they become relevant.

### Added (derived, 3 of 5 maxNewPerRun budget)

1. `low level laser therapy christchurch` — Jonathan Grice's distinctive specialty per team.json (Postgraduate work with THOR Photomedicine, 200+ treatment protocols authored). Tests whether a hyper-niche modality query has a hollow-SERP opportunity we could occupy with a dedicated page.
2. `massage therapist christchurch` — Min Jin's new dual role per PR #98 ('Acupuncturist & Massage Therapist' site-wide). Tests whether her massage offering is being indexed and surfaces against established Christchurch massage businesses.
3. `chronic pain osteopath christchurch` — natural intent variant; Jonathan treats this per team.json (`treats: ["Musculoskeletal Issues", "Chronic pain", "Lower back pain", "Sciatica"]`).

### Pool meta after this run

- Pool size: **45** (was 45 — pruned 3, added 3)
- Under maxPool (50) and maxNewPerRun (5)
- Standard −10 priority decay applied across all 30 queries below top 10 this run

## Industry signals (week of 2026-06-05 → 2026-06-12)

1. **GSC Generative AI report rollout is UK-first.** Google confirmed (developers.google.com/search/blog/2026/06/gen-ai-performance-reports) that initial access is limited to a subset of UK website owners before broader global rollout; no click, CTR or query data yet — impressions only. **Updates item #35:** the verification + opt-in-toggle action still applies and the 2026-06-17 toggle date still matters (once flipped, no future change resurrects historical AI-surface impressions), but realistic data availability for meridianosteopathy.co.nz likely slips several weeks past the UK launch. When the report does become available for NZ, screenshot the first two weeks to bank a pre-blog baseline before item #14 ships.
2. **llms.txt practical reality study (500M+ LLM bot traffic events).** GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, and Google-Extended overwhelmingly **SKIP** /llms.txt — they crawl HTML directly. Healthcare/legal/financial verticals show <10% adoption among top-100 domains overall; SE Ranking sample of 300k domains shows 10.13% total adoption. **Implication:** Meridian's existing `llms.txt` + `llms-full.txt` + `<link rel="alternate" type="text/markdown">` are still worth keeping (zero ongoing maintenance cost, signal of intent, future-proofs against any future Anthropic/OpenAI adoption announcement) but **should NOT be a focus area for more investment.** Combined with last week's Ahrefs schema-impact study, this closes out two of the three 'add more AEO-specific markup' levers; only content depth/freshness (item #14) remains.
3. **Ahrefs 55.8M AI Overviews analysis.** Citation overlap with organic top-10 dropped 76% (mid-2025) → 38% (early 2026); list-formatted pages cited 67% more than equivalent prose (validates item #34 shipped last week); direct-answer openings + E-E-A-T signals do the work, not domain authority. Reinforces #14, #31, #34 patterns.
4. **GBP photo signal emerging.** Multiple local-SEO sources this week (mapranks, healthcaresuccess, mooretechsolutions, ranksdigitalmedia) flag that contextually labelled GBP photos (treatment rooms, exterior, practitioner headshots labelled by name + role) influence AI Overview inclusion for local healthcare. **Drives NEW item #36** — GBP photo audit. Same owner-side pattern as #21 (GBP services audit, shipped 2026-04-26), no code changes.
5. **GBP review-recency window tightened.** Reviews within the last 30 days improve rankings by up to 15% vs profiles that have gone quiet; businesses responding to 80%+ of reviews see a 10–20% ranking boost; AI Overviews now trigger on 83% of all queries. Reinforces #13, #16.
6. **Wikipedia 47.9% of ChatGPT top-cited domains; Reddit 46.7% of Perplexity.** 2026 analysis of 680M citations across 5 platforms: Reddit #1 cited source across every major AI engine, 23.6M pages cited, 92.8% appearance rate in AI search opportunities. Reddit citation share has stabilised — reinforces #15.

## Gaps re-confirmed

- **G7 (no ACC landing page).** osteo.co.nz / Active Health still own `osteopath acc christchurch`; House of Acupuncture owns `acupuncture acc christchurch`; koruhealing.co.nz NEW in top 5 for the acupuncture variant with its own dedicated ACC sub-page. Item #25 covers.
- **G8 (no blog / editorial content).** The two 'more markup' counterweights are now closed out — last week's Ahrefs schema-impact study + this week's 500M-event llms.txt-skip study. Content depth + freshness is the only remaining lever. New 2026-06-12 hollow-SERP confirmations for `acupuncture for pcos christchurch` and `acupuncture for cancer christchurch` further extend the case — no clinic has staked these dedicated sub-pages yet. Item #14 covers.
- **G15 (no off-site citation strategy).** Reddit citation share on Perplexity confirmed stable at 46.5%–46.7% across multiple 2026-06-12 sources. Wikipedia counter-weight at 47.9% of ChatGPT confirms two-platform gatekeeper structure. Item #15 covers.

## Notes for next run

- If the GSC Generative AI report has rolled out to NZ properties, screenshot the first available impressions data and add a `gscBaseline.md` note under `reports/`.
- If Min Jin gets a `bookingPractitionerId`-aware sub-page for either PCOS or post-cancer supportive care (the two hollow SERPs identified this run), re-prime those two queries with the URL once published.
- Watch `osteopath vs physiotherapist christchurch` — if it's still absent at the 3-week mark we should treat the regression as structural and look for what changed (lost backlink? content swap? canonicalisation tweak?).
- If Performance Plus Physio's Addington page keeps holding #1, that's a small but concrete proof-point for shipping item #25 (/acc/) and item #32 (/conditions/concussion/) on the dedicated-URL hypothesis.
