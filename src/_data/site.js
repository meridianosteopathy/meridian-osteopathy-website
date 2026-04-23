// Netlify sets CONTEXT to "production", "deploy-preview", or "branch-deploy"
// at build time. On non-production builds we swap in Cloudflare's always-pass
// test sitekey so Turnstile works on deploy previews without needing every PR
// hostname to be whitelisted on the live sitekey.
//
// The matching server-side secret must be configured in Netlify per context:
//   Production    TURNSTILE_SECRET_KEY = <real secret>
//   Deploy preview TURNSTILE_SECRET_KEY = 1x0000000000000000000000000000000AA
//   Branch deploy  TURNSTILE_SECRET_KEY = 1x0000000000000000000000000000000AA
const LIVE_TURNSTILE_SITE_KEY = "0x4AAAAAAC_rY2ea23Ku00Bl";
const TEST_TURNSTILE_SITE_KEY = "1x00000000000000000000AA";

const isProduction = process.env.CONTEXT === "production";

// Google Maps search URL resolves to the clinic's Business Profile without
// needing the Place ID. Swap for a g.page / maps.app.goo.gl short-link once
// the owner confirms their preferred canonical URL.
const social = {
  googleBusinessProfile: "https://www.google.com/maps/search/?api=1&query=Meridian+Osteopathy+21+Coppell+Place+Christchurch",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
};

module.exports = {
  name: "Meridian Osteopathy",
  url: "https://meridianosteopathy.co.nz",
  phone: "02108655151",
  phoneE164: "+64-21-086-55151",
  email: "info@meridianosteopathy.co.nz",
  address: "21 Coppell Place, Hillmorton, Christchurch 8025",
  addressParts: {
    streetAddress: "21 Coppell Place, Hillmorton",
    locality: "Christchurch",
    region: "Canterbury",
    postalCode: "8025",
    countryCode: "NZ",
    country: "New Zealand",
  },
  areaServed: "Christchurch",
  hours: {
    weekday: "Mon–Fri: 9:00am – 7:00pm",
    saturday: "Saturday: 9:00am – 5:00pm",
    sunday: "Sunday: Closed",
  },
  hoursSchema: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    {
      days: ["Saturday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  social,
  sameAs: Object.values(social).filter(Boolean),
  pricing: {
    acc: { rate: "$80 - $85", notes: "" },
    private: { rate: "$115 - $120", notes: "Non-ACC consultation" },
  },
  priceRange: "$80–$120",
  turnstileSiteKey: isProduction ? LIVE_TURNSTILE_SITE_KEY : TEST_TURNSTILE_SITE_KEY,
  // Only load Google Analytics on the production build, so deploy previews
  // and branch deploys don't pollute the real stats.
  gaMeasurementId: isProduction ? "G-C8RVVJLFBW" : "",
};
