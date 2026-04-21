# Facebook Setup & Practitioner Ads

Brief for setting up Meridian Osteopathy's Facebook presence and launching
practitioner-led ad campaigns. Everything a non-technical operator needs is
in §1 (setup) and §3 (ready-to-paste ad copy).

---

## 1. One-off Facebook setup

1. **Create a Facebook Page** (Business → Create Page) named "Meridian
   Osteopathy". Category: *Medical & Health → Alternative & Holistic Health*.
   Add: profile pic (logomark), cover photo (`/images/hero-team-group.jpg`),
   address, hours (same as `site.js`), phone, website
   `https://meridianosteopathy.co.nz`.
2. **Claim the vanity URL** `facebook.com/meridianosteopathy` (Page → About →
   Username).
3. **Create a Meta Business Manager** account and assign the Page + an ad
   account to it. Add the clinic's primary email as admin.
4. **Create a Meta Pixel** (Events Manager → Connect Data Sources → Web).
   Copy the 15–16 digit Pixel ID.
5. **In Netlify** (Site settings → Environment variables), add, scoped to
   *Production*:
   - `FACEBOOK_PAGE_URL` = `https://www.facebook.com/meridianosteopathy`
   - `META_PIXEL_ID` = `<the pixel ID>`
   Then trigger a fresh deploy. The Page link will appear in the site
   footer and the Pixel will fire on every production page load.
6. **Verify the domain** in Meta Business Settings → Brand Safety → Domains
   using the DNS TXT record method. Required for iOS tracking and ad
   delivery after Apple's ATT changes.
7. **Configure web events for Aggregated Event Measurement**: in Events
   Manager → Aggregated Event Measurement, prioritise `Lead` (referral
   form), `Contact` (contact form), `PageView`.

### Standard events worth wiring up later

The current `base.njk` injects `PageView` automatically. Additional events
can be fired from form-success handlers (see `netlify/functions/`):

| Event        | Trigger                                  |
|--------------|------------------------------------------|
| `Contact`    | contact form submit success              |
| `Lead`       | referral form submit success             |
| `Schedule`   | click on "Book Now" that opens Cliniko   |
| `SubmitApplication` | careers form submit success       |

These belong in a follow-up PR once the Pixel ID is live.

---

## 2. Targeting defaults (reuse across every ad set)

- **Location**: Christchurch + 25 km radius. Exclude under-18 where the
  creative isn't paediatric.
- **Age**: 25–65+ (narrow per creative — see below).
- **Languages**: English.
- **Detailed targeting**: *Advantage+ detailed targeting* ON. Seed interests:
  `Osteopathy`, `Acupuncture`, `Physiotherapy`, `Chiropractic`, `Pilates`,
  `Yoga`, `Running`, `ACC New Zealand`.
- **Placements**: Advantage+ placements (let Meta optimise). Feed, Reels,
  Stories all acceptable — the creative is portrait-friendly.
- **Objective**: *Leads* (on-site form fill via referral page) or *Traffic*
  (clicks to `/book/`). Use *Leads* once the Pixel has 50+ weekly events.
- **Optimisation event**: `Lead` (post-Pixel) or *Landing page views* until
  then.
- **Budget**: start at $15 NZD/day per practitioner ad set for 7 days, then
  scale the winners by 20% every 3 days.
- **Landing page**: always the practitioner profile, not the homepage —
  tag with UTMs so GA/Pixel can attribute. Template:
  `https://meridianosteopathy.co.nz/team/<slug>/?utm_source=facebook&utm_medium=paid_social&utm_campaign=<practitioner>_<theme>`

---

## 3. Practitioner ad creatives

Each practitioner has 2–3 angles. Facebook's primary text hard-limits at
~125 chars before truncation in feed; keep the hook punchy. Headline caps
at 40 chars, description at 30.

### 3.1 Nina Hu — Osteopath & Medical Acupuncture

Landing page: `/team/nina-hu/`
Photo: `/images/team-nina.jpg`
Age target: 25–55, all genders (slight female skew for women's-health angle).

**Angle A — Women's health**
- Primary text: "Hormonal imbalance, pelvic tension, migraines, disrupted
  sleep — Nina blends osteopathy and acupuncture to support women's health
  at every stage. ACC registered, no GP referral needed."
- Headline: "Women's health care in Christchurch"
- Description: "Book with Nina today"
- CTA button: *Book Now*
- Suggested interests add-on: `Women's health`, `Menopause`, `Prenatal`.

**Angle B — Paediatric & infants**
- Primary text: "Unsettled baby? Nina is trained in paediatric osteopathy
  — gentle, hands-on care for infants and young children in Hillmorton."
- Headline: "Gentle osteopathy for babies"
- Description: "ACC registered · Christchurch"
- CTA button: *Book Now*
- Targeting: add *Parents (all)* and *Parents with toddlers (01–02 years)*.

**Angle C — Headaches & TMJ**
- Primary text: "Tension headaches, jaw pain, or neck stiffness that won't
  quit? Nina combines cranial osteopathy and medical acupuncture to get to
  the root cause."
- Headline: "Ongoing headaches? Start here."
- Description: "ACC from $80 · Christchurch"
- CTA button: *Book Now*

### 3.2 Jonathan Grice — Osteopath & Low Level Laser

Landing page: `/team/jonathan-grice/`
Photo: `/images/team-jonathan.jpg`
Age target: 35–65+, all genders.

**Angle A — Complex / chronic pain**
- Primary text: "Tried everything for that lingering pain? Jonathan brings
  15+ years of clinical experience — including NHS general practice — plus
  low-level laser therapy for stubborn cases."
- Headline: "Chronic pain, fresh approach"
- Description: "ACC registered Christchurch osteopath"
- CTA button: *Book Now*

**Angle B — Low level laser therapy (unique USP)**
- Primary text: "Bio-photomodulation — low-level laser therapy — can
  support tissue healing and pain relief where manual therapy alone isn't
  enough. Jonathan authored 200+ THOR Photomedicine protocols."
- Headline: "Low level laser in Christchurch"
- Description: "Only at Meridian Osteopathy"
- CTA button: *Learn More* → `/services/osteopathy/`

**Angle C — UK trained, local expertise**
- Primary text: "UK-trained, Christchurch-born. Jonathan returned home in
  2022 with over a decade of international osteopathic experience — now
  taking new patients in Hillmorton."
- Headline: "Experienced osteopath, local clinic"
- Description: "Book with Jonathan"
- CTA button: *Book Now*

### 3.3 Maddison Moffat — Osteopath

Landing page: `/team/maddison-moffat/`
Photo: `/images/team-maddison.jpg`
Age target: 18–45, slight male skew for sports angle.

**Angle A — Sports & active recovery**
- Primary text: "Training through a niggle? Maddison works with runners,
  gym-goers, and weekend athletes to keep you in the activities you love."
- Headline: "Sports osteopathy, Christchurch"
- Description: "ACC from $80 · no GP referral"
- CTA button: *Book Now*
- Interest add-on: `Running`, `Crossfit`, `Cycling`, `Rugby union`.

**Angle B — Paediatric**
- Primary text: "Warm, patient, and genuinely good with kids — Maddison
  brings a gentle approach to paediatric osteopathy in Hillmorton."
- Headline: "Osteopathy for kids"
- Description: "Christchurch · ACC registered"
- CTA button: *Book Now*
- Targeting: *Parents (all)*.

**Angle C — Community / local**
- Primary text: "Born and raised in Christchurch, Maddison believes a
  strong therapeutic relationship is the foundation of good care. Now
  taking new patients."
- Headline: "Your Christchurch osteopath"
- Description: "Book with Maddison today"
- CTA button: *Book Now*

### 3.4 Min Jin — Acupuncturist

Landing page: `/team/min-jin/`
Photo: `/images/team-min.jpg`
Age target: 30–65, female skew for women's-health / sleep angles.

**Angle A — Pain & migraines**
- Primary text: "Neck, shoulder, back pain, or recurring migraines?
  Min combines classical Chinese medicine with Tung-style acupuncture —
  evidence-informed, patient-centred care."
- Headline: "Acupuncture for pain relief"
- Description: "ACC registered Christchurch"
- CTA button: *Book Now*

**Angle B — Women's health / menopause**
- Primary text: "Cycle irregularity, hot flushes, perimenopausal sleep
  struggles? Min takes time to understand your full picture before
  forming a plan."
- Headline: "Acupuncture for women's health"
- Description: "Book with Min"
- CTA button: *Book Now*
- Targeting: add *Menopause*, *Women's health*, age 40–60.

**Angle C — Stress, sleep, digestion**
- Primary text: "Science-meets-tradition. A decade in clinical research
  before retraining as an acupuncturist — Min brings rigour and warmth to
  stress, sleep, and digestive complaints."
- Headline: "Acupuncture in Christchurch"
- Description: "Evidence-informed care"
- CTA button: *Book Now*

---

## 4. Creative production checklist

For each ad, export:

- **1:1 (1080×1080)** — feed default.
- **4:5 (1080×1350)** — mobile feed, highest engagement.
- **9:16 (1080×1920)** — Reels & Stories. Keep faces and text in the
  central 60% safe area.

Overlay text (keep under 20% of image area):
- Practitioner name + one-line specialty.
- "ACC registered · Christchurch" strip.
- Brand lockup (logo bottom-right, 100px tall).

Use `/images/team-<slug>.jpg` as the hero asset. The existing
`/images/social-card.jpg` (1200×630) is the fallback OG image and is
already wired into `base.njk`.

---

## 5. Measurement

- **Weekly**: check Events Manager for Pixel health (no duplicate events,
  >95% match quality on CAPI once added).
- **Per ad set**: pause anything with CTR <1% after $30 spend.
- **Attribution**: use 7-day click / 1-day view (Meta default) for the
  first 4 weeks, then review.
- **Source of truth for bookings**: Cliniko — ask patients how they found
  you during intake and tag them in the Cliniko referral source field so
  the ROI of paid vs organic stays visible.
