/*
 * Per-domain configuration for the painted-door test.
 *
 * One static site is deployed once and pointed at all three domains. At runtime
 * main.js reads window.location.hostname and applies the matching config below,
 * so each domain renders the same page with slightly different branding, copy,
 * and accent color. This lets us A/B/C the *names* against the same offer and
 * see which one converts.
 *
 * To add or tweak a variant, edit the object for that hostname.
 */
window.SITE_CONFIG = {
  "ncartificialintelligence.com": {
    brand: "NC Artificial Intelligence",
    wordmark: "NC&nbsp;AI",
    region: "North Carolina",
    accent: "#2563eb",
    accentDark: "#1e40af",
    headline: "Practical AI for North Carolina businesses",
    subhead:
      "We help small and medium businesses across North Carolina put large language models to work on real, time-consuming work — without the hype, the risk, or an in-house AI team.",
    locationLine: "Working with businesses across North Carolina.",
    ctaNote: "Founding-client rates for the first NC businesses we partner with.",
    // SEO
    keywords:
      "AI consulting North Carolina, LLM integration, AI for small business NC, ChatGPT for business, AI automation North Carolina",
    areaServed: "North Carolina",
    addressLocality: "Raleigh",
    ogImage: "assets/og-nc.png",
  },

  "caryncai.com": {
    brand: "Cary AI",
    wordmark: "Cary&nbsp;AI",
    region: "Cary & the Triangle",
    accent: "#0d9488",
    accentDark: "#0f766e",
    headline: "AI that actually works for Cary businesses",
    subhead:
      "A local partner helping Cary and Triangle-area small businesses adopt large language models for the repetitive text and document work eating up your team's day.",
    locationLine: "Based in Cary, NC — serving local businesses face to face.",
    ctaNote: "Founding-client rates for the first Cary businesses we partner with.",
    // SEO
    keywords:
      "AI consultant Cary NC, AI for small business Cary, LLM integration Cary, AI automation Triangle NC, ChatGPT consultant Cary",
    areaServed: "Cary, North Carolina",
    addressLocality: "Cary",
    ogImage: "assets/og-cary.png",
  },

  "rtpaisolutions.com": {
    brand: "RTP AI Solutions",
    wordmark: "RTP&nbsp;AI",
    region: "the Research Triangle",
    accent: "#6366f1",
    accentDark: "#4f46e5",
    headline: "AI solutions for Research Triangle companies",
    subhead:
      "We help growing companies in RTP and across the Triangle identify high-ROI workflows and ship dependable, secure LLM integrations — measured by results, not slideware.",
    locationLine: "Serving the Research Triangle Park region.",
    ctaNote: "Founding-client rates for our first Triangle partners.",
    // SEO
    keywords:
      "AI solutions RTP, LLM integration Research Triangle, AI consulting Durham NC, enterprise AI Triangle NC, AI automation RTP",
    areaServed: "Research Triangle Park, North Carolina",
    addressLocality: "Durham",
    ogImage: "assets/og-rtp.png",
  },
};

/* Fallback used for local dev, Netlify preview URLs, or any unknown host. */
window.SITE_CONFIG_DEFAULT = window.SITE_CONFIG["ncartificialintelligence.com"];
