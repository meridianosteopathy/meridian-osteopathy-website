# AI Search Audit — 2026-06-19

Run date: 2026-06-19 (Friday before the Saturday digest)
Pool: 45 queries (cap 50)
Backlog: 8 items pending (#12, #13, #14, #15, #16, #25, #32, #35)

## Shipped since last run (2026-06-05)

Nothing that closes an audit item. Only PR #100 merged in the 14-day window — a content link from Jonathan Hu's profile card to his personal practitioner website. No audit gaps addressed.

## Search visibility — wins / losses vs last run

### Notable competitive move

**'osteopath addington' SERP has tightened — a new NZ competitor took #1.**
Performance Plus Physio Christchurch's dedicated `/osteopath-addington-christchurch/` URL is now the top result. The previous 4 runs were UK-only hollow (sanderstead-osteopaths.co.uk, fresha.com, JM Osteo etc.). This is the same suburb-specific dedicated-URL pattern we keep observing in other queries — Halswell Clinic for vs-physio, House of Acupuncture for ACC, Better Health for vs-chiropractor. Item #29 (Wigram / Addington / etc. in flowing intro copy on every service page) shipped 40+ days ago and did not move the needle on the suburb queries; a NZ rival has now executed the pattern that does work and claimed the slot. Performance Plus also now appears at #2 in the 'sports injury osteopath christchurch' SERP.

### AI-summary entity shift

**'paediatric osteopath christchurch' no longer names Nina Hu in the AI summary.**
Last run, the AI summary explicitly named Nina Hu with her @meridianosteopathy.co.nz email and 02108655151 phone number (even though our URL didn't rank — the entity link ran via happyspine.co.nz). This run, the AI summary names Alix Ramousse (Better Health's paediatric specialist) instead. This is expected SERP volatility per the Ahrefs week-of-2026-05 study (54.5% URL overlap between consecutive AI Overview responses) rather than a structural loss.

### SERP shake-ups

- **'osteopath vs physiotherapist christchurch'** — Halswell's `/blog/osteopath-vs-physio-vs-chiro/` post (the long-standing #1 non-aggregator) is no longer in the visible top 10. Replaced by Australian dedicated-comparison URLs (13thbeachhealthservices.com.au, alignhc.com.au) and Better Health's homepage. Meridian still not visible.
- **'lower back pain christchurch'** — shifted from osteo-dominant to mixed osteo+physio+chiro+sports-clinic. Halswell's `/how-we-can-help/back-and-neck-pain/` is now #1; Four Physio newly surfaces in top 5; headachetendon.nz chiropractor blog still in top 10.
- **'concussion osteopath christchurch'** — osteo.co.nz/concussion/ took #1 from Triskelion Concussion Care.
- **'post concussion osteopath christchurch'** — christchurch-osteopathy-acupuncture.co.nz's cranialosteopathy URL is now the new leader (was outside top 5 last run).

### First-time checks for queries added last run

| Query | First-check result |
| --- | --- |
| acupuncture for endometriosis christchurch | Burwood Acupuncture's dedicated `/blog/endometriosis-christchurch-fertility-support` at #1; House of Acupuncture has 2 URL variants (one is `/acupuncture-endometriosis-period-pelvic-pain`). Min Jin's PR #98 content too recent to expect movement. |
| acupuncture for pcos christchurch | House of Acupuncture dominates with 4 URLs; Vitalis (Auckland) `/pcos` at #2. No Christchurch competitor has a PCOS-only dedicated page. |
| acupuncture for cancer christchurch | Koru Healing #1 with an ACC-subsidised acupuncture page that mentions cancer. Field is fragmented — no entrenched NZ winner. Min Jin's PR #98 post-cancer supportive care content faces tractable competition here. |
| headaches osteopath christchurch | Better Health's `/headaches/` at #1; Shelley Joe #3. Same blog-velocity pattern as the migraines combo we just pruned. |
| post concussion syndrome christchurch | Completely different competitor set than 'post concussion osteopath christchurch' — medical/specialist clinics (headachetendon.nz Concussion Clinic CFR, migraineclinic.co.nz, Axis Sports Medicine). Item #32 (concussion page) would target both SERPs from different angles. |

### Pool changes

**Pruned (2):**
- `acupuncture vs dry needling` — purely informational query, US authority sites dominant, no realistic ranking path. PR #78's FAQ entry on acupuncture-vs-dry-needling still not picked up at 33 days.
- `headaches migraines osteopath christchurch` — replaced by the cleaner `headaches osteopath christchurch` added last run.

**Added (2, derived):**
- `acupuncture for period pain christchurch` — tests Min Jin's dysmenorrhoea focus from PR #98.
- `sciatica christchurch` — broader non-osteo variant; tests whether our `/conditions/sciatica/` page can surface on the shorter higher-volume query.

**Autocomplete:** still blocked by routine host egress allowlist (HTTP 403 confirmed via curl). Workaround: derived-query expansion continues to substitute.

**Priorities:** standard -10 decay applied across all 30 queries below top 10. Pool size 45/50.

## Industry signals (week of 2026-06-12 → 2026-06-19)

1. **Google Search Console Gen AI performance report rollout is regional.**
   The reports + opt-out toggle started rolling out to a subset of UK website owners first ahead of a global release; NZ-region availability is not yet confirmed. The report shows impressions, pages, countries, devices and dates only — no clicks, no CTR, no traffic. Reinforces #35 — the verification work (does Meridian have admin access, is the opt-in toggle ON when the report reaches NZ) still needs doing.

2. **Reddit citation share has hardened.**
   - 21% of all Google AI Overview citations (single most cited domain on AIO).
   - 46.5% of Perplexity citations (stable).
   - #2 on ChatGPT behind only Wikipedia.
   - 23.6M Reddit pages cited in AI responses, appearing in 92.8% of all AI search opportunities (ZipTie + Frase June 2026).
   Reinforces #15.

3. **Healthcare AEO/GEO benchmark data (Conductor + Contently June 2026).**
   - AI search visits grew 42.8% YoY (Q1 2025 → Q1 2026 from 15.6B → 27.4B).
   - Mayo Clinic dominates with 14.1% AI visibility score and 3.4% share of voice; Cleveland Clinic and Johns Hopkins follow.
   - The single most-overlooked GEO lever for healthcare is **co-citation** — appearing alongside trusted medical entities across multiple independent sources, not schema markup. Reinforces #14 (named-clinician blog) and #15 (off-site community presence).

4. **Schema-validation outlook (DigitalApplied + Stackmatix June 2026).**
   Google's March 2026 internal documentation still treats structured data quality as ONE input alongside PageRank + freshness + relevance — not a dominant lever. Late-2026 outlook is that AI systems will cross-reference schema claims against live sources and penalize inaccurate schema rather than ignore it. Reinforces last week's Ahrefs schema-impact finding — do not keep stacking schema for its own sake; keep what we have accurate.

5. **Anthropic side-note: Claude web search policy change.**
   Organisations using Claude via API will need to actively allow web search by end of June 2026; default-deny enforcement from July 2026. Not actionable on our site (it concerns Anthropic API admin, not website owners), but it's worth knowing that ClaudeBot crawl and Claude.ai-citation traffic are increasingly governed by org-level access rules.

## Punch list (priorities)

| # | Tier | Title | Status |
| --- | --- | --- | --- |
| 35 | 1 | Enable Google Search Console Generative AI performance report when NZ region gets coverage | Verification work pending; rollout regional |
| 12 | 2 | Add schema.org speakable blocks on service intros | Pending |
| 13 | 2 | Auto-fetch GBP reviews at build time | Pending |
| 25 | 2 | `/acc/` landing page (osteo.co.nz / activehealth.co.nz / thehouseofacupuncture.co.nz own ACC slots) | Pending |
| 32 | 2 | `/conditions/concussion/` page (Triskelion Concussion Care + Better Health + Moorhouse own concussion slots) | Pending |
| 14 | 3 | Start a blog (2 posts/month) | Pending — strongest case yet given Performance Plus precedent + healthcare benchmark data |
| 15 | 3 | Seed Reddit / community brand mentions | Pending — Reddit now 21% of AIO citations |
| 16 | 3 | Monthly Google reviews nudge | Pending |

## Backlog signal

No new punch-list items added this run. None of the existing items have been implemented since 2026-06-05. The strongest recommendations remain:

1. **#14 (blog)** — Performance Plus Physio's Addington slot capture is the freshest proof point that the dedicated-URL + content-depth pattern works for NZ-side competitors who execute it. With /admin CMS coverage filled (PR #91), the editorial path is shorter than it has been.
2. **#15 (Reddit / co-citation)** — Reddit at 21% of AIO citations is the single highest-leverage off-site signal we are not investing in.
3. **#35 (GSC Gen AI report)** — verification work is cheap and unlocks first-party measurement we don't currently have.
