# Weekly search audit — 2026-10-23

## This week

- **The live website hasn't updated since 15 Oct.** The live dashboard still shows the 9 Oct audit, so last week's 16 Oct update never went live. The Google numbers it uses were fetched on 15 Oct. The code builds cleanly on a fresh copy, so the problem is most likely on Netlify's side (#48).
- **That means Google's numbers are the same as last week** (to 12 Oct), and can't yet show whether the 15 Oct title changes or Kaylee's new pregnancy page are working. Those changes are live: the back pain page's Google title now reads “Back Pain Treatment in Christchurch”.
- **Nothing new shipped.** The homepage title still has no “Christchurch” (#47).
- **Estimated ranks are still unusable** for a third week: directories and overseas sites only.

### Top 3 actions

1. **#48 (you, about 5 minutes):** in Netlify, check why the 16 Oct update didn't go live, then click Trigger deploy. This also refreshes the Google numbers on the dashboard.
2. **#47 (Claude):** add “Christchurch” to the homepage's Google title.
3. **#44 (you, about 5 minutes):** in Search Console, request indexing for the new pregnancy page and the three retitled condition pages, then resubmit the sitemap.

## Google data (Search Console)

Google data was available, but it's the 15 Oct snapshot (15 Sep – 12 Oct), unchanged from last week, because the site hasn't rebuilt since then. Headline numbers, for reference:

| | This period | Previous |
|---|---|---|
| Clicks | 284 | 275 |
| Appearances in Google | 4,904 | 4,194 |
| Clicks from non-name searches | 170 | 147 |
| Searches with Meridian on page 1 | 31 | 30 |
| Average position | 13.1 | 10.0 |

**Closest wins** (unchanged; positions 4–20):

| Search | Position | Appearances | Clicks | Page Google shows |
|---|---|---|---|---|
| acupuncture christchurch | 11.0 | 321 | 3 | Homepage |
| osteopath christchurch | 10.2 | 169 | 6 | Homepage |
| sports injury treatment | 7.5 | 156 | 0 | Sports injury |
| dry needling christchurch | 9.4 | 86 | 2 | Homepage |
| osteopath | 4.7 | 74 | 4 | Homepage |
| acupuncture | 10.4 | 56 | 1 | Homepage |
| sciatica treatment | 15.0 | 48 | 0 | Sciatica |
| osteopathy | 18.7 | 47 | 0 | Homepage |
| osteopath halswell | 10.7 | 23 | 1 | Osteopathy |
| acupuncture riccarton | 8.2 | 20 | 0 | Homepage |
| pregnancy acupuncture | 8.2 | 17 | 0 | Pregnancy acupuncture post |
| dry needling | 5.8 | 16 | 0 | Homepage |

Once the site redeploys, next week's numbers should cover the first week after the 15 Oct changes.

## Estimated rankings

These come from a US-based web search tool, not from what someone in Christchurch sees, and don't include Google Maps.

- **28 searches checked**, including all 8 core ones. Meridian didn't appear in any of them.
- **No wins or losses since last run.** For the third week, results were directories (Healthpoint, Yellow, Fresha, Gensolve, Bizhub365), Ara's teaching clinic, booking/travel-deal sites and overseas health pages. Very few clinic websites appear for anyone, so this still looks like a limitation of the tool, not a Meridian-specific drop.
- **Price and ACC searches** still surface pages that show a price or an ACC fee: Ara's teaching clinic ($50, or $25 with ACC), Body Well Me ($90 first visit, $25 ACC follow-up) and Pro Acupuncture ($105–$110). Supports #25 (ACC page) and #46 (fees page).
- **Query list:** dropped “osteopath for sports injury christchurch” (low-scoring for three runs). Added “dry needling” and “osteopath” from Search Console, plus “acupuncture christchurch acc” and “dry needling cost” from Google's autocomplete. 27 searches on the list.

## Industry signals

1. **BrightLocal, 22 Oct:** a survey of over 1,000 small businesses found only about 35% keep their Google Business Profile active, and 21% hadn't updated it in more than three months. Regular posts, photos and review replies (#16) still set a clinic apart.
2. **Google, 21 Oct:** Google expanded its help page on controlling what Google Search shows, including the setting for AI features. No action needed; the site already allows Google and AI crawlers on purpose.

No Google ranking update was announced this week. The September spam update finished on 8 Oct.

## Recommendations

| # | What | Who | Confidence |
|---|---|---|---|
| 48 | **New:** find out why the website stopped updating after 15 Oct | You | Proven |
| 47 | Add “Christchurch” to the homepage's Google title | Claude | Likely |
| 44 | Ask Google to index the new pregnancy page and the three retitled condition pages | You | Likely |
| 25 | Build an ACC page (Nina checks the wording) | Practitioner (Nina Hu) | Likely |
| 46 | Add a simple fees page | Claude | Likely |
| 35 | Save a baseline of Google's AI Overviews report | You | Likely |
| 16 | Ask for Google reviews and reply to every review within 48 hours | You | Likely |
| 45 | Next blog post: a plain guide to sciatica (Jonathan checks) | Practitioner (Jonathan Grice) | Experimental |
| 32 | Concussion page, only if someone treats concussion | Practitioner (Nina Hu) | Likely |
| 13 | Auto-fetch Google review numbers at build time | You | Experimental |
| 15 | Answer local Reddit questions | You | Experimental |
| 12 | Speakable blocks on service intros | Claude | Experimental |

Shipped since last run: nothing (the only commit to main was last week's audit).
