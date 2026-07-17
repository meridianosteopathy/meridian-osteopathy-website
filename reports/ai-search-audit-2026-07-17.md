# AI Search Audit — 2026-07-17

Weekly snapshot for meridianosteopathy.co.nz against AEO / GEO signals and a tracked search-visibility pool of 46 queries. First run in ~6 weeks (previous audit 2026-06-05).

## Shipped since last audit (2026-06-05 → 2026-07-17)

- **PR #100** — Link Jonathan Coleman's personal osteopathy website from his profile card.
- **PR #103** — Promote Jonathan Coleman to _Senior Osteopath_ across profile, JSON-LD role field, and homepage team-card ordering.
- **PR #104** — Add IPP3A indirect-collection privacy notices; the Privacy page now explicitly discloses when personal information is collected from a source other than the individual (referrals, family members, other health providers, ACC).
- **PR #105** — Update Min Jin's profile content at her own request.
- **PR #108** — Monthly Practitioner Spotlight (June) — Maddison — added to the homepage; **first fresh-content editorial slot on the site since the audit began**, moving in the direction of item #14 (blog) but not a substitute for a sustained editorial cadence.
- **PR #109** — Reformat Maddison's qualifications as a bullet list to match the site-wide pattern established in PR #98 for Min Jin.

**None of these directly closed backlog items #12–#35.** PR #108 is a first fresh-content signal in the direction of item #14 but is a one-off, not a Decap collection with 2-post-per-month cadence.

## Backlog after this run

10 items pending. Tier 1 → #35, **#37 (NEW)**. Tier 2 → #12, #13, #25, #32, **#36 (NEW)**. Tier 3 → #14, #15, #16.

| #  | Tier | Impact | Effort | Title |
|----|------|--------|--------|-------|
| 12 | 2 | L | S | Add speakable blocks on service intros |
| 13 | 2 | M | M | Auto-fetch Google Business Profile reviews at build time |
| 14 | 3 | H | L | Start a blog (2 posts/month) |
| 15 | 3 | M | M | Seed Reddit / community brand mentions |
| 16 | 3 | M | M | Encourage monthly Google reviews nudge |
| 25 | 2 | M | S | Build an /acc/ landing page — osteo.co.nz / activehealth.co.nz own ACC queries |
| 32 | 2 | M | S | Add /conditions/concussion/ page — Triskelion Concussion Care owns 'concussion osteopath christchurch' |
| 35 | 1 | M | S | Enable Google Search Console Generative AI performance report + baseline first two weeks |
| **36** | **2** | **H** | **M** | **Publish an annual anonymised NZ clinic caseload snapshot** |
| **37** | **1** | **M** | **S** | **Add visible 'Reviewed [date] by [practitioner]' byline to service + condition pages** |

## Search visibility

45 of 46 pool queries re-checked against live SERPs. Autocomplete fetch still blocked by routine host egress allowlist (`CONNECT tunnel failed, response 403` on `suggestqueries.google.com`) — pool self-expansion via derived queries continues as the workaround.

### Wins vs last run (three first-time SERP appearances for Meridian)

- **`osteopath vs physiotherapist christchurch` — Meridian homepage now #7** (was 0 last run; had also regressed from #3 in April). Full recovery from the June regression + first stable appearance since April. Better Health still holds #1, #2 and #4 with dedicated `/osteopath-vs-physiotherapist/` URLs.
- **`sports injury osteopath christchurch` — FIRST APPEARANCE EVER at #8.** `/conditions/sports-injury-recovery/` (PR #66, 12+ weeks post-ship) has broken into top 10.
- **`tennis elbow osteopath christchurch` — FIRST APPEARANCE EVER at #6.** Same `/conditions/sports-injury-recovery/` page ranks, AND the AI summary **names Meridian by name as an option** — entity-linkage is working at the AI layer even without a dedicated tennis-elbow URL.

**Combined signal:** the internal-link surface from item #30 (homepage 'Common conditions we treat' + osteopathy service page block, PR #69/#71) is finally translating into visibility, and the item-#31 citation-ready intros + item-#34 list blocks appear to be doing measurable work.

### Losses vs last run

None material. `paediatric osteopath christchurch` no longer surfaces happyspine.co.nz in top 10 (was position 7 last run), so the AI-summary attribution of Nina Hu's Meridian contact details we saw last run may have shifted — worth re-checking next run.

### New SERP-competitor cluster

`post concussion syndrome christchurch` (second check) SERP is dominated by ACC-contracted concussion services — **cranialsolutions.nz, concussioncare.co.nz, lfbit.co.nz, habit.health** — rather than osteopaths. This is post-concussion-rehab intent, distinct from item #32's osteopathy angle. Adds ACC-adjacent framing to the #32 case.

### Pruned (priority 0 for consecutive runs)

- `headaches migraines osteopath christchurch` — superseded by `headaches osteopath christchurch` added last run (`cashmereosteo.co.nz` now #1 on the headache-only variant vs `osteopath-christchurch.com` on the combo, so the SERPs are distinct enough that the newer entry is the more useful tracker).

### Added (derived, 2 of 5 maxNewPerRun budget)

1. `post concussion rehab christchurch` — natural split of concussion-intent following the new ACC-contracted-concussion-service competitor cluster surfacing.
2. `acupuncture near me christchurch` — near-me modifier still material per week-of-2026-07 local-SEO data.

### Pool meta after this run

- Pool size: **46** (was 45 — pruned 1, added 2)
- Under maxPool (50) and maxNewPerRun (5)
- Standard -10 priority decay applied across all 42 queries below top 10 this run

## Industry signals (week of 2026-07-10 → 2026-07-17)

1. **Google's AI Mode (Gemini 3.5 Flash) is now the default output for every query** (TechTimes / RankSense 2026-07-10). The ten blue links now sit below the fold by default; zero-click rate on AI Mode queries estimated at ~93%. **Recalibrates the whole punch list — Tier 1 is now about being citable, not about being #1.** Patient discovery queries like `osteopath christchurch` resolve inside an AI panel.
2. **GSC Generative AI performance report rollout expanded 2026-07-09** to more properties (Search Engine Roundtable). Still doesn't include clicks. Reinforces item #35 urgency.
3. **Ahrefs Q2 2026 update to AIO citation study (2026-07-15).** Top-10 organic share of AI Overview citations fell from 76% to 38% over 8 months. **Listicles + articles + product pages account for 52% of all AI mentions** (75k answers / 1M citations sample). Reinforces item #34's list-block direction — the choice to add structured list blocks in PR #97 is validated by this quarter's data.
4. **Discovered Labs / MarketingCode 2026-07-12 study.** Median time from publish to first ChatGPT/Claude citation is **6.81 days**; 75% of cited pages are indexed-then-cited within 18.7 days. Perplexity shows even stronger recency bias. Strongest freshness case yet for item #14 (blog) and directly motivates new item #37 (8-week reviewed-by cadence).
5. **2026 local-SEO commentary this week (Canvas Score / GMB Mantra).** Review recency is now a 'proof of life' tie-breaker — a clinic with 80 reviews steady over 30 days outranks one with 200 where the last is 8 months old. GBP photos untouched 30+ days flagged as stale. Reinforces items #13, #16.
6. **Semrush 126M-prompt AI Visibility Index (2026-07-13).** Top-3 brands hold 41–83% AI-mention share by vertical; health/local is _less_ concentrated than News/CE — small clinics can still crack the top set on the three canonical Christchurch phrases (`osteopath christchurch`, `acupuncture christchurch`, `acc osteopath christchurch`).
7. **Search Engine Land 2026-07-11 — proprietary data as AI-citation asset.** Multiple 2026-07 analyses argue original / proprietary data (case counts, patient-mix statistics, first-person NZ figures) is now the highest-ROI AI-citation asset. Meridian has a natural moat here — no other Christchurch clinic publishes anonymised caseload figures. **Drives new tier-2 item #36.**
8. **Google 2026-07-14 E-E-A-T eligibility clarification.** Pages need visible expert-author attribution to be eligible for AI Search surfaces. Combined with the 6.81-day time-to-citation finding, drives new tier-1 item #37 (visible `Reviewed [Month YYYY] by [Practitioner]` byline on service + condition pages, extending the existing 'Last updated' block).

## Gaps re-confirmed

- **G7 (no ACC landing page).** osteo.co.nz reclaimed `osteopath acc christchurch` #1 from Active Health; House of Acupuncture still owns `acupuncture acc christchurch`. Post-concussion-syndrome SERP now surfaces ACC-contracted concussion services — the ACC angle keeps compounding. Item #25 covers.
- **G8 (no blog / editorial content).** The 6.81-day time-to-citation datapoint + AI Mode default rollout together make this the strongest week yet for the blog case. Items #14 and #37 cover.
- **G15 (no off-site citation strategy).** Reddit citation share on Perplexity confirmed stable at 46.5%. Item #15 covers.
- **G25 (NEW) — no proprietary NZ clinic caseload / statistics content.** Multiple 2026-07 analyses converge on original data as the highest-ROI AI-citation asset. Item #36 covers.

## Notes for next run

- Re-check the three new-win queries (`osteopath vs physiotherapist christchurch`, `sports injury osteopath christchurch`, `tennis elbow osteopath christchurch`) — confirm whether the appearances are stable or SERP volatility.
- Re-check `paediatric osteopath christchurch` — confirm whether the AI-summary attribution of Nina Hu's Meridian contact details from last run still holds now that happyspine.co.nz has dropped out.
- If item #35 ships, first snapshot of GSC Gen AI report impressions should be included as a parallel signal alongside the SERP-tracking pool.
- If PR #108 pattern (monthly Practitioner Spotlight) continues, treat it as the seed of item #14 — but be explicit that a one-off editorial slot per month is not the 2-post/month cadence the 6.81-day citation-window rewards.
