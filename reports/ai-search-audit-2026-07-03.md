# AI Search Audit — Meridian Osteopathy — 2026-07-03

Weekly audit run covering search visibility, industry signals, and the audit
punch-list. Site: https://meridianosteopathy.co.nz

## TL;DR

- **Shipped this cycle**: no audit backlog items closed. Four PRs merged since
  the 2026-06-05 audit but they were all regulatory or profile-content work:
  - PR #100 (2026-06-11) — Jonathan's personal website link on his profile card
  - PR #103 (2026-06-23) — Jonathan promoted to Senior Osteopath & Low Level
    Laser Therapist site-wide + homepage practitioner reorder to
    Maddison / Kaylee / Jonathan / Nina / Min
  - PR #104 (2026-06-24) — IPP3A indirect-collection privacy notices for
    Privacy Act 2020 §IPP3A (in force 1 May 2026)
  - PR #105 (2026-06-27) — Min's What I Treat / Special Interests / About Me
    refresh (focus reframed around musculoskeletal acupuncture, women's health,
    and chronic condition management)
- **Search visibility**: TWO NOTABLE WINS + one new competitor.
  - `tennis elbow osteopath christchurch` — meridianosteopathy.co.nz/conditions/sports-injury-recovery/
    appeared at **rank #3** (first-ever top-10 appearance). Priority raised 15 → 20.
  - `sports injury osteopath christchurch` — same URL surfaced at **rank #10**
    (first top-10 appearance at 11+ weeks post-ship).
  - Both wins are likely traceable to PR #97 (item #34, shipped 2026-06-03)
    which added a structured 5-7 item list block to every condition page —
    /conditions/sports-injury-recovery/'s `lists` array includes lateral
    epicondylitis (tennis elbow) as a treated condition. **First direct evidence
    in the audit's history that a shipped content investment produced measurable
    SERP visibility.**
  - Notable new competitor: performanceplusphysiochch.co.nz launched a dedicated
    `/osteopath-addington-christchurch/` URL — first NZ site to attempt suburb-page
    ownership of `osteopath addington` (was UK-only hollow SERP). Item #29
    (Addington in flowing intro copy, shipped 2026-05-10) has not produced
    equivalent visibility 8+ weeks post-ship, reinforcing that hollow-suburb SERPs
    reward dedicated URLs, not intro-copy mentions.
- **Backlog after this cycle**: 11 items pending (#12, #13, #14, #15, #16, #25,
  #32, #35, #36, #37, #38). Three new items added this run:
  - #36 — Add /services/acupuncture/cancer-support/ sub-page (no NZ competitor
    owns 'acupuncture for cancer christchurch'; Min Jin's new clinical-interest
    entry is a genuine open lane).
  - #37 — Start a short-form YouTube condition-explainer queue (YouTube overtook
    Reddit as #1 social AI-citation source in June 2026).
  - #38 — Create a Wikidata entity for Meridian Osteopathy (NJ study: Wikidata
    presence separated the cited 2% from the uncited 98% of small
    allied-health practices).

## Search visibility

**30 queries re-checked against live SERPs on 2026-07-03.** Autocomplete
(suggestqueries.google.com) still blocked by the routine host egress allowlist
— pool self-expansion continues via `source: derived` from previous-run SERP
gaps and new site content. Durable fix = widen the egress allowlist.

### Wins vs 2026-06-05

| Query | Last run rank | This run rank | Note |
|---|---|---|---|
| `tennis elbow osteopath christchurch` | 0 (not visible) | **3** | First-ever top-10 appearance; via /conditions/sports-injury-recovery/ |
| `sports injury osteopath christchurch` | 0 (not visible) | **10** | Same URL; 11+ weeks post-ship; first top-10 appearance |

Both wins are traceable to the same URL and to the structured 5-7 item list
block content shipped in PR #97 (item #34) on 2026-06-03 — the
sports-injury-recovery page's `lists` array in `conditions.json` includes
lateral epicondylitis / tennis elbow explicitly. This is the first direct
evidence in the audit's history that a shipped content investment produced
measurable SERP visibility on our target domain.

### Losses / no-change

Same 3-way dominance as last run in the head osteo queries:
Better Health Osteopathy + Christchurch Osteopathic Centre / Moorhouse +
osteopath-halswellclinic.co.nz. Better Health continues to hold multi-URL
positions on nearly every condition query (2–3 URLs in the top 10 for
back-pain, neck-pain, sciatica, headaches, jaw-pain, whiplash, sports-injuries,
frozen-shoulder, tennis-elbow, rotator-cuff, postnatal, pregnancy, chiro-vs-osteo).

`osteopath-christchurch.com` still holds the blog-velocity slots for
headaches/migraines/cranial/baby-osteo (multiple tag URLs — post-concussion,
idiopathic-migraines) and now leads postnatal SERPs with three URL variants.
Reinforces #14 (blog).

`osteopath vs physiotherapist christchurch` — Better Health now #1 non-aggregator
(rotated from #2 last run); Halswell Clinic's osteopath-vs-physio-vs-chiro post
no longer surfacing in top 5 — comparison-URL leadership rotated. Meridian still
absent (was #3 pre-regression); the SERP-volatility hypothesis (Ahrefs 54.5% AIO
URL overlap) holds — the set is shuffling weekly.

### Notable intent signal

`post concussion syndrome christchurch` — first-check SERP is dominated by ACC
concussion-service contract holders (Laura Fergusson Brain Injury Trust,
Concussion Care NZ, Habit Health, Axis Sports Medicine, TBI Health, APM) and
psychologists — NOT osteopaths. Splitting 'syndrome' from 'osteopath' pulls
diagnostic/rehab intent rather than treatment-provider intent. Actionable: item
#32 should target `concussion osteopath christchurch` and `post concussion osteopath
christchurch` variants (both osteo-populated SERPs), NOT the syndrome variant.

### Notable opportunity

`acupuncture for cancer christchurch` — first-check SERP has NO NZ clinic
advertising cancer-supportive acupuncture; top results are US oncology providers
(Inova, Fred Hutch, Cancer Rehab Austin) and NZ generalist acupuncture clinics
that don't call out cancer specifically. Min Jin's new post-cancer supportive-care
special interest (PR #98, 2026-06-05) is a genuine open lane. Drives new item #36.

### Pool changes

- **Pruned** (3, below priority 20 for three consecutive runs):
  - `headaches migraines osteopath christchurch` (superseded by
    `headaches osteopath christchurch` added last run)
  - `paediatric osteopath christchurch` (hollow SERP for us; entity-linkage win
    last run was via happyspine.co.nz, not our URL)
  - `acupuncture vs dry needling` (informational US-dominated, chronically at 5)
- **Added** (5, all `source: derived`):
  - `acupuncture for menopause christchurch` (Min Jin women's-health expansion)
  - `post concussion recovery christchurch` (variant refining item #32 targeting)
  - `concussion clinic christchurch` (variant refining item #32 targeting)
  - `tennis elbow christchurch` (tests whether the rank-3 win extends beyond the
    `osteopath` modifier)
  - `shin splints osteopath christchurch` (sports-injury sub-condition)
- **Priority raises** (rank ≤ 3):
  - `tennis elbow osteopath christchurch`: 15 → 20
- **Priority holds** (rank 4–10):
  - `sports injury osteopath christchurch`: stays 10
- **Priority drops** (–10, not in top 10): 28 queries

Pool size: 45 → 47 (cap 50, still under).

## Industry signals — week of 2026-06-26 → 2026-07-03

1. **Claude Sonnet 5 launched 2026-06-30 with web search ON BY DEFAULT** on the
   Free + Pro tiers, agentic BrowseComp near-Opus, citations baseline
   ([Anthropic](https://www.anthropic.com/news/claude-sonnet-5)). Claude-User /
   Claude-SearchBot hits on meridianosteopathy.co.nz should measurably jump
   this cycle — item #33 (Claude-SearchBot + Claude-Web allow lines, shipped
   2026-06-03 PR #96) is now producing citation traffic at higher rates than
   expected.
2. **Google formally treats AI-citation manipulation as spam** (Search Engine
   Roundtable, 2026-07-02;
   [source](https://www.seroundtable.com/july-2026-google-webmaster-report-41591.html)).
   Buying or seeding third-party mentions to influence AI Overviews / AI Mode
   citations now falls under existing spam policy. Only earned NZ health/news
   mentions are safe. Item #15's title changed from 'Seed' → 'Earn' to align
   with policy — the 90/10 pattern (real karma, real answers, occasional
   mention) is exactly what the policy still permits.
3. **Google June 2026 spam update completed 2026-06-26** — 2-day rollout
   targeting low-quality directory / link networks. Adjacent, not directly
   actionable for Meridian.
4. **GSC "Search generative AI" performance report expanding beyond UK**
   (2026-07-02;
   [source](https://www.seroundtable.com/july-2026-google-webmaster-report-41591.html)).
   Re-check GSC this week — item #35 is now time-critical.
5. **Google FAQ rich-result tooling removed from GSC + Rich Results Test**
   (June 2026). Underlying FAQPage schema still validates via
   validator.schema.org and can stay in place; any future internal validation
   scripts should point at that instead of the Rich Results Test.
6. **Whitespark 2026 Local Search Ranking Factors** — review recency jumped
   from #93 (2023) to #11 (2026); review signals now ~20% of local-pack weight
   ([Whitespark](https://whitespark.ca/local-search-ranking-factors/)). Rolling
   90-day review count now beats lifetime star average — reinforces #16 and
   #13.
7. **YouTube overtakes Reddit as #1 social AI-citation source**
   ([Adweek](https://www.adweek.com/media/youtube-reddit-ai-search-engine-citations/);
   [Otterly.ai](https://otterly.ai/blog/the-youtube-citation-study-2026/)):
   YouTube ~16% of AI answers, Reddit ~10% overall. Reddit still leads Google
   AI Overviews specifically (~21%). Drives new item #37.
8. **NJ local-health-practice study — 98% of 216 independent practices scored
   zero citations** across ChatGPT / Claude / Gemini
   ([study](https://www.slideshare.net/slideshow/ai-citation-factors-for-local-health-practices-2026/288271981)).
   Fix per the study: complete Organization + LocalBusiness + Person schema
   (Meridian has this), NAP consistency across NZ directories, and Wikidata
   entity presence (Meridian does NOT have this — drives new item #38).
9. ClaudeBot roughly DOUBLED to ~19.8% of AI-bot traffic in June 2026
   (adjacent-window Cloudflare Radar / Similarweb reporting); GPTBot eased to
   ~9.4%; ChatGPT's share of B2B AI referrals fell 72.5% (Jan) → 62.6% (Apr).
10. **AI local packs compressing to 1–2 businesses** (vs the legacy 3-pack's
    three); the 'call' button is being dropped in the AI pack variant. GBP
    completeness, service list detail, hours-open-now, photo recency more
    decisive than 12 months ago.
11. **llms.txt has ZERO effect on Google Search or AI Overviews** per Gary
    Illyes' late-June 2026 restatement — keep Meridian's file for
    ChatGPT/Perplexity value only, do not invest more engineering time.
    Adoption ~5.6% of top-10k domains, so Meridian is still ahead of ~94% of
    comparable sites — a genuine cheap edge.
12. Reddit + HN in-window search returned NO fresh Christchurch allied-health
    discussion — an honest non-promotional answer in the next r/chch or
    r/NewZealand osteo/acupuncture thread would face little competition.

## Punch-list snapshot

| # | Tier | Impact | Effort | Title |
|---|---|---|---|---|
| 12 | 2 | L | S | Add speakable blocks on service intros |
| 13 | 2 | M | M | Auto-fetch Google Business Profile reviews at build time |
| 14 | 3 | H | L | Start a blog (2 posts/month) |
| 15 | 3 | M | M | Earn Reddit / community brand mentions (90/10 rule) |
| 16 | 3 | M | M | Encourage monthly Google reviews nudge |
| 25 | 2 | M | S | Not ranking for 'osteopath acc christchurch' — osteo.co.nz owns it |
| 32 | 2 | M | S | Add /conditions/concussion/ page — Triskelion Concussion Care owns 'concussion osteopath christchurch' |
| 35 | 1 | M | S | Enable Google Search Console Generative AI performance report before opt-out toggle goes live |
| 36 | 2 | M | S | Add /services/acupuncture/cancer-support/ sub-page — no NZ competitor owns 'acupuncture for cancer christchurch' |
| 37 | 2 | H | M | Start a short-form YouTube condition-explainer queue (60–90 sec each) |
| 38 | 2 | M | S | Create a Wikidata entity for Meridian Osteopathy |

## Files updated

- `src/_data/audit.json` — reportDate → 2026-07-03; 3 new items (#36, #37, #38);
  #15 title updated + body extended with the Google spam-policy signal;
  tldr rewritten; #35 marked time-critical.
- `src/_data/auditQueries.json` — lastRun → 2026-07-03; poolSize → 47; 30
  queries re-checked with fresh `lastResult`; 3 queries pruned; 5 new derived
  queries added.
- `reports/ai-search-audit-2026-07-03.md` — this snapshot.
