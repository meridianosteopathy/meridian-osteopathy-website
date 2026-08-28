# AI Search Audit — 2026-08-28

Weekly snapshot of Meridian Osteopathy's visibility across Google + AI-search
surfaces, industry signals affecting local healthcare SEO/AEO/GEO, and open
backlog items.

## TL;DR

- **0 items shipped** in the 2026-08-15 → 2026-08-28 window. Only one non-audit
  commit landed (PR #121 — the referral form now reports why a submission
  failed; not on the backlog). Backlog: 9 items pending.
- **3 item bodies updated**: #15 (major — Reddit-ChatGPT citation collapse
  deleverages Reddit seeding), #35 (GSC Gen AI logging bug Aug 13–17), #36
  (postpartum SERP filled in — thin-window closed).
- **Ranked-query count regressed 3 → 2.** Sports-injury-recovery URL keeps
  climbing (#6 → #5), tennis-elbow #9 held for a third consecutive week, but
  the one-week debut on 'sports injury osteopath christchurch' at #5 has
  reversed (Meridian dropped OUT of top 10).
- **Major industry event this week:** Reddit's ChatGPT-Search citation share
  collapsed 86% between Aug 5–8 — Reddit is now a Perplexity-only pathway for
  visible AI citations. This materially deleverages item #15 (Reddit seeding)
  and proportionally increases the leverage of item #14 (first-party blog /
  editorial cadence).

## Search visibility

40 queries re-checked against live Google SERPs on 2026-08-28 (top-30 by
priority + core baseline seeds).

### Wins vs last run

| Query | Last run | This run | Change |
|---|---|---|---|
| sports injury recovery christchurch | #6 | **#5** | ▲ Up one position |
| tennis elbow osteopath christchurch | #9 | **#9** | Held (3rd consecutive week) |

The /conditions/sports-injury-recovery/ page — with its citation-ready 40–60
word intro (item #31), structured list blocks (item #34) and MedicalCondition
+ FAQPage schema — remains Meridian's highest-yield URL for SERP visibility.
Tennis-elbow at #9 for three consecutive weeks is now demonstrably a durable
rank, not a one-run artefact.

### Losses vs last run

| Query | Last run | This run | Change |
|---|---|---|---|
| sports injury osteopath christchurch | #5 | **0** | ▼ Dropped OUT of top 10 |

The debut at #5 lasted exactly one week. `performanceplusphysiochch.co.nz`
retook the top-5 slot it had lost the week before — the same SERP churn that
opened the door has now closed it. Priority decayed 15 → 5 per the standard
-10 rule; kept in the pool.

### Unchanged / no signal

Meridian still absent from all other 27 queries checked. Priority-10 queries
where we ship content but don't rank (endometriosis, PCOS, cancer, hip/knee,
menstrual pain, headaches, post-concussion) show ordinary competitor churn
but no Meridian breakthrough.

### Notable competitor churn this run

- **activehealth.co.nz** added a new osteopath (Luke) and now surfaces at #1
  on 'sports osteopath christchurch', 'osteopath acc christchurch', and top-5
  on 'sports injury osteopath christchurch'.
- **osteo.co.nz** took #1 on 'sciatica osteopath', 'concussion osteopath'
  (2 weeks running — was long-standing triskelionconcussioncare.co.nz), and
  holds top slot on 'pregnancy osteopath'.
- **cashmereosteo.co.nz** took #1 on 'arthritis osteopath', 'shoulder pain
  osteopath' and holds 'hip pain osteopath' + 'best osteopath christchurch'.
- **completeconcussions.com** — NEW #1 entrant on 'post concussion syndrome
  christchurch' via 'The Headache Clinic Christchurch' subdomain. The
  post-concussion SERP is now the most contested it has been at any check.
- **Better Health Osteopathy** holds 3 URL variants in the top 5 of 'tennis
  elbow osteopath christchurch' (osteopathic-treatment-of-tennis-elbow +
  conditions/elbow-pain + elbow-pain relief).

### Thin-SERP window closed

**postpartum osteopath christchurch** returned only 6 total Google results
last week (identified as a low-hanging content opportunity — item #36). This
run: full page of ~10 results. The window has closed inside two weeks — this
now looks like typical Christchurch health-query competition, not a unique
gap. Item #36 body updated: content addition still worth doing, but priority
downweighted from 'easy win' to 'normal condition-page build'; option (a) —
extending the existing /conditions/pregnancy-back-pain/ page rather than a
new URL — is now the better call.

## Query-pool changes

- No new queries added this run (pool at 49/50 — preserving tracking history
  over displacing existing entries).
- No queries pruned this run.
- Standard -10 priority decay applied to 27 rank-0 queries.
- 'dry needling halswell' priority decayed to 0 without a fresh check —
  prune candidate for next run (US-directory + 1 NZ competitor dominate;
  no viable path to compete for a hyperlocal suburb + service combo).
- 9 priority-0 queries held over this run (batch allocation focused on
  top-priority + core baseline seeds): jaw pain, osteopath halswell,
  whiplash, rotator cuff, postnatal, chiropractor vs osteopath, paediatric,
  post concussion osteopath, dry needling halswell.
- Google autocomplete (`suggestqueries.google.com`) STILL blocked from
  routine host egress — 5th consecutive run returning 403. No harvest from
  the autocomplete pathway this run.

## Industry signals — week of 2026-08-22 → 2026-08-28

### 1. **MAJOR — Reddit's ChatGPT-Search citation collapse (86% drop)**

Reddit's share of citations in ChatGPT Search fell from ~3.8% to ~0.5%
between roughly Aug 5–8, an 86% relative decline. Multiple analyses
(cryptobriefing, Forbes, Pierview, State of Brand, Cassie Clark, promptwatch,
explainx.ai). Drivers: (a) an OpenAI backend change to ChatGPT's
query-fanout / retrieval-ranking behaviour, and/or (b) Reddit re-blocking
non-licensed AI crawlers via `robots.txt` (its Google licensing situation is
still contested).

**Perplexity moved the opposite way.** Perplexity's Reddit citations roughly
doubled Jul → early Aug and kept climbing. Of 44,488 Reddit citations tracked
Jul 1 – Aug 19, Perplexity supplied 71% and ChatGPT 23%.

Reddit now behaves as a **silent source** for ChatGPT: read during retrieval
but no longer credited in visible citations.

**Practical implication for Meridian:** Reddit seeding is now a
Perplexity-only play for visible AI citations, not a broad AI-search play.
Perplexity's market share is materially smaller than ChatGPT's, so the ROI on
a proactive Reddit content programme has fallen substantially in a single
quarter. **Item #15 body rewritten** (impact M → L; not to be prioritised).
**Item #14 (blog) proportionally more valuable** — on-site freshness is now
proportionally more of the whole GEO strategy than it was a week ago.

### 2. GSC Generative AI performance report logging bug (Aug 13–17)

Google confirmed a data-logging error caused reported impressions on the
Generative AI performance report to appear lower than reality for data
starting Aug 13 and continuing through Aug 17. Also affected Discover Gen AI
impressions. This is a **data-side bug only, NOT a visibility change** —
Google added a Search Central annotation.

**Practical implication:** when comparing GSC Gen AI baseline forward, treat
Aug 13–17 as unusable data and use Aug 8–12 as the immediate comparison
anchor. **Item #35 body updated** with the data-quality caveat.

### 3. August 2026 ranking volatility remains unconfirmed

No core update announcement despite third-party trackers spiking Aug 1–6 and
continued volatility through the month. Last confirmed update was the June
2026 spam update (Jun 24–26). YMYL/health remains the hardest-hit vertical
in unconfirmed volatility. **No action** — if Meridian sees a dip on
`/services/` or `/conditions/` pages, don't rewrite copy in response.
Historically settles within 10 days without intervention.

### 4. Local SEO 2026 ranking-factor breakdown confirmed across sources

Multiple 2026 breakdowns (Seahawk, PinMeTo, RankMax, JC WebPros, Sparkz):
**GBP signals 32%, on-page 19%, reviews 16%, links 15%, behavioural 8%,
citations 7%.** Reinforces items #13 (auto-fetch GBP reviews) and #16
(monthly review nudge — tier promoted 3 → 2 this run). Also reinforces
item #25 (/acc/ landing page — on-page URL specifically targeting ACC intent).

### 5. AI Overviews health-query saturation up to 89%

From 88% last month to 89% this month. Zero-click rate steady at 83%. Every
existing 40–60 word citation-ready intro on our condition/service pages
(item #31 shipped) is now more valuable, not less.

### 6. llms.txt adoption stalled

No major AI company has publicly committed to reading/acting on `llms.txt`
in production as of Q1 2026 (aeo.press). ClaudeBot/Claude-SearchBot +
GPTBot/OAI-SearchBot separation is now standard practice (already covered
by our `robots.txt` allow-lines — item #33 shipped). **No action required.**

### 7. Schema.org v30 stable

Physician type is now exclusively a subtype of MedicalOrganization;
PhysiciansOffice restored as subtype of MedicalBusiness (v26 correction).
Our Physician JSON-LD upgrade to Schema.org v30 IndividualPhysician
(item #27 shipped) remains current.

## Backlog after this run — 9 items pending

- **Tier 1**: #35 (GSC Gen AI report — data-quality caveat added this run)
- **Tier 2**: #13, #16 (tier-promoted 3 → 2), #25, #32, #36 (postpartum —
  priority downweighted this run)
- **Tier 3**: #12, #14 (blog — relatively more valuable after the Reddit
  collapse), #15 (Reddit seeding — deleveraged this run)

## Alignment with `alreadyShipped`

PR #121 (referral form error reporting) added to `alreadyShipped` for
completeness. Not counted as an audit-item shipping (was not on the backlog).
