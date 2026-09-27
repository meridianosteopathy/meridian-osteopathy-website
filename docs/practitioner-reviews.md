# Practitioner reviews

Ask a practitioner to check a page before it goes live. They comment section by section, you read the feedback, and you decide what happens next. **Publishing is always your call.**

**Where:** [audit.meridianosteopathy.co.nz/reviews](https://audit.meridianosteopathy.co.nz/reviews), or **Practitioner reviews** at the top of the audit dashboard.
**Login:** the same website admin login you use for the content editor. Only the emails listed in `src/_data/auditConfig.json` → `reviews.admins` can send requests or read feedback.

## How it works

1. **Send a request.** Click **＋ New review request** and fill in:
   - the page link
   - the reviewer's name and email (remembered after the first time)
   - an optional message

   **Any link works.** Pages on this website, including draft previews, are split into sections with a comment box under each. Other links (a Google Doc, a Canva design) get one comment box.
   - From the audit dashboard, **Request practitioner review** on a recommendation fills the form in for you.
   - Ship it's draft PRs for practitioner items include a **Send it to … for review** link that fills in the preview link too.
2. **The practitioner reviews it.** They get an email with a private link, with no login needed. The form shows each section's text with a *What would you change here?* box underneath. They choose **Looks good**, **Approve with small changes** or **Needs changes**. It works on a phone.
3. **You get an email** with their decision and comments, and the request appears under **Waiting on you**. Then choose:
   - **Ask Claude to apply these changes.** You can add a note for Claude (for example, "ignore the intro comment"). Claude updates the draft, or opens a new one for a live page, and lists anything it didn't change and why.
   - **Send back to them.** Starts the next round. Use this after Claude's changes (check the preview first), or after you've edited the page yourself. They see their earlier comments under each section, so they can check each was handled.
   - **Approve & close.** Then merge the draft PR when you're ready.
4. While a request is waiting on the reviewer, you can **send a reminder**, **copy the review link** (for example if the email didn't arrive) or **cancel** it.

## Good to know

- Emails come from the website's no-reply address. When a reviewer replies to one, the reply goes to you.
- The reviewer can change their answers until you act on them.
- Anyone with a review link can read that page's text, so share links only with the reviewer. Cancelling or closing a request stops the link taking answers.
- Requests created from a deploy preview and from the live dashboard are stored together. Send your first test request to yourself.

## For a developer

| Piece | Where |
|---|---|
| Owner page | `src/admin/reviews/index.njk` (Netlify Identity login) |
| Reviewer form | `src/admin/reviews/respond/index.njk` (id + secret token in the link) |
| Functions | `netlify/functions/review-admin.js`, `review-public.js`, shared logic in `_lib/reviews.js` |
| Storage | Netlify Blobs store `reviews`: `request/<id>`, and `reviewers` for remembered emails |
| Claude revisions | The Ship-it routine, via `_lib/routine.js`. Payload and steps are in [audit-shipit-routine.md](audit-shipit-routine.md#review-revisions) |
| Settings | `src/_data/auditConfig.json`: `reviews.admins`, `reviews.adminName`, `site.*` |
| Tests | `scripts/test-reviews.js` (part of `npm test`) |

**Reusing it on another site:** copy the files above, set `site` and `reviews` in `auditConfig.json`, and enable Netlify Identity (or swap `adminUser()` in `_lib/reviews.js` for another login). Pages are split at `<h1>`/`<h2>` inside `<main>`, so any conventionally structured site works.
