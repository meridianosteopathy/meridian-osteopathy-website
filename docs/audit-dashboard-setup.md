# AI search audit — setup checklist

One-time setup for the weekly audit dashboard at `audit.meridianosteopathy.co.nz`. Everything should take 15–20 minutes end to end.

## What you're setting up

| Piece | Where it lives |
|---|---|
| Dashboard UI | `/admin/audit/` (rewritten to `audit.meridianosteopathy.co.nz/`) |
| Decisions storage | Netlify Blobs — automatic, no setup |
| Weekly report generation | Claude routine at [claude.ai/code/routines](https://claude.ai/code/routines) |
| Saturday email digest | `netlify/functions/audit-send-digest.js` — called by the routine |

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
src/_data/audit.json; the dashboard at audit.meridianosteopathy.co.nz
reads it.

Do this in order:

1. Read src/_data/audit.json for current state.

2. Research the last 7 days of community + industry signals on AEO / GEO
   for local healthcare businesses. Look at Reddit (r/SEO, r/juststart,
   r/AskMarketing, healthcare threads), HackerNews, Search Engine Land,
   Ahrefs blog, Search Engine Journal, SEMrush blog, and any
   schema.org / llms.txt / AI-crawler development announcements. Focus
   on signals relevant to an osteopathy / multi-disciplinary allied-health
   clinic in New Zealand.

3. Audit the current repo against those findings. Check for new gaps,
   confirm existing gaps still apply, and look for items that may now be
   implemented (see git log for items shipped since last run).

4. Update src/_data/audit.json:
   - Increment meta.reportDate to today.
   - Add any new punch-list items at the end, with a firstSeen = today.
   - Remove items that have been implemented (check git diff / grep the
     relevant source files to confirm — do not remove based on guesswork).
   - Update tldr and gaps sections to reflect current reality.
   - Keep existing item numbers stable so decisions in Netlify Blobs
     stay aligned.

5. Save a markdown snapshot to reports/ai-search-audit-YYYY-MM-DD.md so
   there is a human-readable historical archive. Keep the report
   structure similar to the first one (TL;DR, Already implemented, Gaps,
   Punch-list by tier, Sources). One per run.

6. Commit both files to main with a message like:
   "Weekly audit — N new, M shipped (YYYY-MM-DD)"

7. After the push, call the digest endpoint to send the Saturday email:

   curl -X POST https://meridianosteopathy.co.nz/.netlify/functions/audit-send-digest \
     -H "Authorization: Bearer $AUDIT_DIGEST_TOKEN" \
     -H "Content-Type: application/json"

   If the response is not 200, print the body so the failure is visible
   in the routine run log.

Be rigorous about step 4 — wrong item numbers break stored decisions.
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

## 5. Turning things off

- **Stop emails**: pause or delete the routine at [claude.ai/code/routines](https://claude.ai/code/routines).
- **Stop the dashboard**: remove `audit.meridianosteopathy.co.nz` from Netlify Domain management. The `/admin/audit/` path on the main site will still work.
- **Rotate the digest token**: generate a new value, update `AUDIT_DIGEST_TOKEN` in both Netlify env vars and the routine env vars.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Dashboard shows "Offline — changes kept locally" | `audit-state` function is failing. Check Netlify → Functions → logs. Usually a missing `@netlify/blobs` install; re-trigger a build. |
| Routine runs but no email arrives | (1) `AUDIT_DIGEST_TOKEN` mismatch between Netlify env and routine env; (2) `RESEND_API_KEY` missing; (3) sender domain unverified (shouldn't happen — `meridianosteopathy.co.nz` is already verified). |
| "Unauthorized" in routine log when calling digest | Token mismatch. Re-copy `AUDIT_DIGEST_TOKEN` into the routine environment. |
| Item numbers shift unexpectedly | The routine renumbered items. Revert the last commit to `src/_data/audit.json` and remind the routine via its prompt to keep numbers stable. |
