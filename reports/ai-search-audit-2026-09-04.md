# AI Search Audit — 2026-09-04

**Window**: 2026-08-15 → 2026-09-04 (three-week gap since last audit on 2026-08-14 — routine skipped 2026-08-21 and 2026-08-28 runs)

**Backlog**: 9 pending items (#12, #13, #14, #15, #16, #25, #32, #35, #36).

**Shipped this window**: 0 backlog items. One non-backlog PR: #121 (referral form now reports why a submission failed — UX fix to existing form infrastructure).

---

## Search visibility

30 queries re-checked against live SERPs.

### Ranking wins & regressions

**Meridian rankings this run** (2 queries):

| Query | This run | Last run | Trend |
| --- | --- | --- | --- |
| pregnancy back pain christchurch | **#4** | rank 0 | **NEW WIN — first-ever ranking on this URL** |
| tennis elbow osteopath christchurch | **#9** | #9 | Holds — third consecutive week |

**Regressions**:

| Query | This run | Last run | Trend |
| --- | --- | --- | --- |
| sports injury osteopath christchurch | rank 0 | #5 | Lost slot — performanceplusphysiochch.co.nz returned to top 5 |
| sports injury recovery christchurch | rank 0 | #6 | Lost slot — top 10 returned to all-physio |

### Story of the week

**Pregnancy-back-pain #4 is the FIRST WIN OUTSIDE THE SPORTS-INJURY-RECOVERY URL.** /conditions/pregnancy-back-pain/ debuts at #4 in an SERP where triskelionconcussioncare.co.nz holds #1 and osteo.co.nz #2 — 17+ weeks after the page shipped (item #10 in `alreadyShipped`), and 12 weeks after the 40–60-word citation-ready intro (#31) + structured list blocks (#34) were bundled onto it. Confirms the URL-per-condition pattern is not idiosyncratic to the sports-injury-recovery URL — a second condition page now ranks.

**But both new-last-week sports-injury ranks regressed to 0.** The sports-injury-recovery URL's SERP position on adjacent-intent queries was more fragile than the two-run signal suggested. The URL-per-condition thesis holds, but individual ranks whipsaw as competitor SERPs volatile-churn. Tennis elbow (#9, three consecutive weeks) is now the most durable ranking on the board.

**Rank-count trajectory**: 0 (weeks 1–17) → 1 (2026-08-07) → 3 (2026-08-14) → 2 (2026-09-04).

### Rule interpretation

**Pregnancy back pain** — rank 4 gives "keep priority" per the standard rule (priority stayed at 5), but 5 is below the priority-10 tracking floor. Bumped to 15 (matching the tennis-elbow / sports-injury-osteopath precedent from prior runs) so the newly-ranking query stays in the check pool. Documented in `auditQueries.json` meta.notes.

### Notable competitor churn

- **severnclinics.co.nz** (Wellington) new in 'osteopath vs physio' top 3 — Better Health dropped from long-standing #1 to #3
- **triskelionconcussioncare.co.nz** new #1 on 'arthritis osteopath christchurch' and new top-2 on 'back pain osteopath christchurch' — Triskelion continues its cross-body-region expansion (now competing on arthritis / back-pain / neck-pain / concussion, not just concussion). Reinforces item #32.
- **koruhealing.co.nz** new #1 on 'acupuncture for cancer' + 'acupuncture acc christchurch'
- **advancedholisticcenter.com** (US) new #1 on 'acupuncture for pcos'
- **performanceplusphysiochch.co.nz** returned to 'sports injury osteopath' top 5 (was #1, dropped out last week, now back at #3) — SERP whipsaw that closed the slot on Meridian

### Autocomplete

Blocked by routine host egress allowlist for the 5th consecutive week. All new adds this run are derived.

### Query pool changes

- **Pruned (1)**: dry needling halswell — priority ≤10 for 3+ runs; NZ SERP dominated by physio-focused Halswell Clinic + US directories; no plausible osteopathy path
- **Added (2 derived)**:
  - pregnancy pelvic pain christchurch — extends the newly-validated pregnancy-back-pain URL ranking to test adjacent pelvic-pain intent
  - wrist pain osteopath christchurch — completes the specific-body-part pain-osteo tracking set (companion to elbow, hip, knee)

Pool at 50/50 (cap reached).

### Not checked this run

19 priority-0 queries rotated out — concussion / post-concussion syndrome / whiplash / lower-back-pain / neck-pain / paediatric / medical-acupuncture / dry-needling / fertility acupuncture / herbal medicine / chinese herbal / jaw pain / pregnancy osteo / rotator cuff / postnatal / chiropractor-vs-osteo / osteopath-halswell / best-osteopath / osteopath-acc-christchurch. **Prioritise for next run**: the concussion trio + osteopath acc christchurch (both tied to pending items #32, #25).

---

## Industry signals (three-week window)

1. **August 2026 spam update** (Aug 18 12:30 pm ET → Aug 21 4:50 am ET). Hit rankings harder than a normal update: 16.71% of URLs that had ranked in Google's top 10 fell beyond position 100 vs 9.2% during a comparable baseline. Case studies show it targeted scaled content abuse, AI content, programmatic content, thin affiliates — not something Meridian's pages fit. **YMYL (healthcare, real estate) reported as the STEADIEST segments** (fashion/beauty had the largest volatility). Cross-checked against Meridian's live SERPs: no unusual competitor churn beyond volatility already tracked. No action needed.

2. **Google Site Reputation Policy update (Aug 28) — EEA-only carve-out.** Manual actions under the site-reputation policy behave differently inside vs outside the EEA. Zero relevance for a Christchurch clinic serving NZ patients. Noted for completeness.

3. **Reddit-in-ChatGPT citations COLLAPSED — but Perplexity doubled down.** Jul 1 → Aug 19: Perplexity supplied 71% of tracked Reddit citations while ChatGPT supplied 23%. ChatGPT Search citations linking to Reddit fell from ~250/day early Aug to 16/day the week after Aug 14 — **a -94% decline in six days**. Reddit's Perplexity share ~24%; Gemini 0.1%. Item #15 body updated: focus Reddit effort on Perplexity-oriented threads, skip ChatGPT-oriented seeding.

4. **AI Mode local pack now often 1-2 businesses (not 3)** (Sterling Sky tracking, holding through this window). Fewer slots means the recency + response-rate signals matter more relative to a broader 3-slot pack. Feeds #13 + #16.

5. **Whitespark 2026 Local Search Ranking Factors** — owner response within 48hrs now tracked as a separate behavioural signal (89% of consumers expect responses; 81% within a week; next-day expectations climbed to 32% from 18% year-prior). **BrightLocal 2026**: 50% of consumers actively put off by generic/templated review responses. Item #16 refined: same-week floor, 24–48hr target, personalised text.

6. **Ahrefs 1,885-page schema study finalised** — no major uplift in AI citations across Google AI Overviews / AI Mode / ChatGPT vs 4,000 controls. Reinforces the Feb 2026 Fischman study (position-1 pages cited in 43% of queries; organic rank dominates AI citation prediction). Item #12 (speakable) firmly downweighted: keep because cheap, do NOT invest engineering time in schema-type expansion over body-copy / condition-page work.

7. **AI SEO stats** — AI Overviews now respond to 68% of local searches (Semrush AI Overviews study). Position-1 organic CTR fell from 1.41% to 0.64% on pages where AIO appears (Ahrefs, -54% effective drop). Traditional-organic-only strategy is losing yield; the AI-citation angle matters even more than at start of year.

---

## Backlog after this run

| # | Title | Tier | Impact | Effort |
| --- | --- | --- | --- | --- |
| 12 | Add speakable blocks on service intros | 2 | L | S |
| 13 | Auto-fetch GBP reviews at build time | 2 | M | M |
| 14 | Start a blog (2 posts/month) | 3 | H | L |
| 15 | Seed Reddit / community brand mentions (Perplexity-oriented) | 3 | M | M |
| 16 | Monthly Google reviews nudge + personalised response SLA | 3 | M | M |
| 25 | Build an /acc/ landing page | 2 | M | S |
| 32 | Add /conditions/concussion/ page | 2 | M | S |
| 35 | Enable GSC Generative AI performance report + capture baseline | 1 | M | S |
| 36 | Add postpartum recovery section or dedicated page | 2 | M | S |

**Priority tier ordering**:

- Tier 1 → #35
- Tier 2 → #13, #16, #25, #32, #36
- Tier 3 → #14 (leverage elevated by pregnancy-back-pain ranking win), #15 (posture rebalanced Perplexity-first)

Item body updates this run: #12 (Ahrefs 1,885-page study reinforcement), #14 (pregnancy-back-pain ranking win reinforces URL-per-condition thesis), #15 (MAJOR — Reddit-in-ChatGPT citation collapse), #16 (Whitespark 48hr signal + BrightLocal templated-response finding), #25 (minor), #32 (Triskelion cross-body expansion note added), #36 (pregnancy-back-pain precedent argues for option (b) new page).
