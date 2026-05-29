# AI Search Audit — 2026-05-29

Weekly AEO/GEO audit for Meridian Osteopathy (meridianosteopathy.co.nz).

## TL;DR

**Shipped this week**

- Nothing. `git log --since="2026-05-22"` shows only last Saturday's
  audit commit (`449056f`). The backlog from last run carries over
  intact: items #12, #13, #14, #15, #16, #25, #32.

**Search visibility — the big move**

- **Meridian climbed two non-aggregator positions on "osteopath vs
  physiotherapist christchurch", from #5 to #3.** New top-3 order
  (excluding the WhoDoYou aggregator at #1):
  `osteopath-halswellclinic.co.nz` → `betterhealthosteopathy.nz` →
  `meridianosteopathy.co.nz` → `alignhc.com.au` →
  `christchurchosteopath.co.nz`. This is the second consecutive run
  Meridian has surfaced in a tracked top-10, and the first time we've
  out-ranked an NZ-side competitor (`christchurchosteopath.co.nz`
  dropped from #4 to #5) on a tracked query. Likely still driven by the
  homepage's broadened title (post-PR #78) + the citation-ready intros
  (post-PR #77) + the apex consolidation (post-PR #73) rather than a
  content-led win — we still don't have a dedicated /osteopath-vs-physio/
  page. Priority bumped to 35 per the ≤3 rank rule.

**New punch-list items**

- **#33 — Add `Claude-SearchBot` + `Claude-Web` allow lines to
  robots.txt.** Cloudflare's late-May 2026 crawler telemetry now shows
  `Claude-SearchBot` as a distinct live-retrieval agent at ~2% share,
  separate from the training-only `ClaudeBot` already in our allow-list.
  Two-line robots.txt change; Tier 1, S effort.
- **#34 — Add a structured 5–7 item list block to every condition
  page.** Search Engine Land's May 2026 analysis of 25,000 AI-cited
  URLs found list-formatted pages (`<ol>` / `<ul>` blocks with
  ~18-word items inside H2/H3 sections) get cited at materially higher
  rates than equivalent prose. Our citation-ready 40–60 word intros
  shipped via PR #77 — a list block ("Common signs", "When to see an
  osteopath", "What to expect") is the natural next-cheapest citation
  hook. Tier 2, S effort.

**Industry signals (past 7 days)**

- **Ahrefs (week of 2026-05-26)** — pages cited in AI Overviews coming
  from the top-10 organic results dropped from 76% (Jul-2025) to **38%**
  in May 2026. Gemini 3's query fan-out now pulls heavily from pages
  ranking 11-100+, which validates the "stay citation-ready even when
  you can't out-rank Better Health" thesis under #31/#77 and reinforces
  why answer-leading intros matter more than head-term rank.
- **Search Engine Journal (week of 2026-05-26)** — Google's consolidated
  GenAI optimisation guide explicitly states `llms.txt` is **not used**
  by AI Overviews / AI Mode; it's now a Lighthouse 13.3 audit only, not
  a ranking signal. The file we already ship has no AEO downside but
  shouldn't carry extra weight in roadmap priority.
- **Cloudflare (week of 2026-05-26)** — `Claude-SearchBot` is now
  publisher-visible as a separate user-agent (training vs. retrieval is
  now a three-way split: `ClaudeBot` for training, `Claude-Web` /
  `anthropic-ai` for Claude.ai user retrieval, `Claude-SearchBot` for AI
  search). Drives new item #33.
- **Search Engine Land (week of 2026-05-26)** — 25k-URL analysis: AI
  search disproportionately cites list-formatted pages, 1,000–2,000
  words, ~18 words/sentence, structured H2/H3s. Drives new item #34.
- **mapranks / icreatebrand (2026-05-25)** — Google is replacing Maps
  Q&A with Gemini-generated answers pulled from GBP + reviews + the
  clinic website. Our prose is now the canonical source for Maps-surface
  answers; the citation-ready first paragraphs (PR #77) are already
  doing the right work here.

**Backlog after this run**

- 9 items pending: #12, #13, #14, #15, #16, #25, #32, #33, #34.
- Tier 1 → **#33** (robots.txt Claude-SearchBot allow).
- Tier 2 → #12, #13, #25, #32, **#34** (listicle blocks on condition
  pages).
- Tier 3 → #14, #15, #16.

**Remaining gaps**

- G7 (no ACC landing — scoped under #25)
- G8 (no blog — scoped under #14)
- G15 (no Reddit / off-site citation strategy — scoped under #15)

## Search visibility — wins/losses vs 2026-05-22

### Wins

- **osteopath vs physiotherapist christchurch** — Meridian moves from
  non-aggregator position 5 to **position 3**. `christchurchosteopath.co.nz`
  (Moorhouse Osteopathic Centre) dropped from #4 to #5. AlignHC stayed
  put. Halswell Clinic's blog post on osteopath-vs-physio-vs-chiro
  remains #1 — they have a dedicated URL targeting this intent, we
  don't, and we're still climbing without one.

### Stability / no movement

- **acupuncture christchurch** — chchacupuncture.co.nz holds #1 again
  (reclaimed last week). Top set unchanged.
- **osteopath christchurch** — same dominant set (Christchurch
  Osteopathic Centre, Moorhouse, Better Health, FRAME, Active Health).
- **osteopath halswell** — Halswell Road Clinic + osteo.co.nz/halswell
  top two unchanged.
- **best osteopath christchurch** — Better Health #1, Cashmere Osteo
  retains #2 (climbed back from #3 last week), Moorhouse Osteopathic
  Centre #3.
- All condition queries (back-pain, neck-pain, sciatica,
  headaches-migraines, pregnancy-back-pain, sports-injury,
  frozen-shoulder, jaw-pain, baby, paediatric) — our condition pages
  (6 of them, oldest now 9 weeks post-ship) still **not visible** in
  any top-10. Cross-links from item #30 are now 19 days post-ship.
  Indexing-lag pattern continues — no movement.
- **osteopath hillmorton** — STILL all UK/non-NZ results
  (sanderstead-osteopaths, fionarobertson.net, longmoreosteopaths.com,
  feetham.com, traditionalosteopathy.com). 19 days post item #29
  (Hillmorton in flowing intro copy on every service page) and Google
  has not re-indexed. **Persistent indexing lag** on suburb-tail
  queries.
- **osteopath wigram** — STILL no NZ clinic owns this. Same hollow-SERP
  pattern: health4you aggregator + UK / US bleed.
- **osteopath addington** — STILL UK-only NZ-side. Same hollow.

### Losses

- None this run.

### First-time checks

- All three queries added last run (post-concussion, lower-back-pain,
  tennis-elbow) got their first checks this run. None ranked.
  - **post concussion osteopath christchurch** — same Triskelion +
    Better Health + Halswell + Moorhouse pattern as the parent
    concussion query. Russell Johns, Anastasia McPherson, Melanie Lous
    all named.
  - **lower back pain christchurch** — Better Health back-pain pages
    dominate; physiosouth, fixedphysio, headachetendon, halswell-clinic
    fill the rest. NZ-side osteo + physio split.
  - **tennis elbow osteopath christchurch** — Better Health has TWO
    URL variants in the top 10 (`/resources/osteopathic-treatment-of-tennis-elbow-pain-osteopath-christchurch/`
    AND `/conditions/elbow-pain/`). MK Osteopathy's blog post also
    ranks. Standard "dedicated page wins" pattern.

### Notable observations

- **Better Health's URL portfolio** is the structural lesson of this
  audit: they own multiple ranking URLs for the same condition
  (`/conditions/X/`, `/X-pain-relief-osteopath-christchurch/`,
  `/resources/...`, `/help-my-X-hurts/`) and consistently surface 2-3
  variants in any single condition's top-10. That's what an "X
  treatment Christchurch" page strategy looks like at maturity —
  worth keeping in mind for the post-#14 blog roadmap.
- **Triskelion Concussion Care** still owns concussion + post-concussion
  on single-condition-specialist-site authority (#32 still applies).

## Self-expansion

Three queries added this run, all `source: derived` (autocomplete
endpoint is still blocked by the routine host egress allowlist — confirmed
again via curl this run):

- **rotator cuff osteopath christchurch** — surfaced naturally inside
  the shoulder-pain / frozen-shoulder SERPs (Better Health has a
  dedicated `/osteopathic-treatment-of-rotator-cuff-shoulder-injuries/`
  URL).
- **postnatal osteopath christchurch** — natural pairing with the
  pregnancy-osteopath query we already track; Better Health has a
  dedicated postnatal mention, multiple competitors target it.
- **chiropractor vs osteopath christchurch** — extension of this
  run's biggest movement (osteopath-vs-physio). Halswell Clinic's
  ranking blog post specifically targets osteopath-vs-chiropractor-vs-physio
  as a single piece; tracks whether our homepage continues to surface
  on comparison-intent queries.

Pool size after additions: **44** (cap 50). No prunes this run — three
queries (tmj, acupuncture-for-ivf, cranial-osteopath) hit their **second
consecutive run** below priority 20; if they stay below 20 next run
they become prune candidates.

## Decision support — what to ship next

If Nina has 30 min this week:
- **Item #33** (robots.txt Claude-SearchBot allow). Two lines, ~5 min
  to ship. Low blast radius, immediate safeguard for Claude.ai
  citation traffic.

If Nina has 2 hours this week:
- **Item #34** (listicle blocks on condition pages). Six condition
  pages × one 5-7 bullet `<ul>` block per page. Pairs naturally with
  the citation-ready intros already in place.

If Nina has a half-day this week:
- **Item #25** (`/acc/` landing page, ~500 words). Closes the
  remaining structural piece of G7 and creates one indexable URL
  targeting "osteopath acc christchurch" — `osteo.co.nz` still owns
  that slot, and the same pattern reinforces "acupuncture acc
  christchurch" where `thehouseofacupuncture.co.nz/our-services/acc-acupuncture-chistchurch`
  has the dedicated slot too.

If Nina has a weekend:
- **Item #32** (`/conditions/concussion/` page, mirroring the existing
  condition-page pattern). Triskelion Concussion Care still owns
  "concussion osteopath christchurch" on dedicated-site authority.
  Concussion overlaps directly with the headache/migraine + neck-pain
  conditions we already treat, so this is content-adjacent rather than
  net-new.
