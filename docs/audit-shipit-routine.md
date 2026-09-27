# "Ship it" — routine instructions

This file is the source of truth for the **Meridian audit - Ship it** routine. It runs in two situations:

- **Audit items:** the clinic owner clicks 🚀 Ship it on an approved recommendation at the audit dashboard (`netlify/functions/audit-ship-it.js`).
- **Review revisions:** the clinic owner clicks *Ask Claude to apply these changes* on a practitioner's feedback at `/admin/reviews/` (`netlify/functions/review-admin.js`, see [practitioner-reviews.md](practitioner-reviews.md)).

The routine's prompt is a short pointer to this file (see [audit-dashboard-setup.md](audit-dashboard-setup.md) §5).

## Input

The routine's `text` is one JSON payload. If it has `"type": "review-revision"`, follow [Review revisions](#review-revisions). Otherwise it's an audit item:

```json
{ "item": { "n": 36, "title": "…", "owner": "practitioner", "reviewer": "Kaylee Frost", "why": "…", "body": "…", "files": ["…"], "matchTerms": ["postpartum"] }, "note": "…", "requestedAt": "…" }
```

If it doesn't parse, or has neither `type` nor `item.n`, log the problem and stop.

## Audit items

1. **Check the owner.** If `item.owner` is `"you"`, the item isn't a website change. Log that and stop, without opening a PR.
2. Create a branch `claude/ship-<n>-<kebab-slug-of-title>` from `main`.
3. **Implement only this item**, touching the files it names (plus any data or template the change needs). Follow `CLAUDE.md`: copy rules, colour contrast, image optimisation, CSP, and reuse of existing infrastructure. If `note` is set, it's the clinic owner's instruction and takes precedence over `body`.
4. **For `practitioner` items, write conservatively.** Only make clinical claims that the existing pages and `team.json` already support. Match the structure of the existing condition pages. Where you're unsure (who treats it, what's offered, ACC eligibility), don't guess in the page. Keep the wording neutral and list the question in the PR body (step 7).
5. `npm ci`, then `npm test` and `npm run build`. Both must pass.
6. Commit as `Ship audit #<n> — <title>`, push, and open a **draft** PR titled `Audit #<n>: <title>`.
7. PR body:
   - What changed and why (1–3 sentences), the files touched and a short test plan.
   - Link to the dashboard: `auditConfig.site.dashboardUrl`.
   - **For `practitioner` items**, add a one-click link that opens a pre-filled review request, so the clinic owner can send the draft to the reviewer. URL-encode each value:

     ```
     ## Practitioner review — <reviewer>
     Preview: https://deploy-preview-<PR number>--<auditConfig.site.netlifySiteName>.netlify.app<page path>
     [Send it to <reviewer> for review](<dashboard origin>/admin/reviews/?new=1&n=<n>&title=<title>&reviewer=<reviewer>&page=<preview URL>)
     Open questions for the reviewer:
     - …
     ```
8. Stop. Don't merge, and don't touch other items.

## Review revisions

```json
{
  "type": "review-revision",
  "review": {
    "id": "r_…", "title": "…", "pageUrl": "https://…", "prNumber": 131, "round": 1,
    "reviewer": "Kaylee Frost", "decision": "changes", "general": "…",
    "comments": [{ "heading": "How we treat it", "comment": "…" }],
    "source": { "type": "audit", "n": 36 }
  },
  "note": "…",
  "requestedAt": "…"
}
```

1. **Find the page's source.**
   - If `prNumber` is set, the page is a draft: check out that pull request's head branch (look it up on GitHub) and work there.
   - Otherwise it's a live page: create `claude/review-<id>-<kebab-slug-of-title>` from `main`.

   Then find where the page at `pageUrl`'s path comes from: a template in `src/`, often with its content in `src/_data/*.json` (for example `conditions.json`).
2. **Apply the feedback.** Each comment belongs to the section with that `heading`, and `general` applies to the whole page. The reviewer is the clinical expert: use their facts and wording, and don't add clinical claims they didn't ask for. `note` is the clinic owner's instruction and takes precedence (for example, "ignore the comment about the intro").
3. **Don't guess.** If a comment is unclear, contradicts another one, or isn't a change to this page, leave it and list it under *Not changed* (step 5).
4. Follow `CLAUDE.md` (copy rules, contrast). `npm ci`, then `npm test` and `npm run build`. Both must pass.
5. Commit as `Apply <reviewer>'s review feedback (round <round>)` and push.
   - On an existing PR, add a PR comment. For a live page, open a **draft** PR titled `Review changes: <title>`.
   - Either way, list what changed section by section, then *Not changed* with a reason for each, then the preview link (`https://deploy-preview-<PR number>--<auditConfig.site.netlifySiteName>.netlify.app<page path>`).
6. Stop. Don't merge. The clinic owner checks the preview and sends it back to the reviewer from `/admin/reviews/`.
