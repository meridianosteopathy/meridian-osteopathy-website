# Weekly AI-Search Audit — 2026-06-26

## TL;DR

- **Nothing shipped against the AI-search backlog since 2026-06-05.** Three weeks of commits (PRs #100, #103, #104, #105) were profile / privacy / promotion housekeeping — Jonathan promoted to Senior Osteopath, his personal website linked, IPP3A indirect-collection privacy notices, Min Jin's profile updated. None touched the punch list.
- **Backlog after this run: 10 items.** Tier 1: #35 (GSC AI report). Tier 2: #12, #13, #25, #32, plus two new — **#36** (osteopath-vs-physio-vs-chiropractor comparison URL) and **#37** (three acupuncture condition sub-pages for Min Jin's special interests). Tier 3: #14 (blog), #15 (Reddit), #16 (review nudge).
- **Search visibility: meridianosteopathy.co.nz absent from the top 10 across all 30 queries checked today.** Standard -10 priority decay applied.

## Search visibility

### First checks completed for the 5 derived queries added last run

| Query | Result | Drives |
|---|---|---|
| acupuncture for endometriosis christchurch | Burwood Acupuncture's `/blog/endometriosis-christchurch-fertility-support` #1; The House of Acupuncture's `/acupuncture-endometriosis-period-pelvic-pain` #2-3 | Item **#37** |
| acupuncture for pcos christchurch | The House of Acupuncture's `/our-services/womens-health-acupuncture` #1; vitalis.co.nz/pcos #3 (PCOS-specific URL on a wider-NZ site is enough to break in) | Item **#37** |
| acupuncture for cancer christchurch | **NO Christchurch acupuncturist owns this.** Top result is fredhutch.org (Seattle). Genuine green-field for Min Jin's post-cancer supportive-care positioning. | Item **#37** |
| headaches osteopath christchurch | Better Health `/headaches/` #1, osteopath-christchurch.com still owns the blog-velocity tag URLs (cranial-osteopathy-for-migraines + idiopathic-migraines / post-concussion-migraines tags) | Item **#14** |
| post concussion syndrome christchurch | Dominated by primary concussion-rehab providers (Laura Fergusson Brain Injury Trust, Concussion Care NZ, ACC operational guidelines, Habit Health, Axis Sports Medicine, TBI Health) — **NOT osteopaths.** Different intent than 'post concussion osteopath christchurch'. Item #32 (/conditions/concussion/) would not capture this. | Scope note on #32 |

### Wins / losses vs last run

- **NEW competitor entry** — `performanceplusphysiochch.co.nz` launched `/osteopath-addington-christchurch/`, the first NZ-side site to claim Addington-suburb-osteopath intent. Now surfaces on both 'osteopath addington' and 'sports injury osteopath christchurch'.
- **Leadership rotation on 'osteopath christchurch'** — Moorhouse (christchurchosteopath.co.nz) moved to #1, displacing Better Health from top.
- **Leadership rotation on 'best osteopath christchurch'** — chchosteopaths.co.nz moved to #1 (vs Better Health #1 last run).
- **'osteopath vs physiotherapist christchurch' regression continues** — third consecutive run Meridian not in top 10. Halswell Clinic's comparison post no longer surfaces; Better Health now holds the top two with root + /faqs/.
- **'concussion osteopath christchurch' tail expanding** — healthwithin.co.nz/blog/concussion-osteopath-treatment newly surfaces, adding pressure on Item #32.
- All shipped pages still not yet indexed-and-ranked: /conditions/back-pain/ (11+ wks), /conditions/neck-pain/ (10+ wks), /conditions/sports-injury-recovery/ (12+ wks), /services/acupuncture/fertility/ (8+ wks), Acupuncture & Dry Needling rename (~6 wks).

### Pool changes

- **2 queries added** (pool 46/50): `tcm acupuncture christchurch`, `acupuncture for menstrual pain christchurch`.
- **1 query pruned**: `headaches migraines osteopath christchurch` (priority 0 for ≥3 runs, redundant after the cleaner `headaches osteopath christchurch` split was added 2026-06-05).
- Autocomplete (suggestqueries.google.com) STILL blocked by routine host egress (HTTPS 403 CONNECT tunnel failed). Durable fix = widen the routine egress allowlist.

## Industry signals (week of 2026-06-19 → 2026-06-26)

1. **Two new fast-moving signals reinforce item #14 (blog) over item #12 (speakable/schema):**
   - **searchVIU real-time fetch experiment** confirmed all five major AI systems (ChatGPT, Claude, Perplexity, Gemini, Google AI Mode) extract only VISIBLE HTML when fetching pages. JSON-LD, hidden Microdata, hidden RDFa are all ignored at fetch time.
   - Combined with the **Ahrefs schema-impact study** (1,885 pages adding JSON-LD vs 4,000 controls — no meaningful citation uplift), structured data is now confirmed to be a B2A signalling layer for crawlers, NOT a citation lever. Visible content does the work.
   - Our 40–60 word citation-ready answers (item #31, shipped 2026-05-17) sit on the right side of this finding — they're visible, not buried in JSON-LD.

2. **Ahrefs 17M-citation study (week of 2026-06):** AI assistants cite content 25.7% fresher than Google organic (1064 days avg cited URL age vs 1432 days organic). ChatGPT cites the newest pages most aggressively — 76.4% of its top-cited pages updated within 30 days.

3. **Reddit citation share stabilising at 40.1%** across 150k AI answers (LLM Pulse, week of 2026-06). 46.7% on Perplexity (highest of any platform), 12% on ChatGPT US. **Reddit launched AI-powered ad tools on 2026-06-22** tapping its 25 billion posts/comments — commercial maturation of the same surface ClaudeBot/GPTBot/PerplexityBot crawl. Volatility caveat: Reddit's ChatGPT citation share dropped from ~60% → ~10% in Sept 2025 before recovering; treat as part of a diversified portfolio. Reinforces Item #15.

4. **GBP review-recency now compounds across two surfaces:** Google auto-summarises review themes in the local pack (the AI synthesises a 'customers consistently mention…' overview); Gemini draws review keywords/sentiment to decide which businesses to RECOMMEND in AI Overview answers. 2026 algorithm shift emphasises recency + velocity over raw total — reviews older than 18 months 'carry diminishing weight'. Reinforces #13 and #16.

5. **GSC Generative AI report opt-out toggle took effect 2026-06-17** (item #35's deadline). Sites remain opted IN by default, but admins can disable AI-surface reporting per-property. Report is rolling out UK-first; NZ access not announced yet. Item #35's verify-and-baseline action is still open.

6. **Google clarified its search-spam policies apply to AI search features** (Search Engine Roundtable June 2026 webmaster report) — warned against buying/manipulating citations. Keeps any Reddit-style seeding strategy (#15) strictly 90/10 non-promotional. Also notable: Google dropped FAQ rich results from SERPs around the same time — our FAQPage schema is still useful for AI parsing per the schema-as-signalling finding above, but rich-result CTR uplift from it is gone.

7. **Search Engine Land 2026-06:** AI Overviews appear in 50% of search results where enterprise B2B brands rank, but median enterprise brand is cited in only 3% of those Overviews. Content depth and freshness the gap, not rank. Reinforces #14.

## Backlog after this run

| # | Tier | Impact | Effort | Title |
|---|---|---|---|---|
| 35 | 1 | M | S | Enable Google Search Console Generative AI performance report (verify, screenshot baseline) |
| 12 | 2 | L | S | Speakable blocks on service intros (LOW impact confirmed; do not over-prioritise) |
| 13 | 2 | M | M | Auto-fetch GBP reviews at build time |
| 25 | 2 | M | S | /acc/ landing page |
| 32 | 2 | M | S | /conditions/concussion/ page |
| **36** | **2** | **M** | **S** | **/resources/osteopath-vs-physio-vs-chiropractor/ comparison URL (NEW)** |
| **37** | **2** | **M** | **M** | **Three /services/acupuncture/{endometriosis,pcos,post-cancer-supportive-care}/ sub-pages (NEW)** |
| 14 | 3 | H | L | Start a blog — strongest case yet (four converging studies) |
| 15 | 3 | M | M | Seed Reddit / community brand mentions |
| 16 | 3 | M | M | Monthly Google reviews nudge |
