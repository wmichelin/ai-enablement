/*
 * Applies the per-domain configuration at runtime and wires up SEO.
 *
 * The same static page is served from all three domains. Here we:
 *   1. Pick the config for the current hostname (or a ?site= override).
 *   2. Fill every [data-bind] slot â copy, accent color, and SEO meta tags.
 *   3. Inject JSON-LD structured data for local SEO.
 *   4. Tag the lead form with the source domain so submissions are segmented.
 *   5. In "preview mode" (e.g. the GitHub Pages demo) mark the page noindex and
 *      make the form navigate to the thank-you page without a real backend.
 */
(function () {
  var ALIASES = {
    nc: "ncartificialintelligence.com",
    cary: "caryncai.com",
    rtp: "rtpaisolutions.com",
  };

  var params = new URLSearchParams(window.location.search);

  // Preview mode: the live demo host, localhost, or an explicit ?preview flag.
  // In preview the form has no backend, so we intercept it and skip indexing.
  var host = window.location.hostname.replace(/^www\./, "").toLowerCase();
  var IS_PREVIEW =
    params.has("preview") ||
    /\.github\.io$/.test(host) ||
    host === "localhost" ||
    host === "127.0.0.1";

  function pickConfig() {
    // ?site= wins, so every variant is previewable from one URL.
    var override = (params.get("site") || "").toLowerCase();
    if (override) {
      var key = ALIASES[override] || override;
      if (window.SITE_CONFIG[key]) return window.SITE_CONFIG[key];
    }
    return window.SITE_CONFIG[host] || window.SITE_CONFIG_DEFAULT;
  }

  function canonicalBase() {
    // Self-referencing canonical: each live domain is canonical for itself.
    return (
      window.location.origin +
      window.location.pathname.replace(/index\.html$/, "")
    );
  }

  function apply(cfg) {
    if (!cfg) return;

    var root = document.documentElement;
    if (cfg.accent) root.style.setProperty("--accent", cfg.accent);
    if (cfg.accentDark) root.style.setProperty("--accent-dark", cfg.accentDark);

    var base = canonicalBase();
    var ogImageAbs = cfg.ogImage ? new URL(cfg.ogImage, base).href : "";

    // Keys that are computed rather than read straight from the config.
    var computed = {
      title: cfg.brand + " â AI for " + cfg.region + " businesses",
      description: cfg.subhead,
      ogTitle: cfg.headline + " | " + cfg.brand,
      canonical: base,
      ogImageAbs: ogImageAbs,
      themeColor: cfg.accent,
      year: String(new Date().getFullYear()),
    };

    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var key = el.getAttribute("data-bind");
      var value = key in computed ? computed[key] : cfg[key];
      if (value == null) return;

      if (el.tagName === "TITLE") {
        document.title = value;
      } else if (el.tagName === "META") {
        el.setAttribute("content", value);
      } else if (el.tagName === "LINK") {
        el.setAttribute("href", value);
      } else {
        // config values may contain intentional markup (e.g. &nbsp;)
        el.innerHTML = value;
      }
    });

    // The privacy page shows a brand contact address as both link text and href.
    var mail = document.querySelector("a.contact-email");
    if (mail && cfg.privacyEmail) {
      mail.setAttribute("href", "mailto:" + cfg.privacyEmail);
    }

    injectStructuredData(cfg, base, ogImageAbs);

    // Tag the lead form so every submission records its source domain/brand.
    var domainField = document.querySelector('input[name="site_domain"]');
    var brandField = document.querySelector('input[name="site_brand"]');
    if (domainField) domainField.value = window.location.hostname;
    if (brandField) brandField.value = cfg.brand;

    // Set hidden source-site field
    var sourceField = document.getElementById('source-site');
    if (sourceField) sourceField.value = window.location.hostname;

    // Submit inline form to Google Forms via fetch
    var auditForm = document.getElementById('audit-form');
    if (auditForm) {
      auditForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = auditForm.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
        fetch('https://docs.google.com/forms/d/e/1FAIpQLSct09jEm7KFgqazRBSHuSHnVtyFLjKHujhhD452P3IpsdXMZw/formResponse', {
          method: 'POST',
          body: new FormData(auditForm),
          mode: 'no-cors'
        }).then(function() {
          var site = new URLSearchParams(window.location.search).get('site');
          window.location.href = 'thanks.html' + (site ? '?site=' + site : '');
        }).catch(function() {
          var site = new URLSearchParams(window.location.search).get('site');
          window.location.href = 'thanks.html' + (site ? '?site=' + site : '');
        });
      });
    }

    if (IS_PREVIEW) enablePreviewMode(cfg);
  }

  function injectStructuredData(cfg, base, ogImageAbs) {
    var node = document.getElementById("ld-json");
    if (!node) return;
    var data = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: cfg.brand,
      description: cfg.subhead,
      url: base,
      image: ogImageAbs || undefined,
      serviceType:
        "AI and LLM integration services for small and medium businesses",
      areaServed: { "@type": "AdministrativeArea", name: cfg.areaServed },
      address: {
        "@type": "PostalAddress",
        addressLocality: cfg.addressLocality,
        addressRegion: "NC",
        addressCountry: "US",
      },
      knowsAbout: [
        "Large language models",
        "AI automation",
        "Customer support automation",
        "Document drafting",
        "Internal knowledge search",
        "Data extraction",
      ],
    };
    node.textContent = JSON.stringify(data);
  }

  function enablePreviewMode(cfg) {
    // Keep the demo out of search results.
    var robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute("content", "noindex,nofollow");

    // A small banner so it's clear this is a non-live demo.
    if (!document.querySelector(".preview-banner")) {
      var bar = document.createElement("div");
      bar.className = "preview-banner";
      bar.innerHTML =
        "Preview demo â form submissions are disabled here. " +
        "Switch variant: " +
        '<a href="?site=nc">NC</a> Â· ' +
        '<a href="?site=cary">Cary</a> Â· ' +
        '<a href="?site=rtp">RTP</a>';
      document.body.insertBefore(bar, document.body.firstChild);
    }

    // The real form posts to Netlify; in preview there's no backend, so just
    // route to the (branded) thank-you page instead of erroring on POST.

  }

  function init() {
    apply(pickConfig());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
