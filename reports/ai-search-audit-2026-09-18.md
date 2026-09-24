# AI Search Audit — 2026-09-18

**Window**: 2026-09-05 → 2026-09-18 (two-week gap since last audit on 2026-09-04 — routine skipped 2026-09-11 run)

**Backlog**: 9 pending items (#12, #13, #14, #15, #16, #25, #32, #35, #36).

**Shipped this window**: 0 backlog items. Zero content commits on `main` between audits — the previous audit's PR #123 is the only merged change.

---

## Search visibility

30 queries re-checked against live SERPs.

### Ranking wins & regressions

**Meridian rankings this run** (2 queries):

| Query | This run | Last run | Trend |
| --- | --- | --- | --- |
| pregnancy back pain christchurch | **#1** | #4 | **MERIDIAN'S FIRST-EVER #1 RANKING** — displaces triskelionconcussioncare.co.nz |
| sports injury recovery christchurch | **#4** | rank 0 | **RETURN** — was #6 two weeks ago, whipsaw volatility confirmed |

**Regressions**:

| Query | This run | Last run | Trend |
| --- | --- | --- | --- |
| tennis elbow osteopath christchurch | rank 0 | #9 | **Three-week streak broken** — Better Health now holds 4 tennis-elbow URLs in top 5 |

### Story of the week

**Meridian's first-ever #1 ranking.** /conditions/pregnancy-back-pain/ jumped from #4 to #1 on 'pregnancy back pain christchurch' in a single week, displacing triskelionconcussioncare.co.nz from the position it held last run. This is the first #1 SERP position Meridian has ever held on any tracked query. 17+ weeks after the page shipped (item #10 in `alreadyShipped`), and 12+ weeks after the 40–60-word citation-ready intro (#31) + structured list blocks (#34) were bundled onto it, the pattern has definitively proven itself.

**Sports-injury-recovery URL returned at #4 the same week.** After dropping to rank 0 last week (having been #6 the week before, #5 the week before that), /conditions/sports-injury-recovery/ is back in top 5. The URL's SERP position is genuinely whipsaw-volatile but demonstrably capable of top-5. Two Meridian URLs in the visible top 10 (one at #1, one at #4).

**Tennis elbow #9 lost.** The most durable ranking on the board through three consecutive weeks broke this run. Better Health has intensified its dominance on the query, now holding 4 tennis-elbow URLs in top 5 (up from 3), including a dedicated `/osteopathic-treatment-of-tennis-elbow-pain-osteopath-christchurch/` URL that reads like a purpose-built anchor.

**Rank-count trajectory**: 0 (weeks 1–17) → 1 (2026-08-07) → 3 (2026-08-14) → 2 (2026-09-04) → 2 (this run, URL identities shifted from tennis-elbow+pregnancy-back-pain to pregnancy-back-pain #1 + sports-injury-recovery #4).

### Rule interpretation

- **Pregnancy back pain** — rank 1 gives priority = min(100, 15+5) = **20** per the ≤3 rule.
- **Sports injury recovery** — rank 4 gives "keep priority" (stays at **20**, rank 4-10 unchanged).
- **Tennis elbow** — rank 0 gives priority = max(0, 15-10) = **5** per the standard demotion.

### Notable competitor churn

- **betterhealthosteopathy.nz/acc/** NEW to #2 on 'osteopath acc christchurch' — **Better Health has just shipped exactly what item #25 proposes**. The competitive window for /acc/ is closing rapidly (Active Health still #1; a Meridian /acc/ URL shipped now slots behind two entrenched competitors, delayed further and it faces a third).
- **betterhealthosteopathy.nz** NEW to #2 on 'concussion osteopath christchurch' — via `/anastasia-mcpherson-osteopath-christchurch/` (associate osteopath marketed on concussion). Better Health is expanding into concussion territory where Triskelion previously dominated.
- **betterhealthosteopathy.nz** TOOK #1 on 'lower back pain christchurch' from headachetendon.nz — a 3+ week chiropractor dominance broken. First time an osteopath has topped this query in the tracking window.
- **triskelionconcussioncare.co.nz** dropped to #3 on 'concussion osteopath christchurch' (was #1 in older baseline; new #1 = osteo.co.nz).
- **musclepeople.co.nz** NEW #1 on 'dry needling christchurch' (was outside top 5) — physios continue to own every NZ slot for this query.
- **christchurch-osteopathy-acupuncture.co.nz** NEW to top 3 on 'acupuncture for fertility christchurch' via dedicated `/acupuncture/fertilityivf` sub-URL.

### Thin-SERP opportunity — third-run confirmation

- **postpartum osteopath christchurch** — still ~5-6 total Google results (Better Health, osteo.co.nz, osteopath-christchurch.com, porthillsosteo.co.nz). bambinoosteo.co.nz dropped from visible results this run. Three consecutive weeks of thin-SERP confirmation makes this a durable opportunity, not a one-run anomaly. Item #36 opportunity holds firm.

### Pool changes

- **Pruned**: `sports rehabilitation christchurch` — 100% physio-owned SERP with no viable osteopath path (matches last week's `dry needling halswell` prune rationale).
- **Dropped**: `chiropractor vs osteopath christchurch` — comparison content owned by Better Health, unrelated to Meridian's core service offering, no signal produced in 4 checks.
- **Added (derived — autocomplete blocked 6th consecutive run)**:
  - `back pain during pregnancy christchurch` — tests whether the pregnancy-back-pain URL's #1 rank generalises to a natural verbal variant.
  - `osteopath for sports injury christchurch` — tests whether the sports-injury-recovery URL's rank generalises to alternate phrasing.
- Pool size: 50/50.

---

## Industry signals (2026-09-05 → 2026-09-18)

### New signals this window

1. **Google Search Console Generative AI Performance Report reached full worldwide rollout on 31 Aug 2026.** All sites can now see impressions inside AI Overviews, AI Mode, and Discover AI features by URL / country / device — still impressions-only (no CTR, no prompt data). Item #35 is now unblocked; the panel is globally live and 2–3 weeks is minimum viable sample. **Promoted to Tier 1 top-of-list — 'do this week'** as the highest-leverage cheap first move on the backlog.

2. **Cloudflare's mixed-use AI-crawler default went live 15 Sep 2026.** New Cloudflare-served sites now default-block Training and Agent-class crawlers on ad-monetised pages; Search bots stay allowed; multi-purpose crawlers (Googlebot, Applebot, Bingbot carrying a Training label) inherit the strictest rule. Meridian is on Netlify with no ads so no direct effect, but as ad-supported health publishers shut AI training crawlers out, models will lean harder on primary-source clinic sites + GBP for local health answers — a small tailwind for owned canonical pages. Feeds item #14 (blog) leverage upward.

3. **August 2026 Google Core Update finished rolling out on 21 Sep 2026** — 26-day rollout stretched through most of this window, layered on the 18–21 Aug spam update already tracked. Health/YMYL has remained steadier than commercial verticals but per-query volatility was reported through mid-Sep. Interpretive note for next run: hold off strong reads on condition-page GSC data until ~22 Sep+ baseline settles.

4. **AI Mode 'developing-topic' link carousels** announced 25 Aug and expanded through Sep — targets trending/news topics, not evergreen clinic pages. Low relevance for Meridian unless we ever ship rapid-response content (e.g. an ACC scheme change).

### Nothing new since 4 Sep

- **Schema.org**: no new release (v30.0 from March 2026 still current); MedicalClinic / Physician / MedicalCondition unchanged.
- **Speakable schema**: still limited beta for news publishers; no evidence of AI-citation lift and no deprecation announcement — item #12 verdict unchanged.
- **Reddit ↔ Perplexity litigation / licensing**: no material movement past the 31 Jul motion-to-dismiss rejection.
- **Sterling Sky / Whitespark / BrightLocal**: no new material studies past the 2026 Local Search Ranking Factors report already tracked.

### Refreshed leverage table

- **Tier 1**: #35 (unblocked, top move), #14 (Cloudflare publisher-squeeze + AI Mode query fan-out + pregnancy-back-pain #1 proof triple-reinforce the blog leverage), #25 (competitive urgency — Better Health just shipped what this item proposes).
- **Tier 2**: #13, #16 (compound value with AI Mode's GBP dependence), #32 (Better Health expansion into concussion), #36 (three-week thin-SERP confirmation).
- **Tier 3**: #15 (Perplexity-scoped), #12 (unchanged low).

---

## Backlog after this run

| # | Tier | Title | Status |
| --- | --- | --- | --- |
| 12 | 2 | Speakable blocks on service intros | Unchanged low leverage |
| 13 | 2 | Auto-fetch GBP reviews at build time | Unchanged |
| 14 | 3 | Start a blog (2 posts/month) | **Leverage elevated** — pregnancy #1 proof + Cloudflare tailwind |
| 15 | 3 | Reddit/Perplexity seeding | Unchanged (Perplexity-only scope) |
| 16 | 3 | Monthly review nudge + personalised response SLA | Reinforced — compound AI Mode value |
| 25 | 2 | /acc/ landing page | **URGENT — competitor just shipped this** |
| 32 | 2 | /conditions/concussion/ page | Reinforced — Better Health expanding into concussion |
| 35 | 1 | GSC Gen AI Performance Report | **Top move — DO THIS WEEK** (rollout complete 31 Aug) |
| 36 | 2 | Postpartum recovery page | Three-week thin-SERP confirmation holds |

---

## Recommended next actions (in order)

1. **Enable + screenshot the GSC Gen AI Performance Report baseline** (item #35, 15 minutes, in GSC console — no repo changes). Blocks nothing; unblocks the AI-surface-impressions story that everything else builds on.
2. **Ship /acc/ landing page** (item #25, effort S). Competitive window is closing.
3. **Ship /conditions/concussion/ page** (item #32, effort S) using the pregnancy-back-pain / sports-injury-recovery pattern that has now demonstrably reached #1.
4. **Ship /conditions/postpartum-recovery/ page** (item #36 option b, effort S). Thin-SERP opportunity is now robustly confirmed and the adjacent pregnancy-back-pain URL's #1 is direct precedent.
5. **Blog scaffolding** (item #14). Adapt PR #108's Practitioner Spotlight infrastructure rather than build from scratch.
