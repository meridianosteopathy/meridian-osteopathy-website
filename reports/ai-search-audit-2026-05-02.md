# AI Search Audit — Meridian Osteopathy

**Report date:** 2026-05-02
**Branch:** `claude/dazzling-heisenberg-YW3pP`
**Previous report:** `reports/ai-search-audit-2026-04-24.md`
**Scope:** Weekly refresh. Covers (1) what shipped since last run, (2) industry signals from the past 7 days, (3) second search-visibility run against 28 tracked queries, and (4) updated punch-list with two new items.

---

## 1. TL;DR

**Quiet shipping week.** Six items closed during the past 7 days (items #10, #11, #18, #19, #20, #24 moved to `alreadyShipped`). The remaining open items — #12, #13, #14, #15, #16, #17, #21, #22, #23, #25 — are unchanged from last run. The two highest-leverage Tier-1 fixes that have NOT shipped are still item #17 (acupuncture page TCM-first) and item #21 (Google Business Profile services audit). #21 has been promoted from Tier 2 → Tier 1 this run (see industry signal below).

**Search visibility (run 2):** Meridian still rank 0 across all 28 tracked queries. SERP shape is essentially unchanged from last week. One real movement: `dry needling halswell` — the SERP that was 100% US physical-therapy clinics last week now has Elite Physiotherapy's Halswell clinic appearing. The uncontested suburb gap is closing without us, which makes item #17 + Halswell content more time-sensitive.

**Two new items added.** Both came out of this week's industry research:
- **#26** — Add `<link rel="alternate" type="text/markdown" href="/llms.txt">` in the HTML head (closes G13). One-line edit in `base.njk`.
- **#27** — Upgrade Physician schema to `IndividualPhysician` with `practicesAt` (Schema.org v30, released 2026-03-19, introduced these subtypes for sharper entity disambiguation). Small JSON-LD edit in `team-profile.njk`.

---

## 2. What shipped since last run (2026-04-24 → 2026-05-02)

Verified against git log (`b31aa02` and ancestors) and live source:

| # | Item | Verified via |
|---|---|---|
| 10 | Four condition Q→A pages (sciatica / headaches / pregnancy / sports) | `src/conditions/*.njk` — files exist, MedicalCondition + FAQPage schema in place |
| 11 | ProfilePage + MedicalWebPage @graph on team pages | `src/_includes/team-profile.njk` |
| 18 | Evidence-informed copy (no longer "holistic") | `src/index.njk` hero + practitioners intro; `src/_data/team.json` taglines |
| 19 | Catchment-suburb signals (Halswell / Addington / Sydenham / Wigram / etc.) | `src/_includes/footer.njk:14`, `src/llms.njk:15` Area-served line |
| 20 | "Treats:" specialty pills on team profiles | rendered card on each `/team/<name>/` page; data in `team.json.treats` |
| 24 | `/services/acupuncture/fertility/` sub-page | `src/services/acupuncture/fertility.njk` — MedicalTherapy schema linking to parent #service, FAQPage on IVF / ACC / Nina's credentials |

Plus polish that doesn't map to numbered items: site-wide sweep to remove "GP referral" from patient-facing copy (per the new CLAUDE.md rule), condition CTAs trimmed to heading + booking button, sciatica content revisions, contact-page intro reword. These don't move SERP rankings but tighten the on-page voice — added to `alreadyShipped` as a single rolled-up entry.

---

## 3. Industry signals — last 7 days (AEO / GEO / healthcare / schema)

- **Schema.org v30 (released 2026-03-19)** added two Physician subtypes: `IndividualPhysician` (a person who practises medicine) and `PhysiciansOffice` (the place they practise). The new `practicesAt` property on `IndividualPhysician` points to the `MedicalOrganization` where they practise. Our team-profile schema currently uses the generic `Physician` type — upgrading sharpens entity disambiguation for AI engines that map a team member to a clinic. → New item **#27**. ([Schema.org meddocs](https://schema.org/docs/meddocs.html), [Schema.org Physician release notes via medrankseo.com](https://medrankseo.com/schema-markup-for-healthcare-websites/))
- **Google's March 2026 core update made Google Business Profile completeness an explicit ranking input.** Profiles missing service listings, photos, attributes or Q&A "now face a measurable penalty relative to complete competitors." Review recency and owner-response rate are also weighted more heavily than raw review count. → Item **#21** promoted to Tier 1; item **#16** body updated to reflect the recency weighting. ([Amigo Softtech](https://amigosofttech.com/blog/google-ai-local-pack-visibility-for-clinics-schools-real-estate/), [MedRankSEO](https://medrankseo.com/local-seo-for-doctors-2026-guide/))
- **Local "near me" healthcare queries: 0% AI Overview presence as of December 2025** (down from 100% in 2023). Google has explicitly removed AI Overviews from local-provider queries — they're competed on the traditional map pack, GBP completeness and organic ranking. Reinforces #19/22/23/25 urgency. ([Ranktracker](https://www.ranktracker.com/blog/google-ai-mode-for-medical-clinics/))
- **`<link rel="alternate" type="text/markdown">` is now consensus llms.txt best practice.** The 2026 llms.txt guides (BigCloudy, ALLMO, AEO Press, Evil Martians) all converge on adding this link in the head as a discovery signal alongside the actual `/llms.txt` file. We have the file, just not the head link. → New item **#26**. ([Evil Martians](https://evilmartians.com/chronicles/how-to-make-your-website-visible-to-llms), [BigCloudy llms.txt 2026 guide](https://www.bigcloudy.com/blog/what-is-llms-txt/))
- **Content freshness as primary AI-ranking signal:** Ahrefs analysis of 17M AI citations finds AI-cited content is 25.7% fresher than traditional Google organic results. 76.4% of ChatGPT's top-cited pages were updated within the last 30 days; 50% of Perplexity citations come from content less than 13 weeks old. → Reinforces item **#14** (start a blog) — body updated with the new figures. ([Demand Local](https://www.demandlocal.com/blog/content-freshness-ai-rankings/), [Yext](https://www.yext.com/blog/how-chatgpt-perplexity-gemini-claude-decide-what-to-cite))
- **Reddit visibility continues to grow.** Reddit is now Google's #2 most-visible website (after Wikipedia) and is cited in ~68% of AI-generated responses across major platforms. The 90/10 rule (90% non-promotional contributions) is the standard playbook for healthcare brands. → Item **#15** body updated with the latest figures. ([ReplyAgent](https://www.replyagent.ai/blog/reddit-seo-complete-guide), [Reddireach](https://www.reddireach.com/blog/reddit-ai-seo-strategies-for-2026))

No competing items found in HackerNews / Search Engine Land / SEMrush blog this week that aren't already covered by the existing punch-list.

---

## 4. Search visibility — second run (28 queries)

**Overall:** still 0 / 28 in top 10. 0 / 28 in top 3. Decay applied per spec (every query lost 10 priority points). New high-watermark is `osteopath christchurch` at priority 70. Nothing dropped below 20, so no pruning this run.

### Top open queries by priority (after decay)

| Priority | Query | Who owns it (top 3) | Addressed by |
|---|---|---|---|
| 70 | osteopath christchurch | christchurchosteopath.co.nz, chchosteopaths.co.nz, frameosteo.co.nz | Site-wide authority (#14, #16) |
| 65 | osteopath halswell | osteopath-halswellclinic.co.nz, osteo.co.nz, christchurchosteopath.co.nz | #19 (shipped, suburb signal) — still not enough |
| 65 | acupuncture christchurch | chchacupuncture.co.nz, thehouseofacupuncture.co.nz, acuclinic.co.nz | #17, #14 |
| 60 | best osteopath christchurch | yelp.com, christchurchosteopath.co.nz, whodoyou.com | Site-wide |
| 60 | osteopath near me halswell | osteo.co.nz, osteopath-halswellclinic.co.nz, christchurchosteopath.co.nz | #19 |
| 60 | neck pain osteopath christchurch | osteopath.nz, betterhealthosteopathy.nz, cashmereosteo.co.nz | **#22** (still pending) |
| 60 | back pain osteopath christchurch | betterhealthosteopathy.nz, osteopath.nz, cashmereosteo.co.nz | **#23** (still pending) |
| 60 | medical acupuncture christchurch | musclepeople.co.nz, physiosouth.co.nz, acupuncturechristchurch.com | **#17** (still pending) |
| 60 | dry needling christchurch | musclepeople.co.nz, fixedphysio.co.nz, korutherapies.co.nz | **#17** (still pending) |
| 55 | osteopath acc christchurch | activehealth.co.nz, osteo.co.nz, betterhealthosteopathy.nz | **#25** (still pending) |
| 55 | sciatica osteopath christchurch | betterhealthosteopathy.nz, osteo.co.nz, mkosteopathy.co.nz | #10 (shipped — re-check next run for indexing lag) |
| 55 | pregnancy back pain christchurch | osteopath-halswellclinic.co.nz, betterhealthosteopathy.nz, osteopath-christchurch.com | #10 (shipped — re-check) |
| 55 | dry needling halswell | musclepeople.co.nz, fixedphysio.co.nz, **elitephysio.co.nz** | **#17** + Halswell signal (more urgent now — see below) |

### Wins / losses vs last run

- **No wins.** Meridian rank stays at 0 across all 28 queries. Two pages shipped (sciatica/headaches/pregnancy/sports cluster + fertility-acupuncture) that Google hasn't indexed yet — expect indexing lag of 1–3 weeks; re-check next run.
- **One material loss: `dry needling halswell` — Elite Physiotherapy now has a Halswell clinic surfacing in this SERP.** Last week the entire page was US physical-therapy clinics — a clean uncontested NZ gap. This week a physio competitor has filled it. The window for owning "Halswell + dry needling" via a single content fix (item #17 + Halswell signal on the acupuncture page) is closing.
- **One small reshuffle: `acupuncture christchurch` — chchacupuncture.co.nz overtook thehouseofacupuncture.co.nz for the top slot.** No impact on us; both are TCM-led competitors with established authority.
- **Position-stability check:** every other top-3 across the 28 queries is the same domain set as last week, confirming we're not at risk from new entrants beyond the dry-needling-halswell case above.

### New queries added this run (5 — derived, not autocomplete)

Autocomplete fetch is still blocked at the routine egress allowlist (confirmed again this run via `curl` + `WebFetch`). Five new derived queries added based on SERP-gap analysis and the active suburb / condition coverage map:

1. `osteopath wigram` — suburb signal in our footer but never tested
2. `osteopath addington` — same
3. `frozen shoulder osteopath christchurch` — common condition, observed surfaced for chchacupuncture.co.nz in the umbrella query
4. `arthritis osteopath christchurch` — common condition, mentioned in osteopathy intro
5. `baby osteopath christchurch` — alternate phrasing for "paediatric" (parents searching this term)

Pool size: 28 → 33 (well under maxPool of 50).

---

## 5. Updated punch-list

Full state in `src/_data/audit.json`. Summary of changes:

**Closed and moved to `alreadyShipped`:** items #10, #11, #18, #19, #20, #24 (closed by the bundle merged in PR #57 + the standalone `b31aa02` audit-status update commit).

**Tier promoted:** item **#21** Tier 2 → Tier 1 (Google March 2026 core update made GBP completeness an explicit ranking penalty signal).

**Bodies updated** to reflect 2026-05-02 industry data: items #14, #15, #16, #17 (added the 2026-05-02 SERP confirmation note).

**New this week:**
- **#26** — Add `<link rel="alternate" type="text/markdown" href="/llms.txt">` in the HTML head (Tier 2, M / S, addresses G13).
- **#27** — Upgrade Physician @graph nodes to v30 `IndividualPhysician` with `practicesAt` pointing to the clinic node (Tier 2, M / S, addresses new gap G21).

**Gaps closed:** G12 (ProfilePage shipped via #11), G17 (holistic-language reframe shipped via #18), G18 (catchment suburbs shipped via #19), G19 (Treats pills shipped via #20). Gap IDs preserved in `alreadyShipped` narrative; removed from active gaps. New gap G21 added (schema.org v30 upgrade opportunity).

**Item numbers stable:** all decisions in Netlify Blobs remain aligned. Nothing was renumbered.

---

## 6. Routine health notes

Same two routine-environment blockers as last week, unchanged:

- **Step 3c (Google autocomplete fetch)** — `suggestqueries.google.com` returns "Host not in allowlist" via both `curl` (sandbox enabled and disabled) and `WebFetch` (403). Worked around again this week with five derived queries from SERP-gap analysis.
- **Step 10 (digest email endpoint)** — `meridianosteopathy.co.nz` is also blocked. The `audit-send-digest` Netlify function is now wired to a Netlify scheduled function (cron Saturday) per `db87265`, so the digest will fire from Netlify itself even when the routine `curl` step 403s. The step-10 curl below is a no-op safety call.

**Durable fix still pending:** widen the routine host allowlist to include `suggestqueries.google.com` and `meridianosteopathy.co.nz`. Until that's done, expect both calls to keep 403-ing every Saturday.
