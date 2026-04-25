# AI search audit — setup checklist

One-time setup for the weekly audit dashboard at `audit.meridianosteopathy.co.nz`. Everything should take 15–20 minutes end to end.

## What you're setting up

| Piece | Where it lives |
|---|---|
| Dashboard UI | `/admin/audit/` (rewritten to `audit.meridianosteopathy.co.nz/`) |
| Decisions storage | Netlify Blobs — automatic, no setup |
| Weekly report generation | Claude routine at [claude.ai/code/routines](https://claude.ai/code/routines) |
| Saturday email digest | `netlify/functions/audit-send-digest.js` — runs on a Netlify schedule (Sat 22:00 UTC) |

## 1. Check / add Netlify environment variables

Go to **Netlify → meridian-osteopathy → Site configuration → Environment variables** and make sure these exist. Add any that are missing.

| Variable | Needed for | How to get it |
|---|---|---|
| `RESEND_API_KEY` | Email digest (and existing forms) | Already there if the referral/careers form emails work. Otherwise create at [resend.com/api-keys](https://resend.com/api-keys). |
| `AUDIT_DIGEST_TOKEN` | Protects the digest endpoint so only your routine can trigger it | Generate a random string: `openssl rand -hex 32` or any long random string you make up. Save this value — you'll paste it into the routine in step 3. |
| `AUDIT_DIGEST_TO` | *(optional)* Override digest recipient | Default is `nina@meridianosteopathy.co.nz`. Only set this if you want a different recipient. |

Netlify will redeploy automatically when you add/change env vars.

## 2. Point `audit.meridianosteopathy.co.nz` at the site

**At your DNS provider** (whoever you bought the domain through, or wherever you verified the Resend records):

- Add a `CNAME` record
- Name/Host: `audit`
- Value/Target: `meridian-osteopathy.netlify.app`
- TTL: default (usually 3600)

**In Netlify:**

1. Netlify → `meridian-osteopathy` → **Domain management**
2. **Add a domain** → type `audit.meridianosteopathy.co.nz` → **Verify** → **Add**
3. Netlify auto-provisions a Let's Encrypt certificate. Allow 5–15 minutes for DNS propagation + cert.

After that's live, `audit.meridianosteopathy.co.nz/` will serve the dashboard (the rewrite rule in `netlify.toml` handles this automatically).

## 3. Create the weekly Claude routine

Go to [claude.ai/code/routines](https://claude.ai/code/routines) and sign in with the same account that holds your Max subscription.

1. Click **New routine**
2. **Name**: `Meridian weekly audit`
3. **Repositories**: add `meridianosteopathy/meridian-osteopathy-website`. Enable **Allow unrestricted branch pushes** (the routine commits the refreshed `audit.json` directly to `main` so the dashboard updates without a PR to merge).
4. **Environment**:
    - Use the **Default** environment.
    - Add these environment variables under the routine's environment settings (these give the routine the secret it needs to hit the digest endpoint):
      - `AUDIT_DIGEST_TOKEN` = *same value you set in step 1*
5. **Trigger**: Schedule → **Weekly** → Saturday → 09:00 (your local zone, NZ time)
6. **Prompt**: paste the block below verbatim.

```
You are the weekly AI-search-audit producer for Meridian Osteopathy
(https://meridianosteopathy.co.nz). The previous audit data lives in
src/_data/audit.json; the live-search query pool lives in
src/_data/auditQueries.json; the dashboard at
audit.meridianosteopathy.co.nz reads both.

Do this in order:

1. Read src/_data/audit.json AND src/_data/auditQueries.json for
   current state.

2. Research the last 7 days of community + industry signals on AEO / GEO
   for local healthcare businesses. Look at Reddit (r/SEO, r/juststart,
   r/AskMarketing, healthcare threads), HackerNews, Search Engine Land,
   Ahrefs blog, Search Engine Journal, SEMrush blog, and any
   schema.org / llms.txt / AI-crawler development announcements. Focus
   on signals relevant to an osteopathy / multi-disciplinary allied-health
   clinic in New Zealand.

3. SEARCH VISIBILITY — for every query in auditQueries.pool (process the
   top 30 by priority if the pool is larger):
   a. Web-search the query.
   b. From the results, record into that query object as a `lastResult`
      with fields {date, meridianRank, topDomains, notes}:
      - date: today, ISO-8601.
      - meridianRank: 1-based position of meridianosteopathy.co.nz in
        the results. Use 0 if not present in the visible results.
      - topDomains: up to 5 unique non-aggregator ranking domains in
        order. Strip subdomains to root (e.g. `m.example.com` →
        `example.com`).
      - notes: one short sentence if there's a standout observation
        (AI Overview mentioned Meridian, a new competitor appeared,
        position shifted ≥ 5 spots since last run, etc.). Skip if
        nothing notable.
   c. Also fetch Google autocomplete for each query:
        GET https://suggestqueries.google.com/complete/search?client=firefox&q=<query>
      Take up to 2 suggestions that aren't in the pool and aren't near-
      duplicates of existing entries. If accepted, add each with:
      {q, source: "autocomplete", priority: 50, addedAt: today}.
   d. Update priority per query:
      - If Meridian rank ≤ 3: priority = min(100, priority + 5)
      - If Meridian rank 4–10: keep priority
      - If Meridian not in top 10: priority = max(0, priority - 10)
   e. Demote & prune:
      - Any query with priority < 20 for the past 3 runs → remove.
      - Cap the pool at auditQueries.meta.maxPool (default 50).
        Drop lowest-priority first.
   f. Respect auditQueries.meta.maxNewPerRun (default 5) — do not add
      more than that many new queries in a single run.

4. IF the pool has fewer than 20 entries, regenerate seeds from content:
   - Read src/_data/services.json `specialties[].title`, `services.*.intro`.
   - Read src/_data/team.json `*.specialInterests` — extract condition
     phrases.
   - Cross-product with suburbs: Christchurch, Halswell, Addington,
     Sydenham, Wigram, Hillmorton.
   - Add 10–15 of the most natural-sounding queries.

5. Audit the current repo against industry findings from step 2. Check
   for new gaps, confirm existing gaps still apply, and look for items
   that may now be implemented (see git log for items shipped since
   last run).

6. Update src/_data/audit.json:
   - Increment meta.reportDate to today.
   - Add any new punch-list items at the end, with a firstSeen = today.
   - Remove items that have been implemented (check git diff / grep the
     relevant source files to confirm — do not remove based on guesswork).
   - For each query with meridianRank > 10 OR absent AND priority ≥ 60,
     if no existing punch-list item addresses it, add one:
       - title: "Not ranking for '<query>' — [top competitor] owns it"
       - body: describe the gap + recommend the smallest content fix
       - tier: 2 (unless the content effort is clearly small, then 1)
       - impact: H if priority ≥ 80, M otherwise
       - effort: S if a page exists to tweak, L if a new page is needed
       - addresses: ["G16"] (the search-visibility gap) + any topical gap
   - Update tldr and gaps sections if the search-visibility data reveals
     something material.
   - Keep existing item numbers stable so decisions in Netlify Blobs
     stay aligned.

7. Update src/_data/auditQueries.json:
   - Write the updated pool (with lastResult entries, priority changes,
     new autocomplete entries).
   - Update meta.lastRun to today and meta.poolSize.

8. Save a markdown snapshot to reports/ai-search-audit-YYYY-MM-DD.md so
   there is a human-readable historical archive. Include a "Search
   visibility" section summarising wins/losses vs last run.

9. Commit all three files to main with a message like:
   "Weekly audit — N new items, M shipped, K queries checked (YYYY-MM-DD)"

The Saturday digest email is sent automatically by a Netlify scheduled
function (configured in netlify.toml — runs Saturday 22:00 UTC / Sunday
morning NZ). The routine does NOT need to call out to send it. The
manual POST endpoint with AUDIT_DIGEST_TOKEN remains available for
testing or as a fallback if the schedule is paused.

Be rigorous about step 6 — wrong item numbers break stored decisions.
When in doubt, add new items rather than renumbering.
```

7. Click **Create**. Optionally click **Run now** to test-fire it immediately.

## 4. Verify

- Open `https://audit.meridianosteopathy.co.nz/` — you should see the dashboard with 16 items.
- Click Approve on any item. Reload. The decision should persist (it's in Netlify Blobs, shared across devices).
- Manually trigger the routine via **Run now**. It should:
  - Push an updated `audit.json` to `main`
  - Send you a digest email within 2–3 minutes
- Check your inbox — you should receive an email titled something like *"Meridian weekly audit — N new, M approved, K Tier 1 pending"*.

## 5. Optional — set up the "Ship it" button (one-click implementation)

The dashboard has a **🚀 Ship it** button on every approved item. Clicking it triggers a *second* Claude routine — an API-triggered one — that implements just that single item on a fresh `claude/ship-N-*` branch and opens a draft PR. If you want this working, do the following once.

### a) Create the ship-it routine

Go to [claude.ai/code/routines](https://claude.ai/code/routines) → **New routine**.

- **Name**: `Meridian audit — Ship it`
- **Repositories**: add `meridianosteopathy/meridian-osteopathy-website`. Leave **Allow unrestricted branch pushes** *off* — the routine should only push to `claude/*` branches and open a PR, not push straight to `main`.
- **Environment**: the same `Meridian audit` environment you created for the weekly routine is fine (no new env vars needed for this routine).
- **Trigger**: Schedule → **Skip**. Then **Add another trigger** → **API**. Save the routine first, then come back to copy the URL and generate a token.
- **Prompt**: paste verbatim —

```
You implement a single AI-search-audit punch-list item on behalf of
Meridian Osteopathy.

The incoming `text` payload is JSON describing one item, e.g.:
{"item":{"n":5,"title":"Fix homepage H1","body":"...","files":[...],"tier":1,"impact":"H","effort":"S","addresses":["G9"]},"note":"","requestedAt":"..."}

Parse it (the item may be nested as in the example; treat malformed
payloads by logging and exiting). Then:

1. Check out a fresh branch named claude/ship-<item.n>-<kebab-slug-of-title>.
2. Implement ONLY that single item, touching only the files it names.
   Match the codebase style; reuse infra per CLAUDE.md; keep diffs minimal.
3. Run `npm run build` to confirm Eleventy still builds cleanly.
4. Commit with a message like:
   "Ship audit #<n> — <title>"
5. Push the branch and open a DRAFT pull request titled:
   "Audit #<n>: <title>"
   Body should include: the item description, the files touched, a short
   test plan, and a link back to audit.meridianosteopathy.co.nz.

Do not merge. Do not touch items other than the one requested. Stop after
opening the draft PR.
```

### b) Copy the trigger URL and token

Once saved, click the routine's **API** trigger → the dialog shows the `/fire` URL and a **Generate token** button. Copy both **immediately** — the token is shown once.

### c) Add the URL and token to Netlify

Netlify → `meridian-osteopathy` → **Site configuration** → **Environment variables**:

| Key | Value |
|---|---|
| `AUDIT_SHIPIT_ROUTINE_URL` | The `/fire` URL from the routine |
| `AUDIT_SHIPIT_ROUTINE_TOKEN` | The bearer token from the routine |

### d) Try it

Open the dashboard → pick an approved item → click **🚀 Ship it**. Within 2-3 minutes you'll see a new draft PR in the repo. The button reports **Shipped ✓** with a link to the routine session so you can watch it work.

### Gotchas

- **Daily cap**: each Ship-it click is one routine run. Max plan = 15/day total across all routines. The weekly audit uses one; the rest are available for Ship-it.
- **Security**: the endpoint accepts POSTs from the audit dashboard origin only. A determined attacker could forge the `Origin` header to trigger runs; the blast radius is burning your daily allowance + seeing draft PRs open. Add Netlify Identity later if this worries you.
- **Rotating the token**: in the routine's API trigger dialog click **Regenerate**, then update `AUDIT_SHIPIT_ROUTINE_TOKEN` in Netlify env vars.

## 6. Turning things off

- **Stop emails**: pause or delete the routine at [claude.ai/code/routines](https://claude.ai/code/routines).
- **Stop the dashboard**: remove `audit.meridianosteopathy.co.nz` from Netlify Domain management. The `/admin/audit/` path on the main site will still work.
- **Rotate the digest token**: generate a new value, update `AUDIT_DIGEST_TOKEN` in both Netlify env vars and the routine env vars.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Dashboard shows "Offline — changes kept locally" | `audit-state` function is failing. Check Netlify → Functions → logs. Usually a missing `@netlify/blobs` install; re-trigger a build. |
| Routine runs but no email arrives | (1) `AUDIT_DIGEST_TOKEN` mismatch between Netlify env and routine env; (2) `RESEND_API_KEY` missing; (3) sender domain unverified (shouldn't happen — `meridianosteopathy.co.nz` is already verified). |
| "Unauthorized" in routine log when calling digest | The routine no longer calls the digest — it runs on a Netlify schedule. If you're testing the manual POST endpoint, re-copy `AUDIT_DIGEST_TOKEN` into your test environment. |
| "Host not in allowlist" 403 from `curl` in the routine | The routine environment blocks outbound HTTPS at the egress proxy. Don't rely on outbound calls from the routine — use Netlify scheduled functions (as the digest does) instead. |
| Item numbers shift unexpectedly | The routine renumbered items. Revert the last commit to `src/_data/audit.json` and remind the routine via its prompt to keep numbers stable. |
