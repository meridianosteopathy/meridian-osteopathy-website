# AI Search Audit — 2026-07-31

Weekly snapshot for meridianosteopathy.co.nz against AEO / GEO signals and a tracked search-visibility pool of 46 queries. Catch-up run — the routine did not fire on the five intervening Saturdays since 2026-06-05 (8-week gap).

## Shipped since last run (2026-06-05 → 2026-07-31)

No audit-list items closed. Operational work landed anyway:

- **Jonathan promoted to Senior Osteopath** with homepage team reordered (PR #103, 2026-06-23).
- **IPP3A indirect-collection privacy notices** added to referral form + privacy page (PR #104, 2026-06-24).
- **Min's profile content refreshed** at her request (PR #105, 2026-06-27).
- **Monthly Practitioner Spotlight — June: Maddison** — homepage surface + Decap CMS entry (PRs #108/#109, 2026-07-11).
- **ACC copy reworded site-wide** from "we file the claim for you" framing to "ACC-registered provider" framing across services.json, conditions.json, home.json and booking pages (PR #113, 2026-07-29) — sharpens item #25 without shipping the standalone /acc/ page.
- **Pricing framing + GP-mention copy-rule fixes** across services, conditions and team data (PR #114, 2026-07-29).
- **Cliniko booking funnel wired as GA4 conversion events** via new /js/cliniko-booking.js (PR #116, 2026-07-29) — first conversion-attribution surface we can later attribute to AI-search traffic once GSC AI-report data catches up.

## Backlog after this run

**12 items pending.** Tier 1 → #35. Tier 2 → #12, #13, #25, #32, #37, #38. Tier 3 → #14, #15, #16, #36, #39.

| # | Tier | Impact | Effort | Title |
|----|------|--------|--------|-------|
| 12 | 2 | L | S | Add speakable blocks on service intros |
| 13 | 2 | M | M | Auto-fetch Google Business Profile reviews at build time |
| 14 | 3 | H | L | Start a blog (2 posts/month) |
| 15 | 3 | M | M | Seed Reddit / community brand mentions |
| 16 | 3 | M | M | Encourage monthly Google reviews nudge |
| 25 | 2 | M | S | Build an /acc/ landing page — activehealth.co.nz + Burwood Acupuncture own ACC queries |
| 32 | 2 | M | S | Add /conditions/concussion/ page — Triskelion Concussion Care owns concussion queries |
| **35** | **1** | **M** | **S** | **Enable Google Search Console Generative AI performance report + bank baseline** |
| **36** | 3 | H | L | **NEW: Establish YouTube channel with 6–10 short clinical-explainer videos** |
| **37** | 2 | M | M | **NEW: Add Min-Jin-focused acupuncture landing pages — cancer support (VACANT NICHE), endometriosis, PCOS** |
| **38** | 2 | M | S | **NEW: NAP consistency audit across NZ directories** |
| **39** | 3 | M | M | **NEW: GBP posts + photos + Q&A monthly cadence** |

## Search visibility

30 of 46 pool queries re-checked against live SERPs (top-30 by priority). Autocomplete fetch (`suggestqueries.google.com`) still blocked by routine host egress allowlist — confirmed again this run (`CONNECT tunnel failed, response 403`). Pool self-expansion via derived queries remains the workaround.

### Wins vs last run

- **NOTABLE WIN — `tennis elbow osteopath christchurch`: 0 → 9.** First Meridian appearance in ANY tracked query since the audit started. Likely surfacing `/conditions/sports-injury-recovery/` (which covers tennis and golfer's elbow explicitly per conditions.json:535). The 4–10 hold band keeps priority unchanged at 15; will monitor whether the position holds next run before drawing conclusions. Non-aggregator top 5 for context: Better Health (#1), balancedmotionclinic.co.uk (#2), Performance Plus Physio Chch (#3), theosteopaths.org.uk (#4), chchosteopaths.co.nz (#5), Meridian (#9).
- **NOTABLE VACANT NICHE — `acupuncture for cancer christchurch`.** First-check top 5 are all generic acupuncture-clinic homepages (chchacupuncture, House of Acupuncture, acuclinic, healthbymana, acumore) — NO NZ clinic has a dedicated cancer-support acupuncture landing page. This is the clearest "small page, vacant slot" opportunity we've surfaced since item #17. Min Jin's PR #98 already added post-cancer supportive care (nausea, fatigue, chronic pain, peripheral neuropathy) as her stated special interest — the missing piece is a dedicated URL. Drives new item #37.

### Losses / stalls vs last run

- **`osteopath vs physiotherapist christchurch`** — still not in top 10. Halswell Clinic's dedicated comparison URL that historically won has now dropped out entirely; Better Health sweeps top 3 with two dedicated pages; Canadian `physiotherapyfirst.ca` sits at #2 which suggests weak NZ non-agg supply for this specific comparison phrase. Priority now 15 (from 25 → -10).
- **`lower back pain christchurch`** — `headachetendon.nz` chiropractor post jumped to #1 displacing Better Health; `sportsclinic.co.nz` new to top 5. Meridian's /conditions/back-pain/ + /conditions/sciatica/ still not visible.
- **`sports injury osteopath christchurch`** — Performance Plus Physio Chch new #1; UK domain `newforestosteopathy.co.uk` leaking into results. Our /conditions/sports-injury-recovery/ (which just cracked the tennis-elbow query, see win above) still not visible at the parent-topic level.
- **Burwood Acupuncture surged across the acupuncture cluster** — now #1 for `acupuncture christchurch`, `acupuncture acc christchurch`, `acupuncture for fertility christchurch`, `acupuncture for endometriosis christchurch`, `acupuncture for pcos christchurch`, and `chinese herbal medicine christchurch`. Same competitive pattern as Better Health owns on the osteopathy side: dedicated per-condition URLs winning across the board.
- Two more UK domains (`newforestosteopathy.co.uk`, `balancedmotionclinic.co.uk`, `katefreemantle.co.uk`) leaked into NZ SERPs this run across multiple queries — noise, but suggests Google's local-intent filter is weaker than it was.

### First checks completed cleanly

- `headaches osteopath christchurch` (split-intent from headaches-migraines combo): Better Health dominates with two of top four; different competitor mix than the combo query, supporting the earlier decision to track them separately.
- `post concussion syndrome christchurch`: concussion-specialist clinics dominate (Triskelion #1, Cranial Solutions, Headache & Tendon, Axis Sports Medicine, ACC.co.nz) — no general-osteopathy site surfaces. Reinforces item #32.
- Three of Min Jin's PR #98 women's-health / oncology queries first-checked — details in the batch results above.

### Pruned (priority < 20 for 3+ consecutive runs)

- `osteopath wigram` — hollow NZ SERP, item #29 shipped 12 weeks ago with zero movement.
- `osteopath addington` — mostly hollow, Performance Plus Physio just entered as first NZ non-agg but no clear action lever.
- `arthritis osteopath christchurch` — stable competitor set for 4 runs, no shipping candidate. `osteopath-christchurch.com` slipped out of top 5 for the first time.

The pool can re-derive any of these from future SERP gaps if they become relevant.

### Added (derived, 4 of 5 maxNewPerRun budget)

- `post cancer acupuncture christchurch` — vernacular variant of the vacant-niche find; tests item #37 cancer-support page once shipped.
- `dysmenorrhoea acupuncture christchurch` — completes Min's women's-health triple alongside endometriosis and PCOS.
- `period pain acupuncture christchurch` — vernacular variant of dysmenorrhoea, captures the more common search phrasing.
- `massage therapist halswell` — tests Min's new dual role (introduced PR #98) as a suburb+modality query.

**Pool size 46/50.** Under the cap.

## Industry signals (week of 2026-07-24 → 2026-07-31)

1. **AI Mode launched in France 2026-07-22 with the full stack** — Search Live voice/camera, query fan-out, Gemini 3.5, desktop + mobile web + app on day one. Signal: expect NZ rollout to arrive similarly complete inside 4–8 weeks. Source: keywordseverywhere.com/news/google-ai-mode/.
2. **Profound / Search Engine Land 2026-07-15 — google.com is now AI Mode's #2 most-cited domain**, up 8.4x between Apr 15 and Jun 30. Surge driven mainly by Google Business Profile cards and Product Knowledge Panels; concentrated in five industries **including healthcare**. Implication: GBP is now the highest-leverage AEO surface for a local clinic, arguably ahead of any on-site change. Drives new item #39.
3. **Ahrefs July-2026 Top-50 AI-Overview cited domains — YouTube 21.1% overtook Reddit 18.5% for the first time.** Combined with Ahrefs' 75k-brand study finding YouTube-mentions correlation 0.737 with AI visibility (vs 0.218 for backlinks), YouTube is now a top-3 AI-visibility signal. Meridian has no video footprint. Drives new item #36.
4. **GSC Generative-AI performance report expanded to more properties 2026-07-09** — still impressions-only, no clicks / CTR / queries yet, only May-18-onward data. Reinforces item #35.
5. **llms.txt adoption up 8.8x YoY but 97% of files receive zero AI-crawler requests; healthcare is a laggard sector.** Confirms our llms.txt is essentially inert — treat as "shipped and forgotten", no further investment warranted.
6. **Growth Marshal + HCIC 2025 update**: attribute-rich schema (Review with author, LocalBusiness with geo+hours, MedicalBusiness variants) drives +78–94% AI-Mode citation rates for healthcare specifically. Nuances the Ahrefs 2026-05 finding that generic schema had "no major uplift" — attribute quality matters more than raw schema presence. We're already attribute-rich; no change to our stance.
7. **ChatGPT-ranking research July**: NAP inconsistency across NZ directories (Yellow, Healthpoint, Finda, ACC provider list, GBP) leads to no AI citation at all. Drives new item #38.

## Recommendation for the coming week

- **Ship item #37 first** — the cancer-support acupuncture page is the vacant-niche opportunity, low effort (mirror the /services/acupuncture/fertility/ pattern), high strategic value now that Min's stated interest matches an empty SERP.
- **Verify item #35 in the same session** — GSC AI-report enrolment should be confirmed and a baseline screenshot banked; if not enrolled by now something is wrong.
- Everything else remains as tracked.
