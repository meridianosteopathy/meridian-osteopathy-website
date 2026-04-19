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
