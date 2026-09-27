# AI search audit — setup checklist

One-time setup for the weekly audit dashboard at `audit.meridianosteopathy.co.nz`. Everything should take 15–20 minutes end to end.

## What you're setting up

| Piece | Where it lives |
|---|---|
| Dashboard UI | `/admin/audit/` (rewritten to `audit.meridianosteopathy.co.nz/`) |
| Decisions storage | Netlify Blobs — automatic, no setup |
| Weekly report generation | Claude routine at [claude.ai/code/routines](https://claude.ai/code/routines) |
| Saturday email digest | `netlify/functions/audit-send-digest.js` — runs on a Netlify schedule (Sat 22:00 UTC); warns if the routine didn't run |
| Real Google numbers | Google Search Console, fetched at build time — one-time setup in [gsc-setup.md](gsc-setup.md) |
| Routine instructions | [audit-routine.md](audit-routine.md) (weekly) and [audit-shipit-routine.md](audit-shipit-routine.md) (Ship it) |
| Settings | `src/_data/auditConfig.json` — domain, brand terms, thresholds, digest recipient, review admins |
| Practitioner reviews | `/admin/reviews/` (short address `audit.meridianosteopathy.co.nz/reviews`) — no extra setup; uses the content-editor login, the existing email sender and the Ship-it routine. See [practitioner-reviews.md](practitioner-reviews.md) |

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
6. **Prompt**: paste the short block below verbatim.

```
You are the weekly search-audit routine for this repository.
Read docs/audit-routine.md on the main branch and follow it
exactly, from step 1 through the final push. That file is the
source of truth for how the audit works; if anything in this
prompt conflicts with it, the file wins.
```

All the audit logic (what to check, how to write recommendations, the
plain-English rules) lives in [`docs/audit-routine.md`](audit-routine.md),
so improving the audit is a normal reviewed PR, with nothing to re-paste here.

7. Click **Create**. Optionally click **Run now** to test-fire it immediately.

## 4. Verify

- Open `https://audit.meridianosteopathy.co.nz/` — you should see the dashboard with the current recommendations.
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
You implement one search-audit recommendation. The incoming text
is a JSON payload describing the item. Read
docs/audit-shipit-routine.md on the main branch and follow it
exactly. That file is the source of truth; if anything in this
prompt conflicts with it, the file wins.
```

The steps (including the practitioner-review section in the PR) live in
[`docs/audit-shipit-routine.md`](audit-shipit-routine.md).

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
