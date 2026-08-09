# AI Search Audit — 2026-08-07

Weekly snapshot for meridianosteopathy.co.nz against AEO / GEO signals and a tracked search-visibility pool of 46 queries.

First run since 2026-06-05 (the routine was paused ~9 weeks).

## Shipped in this window (2026-06-06 → 2026-08-07)

No backlog items closed in this window, but five materially relevant PRs shipped:

- **PR #103 (2026-06-23) — Jonathan Grice promoted to Senior Osteopath & Low Level Laser Therapist.** Title updated site-wide in `team.json`, homepage cards, Physician JSON-LD and `/book/jonathan/`. Homepage practitioner order reshuffled to Maddison → Kaylee → Jonathan → Nina → Min.
- **PR #104 (2026-06-24) — IPP3A indirect-collection privacy notices.** New section 3 of `privacy.njk` covering the six required IPP3A notification elements; `submit-referral.js` now emails a compliant notice to referred patients; `docs/ipp3a-compliance.md` captures the clinic-side checklist for indirect collection outside the website. Not directly SEO, but part of the trust-signal surface.
- **PR #108 (2026-07-11) — Monthly Practitioner Spotlight infrastructure.** Homepage spotlight section, team-card ribbon, profile hero badge and highlighted "What I Treat" pill, all driven by `src/_data/spotlight.json` and editable in the CMS under Homepage → Practitioner Spotlight. June spotlight = Maddison. **This is the first cadenced fresh-content surface the site has ever had — a partial address for #14 (blog).** Notes below.
- **PR #113 (2026-07-29) — ACC copy reworded from claim-filing to provider-status framing** after Google Ads disapproved the clinic under the "Government documents and official services" policy. ACC is a Crown entity, and the old wording read as paid-intermediary facilitation to the Ads classifier. Every "we lodge / claim for you" was reworded to "ACC-registered provider" language. Explicit non-affiliation line + `acc.co.nz` link added on the two ads-target service pages and in the ACC FAQ / llms.txt. **Changes the copy angle item #25 (/acc/ landing page) needs to take.**
- **PR #114 (2026-07-29) — CLAUDE.md copy-rule violations swept out.** "At no extra charge" removed in three places (Nina's approach + two appointment-type descriptions); five "GP" → "doctor" fixes in clinically legitimate contexts (red-flag escalation + coordinating with a patient's existing care).
- **PR #116 (2026-07-29) — Cliniko booking funnel tracked as GA4 conversions.** Real `booking_completed` events, not click proxies. Widget's cross-origin iframe broadcasts step transitions (`cliniko-bookings-page:schedule` / `:patient` / `:confirmed`) which we now listen for; drop-off between steps is visible rather than inferred. Duplicate inline handler consolidated into `src/js/cliniko-booking.js`. **Pairs with #35 (GSC Gen AI report) for end-to-end AI-surface → click → booking attribution once the GSC report has settled data.**

## Backlog after this run

8 items pending. Tier 1 → #35. Tier 2 → #13, #16, #25, #32 (elevated urgency this run per Whitespark + Epicware review-recency data and passage-extraction data). Tier 3 → #14, #15.

| #  | Tier | Impact | Effort | Title |
|----|------|--------|--------|-------|
| 12 | 2 | L | S | Add speakable blocks on service intros (**downweighted** — schema studies + 7-year Speakable beta stall) |
| 13 | 2 | M | M | Auto-fetch Google Business Profile reviews at build time (**reinforced** — review recency = #1 local ranking factor) |
| 14 | 3 | H | L | Start a blog (2 posts/month) |
| 15 | 3 | M | M | Seed Reddit / community brand mentions (**strongest lever** — 46.7% Perplexity citation share) |
| 16 | 3 | M | M | Encourage monthly Google reviews nudge (**reinforced** — Gemini uses review sentiment/keywords) |
| 25 | 2 | M | S | Build an /acc/ landing page — Active Health / osteo.co.nz own ACC queries (**angle updated** per PR #113) |
| 32 | 2 | M | S | Add /conditions/concussion/ page — Triskelion owns 'concussion osteopath christchurch' |
| 35 | 1 | M | S | Enable Google Search Console Generative AI performance report + capture baseline |

## Search visibility

30 of 46 pool queries re-checked against live SERPs (top-30 by priority). Autocomplete fetch still blocked by routine host egress allowlist — pool self-expansion via derived queries continues as the workaround.

### Wins vs last run

- **🎯 FIRST-EVER Meridian appearance in the tracked pool.** `tennis elbow osteopath christchurch` — `meridianosteopathy.co.nz` at rank **#9** via `/conditions/sports-injury-recovery/`. Priority held at 15 per the rank 4–10 rule (no priority change on top-10 ranks). The caveat: three UK-side domains (balancedmotionclinic.co.uk, theosteopaths.org.uk, therichardscentre.co.uk) crowd the top of the SERP, so this is a slightly hollow local SERP that let our sports-injury page break through on partial-topic relevance — the win is real but conditional. Adds evidence that (a) the condition-page + citation-ready-intro + list-block investment is starting to earn ranking on the long tail, and (b) `sports-injury-recovery` in the URL slug is doing work even for queries that aren't exact-match to it (tested next run via the new derived query `sports injury recovery christchurch`).
- **Paediatric entity linkage still holds at AI-summary layer** (from last run; not re-checked this run — kept in pool at priority 0). Nina Hu's `@meridianosteopathy.co.nz` email and phone previously named in the AI summary despite our URL not ranking.

### Losses vs last run

- **Osteopath vs physiotherapist christchurch — regression PERSISTS and consolidates.** Last run flagged this as ≥5-spot drop and hedged as possible SERP volatility per Ahrefs 2026-05 AIO-URL-overlap study. Not volatility: Better Health now holds top 3 slots with three separate comparison-URL variants. Priority dropped 25 → 15 per the -10 rule. Reset the volatility hypothesis.
- **`osteopath christchurch` — Frame Osteo jumped to #1**, was outside top 5 last run. Cashmere Osteo also entered top 5, displacing Active Health. Umbrella-query SERP churn is picking up.
- **`neck pain osteopath christchurch` — Triskelion Concussion Care expanded into #2** (a new competitor for a query that was previously dominated by pure-osteo sites). Concussion specialist site is now colonising adjacent SERPs.
- **`medical acupuncture christchurch` — acupuncturepainrelief.co.nz took #1**, a new competitor 82 days after our Acupuncture & Dry Needling rename (PR #78) with no movement for us.
- **`lower back pain christchurch` — headachetendon.nz (a chiropractor with content-heavy strategy) surged to #1**, past Better Health. New evidence that content-heavy strategies from adjacent modalities can colonise slots we could otherwise take.
- **`sports injury osteopath christchurch` — performanceplusphysiochch.co.nz is a new physio contender** at #1 for the parent query, even as our sports-injury page ranks for the child query (tennis elbow). Interesting asymmetry to watch.

### Pruned this run

Four queries removed for showing 0 signal after multiple runs:

- `osteopath wigram` — 2+ months post item #29 suburb inclusion, hollow SERP unchanged (US directories + Wikipedia)
- `osteopath addington` — same story, only aggregators + UK/US-directory results
- `osteopath near me halswell` — US-directory hollow SERP with no NZ competition to displace
- `headaches migraines osteopath christchurch` — superseded by cleaner `headaches osteopath christchurch` variant added last run (SERPs overlap)

### Added this run (derived, 5 of 5 maxNewPerRun budget)

1. `acupuncture for menstrual pain christchurch` — tests Min Jin's dysmenorrhoea specialty per PR #98
2. `hip pain osteopath christchurch` — natural condition-page gap, not tracked yet
3. `knee pain osteopath christchurch` — natural condition-page gap, not tracked yet
4. `sports injury recovery christchurch` — direct match with Meridian's condition-page URL slug; tests whether the tennis-elbow #9 rank generalises to the exact URL slug
5. `postpartum osteopath christchurch` — US-variant of postnatal; tests whether SERP intent differs

### Pool meta after this run

- Pool size: **46** (was 45 — pruned 4, added 5)
- Under maxPool (50) and maxNewPerRun (5)
- Standard -10 priority decay applied across all 30 queries below top 10 this run
- Autocomplete egress still blocked by routine host allowlist — durable fix = widen allowlist for `suggestqueries.google.com`

## Industry signals (week of 2026-07-31 → 2026-08-07)

1. **GSC Generative AI report added CTR + regional rollout.** Google extended the Search Console AI performance report beyond impressions to include CTR (clicks ÷ impressions) in July, and rolled it to more regions (India confirmed). Query-level data still absent. **Implication:** #35 (enable GSC Gen AI report) is now a Tier-1 no-brainer — we finally get a delta between AI-surface impressions and site visits, and it pairs with PR #116's `booking_completed` event for full attribution.
2. **AI Mode is default + queries doubling** (blog.google, Search Central, July 10 2026). Gemini 3.5 Flash now powers every Google query globally, not just the opt-in AI Mode tab. AI Mode passed 1B MAU with queries 3× longer than classic search; follow-ups up 40% MoM. Only 17–54% of AI Overview citations come from top-10 organic (down from 76% mid-2025), and 70% of cited pages churn within 2–3 months. **Implication:** raw ranking is decoupling from citation. Passage-level extractability matters more than more schema — reinforces #25 (/acc/ page) and #32 (concussion) as the priority items for content.
3. **Reddit = 46.7% of Perplexity top-10 citation share** (Tinuiti Q1 2026 + SaaSIntelligence follow-up, reiterated late July). Reddit citation share grew 73% across nine tracked verticals. ChatGPT cites Reddit ~5%, Gemini 0.1%. Only ~11% domain overlap between ChatGPT and Perplexity citations. **Implication:** strongly reinforces #15 — this is the single highest-leverage AEO lever we have for Perplexity visibility.
4. **Review recency = #1 individual local ranking factor** (Whitespark 2026 report + Epicware / DigitalApplied July 2026). Reviews <30 days carry full algorithmic weight; 30–180 days decays to 10–20%; 73% of consumers only trust reviews from the last month. Gemini/AI Overviews now use review sentiment + keywords to pick which local businesses to recommend. **Implication:** #16 (monthly reviews nudge) and #13 (auto-fetch GBP reviews at build time) both reinforced hard — freshness compounds across Local Pack AND AI citation.
5. **Ahrefs schema study holds up; FAQ rich results deprecated** (Ahrefs May 11 + follow-up commentary July 2026). +2.4% AI Mode / +2.2% ChatGPT / –4.6% AI Overviews across 1,885 pages adding schema — all statistically indistinguishable from zero (or negative). Late-July consensus: schema is a context signal, not a lever. **Implication:** downweight #12 (Speakable blocks) — 7-year beta stall and near-zero measured uplift. Keep on list because it's still cheap, but don't invest engineering time here over body copy.
6. **ClaudeBot overtook GPTBot in crawler share** (July 2026, Cloudflare data). ClaudeBot 16.28% / GPTBot 9.74% for all 31 days — inverted from July 2025 order. Google separately confirmed (2026-06-15) that llms.txt has zero ranking effect. **Implication:** validates our existing Claude-SearchBot allow line (item #33); don't extend llms.txt investment — our existing file is fine as a passive signal.
7. **88% of health queries trigger AI Overviews; 83% zero-click** (Search Engine Journal + 210 Digital July 2026). Passage-level clarity on treatment/condition pages is now the extraction unit — not the page. **Implication:** reinforces #32 (/conditions/concussion/) and argues #25's /acc/ page needs a tight 40–60 word intro block per item #31's pattern.

## Gaps re-confirmed

- **G7 (no ACC landing page).** osteo.co.nz / Active Health still own `osteopath acc christchurch`; House of Acupuncture owns `acupuncture acc christchurch`. Item #25 covers, with the copy angle updated to match PR #113's provider-status framing.
- **G8 (no blog / editorial content).** Now the strongest week yet for the blog case — PR #108's Practitioner Spotlight infrastructure shortens the build path (Decap collection config, JSON-LD, homepage surface can be adapted rather than built from scratch). Item #14 covers.
- **G15 (no off-site citation strategy).** Reddit citation share on Perplexity confirmed. Item #15 remains our single highest-leverage un-attempted AEO lever.

## Notes for next run

- Re-check `tennis elbow osteopath christchurch` — confirm whether the #9 rank persists or was a one-run artefact. If it persists, it's evidence the condition-page pattern is working on the long tail; if it evaporates, note it as SERP volatility.
- Re-check `sports injury recovery christchurch` (added this run) — tests whether the tennis-elbow rank generalises to the exact URL-slug query.
- Re-check `osteopath vs physiotherapist christchurch` — regression consolidated this run (Better Health 3-in-3); consider whether a dedicated `/osteopath-vs-physiotherapist/` explainer page (Halswell-Clinic pattern) is worth a follow-up item.
- If item #35 (GSC Gen AI report) is enabled between now and next run, next audit should include AI Overview / AI Mode impression **and CTR** deltas as parallel signal alongside the SERP pool.
- Consider whether the Practitioner Spotlight (PR #108) cadence — if maintained monthly — is enough freshness signal on its own to defer item #14, or whether the site still needs a separate `/blog/` URL space for cited-page freshness (industry data suggests separate URLs still matter, since cited pages need to be individual crawlable entities).
