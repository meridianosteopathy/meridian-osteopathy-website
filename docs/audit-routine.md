# Weekly search audit — routine instructions

This file is the source of truth for the **Meridian Weekly Audit** routine. The routine's prompt at [claude.ai/code/routines](https://claude.ai/code/routines) is a short pointer to this file (see [audit-dashboard-setup.md](audit-dashboard-setup.md) §3), so changing how the audit works is a normal reviewed PR, not a copy-paste into claude.ai.

Clinic-specific settings live in `src/_data/auditConfig.json` (domain, brand terms, thresholds, digest recipient). Keep new logic generic and put anything clinic-specific there, so the audit can be pointed at another site by editing that file.

## Who reads this output

A clinic owner, not an SEO specialist. The main goal is to **rank higher on Google**, because that brings bookings. Every recommendation has to answer three questions: *who does it*, *why we think it will work*, and *what the clinic's own data says*.

Rules for everything you write:

- **Plain English.** No SERP / AEO / GEO / schema / "priority = min(…)" in `summary`, `topActions`, item titles or `why`. If a technical term is unavoidable, explain it in a few words.
- **Real data beats estimates.** Search Console numbers (step 2) come from Google. The web-search ranks (step 3) are estimates from a US-based search tool, not what someone in Christchurch sees, and they don't include Google Maps. Label them "estimated".
- **Honest confidence.** Never call something proven because of one week's estimated rank.
- **Fewer, better items.** Industry news is context, not a reason on its own to add an item.
- **Copy rules in `CLAUDE.md` apply** to everything you write (no "GP" / "GP referral", no "at no extra charge", and so on).

## Steps

### 1. Read current state

- `src/_data/audit.json`, `src/_data/auditQueries.json`, `src/_data/auditConfig.json`
- `git log --since=<audit.meta.reportDate> --oneline` on `main`, to see what shipped since the last run.

### 2. Google data (Search Console)

Fetch `https://<auditConfig.site.domain>/admin/audit/gsc.json` with `curl -sS`. It's baked in at build time by `src/_data/gsc.js`.

- If `connected: true`, this is the source of truth for the week: `totals`, `nonBranded` (clicks from people who didn't search the clinic's name), `page1`, `closestWins` (searches at positions 4–20 that people already see), `pages` and `queries`, each with the previous 28 days for comparison.
- If `connected: false`, or the fetch is blocked by the routine's network settings, carry on with estimates only. Say in the report, in one line, that Google data was unavailable and why. Don't retry in a loop.

### 3. Estimated rankings (web-search spot-check)

For queries in `auditQueries.pool`:

1. **Always check every query with `"core": true`.** Then check the highest-priority remaining queries, up to 30 checks in total.
2. Web-search each query and write `lastResult` = `{ date, meridianRank, topDomains, notes }`:
   - `meridianRank`: 1-based position of the site domain in the results, or `0` if absent.
   - `topDomains`: up to 5 unique non-directory domains in order, stripped to the root domain.
   - `notes`: one short sentence only if something stands out; otherwise omit.
3. Autocomplete: `GET https://suggestqueries.google.com/complete/search?client=firefox&q=<query>`. Take up to 2 new, non-duplicate suggestions per query as `{ q, source: "autocomplete", priority: 50, addedAt }`. If the request is blocked, skip it quietly and don't mention it in the summary.
4. If Google data is connected, you may also add up to 2 queries from `closestWins` that aren't in the pool yet, as `{ q, source: "search-console", priority: 60, addedAt }`.
5. Priority: rank ≤ 3 → `min(100, priority + 5)`; rank 4–10 → unchanged; not in the top 10 → `max(0, priority − 10)`.
6. Prune queries whose priority has been under 20 for 3 runs, then cap the pool at `meta.maxPool`, dropping the lowest priority first. **Never prune or demote a `core` query.** Add at most `meta.maxNewPerRun` new queries per run.
7. If the pool falls below 20 entries, re-seed from `services.json` and `team.json` special interests × the suburbs in `auditConfig`.

### 4. Industry signals (keep it short)

Scan the last 7 days of Google Search Central, Search Engine Land, Search Engine Journal, and Whitespark / BrightLocal (local search). Keep at most 3 signals, and only ones that change what a local NZ allied-health clinic should do. Put them in the report, not in `summary`.

### 5. Recommendations (`audit.json` → `items`)

- **Numbers are permanent.** Decisions in Netlify Blobs are keyed by `n`. Never renumber. A new item gets `max(n) + 1`, and a removed item's number is never reused.
- Remove an item only when `git log` or `grep` confirms it shipped, and add a one-line note to `alreadyShipped`.
- Add **at most 3** new items per run. Prefer items backed by `closestWins`. For example: *"Move up for 'sciatica osteopath christchurch' (now #9)"*, improving the page that already ranks. If a core query has no Meridian page at all, a new-page item is also fair.
- Every item has these fields:

| Field | What goes in it |
|---|---|
| `n`, `tier`, `impact`, `effort`, `files`, `addresses`, `firstSeen` | As before. |
| `title` | Plain English, ≤ 90 characters. |
| `owner` | `"claude"`: Claude can do it without clinical input (titles, descriptions, headings, internal links, technical fixes). `"practitioner"`: Claude drafts it, but a practitioner must check clinical accuracy (new or changed clinical claims, condition / treatment content, ACC wording). `"you"`: the clinic owner has to act outside the website (Search Console, Google Business Profile, reviews, accounts, anything paid). |
| `reviewer` | Only for `practitioner` items. The practitioner whose `team.json` `specialInterests` / `treats` best match the topic. If nobody lists it, use the clinic owner and say in `why` to confirm someone treats it before building. |
| `confidence` | `"proven"`: Search Console shows this kind of change already worked on this site (for example, comparable pages gained clicks after they shipped). `"likely"`: solid evidence elsewhere, or estimated ranks point that way. `"experimental"`: weak or mixed evidence. |
| `why` | 1–2 plain sentences the clinic owner can judge, including the single most relevant number. |
| `matchTerms` | 1–3 short words the dashboard uses to pull live Search Console evidence (for example `["acc"]` or `["postpartum", "postnatal"]`). Use `[]` for items that aren't about a search topic. |
| `body` | The details, **≤ 120 words, describing the current state**. Rewrite it instead of appending dated notes, because the history lives in `reports/`. |

### 6. "This week" (`audit.json`)

- `summary`: 1–3 short sentences covering the most important change since the last run (win or loss), the most urgent gap, and progress on shipping. Use Search Console numbers when connected and say "estimated" for web-search ranks.
- `topActions`: exactly 3 × `{ text, owner, n }` (`n` is `null` if the action isn't a numbered item), ordered by expected effect on Google ranking. Each `text` says what to do and who does it, in ≤ 30 words.
- `tldr`: the detailed notes, at most 3 paragraphs of ≤ 150 words each. These are shown folded away on the dashboard.
- `meta.reportDate` and `meta.lastUpdated` = today. Keep `meta.schemaVersion` at 2.

### 7. Query pool (`auditQueries.json`)

Write the updated pool and set `meta.lastRun` and `meta.poolSize`. Keep the file's one-line-per-query layout.

### 8. Report (`reports/ai-search-audit-YYYY-MM-DD.md`)

Lead with the summary and top 3 actions. Then add Google data (if connected: headline numbers and closest wins), estimated rankings (wins and losses since the last run), industry signals (≤ 3) and the recommendations table with owner and confidence. Keep it under ~150 lines, with no priority arithmetic.

### 9. Check, then commit

1. `npm ci` (a fresh checkout has no `node_modules`), then `npm test`. The tests also run `scripts/audit/check-audit-data.js`, which validates the fields above, unique item numbers and core queries.
2. `npm run build`. It must succeed.
3. Commit the three files to `main` as `Weekly audit — N new items, M shipped, K searches checked (YYYY-MM-DD)` and push.

The Saturday digest email is sent by a Netlify scheduled function (`netlify.toml`), so don't call it. It also warns the clinic owner if this routine hasn't run for more than `auditConfig.digest.staleAfterDays` days.
