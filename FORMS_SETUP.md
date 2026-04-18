# Forms Setup Guide

This site's referral + careers forms flow through Netlify Functions into your Supabase project, with Cloudflare Turnstile bot protection and Resend email notifications.

## Architecture

```
Browser (referral.njk / careers.njk)
  └─ POST /.netlify/functions/submit-{referral|career}
       ├─ Cloudflare Turnstile verify
       ├─ Supabase insert (schema: website)
       ├─ [career only] Upload CV/cover letter → private bucket career-cvs
       └─ Resend → info@meridianosteopathy.co.nz
```

No form data ever hits Netlify Forms. Patient/applicant data lives only in your Supabase project, which the Clinic Intelligence Platform already reads from.

## One-time setup

### 1. Install dependencies

```bash
npm install
```

This pulls in `@supabase/supabase-js` and `parse-multipart-data`.

### 2. Apply the Supabase migration

In the Supabase dashboard → SQL editor, paste the contents of `supabase/migrations/20260419_forms.sql` and run it. It's idempotent, so re-running is safe. It creates:

- `website.referrals`
- `website.career_applications`
- Storage bucket `career-cvs` (private)
- RLS enabled, no policies (service_role only)

### 3. Get Cloudflare Turnstile keys

1. Go to https://dash.cloudflare.com → Turnstile
2. Add a site: domain `meridianosteopathy.co.nz`, widget mode **Managed**
3. Copy the **Site Key** and **Secret Key**

Paste the **site key** into `src/_data/site.json` → `turnstileSiteKey`.
Put the **secret key** in Netlify env (see step 5).

### 4. Get a Resend API key

1. https://resend.com → create account
2. Verify the domain `meridianosteopathy.co.nz` (Resend walks you through DNS records)
3. Create an API key under https://resend.com/api-keys

Until the domain is verified, emails won't send — but the form will still save to Supabase. The code degrades gracefully.

### 5. Set Netlify environment variables

Netlify dashboard → Site settings → Environment variables. Add:

| Key | Value |
|---|---|
| `TURNSTILE_SECRET_KEY` | from Cloudflare |
| `SUPABASE_URL` | Supabase → Project settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project settings → API → `service_role` key |
| `RESEND_API_KEY` | from Resend |
| `NOTIFY_TO` | `info@meridianosteopathy.co.nz` (optional; this is the default) |
| `NOTIFY_FROM` | e.g. `Meridian Website <no-reply@meridianosteopathy.co.nz>` (optional) |

After saving env vars, trigger a redeploy (Deploys → Trigger deploy).

### 6. Test

- Fill out the referral form → expect a row in `website.referrals` + an email to info@
- Fill out the careers form with a small PDF → expect a row in `website.career_applications`, an object in bucket `career-cvs`, and an email

## Reading applications (for staff)

From the Clinic Intelligence Platform, read:

```sql
select * from website.referrals order by created_at desc;
select * from website.career_applications order by created_at desc;
```

To download a CV (service role only — do this server-side, never in a browser):

```js
const { data } = await supabase
  .storage.from("career-cvs")
  .createSignedUrl(row.cv_path, 60 * 10); // 10-minute link
```

## Limits & notes

- **File size:** 3 MB per file (CV + cover letter). Netlify sync functions cap payloads around 6 MB total, and multipart data base64-inflates, so 3 MB is the safe ceiling.
- **File types:** PDF, DOC, DOCX only.
- **Turnstile test mode:** The placeholder site key `1x00000000000000000000AA` in `site.json` always passes. Swap it for your real key once you've set up the Cloudflare widget.
- **Honeypot:** Both forms have a hidden `bot-field`; if a bot fills it, the server returns success without saving.
- **CORS:** Functions only accept POST from `meridianosteopathy.co.nz` and `www.meridianosteopathy.co.nz`.
- **PHI:** Referrals contain patient health info. They sit in your own Supabase project (NZ region recommended) with RLS-only access — no third-party form provider in the pipeline.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Form returns `turnstile-failed` | Widget not loaded, secret key mismatch, or test key swapped on only one side |
| Form returns `storage-failed` | `SUPABASE_SERVICE_ROLE_KEY` missing or migration not applied |
| Form succeeds, no email arrives | `RESEND_API_KEY` not set, or sending domain not verified in Resend |
| File upload returns `file-too-large` | File over 3 MB — ask applicant to compress |
| `FUNCTION_INVOCATION_FAILED` in Netlify logs | Run `npm install` locally, redeploy — dependencies might be missing |
