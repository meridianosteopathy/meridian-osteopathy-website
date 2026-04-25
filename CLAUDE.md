# Meridian Osteopathy Website

Eleventy (v2) static site deployed to Netlify. Forms are handled by Netlify Functions (`netlify/functions/`) with Supabase + Resend. Cloudflare Turnstile gates the contact/careers/referral forms. Admin area at `/admin/` uses Netlify Identity + Decap CMS.

## Always optimise images the user uploads

When the user uploads an image to be added to the site, automatically resize and compress it before committing — do not ask first.

Use `sharp` (install with `npm install --no-save sharp` if not present). Defaults:

- **Hero / full-width images**: max width 2000 px, JPEG quality 82, `mozjpeg: true`. Target 150–500 KB.
- **Team photos / inline content images**: max width 1200 px, JPEG quality 82, `mozjpeg: true`. Target 100–250 KB.
- **Logos / icons**: leave SVGs alone. For raster logos, keep as-is unless >200 KB.
- Preserve aspect ratio (`withoutEnlargement: true`, no explicit height).
- Overwrite the file in place at `src/images/<filename>` — no separate "-optimised" copy.

Skip optimisation only if the user explicitly says "don't compress" or "keep original quality".

## Branch / PR workflow

- Develop on the designated feature branch (never push to `main`).
- Commit messages: short imperative subject, body explains *why*. Match existing style in `git log`.
- Open PRs as **draft** after first push; mark ready only when the user confirms the preview looks good.

## CSP notes

`netlify.toml` defines a strict Content-Security-Policy. When adding a third-party script, iframe, font, or XHR endpoint, remember to widen the relevant directive (`script-src`, `frame-src`, `connect-src`, `font-src`, `style-src`).

## Turnstile on previews

`src/_data/site.js` swaps the live sitekey for Cloudflare's always-pass test key (`1x00000000000000000000AA`) on non-production builds. The matching server-side secret (`1x0000000000000000000000000000000AA`) is configured as a deploy-preview scoped `TURNSTILE_SECRET_KEY` in Netlify. Production uses the real key/secret.

## Working preferences

- **Before proposing automation, check the latest Anthropic release notes.** Prefer first-party primitives (Claude Code routines, skills, scheduled tasks, etc.) over hand-rolled GitHub Actions workflows. Anthropic ships new automation features frequently; what was "the way" 3 months ago is often superseded.
- **Minimise touch points.** Favour approaches where the user has as few manual config/setup steps as possible. One copy-paste is better than five. Reusing existing infrastructure beats adding new infrastructure.
- Clinic is on the **Claude Max plan** — routines allowance is 15 runs/day, included in the subscription. Use routines for recurring work; fall back to GitHub Actions only when a routine can't do it.

## Site copy rules

- **Never mention "GP" or "GP referral" in patient-facing copy.** A patient does not need a GP to access Meridian — they can book directly. Use "no referral needed", "you don't need a referral", or "you can book directly" instead. This applies to body copy, headings, FAQ answers, meta descriptions, llms.txt content, and any new condition / service pages.
- The same rule applies to weekly-audit and Ship-it routine output: when generating new copy, never write "GP referral" — use "no referral needed".
- The single allowed exception is biographical detail about a practitioner's UK NHS career, where "general practice" (not "GP") is used to describe the institution.

## Reusable infrastructure already in the repo

Before building anything new, check whether one of these can be reused:

- **Transactional email** — `netlify/functions/_lib/email.js`. Reads `RESEND_API_KEY` from Netlify env; sender domain `meridianosteopathy.co.nz` is already verified with Resend. Any new notification path should `require('./_lib/email')` rather than re-implement.
- **Passthrough `/admin/*`** — `.eleventy.js` line 6 passes `src/admin` through unchanged, and `netlify.toml` gives that path a looser CSP (for Decap CMS). Drop standalone internal HTML tools in `src/admin/<toolname>/` — they get the brand CSS, looser CSP, and noindex-able paths for free.
- **Brand tokens** — CSS custom properties in `src/css/styles.css` (`:root`): `--primary` (#345E85), `--accent-pink` (#B1536D), `--accent-green` (#5E855C), `--gold` (#c9963b), `--text-dark`, `--border`, fonts `--font-primary` (Essential Sans) and `--font-secondary` (Baskervville). Internal tools should link `/css/styles.css` and use these variables to stay on-brand without reinventing type/colour.
- **Turnstile** — gated forms should use the pattern already in `submit-referral.js` / `submit-career.js`; don't re-implement verification.

