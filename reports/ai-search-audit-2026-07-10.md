# AI Search Audit — Meridian Osteopathy — 2026-07-10

Weekly routine snapshot. Compares against the 2026-06-05 baseline.

**Cadence note:** the routine missed four weekends (2026-06-12/19/26 + 2026-07-03). This is the first run since 2026-06-05, so priority moves compound only one weekly cycle, not four.

## Punch list — pending after this run

10 items open: #12, #13, #14, #15, #16, #25, #32, #35, **#36 (new)**, **#37 (new)**.

Nothing shipped from the pending list this window. Team + copy changes only:

- Jonathan promoted to Senior Osteopath; homepage team reordered (PR #103)
- Jonathan's personal website linked from his profile (PR #100)
- IPP3A indirect-collection privacy notices (PR #104)
- Min's profile content refreshed at her request (PR #105)
- June Practitioner Spotlight — Maddison (PR #108) + qualifications bullet-list reformat (PR #109)

## New items this run

**#36 — Add /services/acupuncture/womens-health/ + /services/acupuncture/cancer-supportive-care/ sub-pages.** Min Jin's May-2026 refresh (PR #98) repositioned her clinical interests but has no indexable landing yet. Three first-check queries added last run — endometriosis, PCOS, cancer — all show Meridian NOT visible at 2026-07-10 (5 weeks post-Min's-refresh); House of Acupuncture owns all three via its dedicated /our-services/womens-health-acupuncture sub-page (same pattern that wins them ACC and fertility). Mirror the /services/acupuncture/fertility/ sub-page pattern. Tier 2, impact M, effort S.

**#37 — Establish a quarterly refresh cadence for top service + condition pages.** Ahrefs' 17M-citation freshness study (mid-June 2026): AI-cited URLs average 1,064 days old vs. 1,432 for organic (25.7% fresher). SEMrush corroborates: pages unrefreshed >3 months are 3× more likely to lose citations. Every service + condition page already has a visible 'Last updated' block and dateModified schema; the gap is cadence, not plumbing. Tier 3, impact M, effort S.

## Reworded — #15 "seed Reddit" → "earn authentic Reddit mentions"

404 Media (June 2026) exposed peptide / HRT brands seeding r/biohackers to game AI answers; subreddit mods are banning coordinated accounts. Coordinated seeding is now a red flag. The reward is still real (Reddit citation share up 73% Q4-25 → Q1-26 per Tinuiti; Perplexity 24% Reddit-cited; ClaudeBot +66% June surge means Reddit feeds Claude's answers too), but the play must be authentic: helpful, disclosed answers on r/newzealand / r/chch / r/AskNZ, never posted as the clinic.

## Reworded — #35 "enable GSC Gen AI report" → "verify NZ availability + baseline"

Google's Generative AI performance report launched 2026-06-03 but Search Engine Land coverage clarified the rollout was UK-first. The 2026-06-17 opt-out toggle date has passed and the NZ property may not yet show the report. Toggle is NOT a ranking signal — leave OFF regardless. Action items: verify visibility in the NZ property, screenshot baseline if visible, otherwise monthly re-check.

## Search visibility

30 queries re-checked against live SERPs today (top 30 by priority). 14 lower-priority queries retain their 2026-05-29 / 2026-06-05 baselines.

### Wins vs last run

1. **`tennis elbow osteopath christchurch` — Meridian rank 6 (previously 0 for 6+ weeks).** FIRST TIME Meridian has broken into the top 10 for any tracked query since the pool was seeded 2026-04-24. Priority retained at 15 under the 4-10 = keep rule. Off-target UK domains (balancedmotionclinic.co.uk, theosteopaths.org.uk) also ranking — the local SERP is thin, which likely helped Meridian break in. Watch for volatility next run.
2. **`sports injury osteopath christchurch` — Meridian rank 9 (previously 0 for 12+ weeks).** /conditions/sports-injury-recovery/ (PR shipped 2026-04-15) finally surfacing. Priority retained at 10. Off-target UK newforestosteopathy.co.uk also ranking.

### Losses / SERP recompositions vs last run

- **`osteopath vs physiotherapist christchurch`** — recomposed further. Both osteopath-halswellclinic.co.nz (previously #1 non-aggregator) and christchurchosteopath.co.nz dropped OUT of the top 5. betterhealthosteopathy.nz now dominates with two ranking pages; nib.co.nz (insurer comparison content) enters at #2. Confirms 2026-06-05's suspected regression was a structural shift, not just SERP volatility per Ahrefs' 54.5% AIO-consecutive-response overlap number.
- **`osteopath christchurch`** — christchurchosteopath.co.nz overtook betterhealthosteopathy.nz for #1; cashmereosteo.co.nz displaced activehealth.co.nz from top 5.
- **`whiplash osteopath christchurch`** — frameosteo.co.nz new to top 5; osteopath.nz dropped out.
- **`concussion osteopath christchurch`** — Triskelion Concussion Care + sibling Triskelion Osteopathy now both in top 5 (same-brand dominance intensifying).
- **`neck pain osteopath christchurch`** — triskelionconcussioncare.co.nz displaced mkosteopathy.co.nz / activehealth.co.nz from top 5 (concussion-specialist site now cross-ranking on neck-pain).

### First-time checks (queries added 2026-06-05)

- `acupuncture for endometriosis christchurch` — Meridian not in top 10 at 5 weeks; burwoodacupuncture.co.nz leads with a dedicated endometriosis page.
- `acupuncture for pcos christchurch` — Meridian not in top 10; House of Acupuncture leads.
- `acupuncture for cancer christchurch` — Meridian not in top 10; every top-5 result is a Christchurch TCM clinic.
- `headaches osteopath christchurch` (split from combo) — Cashmere Osteo leads on the narrower intent (not osteopath-christchurch.com's blog, which owns the combo).
- `post concussion syndrome christchurch` — entirely different SERP set from 'post concussion osteopath' — concussion-specialist / sports-medicine sites (cranialsolutions.nz, lfbit.co.nz, concussioncare.co.nz, axissportsmedicine.co.nz). Reinforces item #32 with a broader-audience angle.

### Priority moves

- +5 (rank ≤ 3): none this run.
- Keep (rank 4–10): tennis elbow (15), sports injury (10).
- −10 (rank 0 or > 10): 28 queries.
- Pruned: `headaches migraines osteopath christchurch` (priority 0 for 3+ consecutive runs AND redundant with the 2026-06-05 split into `headaches osteopath christchurch`).

### Pool status

- Size 44 / 50 (was 45).
- No new derived queries added — pool has room, but no material new site content has shipped since PR #98 and the 5 women's-health-related queries added last run are still their first-run baseline.
- Autocomplete fetch (suggestqueries.google.com) still blocked by routine host egress allowlist — durable fix = widen the allowlist.

## Industry signals — 2026-06-05 → 2026-07-10

Five-week window covering four missed weekly runs. Sources cited in the tldr; distilled here.

1. **AI Overviews retreated from provider-intent local health queries** (Search Engine Land). ~0–10% AIO trigger on 'dermatologist near me'-type SERPs; Google is deferring to the Local Pack. Big tailwind for #25 (ACC landing) and #32 (concussion page) — they now compete for Local Pack + landing-page, not the AIO citation slot. Educational-first, booking-CTA-second.
2. **Ahrefs 17M-citation freshness study.** AI-cited URLs 25.7% fresher than organic. SEMrush: pages unrefreshed >3 months are 3× more likely to lose citations. Strongest case yet for #14 (blog) AND drives new #37 (quarterly refresh).
3. **Reddit citation share up 73% Q4-25 → Q1-26 (Tinuiti).** BUT — 404 Media (June 2026) exposed brand seeding. Reframed #15.
4. **ClaudeBot +66% June surge** (Web Search API monthly report) — now #2 crawler behind Googlebot. Confirms item #33 (Claude-SearchBot + Claude-Web robots.txt allow, shipped 2026-06-03 PR #96) was time-sensitive.
5. **OpenAI updated OAI-SearchBot 2026-06-22** with clearer UA identification.
6. **llms.txt adoption stalled at 5.6–8.7% of top 10k** with no measurable citation lift (Rankability). Nice-to-have, not a leading signal.
7. **schema.org v26 added `practicesAt` officially.** Our IndividualPhysician upgrade (item #27, PR #65) already uses this shape — no change needed.
8. **GSC Generative AI performance report + opt-out toggle live** — UK-first rollout, NZ property may not yet show the report. See rewritten #35.
