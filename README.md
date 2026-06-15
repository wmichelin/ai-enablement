# AI Enablement — Landing Site

A single templated landing page for an LLM-integration services business serving
small & medium businesses in the North Carolina / Research Triangle area. One
static site is deployed once and served from three domains, each rendering the
same page with its own brand, copy, and accent color.

## The three brands

All three domains serve the **same page**, customized at runtime by hostname:

| Domain | Brand | Focus | Accent |
| --- | --- | --- | --- |
| `ncartificialintelligence.com` | NC Artificial Intelligence | Statewide North Carolina | Blue |
| `caryncai.com` | Cary AI | Local, Cary NC | Teal |
| `rtpaisolutions.com` | RTP AI Solutions | Research Triangle / tech corridor | Indigo |

Each lead is tagged with the domain it came from (`site_domain` / `site_brand`
hidden fields) so submissions can be attributed to the right site.

## Live preview (GitHub Pages)

A preview deploys automatically via GitHub Actions to:

**https://wmichelin.github.io/ai-enablement/**

Because branding is chosen by hostname, use `?site=` to preview each brand from
that one URL:

- NC: <https://wmichelin.github.io/ai-enablement/?site=nc>
- Cary: <https://wmichelin.github.io/ai-enablement/?site=cary>
- RTP: <https://wmichelin.github.io/ai-enablement/?site=rtp>

The GitHub Pages host runs in **preview mode**: it's marked `noindex` (so the
preview doesn't compete with the production domains in search) and the form is
disabled (it has no backend there). Production runs on Netlify with the three
custom domains — see *Deploying* below.

### One-time setup to turn the preview on

GitHub won't let the Actions token enable Pages for the very first time, so flip it
on once (takes ~10 seconds):

1. Go to **Settings → Pages → Build and deployment**.
2. Set **Source: GitHub Actions**.
3. Re-run the latest "Deploy sample to GitHub Pages" workflow (Actions tab →
   the run → **Re-run jobs**), or just push any commit.

After that, every push to the deploy branch republishes the preview automatically.

## How it works

- **One static site**, deployed once, with all three domains pointed at it.
- `public/assets/config.js` holds the per-domain copy, brand, and accent color.
- `public/assets/main.js` reads `window.location.hostname` and applies the right
  brand — fills in headings, colors, meta tags, and the form's hidden domain tag.
- The contact form is **plain static HTML** so Netlify detects it automatically and
  **emails each submission to you** — no backend, no API keys, free.

```
public/
  index.html        # the landing page (static form lives here)
  thanks.html       # post-submit thank-you page
  favicon.svg
  robots.txt
  assets/
    config.js       # <-- edit per-domain copy here
    main.js         # applies the right brand at runtime
    styles.css
netlify.toml        # publish config (no build step)
```

## Deploying (free: hosting + forms + email)

This is set up for **Netlify**, which gives you free static hosting, free form
handling (100 submissions/month), and **built-in email notifications** to your
inbox — no third-party services or secrets required.

### 1. Push this repo to GitHub
Merge the working branch into your default branch when ready.

### 2. Create the Netlify site
1. Sign in at <https://app.netlify.com> (free account).
2. **Add new site → Import an existing project** → pick this GitHub repo.
3. Build settings are read from `netlify.toml`:
   - Build command: *(empty)*
   - Publish directory: `public`
4. Deploy. You'll get a `something.netlify.app` URL — open it to preview
   (preview URLs fall back to the NC brand).

### 3. Attach all three domains
In **Site configuration → Domain management → Add a domain**, add:
- `ncartificialintelligence.com`
- `caryncai.com`
- `rtpaisolutions.com`

Netlify lets one site have multiple custom domains (one primary + the rest as
**domain aliases**) on the free plan. For each domain, point DNS at Netlify
(either move nameservers to Netlify DNS, or add the `CNAME`/`A` records Netlify
shows you at your registrar). Netlify provisions free HTTPS certs for all three.

> Because branding is chosen by hostname at runtime, each domain automatically
> renders its own brand — no separate deploys needed.

### 4. Turn on email notifications for leads
1. Submit the form once on the live site so Netlify registers it (named
   `ai-interest`).
2. Go to **Site configuration → Forms → Form notifications → Add notification →
   Email notification**.
3. Set the destination address. Done — every submission now emails you, including
   the `site_domain` field so you know which site produced it.

You can also see/export all submissions under the **Forms** tab.

## Analytics (optional)

To track traffic per site for free, add a lightweight, privacy-friendly analytics
tag (e.g. [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) or
[GoatCounter](https://www.goatcounter.com/)). Drop the snippet into the `<head>`
of `public/index.html`. The `site_domain` tag on each lead identifies which page
produced it even though all sites share one Netlify Forms inbox.

## SEO

Each domain is search-optimized independently, generated per-brand at runtime:

- **Per-brand `<title>`, meta description, and keywords** tuned to each name and
  location (e.g. "AI consultant Cary NC" vs "AI solutions RTP").
- **Self-referencing canonical** on each domain — each is canonical for itself, the
  standard way to handle near-duplicate content across domains.
- **Open Graph + Twitter Card** tags with a **custom share image per brand**
  (`assets/og-*.png`, 1200×630) so links unfurl nicely in social/Slack/iMessage.
- **JSON-LD structured data** (`ProfessionalService`) with `areaServed` and a local
  address region for local/map search results.
- **`robots.txt`** + **`sitemap.xml`** listing all three homepages.
- `theme-color` set to each brand's accent.

After launch, submit `sitemap.xml` for each domain in **Google Search Console**
(and Bing Webmaster Tools) to get them indexed. Edit per-brand SEO copy in
`public/assets/config.js` (the `keywords`, `areaServed`, `addressLocality`, and
`ogImage` fields).

## Editing copy

All per-domain text and colors live in `public/assets/config.js`. Shared copy
(offerings, how-it-works, trust section) lives in `public/index.html`. No build
step — edit, commit, push, and Netlify redeploys.

## Local preview

```bash
cd public
python3 -m http.server 8000
# open http://localhost:8000  (renders the NC fallback brand)
```

To preview a specific brand locally, append `?site=nc`, `?site=cary`, or
`?site=rtp` to the URL.
