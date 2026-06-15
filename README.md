# AI Enablement — Painted Door Test

A single templated landing page used to **painted-door test three domain names**
for an LLM-integration services business targeting small & medium businesses in
the North Carolina / Research Triangle area.

The goal: stand up a credible page for each name, send a little traffic, and see
**which name/positioning gets the most "I'm interested" form submissions** —
before building any actual service.

## The three variants

All three domains serve the **same page**, customized at runtime by hostname:

| Domain | Brand | Angle | Accent |
| --- | --- | --- | --- |
| `ncartificialintelligence.com` | NC Artificial Intelligence | Statewide North Carolina | Blue |
| `caryncai.com` | Cary AI | Hyper-local, Cary NC | Teal |
| `rtpaisolutions.com` | RTP AI Solutions | Research Triangle / tech corridor | Indigo |

Every lead is **tagged with the domain it came from** (`site_domain` / `site_brand`
hidden fields), so you can compare conversion across the three names.

## How it works

- **One static site**, deployed once, with all three domains pointed at it.
- `public/assets/config.js` holds the per-domain copy, brand, and accent color.
- `public/assets/main.js` reads `window.location.hostname` and applies the right
  variant — fills in headings, colors, meta tags, and the form's hidden domain tag.
- The lead form is **plain static HTML** so Netlify detects it automatically and
  **emails each submission to you** — no backend, no API keys, free.

```
public/
  index.html        # the landing page (static form lives here)
  thanks.html       # post-submit thank-you page
  favicon.svg
  robots.txt
  assets/
    config.js       # <-- edit per-domain copy here
    main.js         # applies the right variant at runtime
    styles.css
netlify.toml        # publish config (no build step)
```

## Deploying (free: hosting + forms + email)

This is set up for **Netlify**, which gives you free static hosting, free form
handling (100 submissions/month), and **built-in email notifications** to your
inbox — no third-party services or secrets required.

### 1. Push this repo to GitHub
Already on branch `claude/painted-door-test-f4rfdu`. Merge to your default branch
when ready.

### 2. Create the Netlify site
1. Sign in at <https://app.netlify.com> (free account).
2. **Add new site → Import an existing project** → pick this GitHub repo.
3. Build settings are read from `netlify.toml`:
   - Build command: *(empty)*
   - Publish directory: `public`
4. Deploy. You'll get a `something.netlify.app` URL — open it to preview
   (preview URLs fall back to the NC variant).

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
> renders its own variant — no separate deploys needed.

### 4. Turn on email notifications for leads
1. Submit the form once on the live site so Netlify registers it (named
   `ai-interest`).
2. Go to **Site configuration → Forms → Form notifications → Add notification →
   Email notification**.
3. Send to **wmichelin@gmail.com**. Done — every submission now emails you,
   including the `site_domain` field so you know which name it came from.

You can also see/export all submissions under the **Forms** tab.

## Reading the painted-door results

For each domain, compare **submissions ÷ visitors**. To get visitor counts for
free, add a lightweight, privacy-friendly analytics tag (recommended:
[Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) or
[GoatCounter](https://www.goatcounter.com/) — both free). Drop the snippet into
`<head>` of `public/index.html`. Then:

- **Highest conversion** = the name/positioning that resonates most.
- The `site_domain` tag on each lead tells you which page produced it even though
  they share one Netlify Forms inbox.

Drive traffic evenly (e.g. equal ad budget or rotating links) so the comparison
is fair.

## Editing copy

All per-domain text and colors live in `public/assets/config.js`. Shared copy
(offerings, how-it-works, trust section) lives in `public/index.html`. No build
step — edit, commit, push, and Netlify redeploys.

## Local preview

```bash
cd public
python3 -m http.server 8000
# open http://localhost:8000  (renders the NC fallback variant)
```

To preview a specific variant locally, temporarily change the host lookup in
`main.js`, or add a hosts-file entry pointing one of the domains to `127.0.0.1`.
