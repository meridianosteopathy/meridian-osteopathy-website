# AI Search Audit — 2026-09-11

Weekly AI-search-audit run. Prior audit: 2026-09-04.

## Ship report

- **Backlog items shipped this week: 0.**
- Only intervening commit since last audit was PR #123 (merge of last week's audit run — not a code change).
- Backlog after this run: 10 items pending — #12, #13, #14, #15, #16, #25, #32, #35, #36, and new #37.

## Item bodies updated

- **#13** — added GBP Insights outage caveat (September blackout, unresolved through 2026-09-11); build script must be resilient to Places-API 429/5xx and not fail the Netlify build on transient outages.
- **#14** — Zyppy 2026 Ranking Factors Survey (Sept 9) top 3 signals = search-intent match + trusted/topical backlinks + content quality. Decisive URL-per-condition evidence this week (pregnancy-back-pain URL now ranks on TWO pregnancy queries).
- **#15** — OpenAI Deep Research shipped into ChatGPT Work + Codex on 2026-09-09 (cited outputs across web/files/connected apps). Reinforces Perplexity-Reddit posture. ChatGPT-Reddit citation cliff still baseline, no reversal.
- **#25** — direct precedent: betterhealthosteopathy.nz/acc/ now appears at #5 on 'osteopath acc christchurch'. Competitor has shipped exactly the URL structure this item calls for.
- **#32** — SERP pattern change: 'concussion osteopath christchurch' #1 is now a PRACTITIONER PROFILE PAGE (betterhealthosteopathy.nz/anastasia-mcpherson-osteopath-christchurch/). Item #32 implementation should pair the condition page with a Nina/Maddison practitioner-profile surface for concussion intent.
- **#36** — postpartum SERP still thin, now 4/6 URLs owned by Better Health. Pregnancy-back-pain URL's cross-query success reinforces the new-URL option over extend-existing.

## New backlog item

- **#37 — Monthly GBP contributor-photo audit.** Defensive against the Google Maps phone-in-photo scam pattern flagged 2026-09-10. Low effort (~5-10 mins/month), zero code changes. Clinic-side ops item.

## Search visibility

30 queries re-checked against live Google SERPs on 2026-09-11.

### Three ranked queries this week — highest count of the year (tied with 2026-08-14)

| Query | Rank | URL | Trend |
|---|---|---|---|
| tennis elbow osteopath christchurch | #9 | /conditions/sports-injury-recovery/ | **4th consecutive week — most durable rank on the board** |
| pregnancy back pain christchurch | #4 | /conditions/pregnancy-back-pain/ | 2nd consecutive week (held after last week's #4 debut) |
| pregnancy pelvic pain christchurch | #5 | /conditions/pregnancy-back-pain/ | **NEW — first-check ranking on the derived query added 2026-09-04** |

### Wins vs 2026-09-04

- **pregnancy pelvic pain #5** — the pregnancy-back-pain URL is establishing pregnancy-vertical authority, generalising beyond its exact-slug intent. A single URL now ranks on TWO distinct pregnancy queries.
- **pregnancy back pain #4 held** — the pregnancy-back-pain URL is not a one-week fluke; SERP position is stabilising.
- **tennis elbow #9 held for a 4th consecutive week** — this remains the site's most durable ranking, all via the sports-injury-recovery URL.

### Losses / regressions vs 2026-09-04

- No new losses this week — sports-injury queries were already at rank 0 last week and remain 0 (baseline: `sports injury osteopath christchurch` rank 0 for 2nd week; `sports injury recovery christchurch` rank 0 for 2nd week).
- The sports-injury-recovery URL's authority remains isolated to the tennis-elbow phrasing — it does NOT generalise to sibling body-part queries ('elbow pain' rank 0, 'wrist pain' rank 0) or to the URL's own slug intent ('sports injury recovery' rank 0). Contrast with pregnancy-back-pain, which now ranks on two queries.

### Rank-count trajectory

| Week | Ranked queries |
|---|---|
| 2026-04-24 through 2026-08-06 | 0 |
| 2026-08-07 | 1 (tennis elbow) |
| 2026-08-14 | 3 (tennis elbow + sports injury osteo + sports injury recovery) |
| 2026-09-04 | 2 (tennis elbow + pregnancy back pain) |
| **2026-09-11** | **3 (tennis elbow + pregnancy back pain + pregnancy pelvic pain)** |

### Notable competitor SERP shifts

- **`lower back pain christchurch`**: betterhealthosteopathy.nz/back-pain-relief-osteopath-christchurch/ took #1. Chiropractor headachetendon.nz's #1 (held for 3+ weeks running) has broken — dropped to #4 with a different URL.
- **`concussion osteopath christchurch`** (deferred-from-2026-08-14 check completed): betterhealthosteopathy.nz/anastasia-mcpherson-osteopath-christchurch/ took #1 — a PRACTITIONER PROFILE PAGE displaced osteo.co.nz/concussion/ from #1. New SERP pattern to watch.
- **`osteopath acc christchurch`** (deferred check): betterhealthosteopathy.nz/acc/ appears at #5 — Better Health has shipped a dedicated /acc/ landing URL. Direct precedent for item #25.
- **performanceplusphysiochch.co.nz** continues widening into body-region queries (elbow pain top 5, knee pain top 5).
- **triskelionconcussioncare.co.nz** appears in pregnancy back pain #1 and pregnancy pelvic pain #3 — Triskelion continues expansion beyond concussion vertical.
- **`neck pain osteopath christchurch`**: osteopath.nz (Shelley Joe) took #1; Better Health /conditions/neck-pain/ #2.
- **`postpartum osteopath christchurch`**: still thin SERP (~6 results), now 4/6 owned by Better Health.

## Query pool changes

- **Pool at 50/50**. No adds, no prunes.
- **Autocomplete blocked (6th consecutive run)** — routine host still cannot reach suggestqueries.google.com; HTTP 000 on the connect. No derivations added this run.
- **Priority decays applied to 8 queries**: wrist pain 30→20 (rank 0, first check); sports injury recovery 20→10 (rank 0, 2nd week); sports osteopath / elbow pain / sports rehabilitation / acupuncture for menopause / post cancer acupuncture all 20→10 (rank 0, 2nd week); sports injury osteopath 5→0 (rank 0, 2nd week — priority now floored).
- **Approaching prune threshold** (4 queries hit third-consecutive-run-at-<20): acupuncture for menstrual pain, hip pain, knee pain, postpartum osteopath. One more run at <20 would trigger removal per meta rules. Kept this run so item #36's postpartum evidence stays trackable.
- **Priorities held on 3 queries**: pregnancy back pain 15 (rank 4-10 keeps), tennis elbow 15 (rank 4-10 keeps), pregnancy pelvic pain 30 (rank 4-10 keeps).

## Industry signals (2026-09-04 → 2026-09-11)

1. **GBP Insights blackout all of September (HIGH relevance).** Barry Schwartz / SE Roundtable reported 2026-09-08 that Business Profile Insights showed 8+ days of the month with zero data. Unresolved through 2026-09-11. Backfill expected but not delivered. Action: don't score September Discovery vs Direct movement until backfilled — flag the gap, don't call a false dip.
2. **Google Maps phone-in-photo scam (moderate relevance).** Scammers uploading AI-generated contributor photos containing fraudulent phone numbers. New backlog item #37 added: monthly GBP contributor-photo audit.
3. **OpenAI Deep Research shipped into ChatGPT Work + Codex on 2026-09-09 (moderate relevance).** Cited, editable outputs across web/files/connected apps for Pro/Enterprise/Edu first. More consumers will run cited 'compare-osteo-clinics-in-Christchurch'-style research; reinforces item #15 (Perplexity-Reddit seeding).
4. **Zyppy 2026 Ranking Factors Expert Survey (published Sept 9; 131 SEOs, 103 signals, 13,665 data points).** Top 3: search-intent match + backlinks (trusted+topical) + content quality. Meta description effectively zero-impact. Validates item #14 (blog) and downweights item #12 (schema) further.
5. **No AI Overviews / AI Mode product changes this week.** Aug core update tail continues residual reshuffling through ~Sept 21 but no new rollout.
6. **No new Whitespark / BrightLocal / Local Falcon research this week.** Baseline holds for item #16.
7. **No schema.org / llms.txt movement.**

## Priority stack going forward

- **Tier 1**: #35 — GSC Gen AI performance report baseline capture. Still the highest-value first-party AI-visibility signal we can capture.
- **Tier 2**: #13 (auto-fetch GBP reviews), #16 (reviews nudge + response SLA), #25 (/acc/ landing page), #32 (concussion page + practitioner-level surface), #36 (postpartum page), #37 (new — monthly GBP contributor-photo audit).
- **Tier 3**: #14 (blog — decisive URL-per-condition evidence this week), #15 (Perplexity-oriented Reddit seeding).

Backlog headline: **The URL-per-condition thesis (item #14's core hypothesis) got its strongest evidence yet this week — the pregnancy-back-pain URL now ranks on two distinct pregnancy queries, generalising exactly as we hoped when we derived 'pregnancy pelvic pain christchurch' last run.**
