# "Ship it" — routine instructions

This file is the source of truth for the **Meridian audit - Ship it** routine, which runs when the clinic owner clicks 🚀 Ship it on an approved recommendation at the audit dashboard. The routine's prompt is a short pointer to this file (see [audit-dashboard-setup.md](audit-dashboard-setup.md) §5).

## Input

The routine's `text` is JSON from `netlify/functions/audit-ship-it.js`:

```json
{ "item": { "n": 36, "title": "…", "owner": "practitioner", "reviewer": "Kaylee Frost", "why": "…", "body": "…", "files": ["…"], "matchTerms": ["postpartum"] }, "note": "…", "requestedAt": "…" }
```

If it doesn't parse, or has no `item.n`, log the problem and stop.

## Steps

1. **Check the owner.** If `item.owner` is `"you"`, the item isn't a website change. Log that and stop, without opening a PR.
2. Create a branch `claude/ship-<n>-<kebab-slug-of-title>` from `main`.
3. **Implement only this item**, touching the files it names (plus any data or template the change needs). Follow `CLAUDE.md`: copy rules, colour contrast, image optimisation, CSP, and reuse of existing infrastructure. If `note` is set, it's the clinic owner's instruction and takes precedence over `body`.
4. **For `practitioner` items, write conservatively.** Only make clinical claims that the existing pages and `team.json` already support. Match the structure of the existing condition pages. Where you're unsure (who treats it, what's offered, ACC eligibility), don't guess in the page. Keep the wording neutral and list the question in the PR body (step 7).
5. Run `npm test` and `npm run build`. Both must pass.
6. Commit as `Ship audit #<n> — <title>`, push, and open a **draft** PR titled `Audit #<n>: <title>`.
7. PR body:
   - What changed and why (1–3 sentences), the files touched and a short test plan.
   - Link to the dashboard: `auditConfig.site.dashboardUrl`.
   - **For `practitioner` items**, add a section the clinic owner can forward as-is:

     ```
     ## Practitioner review — <reviewer>
     Preview: https://deploy-preview-<PR number>--meridian-osteopathy.netlify.app/<page path>
     Please check:
     - [ ] Everything said about the condition and treatment is accurate
     - [ ] We only describe care we actually offer
     - [ ] It reads the way you'd explain it to a patient
     - [ ] ACC wording is correct (if mentioned)
     - [ ] You're happy to be named on this page (if named)
     Open questions:
     - …
     ```
8. Stop. Don't merge, and don't touch other items.
