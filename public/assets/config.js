/*
 * Per-domain configuration.
 *
 * One static site is deployed once and pointed at all three domains. At runtime
 * main.js reads window.location.hostname and applies the matching config below,
 * so each domain renders the same page with its own branding, copy, and accent
 * color.
 *
 * To add or tweak a brand, edit the object for that hostname.
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
      "We're a local North Carolina team that helps small and medium businesses put large language models to work on real, time-consuming work — and we'll sit down with you in person, without the hype, the risk, or an in-house AI team.",
    locationLine: "A local North Carolina team — happy to meet you in person.",
    ctaNote: "Local and in person. Founding-client rates for the first NC businesses we partner with.",
    // SEO
    keywords:
      "AI consulting North Carolina, LLM integration, AI for small business NC, ChatGPT for business, AI automation North Carolina",
    areaServed: "North Carolina",
    addressLocality: "Raleigh",
    ogImage: "assets/og-nc.png",
    privacyEmail: "wmichelin+nc@gmail.com",
  },

  "caryncai.com": {
    brand: "Cary AI",
    wordmark: "Cary&nbsp;AI",
    region: "Cary & the Triangle",
    accent: "#0d9488",
    accentDark: "#0f766e",
    headline: "AI that actually works for Cary businesses",
    subhead:
      "A local Cary partner helping Triangle-area small businesses adopt large language models for the repetitive text and document work eating up your team's day — and we'll meet you in person, right here in town.",
    locationLine: "Based in Cary, NC — we meet local businesses face to face.",
    ctaNote: "Based in Cary — let's meet in person. Founding-client rates for the first Cary businesses we partner with.",
    // SEO
    keywords:
      "AI consultant Cary NC, AI for small business Cary, LLM integration Cary, AI automation Triangle NC, ChatGPT consultant Cary",
    areaServed: "Cary, North Carolina",
    addressLocality: "Cary",
    ogImage: "assets/og-cary.png",
    privacyEmail: "wmichelin+cary@gmail.com",
  },

  "rtpaisolutions.com": {
    brand: "RTP AI Solutions",
    wordmark: "RTP&nbsp;AI",
    region: "the Research Triangle",
    accent: "#6366f1",
    accentDark: "#4f46e5",
    headline: "AI solutions for Research Triangle companies",
    subhead:
      "We're a local Triangle team helping growing companies in RTP identify high-ROI workflows and ship dependable, secure LLM integrations — on-site and in person, measured by results, not slideware.",
    locationLine: "Local to the Research Triangle Park region — we'll meet you on-site.",
    ctaNote: "Local and on-site. Founding-client rates for our first Triangle partners.",
    // SEO
    keywords:
      "AI solutions RTP, LLM integration Research Triangle, AI consulting Durham NC, enterprise AI Triangle NC, AI automation RTP",
    areaServed: "Research Triangle Park, North Carolina",
    addressLocality: "Durham",
    ogImage: "assets/og-rtp.png",
    privacyEmail: "wmichelin+rtp@gmail.com",
  },
};

/* Fallback used for local dev, Netlify preview URLs, or any unknown host. */
window.SITE_CONFIG_DEFAULT = window.SITE_CONFIG["ncartificialintelligence.com"];

/*
 * Resolve which brand config applies to the current request.
 *
 * Shared by the early theme script in <head> (so the accent color paints
 * correctly on first render, with no flash of the default blue) and by main.js
 * (which fills in copy and SEO once the DOM is ready). Keeping the lookup here
 * means both run off the exact same logic.
 */
window.ALIASES = { nc: "ncartificialintelligence.com", cary: "caryncai.com", rtp: "rtpaisolutions.com" };

window.resolveSiteConfig = function () {
  var params = new URLSearchParams(window.location.search);
  // ?site= wins, so every variant is previewable from one URL.
  var override = (params.get("site") || "").toLowerCase();
  if (override) {
    var key = window.ALIASES[override] || override;
    if (window.SITE_CONFIG[key]) return window.SITE_CONFIG[key];
  }
  var host = window.location.hostname.replace(/^www\./, "").toLowerCase();
  return window.SITE_CONFIG[host] || window.SITE_CONFIG_DEFAULT;
};
