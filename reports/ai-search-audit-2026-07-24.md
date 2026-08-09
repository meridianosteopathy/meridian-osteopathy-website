# AI Search Audit — 2026-07-24

Weekly snapshot for meridianosteopathy.co.nz against AEO / GEO signals and a tracked search-visibility pool of 49 queries.

## Shipped this week

Nothing from the audit backlog. Commits since 2026-06-05 (PRs #100, #103, #104, #105, #108, #109) were all personnel/profile updates — Jonathan promoted to Senior Osteopath, Min's profile updated, IPP3A indirect-collection privacy notices, monthly Practitioner Spotlight for June (Maddison), Maddison's qualifications reformatted. None of these ship a pending audit item.

Note: PR #108 (monthly Practitioner Spotlight) is a form of content-freshness output that adjacently helps **G8** without being a blog. Establishing a repeatable monthly editorial cadence — even for personnel content — reduces the delta to a real blog collection (**item #14**).

## Backlog after this run

9 items pending (1 new this run). Tier 1 → **#35 (overdue)**. Tier 2 → #12, #13, #25, #32, **#36 (new)**. Tier 3 → #14, #15, #16.

| #  | Tier | Impact | Effort | Title |
|----|------|--------|--------|-------|
| 12 | 2 | L | S | Add speakable blocks on service intros |
| 13 | 2 | M | M | Auto-fetch Google Business Profile reviews at build time |
| 14 | 3 | H | L | Start a blog (1–2 comprehensive posts/month) |
| 15 | 3 | M | M | Seed Reddit / community brand mentions |
| 16 | 3 | M | M | Encourage monthly Google reviews nudge |
| 25 | 2 | M | S | Build an /acc/ landing page — Active Health / osteo.co.nz own 'osteopath acc christchurch' |
| 32 | 2 | M | S | Add /conditions/concussion/ page — Triskelion + osteo.co.nz own the concussion queries |
| **35** | **1** | **M** | **S** | **Verify Google Search Console AI performance report — opt-out toggle deadline has passed (2026-06-17)** |
| **36** | **2** | **M** | **S** | **Add /faq/osteopath-vs-physio-vs-chiro/ comparison page — comparison-URL SERP pattern is now locked-in** |

## Search visibility

30 of 49 pool queries re-checked against live SERPs (top-30 by priority). Autocomplete fetch still blocked by routine host egress allowlist (confirmed via `curl` → `CONNECT tunnel failed, response 403`) — pool self-expansion via derived queries continues as the workaround.

**Meridian remains absent from top 10 for every checked query.** No rank recoveries and no first-time surfacings.

### Notable competitor movements vs last run

- **`osteopath addington` — NEW NZ COMPETITOR.** Performance Plus Physio has published `/osteopath-addington-christchurch/` which now ranks **#1 non-aggregator**. Previously a hollow UK-dominated SERP where no NZ clinic held the suburb slot. Meridian's flowing-intro-copy Addington mention (item #29, shipped 2026-05-10) has been outflanked by a dedicated URL 10+ weeks after ship. Priority held at 10 (not decayed to 0) to monitor. Same site also now surfaces for `tennis elbow osteopath christchurch`.
- **`chiropractor vs osteopath christchurch`.** Better Health now owns **BOTH** `/resources/osteopath-vs-chiropractor/` (#1) AND `/resources/osteopath-vs-chiropractor-vs-physio/` (#2). Halswell also has a dedicated `/blog/what-is-the-difference-between-an-osteopath-a-chiropractor-and-a-physiotherapist/` post in the top 5.
- **`osteopath vs physiotherapist christchurch` — no recovery from last-run regression.** Better Health has now published a SECOND dedicated URL `/resources/osteopath-vs-physiotherapy/` (in addition to `/resources/osteopath-vs-chiropractor-vs-physio/`). The comparison-URL pattern is now clearly locked-in. Drives new **item #36**.
- **`concussion osteopath christchurch`.** `osteo.co.nz/concussion/` now ranks **#1** (previously mid-pack). Triskelion Concussion Care + Triskelion Osteopathy still dominant with 3 URLs between them. Item #32 more urgent.
- **`lower back pain christchurch`.** `headachetendon.nz` (Musculoskeletal Solutions) now #1 with `/back-pain-doctor-christchurch/` post. Physio-heavy set (Four Physio, Physiosouth, Muscle People) squeezing osteos.

### Wins vs last run

- **`paediatric osteopath christchurch` — AI summary still names Nina Hu directly** with her `@meridianosteopathy.co.nz` email and `02108655151` phone. Not re-checked live this run (below top-30 after decay to priority 0), but no signal of regression. The entity-disambiguation work from #27 / #28 / #31 continues to pay off at the AI layer.
- **Five first-time checks completed cleanly** for queries added 2026-06-05:
  - `acupuncture for endometriosis christchurch` — Burwood Acupuncture + House of Acupuncture own dedicated URLs.
  - `acupuncture for pcos christchurch` — House of Acupuncture explicitly names PCOS training.
  - `acupuncture for cancer christchurch` — **hollow SERP with no incumbent dedicated URL**. Clearest single-query content opportunity identified this run given Min Jin's new post-cancer supportive-care specialty (PR #98). Consider fast-follow to item #14: a `/services/acupuncture/supportive-cancer-care/` sub-page mirroring the fertility sub-page pattern.
  - `headaches osteopath christchurch` — Better Health + osteopath-christchurch.com own the pattern (same as combined headaches-migraines query).
  - `post concussion syndrome christchurch` — Triskelion Concussion Care #1, Axis Sports Medicine's ACC-funded concussion clinic in top 4.

### Losses vs last run

None new. The `osteopath vs physio` regression from last run has not recovered — see the competitor-movements section above.

### Pruned (below priority threshold + redundant)

- `headaches migraines osteopath christchurch` — priority 0 for 2 consecutive runs AND now redundant with the more natural `headaches osteopath christchurch` added last run.

### Added (derived, 5 of 5 maxNewPerRun budget)

- **`osteopath hoon hay`** — Meridian's own suburb (Halswell Road Clinic is also at Hoon Hay 8025, so directly competitive).
- **`cupping christchurch`** — Min Jin offers cupping alongside acupuncture but the site has no dedicated content.
- **`acupuncture for menstrual pain christchurch`** — natural variant of Min's dysmenorrhoea specialty from PR #98.
- **`chinese medicine christchurch`** — broader intent than the existing `chinese herbal medicine christchurch` query.
- **`osteopath riccarton`** — dense competitor cluster (Triskelion Osteopathy on Riccarton Rd, Shelley Joe at 4 Kahu Rd Riccarton, Nikau Room at 164 Clarence St Riccarton — same address as Nina Hu's Happy Spine).

## Industry signals — week of 2026-07-17 → 2026-07-24

1. **Ahrefs July 2026 ChatGPT citation data** — Reddit at **16.7%** of ChatGPT citations (up from 11.97% in 5WPR Jan-Feb 2026 study). Reddit is the single most-cited source across ChatGPT / Claude / Gemini / Perplexity / AIO with **~40% multi-engine aggregate frequency**. Wikipedia (13.15%) + Reddit (16.7%) together account for **>29% of ChatGPT US citations**. Reinforces **#15**.

2. **Ahrefs May-2026 500M-event LLM-crawler study** — GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended **overwhelmingly skip /llms.txt** and crawl HTML directly. Google's John Mueller publicly compared llms.txt to the discredited keywords meta tag. Google has stated it doesn't support llms.txt and isn't planning to. Our existing llms.txt work is not wasted (it's a B2A signalling play) but this data further redirects future audit investment AWAY from schema / machine-readable side files and TOWARD on-page content depth/freshness. Reinforces **#14**. **Do not add new llms.txt maintenance items on the strength of this signal alone.**

3. **Conductor 2026 Healthcare AEO/GEO benchmarks** — AI Overviews now appear in **51% of US healthcare searches** (>2× the all-industries average). Healthcare brands cited in AIOs earn **35% more organic clicks** and **91% more paid clicks** vs same-page uncited peers. 60%+ of healthcare queries now end without an external click. Ahrefs study of 1.9M AIO citations: **86% came from top-100 organic domains** for the query — the "get to top-100 organic first, then win AI citation" path is empirical, not theoretical.

4. **Perplexity signal weighting** (Powered by Search / Demand Local, July 2026) — Perplexity averages 8.79 citations/response and cites at 15.43% rate (vs ChatGPT 2.78%). Its five weighted signals are: **freshness, structured Q&A formatting, authority within its curated pool, direct query-to-heading matches, citation density**. Our citation-ready 40-60 word intros (item #31 shipped 2026-05-17) address "direct query-to-heading match" and "structured Q&A"; freshness gap (**G8**) still unaddressed.

5. **Google Search Console AI performance report** — UK-subset only for now, opt-out toggle went live **2026-06-17 (past)**. Google confirmed the toggle does NOT affect organic blue-link rankings, so leaving it ON is unambiguously the right call. **Item #35 deadline has passed — status verification urgently needed.** NZ properties may still be pre-rollout; the check is "is meridianosteopathy.co.nz verified as a property, and is the toggle left at default ON".

6. **Content depth over quantity** (Winston Digital / Practicebeat, 2026): _"Healthcare SEO is no longer about publishing as many pages as possible. Content depth and quality are critical; editorial strategies focused on comprehensive, well-researched content outperform high-velocity content creation."_ **Refines #14** — the ask is 1–2 comprehensive posts per month (900-1500 words each with expert citations), not 2 shallow posts/month.

## Priority summary

- Tier 1 → **#35** (overdue GSC verification)
- Tier 2 → #12, #13, #25, #32, **#36 (new)**
- Tier 3 → #14, #15, #16

Pool size 49 / 50. Meta lastRun advanced to 2026-07-24.
