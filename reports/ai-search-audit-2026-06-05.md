# AI Search Audit — 2026-06-05

Weekly snapshot for meridianosteopathy.co.nz against AEO / GEO signals and a tracked search-visibility pool of 45 queries.

## Shipped this week

- **#33 — Claude-SearchBot + Claude-Web allow lines in `src/robots.txt`** (PR #96, 2026-06-03). Two-line addition alongside the existing `ClaudeBot` / `anthropic-ai` entries. No-op functionally today (everything falls under `User-agent: * Allow: /`), but pins Anthropic's live-retrieval agents open against any future `Disallow` line we add.
- **#34 — Structured 5–7 item list blocks on every condition page** (PR #97, 2026-06-03). Three `<ul>` blocks under their own H2 per condition (back-pain, neck-pain, sciatica, headaches-migraines, pregnancy-back-pain, sports-injury-recovery): _Common signs_, _When to see an osteopath_, _What to expect at your first appointment_. Data lives in a new `lists` array on each condition in `conditions.json`. Search Engine Land's May-2026 analysis of 25k AI-cited URLs found list-formatted pages cited at materially higher rates than equivalent prose — this is the natural follow-up to #31's citation-ready intros.
- **PR #98 — Min Jin profile + Acupuncture service page refresh** (2026-06-05). Min now titled _Acupuncturist & Massage Therapist_ site-wide; qualifications restructured to a bulleted list; About Me trimmed; special interests refocused on **women's health (PCOS, endometriosis, dysmenorrhoea)** and **post-cancer supportive care (nausea & vomiting, fatigue, chronic pain, peripheral neuropathy)**; What I Treat refreshed; Acupuncture page reflects Min's new focus + massage-therapist role; broken practitioner links fixed in `llms.txt` / `llms-full.txt` with flattened qualifications and an enriched meta/OG description.

## Backlog after this run

8 items pending. Tier 1 → #35. Tier 2 → #12, #13, #25, #32. Tier 3 → #14, #15, #16.

| #  | Tier | Impact | Effort | Title |
|----|------|--------|--------|-------|
| 12 | 2 | L | S | Add speakable blocks on service intros |
| 13 | 2 | M | M | Auto-fetch Google Business Profile reviews at build time |
| 14 | 3 | H | L | Start a blog (2 posts/month) |
| 15 | 3 | M | M | Seed Reddit / community brand mentions |
| 16 | 3 | M | M | Encourage monthly Google reviews nudge |
| 25 | 2 | M | S | Build an /acc/ landing page — osteo.co.nz / activehealth.co.nz own ACC queries |
| 32 | 2 | M | S | Add /conditions/concussion/ page — Triskelion Concussion Care owns 'concussion osteopath christchurch' |
| **35** | **1** | **M** | **S** | **Enable Google Search Console Generative AI performance report before opt-out toggle goes live (2026-06-17)** |

## Search visibility

30 of 45 pool queries re-checked against live SERPs (top-30 by priority). Autocomplete fetch still blocked by routine host egress allowlist — pool self-expansion via derived queries continues as the workaround.

### Wins vs last run

- **Paediatric osteopath christchurch — AI summary now names Nina Hu directly.** Meridian still doesn't rank on the page itself (happyspine.co.nz/nina-hu surfaces at SERP position 7 instead), but the AI-summary layer pulls Nina's `@meridianosteopathy.co.nz` email and `02108655151` phone into the response text. The entity-disambiguation work from #27 / #28 / #31 is starting to pay off at the AI layer even where it hasn't paid off at the SERP layer.
- **Three first-time checks completed cleanly** for the queries added last run: `rotator cuff osteopath christchurch`, `postnatal osteopath christchurch`, `chiropractor vs osteopath christchurch`. None of the three rank for us, but all three reproduce the dedicated-URL pattern we already know (Better Health owns `/resources/osteopath-vs-chiropractor/`, `/care/postnatal/`, and three rotator-cuff URLs in the top 3) — gives a clean baseline to track against.

### Losses vs last run

- **Osteopath vs physiotherapist christchurch — REGRESSION.** Last run Meridian was at non-aggregator #3 (the biggest tracked win in audit history). This run we're not visible in the top 10. Non-aggregator order: Halswell Clinic blog post (#1), Better Health (#2), Moorhouse (#3), AlignHC (#4), 13thBeach (#5), Mind Body Clinic, Excellence Physio, Active Health.
- Caveat: Ahrefs published this week that consecutive AI Overview responses share only 54.5% URL overlap on average — i.e. one in two URLs changes per re-run while the semantic answer stays ~95% similar. The same volatility likely affects this tool's underlying SERP samples. Treat this as one data point, not a structural verdict. Priority dropped 35 → 25 per the -10 rule; will reassess next run before recommending any code change.

### Pruned (priority < 20 for 3+ consecutive runs)

- `osteopath hillmorton` (all-UK SERP, 19+ days post item #29 suburb mention with no movement)
- `tmj osteopath christchurch` (MK Osteopathy owns it via blog velocity — #14 territory)
- `acupuncture for ivf christchurch` (House of Acupuncture / Burwood Acupuncture own)
- `cranial osteopath christchurch` (Halswell Clinic / osteopath-christchurch.com own)

The pool can re-derive any of these from future SERP gaps if they become relevant.

### Added (derived, 5 of 5 maxNewPerRun budget)

All five test fresh signal post-PR-#98:

1. `acupuncture for endometriosis christchurch` — Min Jin's new special interest area
2. `acupuncture for pcos christchurch` — Min Jin's new special interest area
3. `acupuncture for cancer christchurch` — Min Jin's post-cancer supportive care specialty
4. `headaches osteopath christchurch` — splits intent from the headaches-migraines combo since the SERPs may differ
5. `post concussion syndrome christchurch` — natural variant of post-concussion; tests whether the broader symptom-cluster query behaves differently

### Pool meta after this run

- Pool size: **45** (was 44 — pruned 4, added 5)
- Under maxPool (50) and maxNewPerRun (5)
- Standard -10 priority decay applied across all 30 queries below top 10 this run

## Industry signals (week of 2026-05-29 → 2026-06-05)

1. **Google Search Console launched a Generative AI performance report on 2026-06-03.** Tracks impressions for AI Overviews and AI Mode by pages, countries, devices and dates at hourly through monthly granularity. Opt-out toggle effective 2026-06-17 — sites are opted IN by default until then. **First first-party way to measure AI-surface visibility for the clinic.** Drives new punch-list item #35.
2. **Ahrefs schema-impact study (1,885 pages adding JSON-LD between Aug 2025 – Mar 2026 vs 4,000 controls).** Adding schema produced **no major uplift** in citations on Google AI Overviews, AI Mode, or ChatGPT. This is a counterweight to schema-heavy AEO/GEO advice. **Implication for the audit roadmap:** entity authority + content depth + freshness do the work, not schema markup. We already have the MedicalClinic / MedicalCondition / Physician / Service / FAQPage / ReserveAction graph — don't keep adding schema for its own sake. Reinforces #14 (blog) and downgrades the urgency of #12 (speakable blocks) — kept on the list because it's still cheap, but not high impact.
3. **Gemini 3 update consolidates (SE Ranking 100k-keyword study).** 42% of previously cited AIO domains replaced; each AIO now pulls 32% more sources per response (88% of AIOs cite three or more sources, only 1% cite a single source); citation overlap with the organic top-10 collapsed from 76% (Jul-2025) to 17–38%. **Implication:** a citable rank-anywhere page is still the right strategy — being cited in AIO drives 35% more organic clicks and 91% more paid clicks than non-cited brands on the same queries.
4. **Reddit citation share stabilising.** Perplexity 46.5% of citations from Reddit (week of 2026-05-29 data); ChatGPT ~5%; Gemini 0.1%. Conductor research note: when LLMs cite Reddit, sole-source citations rose 31%. Reinforces #15.
5. **GBP review recency.** Reviews older than 18 months carry diminishing weight for AI citation confidence; content / signals updated within the past two months earn **28% more AI citations** than older material. Reinforces #13 and #16.

## Gaps re-confirmed

- **G7 (no ACC landing page).** osteo.co.nz / Active Health still own `osteopath acc christchurch`; House of Acupuncture owns `acupuncture acc christchurch`. Item #25 covers.
- **G8 (no blog / editorial content).** The Ahrefs schema-study + the 28%-citation-uplift-for-fresh-content datapoint together make this the strongest week yet for the blog case. Item #14 covers.
- **G15 (no off-site citation strategy).** Reddit citation share on Perplexity confirmed stable at 46.5%. Item #15 covers.

## Notes for next run

- Re-check `osteopath vs physiotherapist christchurch` early — confirm whether the #3 → not-in-top-10 drop was volatility or a real regression before reacting.
- Re-check the three Min-Jin-specialty queries added this run (endometriosis, PCOS, cancer) at ~3 weeks post-ship to gauge whether the new copy is being picked up.
- If item #35 (GSC Gen AI report) ships, future audits should include AI Overview / AI Mode impression deltas from the GSC report as a parallel signal next to the SERP tracking pool.
