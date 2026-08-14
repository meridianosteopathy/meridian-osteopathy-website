# AI Search Audit — 2026-08-14

Weekly snapshot for meridianosteopathy.co.nz against AEO / GEO signals and a tracked search-visibility pool of 49 queries.

## Shipped in this window (2026-08-08 → 2026-08-14)

No backlog items shipped this window. Only two commits since last audit and both are audit infrastructure:

- **PR #118 (2026-08-07)** — Last week's weekly audit.
- **PR #119 (2026-08-07)** — Backfilled 6-week reports archive (2026-06-12 → 2026-07-31 markdown snapshots) so the historical record is complete.

## Backlog after this run

9 items pending (was 8; +1 new for postpartum thin-SERP opportunity).

Tier 1 → #35. Tier 2 → #13, #16, #25, #32, and NEW #36. Tier 3 → #14, #15.

| #  | Tier | Impact | Effort | Title |
|----|------|--------|--------|-------|
| 12 | 2 | L | S | Add speakable blocks on service intros (**downweighted** — no new schema-uplift signal this week) |
| 13 | 2 | M | M | Auto-fetch Google Business Profile reviews at build time (**reinforced** — review recency = #1 local ranking factor) |
| 14 | 3 | H | L | Start a blog (2 posts/month) |
| 15 | 3 | M | M | Seed Reddit / community brand mentions (**time-decay clock started** — Reddit/Perplexity licensing turmoil may narrow the window in 60–90 days) |
| 16 | 3 | M | M | Encourage monthly Google reviews nudge (**reinforced** — GBP local-pack redesign surfaces response rate more prominently) |
| 25 | 2 | M | S | Build an /acc/ landing page (**angle updated** per PR #113) |
| 32 | 2 | M | S | Add /conditions/concussion/ page (**SERP churn this week** — osteo.co.nz took #1 back from long-standing Triskelion; top-tier more contestable) |
| 35 | 1 | M | S | Enable GSC Generative AI report + baseline (**CTR-contradiction correction** — Gen AI panel still impressions-only despite July reports) |
| 36 | 2 | M | S | **NEW** — Add postpartum recovery section or dedicated page (thin SERP — only 6 total Google results this week) |

## Search visibility

34 of 49 pool queries re-checked against live SERPs. Autocomplete fetch still blocked by routine host egress allowlist (4th consecutive run). Pool self-expansion via derived queries continues as the workaround.

### Wins vs last run

- **🎯🎯🎯 THREE RANKED QUERIES this run — all via /conditions/sports-injury-recovery/.** Progression: 0 ranked queries (weeks 1–17) → 1 (last week) → **3 (this week)**.
  - `tennis elbow osteopath christchurch` — **#9 held from last week** (continuation confirmed; not a one-run artefact).
  - `sports injury osteopath christchurch` — **NEW #5** (was 0 last week). performanceplusphysiochch.co.nz dropped OUT of top 5 (was #1 last week) — the same SERP churn that opened the slot.
  - `sports injury recovery christchurch` — **NEW #6** on the first-ever check of the direct URL-slug match. In an otherwise all-physio SERP (musclepeople.co.nz, fixedphysio.co.nz, habit.health, acephysio.co.nz, christchurchparkphysiotherapy.co.nz). Confirms the URL-slug generalisation hypothesis from last run — the exact-slug URL match ranks better on the exact-slug query.

  The `/conditions/sports-injury-recovery/` page — citation-ready 40–60 word intro (item #31) + structured list blocks (item #34) + Physician + MedicalCondition + FAQPage schema — is now the highest-performing URL on the site by SERP-visibility yield. It's the strongest evidence yet that the condition-page pattern works and is worth applying to the queries where we still have zero visibility.

### Losses vs last run

- **`osteopath vs physiotherapist christchurch` — regression persists for a second week.** Better Health still holds top 3 slots with three separate comparison-URL variants; SERP consolidating around one competitor. Priority dropped 15 → 5.

### Notable SERP churn (not a win/loss for us — market signal)

- **`concussion osteopath christchurch`** — osteo.co.nz took #1 back from triskelionconcussioncare.co.nz, which had been long-standing #1 (item #32 gap-holder). Triskelion's brand hasn't collapsed — still #1 on 'post concussion' variants — but the top tier is more contestable this week than any prior check.
- **`sports injury osteopath christchurch`** — performanceplusphysiochch.co.nz dropped OUT of top 5 (was #1 last week). Same SERP volatility that opened the slot for us.
- **`acupuncture for fertility christchurch`** — ableacupuncture.co.nz new entrant to top 5; creativehealthacupuncture and taoclinic dropped out.
- **`herbal medicine christchurch`** — dph.nz (DP Herbals) new entrant at #2.
- **`chiropractor vs osteopath christchurch`** — chchwellness.co.nz new to top 5; lifebalancechiropractic.co.uk dropped out.
- **`headaches osteopath christchurch`** — osteo.co.nz dropped from top 5; osteopath.net.nz new entrant.
- **`osteopath acc christchurch`** — chchosteopaths.co.nz moved from #4 to #2; osteo.co.nz slipped from #2 to #4.

### Rule interpretation this run

The `sports injury osteopath christchurch` query was at priority 0 last week (had never ranked) and this week debuted at rank 5. Strict application of the "keep priority for rank 4–10" rule would leave it at 0, dropping it below the top-30 check cutoff for the next run — a bug when the rule meets a priority-0 floor. Bumped to 15 (matching tennis elbow's tracking floor when it first ranked) so the newly-ranking query stays in the check pool. Documented in the meta notes for both files.

### Pruned this run

Two queries removed for showing zero signal after 3+ consecutive runs at priority <20 with no plausible path to compete:

- `acupuncture vs dry needling` — pure informational query dominated by US authority sites (peaktherapy.com, inspireatlanta.com, rockvalleypt.com); no NZ SERP to displace.
- `osteopath cashmere` — suburb owned by same-name competitor cashmereosteo.co.nz; no plausible path to displace them on their own suburb name.

### Added this run (derived, 5 of 5 maxNewPerRun budget)

All 5 extend proven patterns from this run's wins:

1. `sports osteopath christchurch` — direct variant of the ranking sports-injury queries; tests ranking ceiling.
2. `elbow pain osteopath christchurch` — extends the tennis-elbow #9 win to broader elbow-pain intent.
3. `sports rehabilitation christchurch` — sports-injury-recovery-adjacent, tests whether the SI page also ranks on rehabilitation intent.
4. `acupuncture for menopause christchurch` — Min Jin's women's health specialty extension (per PR #98).
5. `post cancer acupuncture christchurch` — Min Jin's post-cancer supportive care specialty extension.

### Pool meta after this run

- Pool size: **49** (was 46 — pruned 2, added 5).
- Under maxPool (50) and maxNewPerRun (5).
- Standard -10 priority decay applied across queries below top 10 this run.
- **5 priority-10 queries not checked this run** due to batch-allocation skew — prioritise for next run: frozen shoulder, arthritis, baby, shoulder pain, acupuncture acc.
- Autocomplete egress still blocked by routine host allowlist — durable fix = widen allowlist for `suggestqueries.google.com`.

## Industry signals (week of 2026-08-08 → 2026-08-14)

1. **Ranking volatility Aug 12–13 (unconfirmed).** Semrush Sensor / Advanced Web Rankings / Mozcast community reports logged a second August volatility wave with no core-update announcement on Google's Search Status Dashboard. YMYL/health is historically the hardest-hit vertical in unconfirmed volatility. **Implication:** if Meridian sees a dip on /services/ or /conditions/ pages between now and next audit, don't rewrite copy in response — pattern usually settles inside 10 days.
2. **Google removed the HowTo structured data doc from Search Central (~Aug 9).** Formally closes a type that was already deprecated on desktop in 2023. Checked: Meridian uses no HowTo schema, so no action needed. Noted only so future condition-page work doesn't accidentally reach for it.
3. **Perplexity motion to dismiss Reddit scraping suit rejected (federal, 31 Jul).** Reddit / Google $60M/yr licensing renewal talks reportedly stalled; both sides re-scoping access. **Implication:** the 46.7% Perplexity-cites-Reddit baseline is now a moving target. If Reddit tightens access over the next quarter, the marginal ROI of #15 (Reddit seeding) drops. Item #15 body updated with an implicit 60–90 day time-decay clock.
4. **EU AI Act Article 50 enforceable Aug 2.** Any chatbot/AI-generated content aimed at EU users must self-disclose. **Implication:** minor for a Christchurch clinic (audience is NZ) — but if we ever ship an AI-generated blog draft or on-site symptom-triage widget, include a "reviewed by [practitioner]" disclosure line. Cheap insurance and doubles as an E-E-A-T signal Perplexity/Claude weight.
5. **GBP local-pack redesign spreading Aug 11–13** (BrightLocal + Local Search Forum). Map moved to top, action buttons rearranged, **response rate** surfacing more prominently. **Implication:** reinforces Whitespark 2026 review-recency baseline and adds a new operational sub-signal — the clinic's 24–48 hr response cadence to reviews now feeds visible-in-SERP trust cues, not just internal engagement metrics. Item #16's body updated to include a reply-cadence hand-off on the clinic side.
6. **CTR-loss diagnostic framing (SEJ ~Aug 11)** — "stable rankings + stable impressions + falling CTR = AI Overview click loss." **CRITICAL CONTRADICTION vs last week's baseline:** multiple August write-ups (Pragma-Code, Weblumino, TJ Robertson, SmartTeam) all confirm the GSC Generative AI panel is STILL impressions-only — no CTR, no clicks, no query data — despite last week's tldr claiming CTR was added in July. The July note was either premature or was rolled back. **Item #35's body updated to reflect this** — the report is still worth enabling for AI-surface impressions, but the CTR + booking_completed attribution story pairs with the standard Performance report's CTR column, not the Gen AI panel, until Google actually ships CTR there.
7. **Semrush AI Visibility Index expansion.** Only 36 brands hold top-100 visibility across ChatGPT / Gemini / AI Mode / AI Overviews simultaneously; 45% of marketing leads cannot measure AI visibility at all. **Implication:** for a NZ clinic, being present on even 2 of the 4 surfaces is a competitive moat. A monthly manual check of 'osteopath christchurch', 'ACC osteopath near me' and 5–10 condition queries in ChatGPT + Perplexity + AI Mode (~10 minutes total) is a defensible free alternative to paid AI-visibility trackers — consider adding as an operational-checklist item on the weekly routine README if the clinic wants it tracked.

### Baseline contradiction flagged

Last week's tldr stated "GSC Generative AI performance report added CTR + regional rollout" — mid-August write-ups all disagree. Corrected in item #35's body this run. Worth verifying inside the clinic's own GSC console before designing any dashboards against a Gen-AI-panel CTR column.

## Gaps re-confirmed

- **G7 (no ACC landing page).** Active Health still owns 'osteopath acc christchurch' at #1; chchosteopaths.co.nz now #2 (moved up from #4 last week); House of Acupuncture owns 'acupuncture acc christchurch'. Item #25 covers; copy angle per PR #113's provider-status framing.
- **G8 (no blog / editorial content).** Content-heavy competitors from adjacent modalities continuing to colonise slots we could take (headachetendon.nz still #1 on 'lower back pain christchurch' for a second week). Item #14 covers; PR #108 Practitioner Spotlight infrastructure is the reusable starting point. Reddit/Perplexity licensing turmoil (see #G15) is orthogonal — first-party freshness is unaffected.
- **G15 (no off-site citation strategy).** Reddit citation share on Perplexity confirmed but with a new time-decay clock this week (Reddit/Perplexity licensing renewal talks stalled). Item #15 remains our single highest-leverage un-attempted AEO lever but the window may narrow in 60–90 days.

## Notes for next run

- Prioritise the 5 priority-10 queries not checked this run: **frozen shoulder, arthritis, baby, shoulder pain, acupuncture acc**.
- Re-check the three newly-ranking sports queries — confirm continuation or regression. If all three hold, the ranking-via-condition-page-pattern is a durable win and worth doubling down on with items #32 (concussion) and #36 (postpartum).
- Check the 5 new derived queries — especially `sports osteopath christchurch`, `elbow pain osteopath christchurch`, and `sports rehabilitation christchurch` — to see if the sports-injury-recovery page picks up ranking on natural variants.
- If item #35 (GSC Gen AI report) is enabled between now and next run, the next audit should include AI Overview / AI Mode **impression** deltas (not CTR — see contradiction above) as parallel signal alongside the SERP pool.
- Consider whether to add an operational-checklist item on the weekly routine for a manual monthly AI-visibility spot-check (ChatGPT + Perplexity + AI Mode) — per industry signal #7 this week.
