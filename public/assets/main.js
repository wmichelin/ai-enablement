/*
 * Applies the per-domain configuration at runtime.
 *
 * The same static page is served from all three domains. Here we look up the
 * config for the current hostname, fill in every [data-bind] slot, set the
 * accent color, and tag the lead form with which domain/variant the visitor
 * landed on — so form submissions are segmented by domain in Netlify.
 */
(function () {
  function pickConfig() {
    var host = window.location.hostname.replace(/^www\./, "").toLowerCase();
    return (window.SITE_CONFIG && window.SITE_CONFIG[host]) || window.SITE_CONFIG_DEFAULT;
  }

  function apply(cfg) {
    if (!cfg) return;

    // Accent color drives the whole theme via CSS custom properties.
    var root = document.documentElement;
    if (cfg.accent) root.style.setProperty("--accent", cfg.accent);
    if (cfg.accentDark) root.style.setProperty("--accent-dark", cfg.accentDark);

    // Fill every element that opts in with data-bind="<key>".
    // A few keys are computed rather than read straight from the config.
    var computed = {
      title: cfg.brand + " — AI for " + cfg.region + " businesses",
      description: cfg.subhead,
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
      } else {
        // config values may contain intentional markup (e.g. &nbsp;)
        el.innerHTML = value;
      }
    });

    // Tag the lead form so every submission records its source domain/brand.
    var domainField = document.querySelector('input[name="site_domain"]');
    var brandField = document.querySelector('input[name="site_brand"]');
    if (domainField) domainField.value = window.location.hostname;
    if (brandField) brandField.value = cfg.brand;
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
