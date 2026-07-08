# GTA VI Release Countdown — [gta6.date](https://gta6.date/)

A fast, responsive, dark-themed site with a live countdown to the official
**Grand Theft Auto VI** release: **November 19, 2026** on PS5 & Xbox Series X|S.

## Features

- **Live countdown** — split-flap days/hours/minutes/seconds, updated every second
- **Local timezone** — shows the release moment converted to the visitor's timezone
- **Progress bar** — how far we've come since Trailer 1 (Dec 2023)
- **Milestone banners** — celebratory alerts at 1 year, 100 days, 1 week, etc.
- **Trailer modals** — Trailer 1 & 2 embedded from YouTube
- **Pre-order menu** — links to PlayStation, Xbox, and Rockstar
- **Add to Calendar** — Google, Apple, Outlook, Yahoo
- **Share** — native Web Share API with a copy-to-clipboard fallback
- **Fast & light** — responsive AVIF/WebP/JPG background with an instant blurred placeholder
- **Accessible** — semantic HTML, screen-reader countdown, and `prefers-reduced-motion` support
- **SEO-ready** — Open Graph/Twitter card, JSON-LD, sitemap, robots.txt, PWA manifest

## Project structure

```
index.html               Markup + head/meta/JSON-LD
styles.css               All styling (CSS variables, responsive, reduced-motion)
script.js                Countdown, trailers, calendar, pre-order, share
site.webmanifest         PWA manifest
robots.txt / sitemap.xml SEO
CNAME                    Custom domain (gta6.date) — do not delete
scripts/
  optimize-images.mjs    Regenerates responsive images from the 8K source
assets/
  gta6-bg-8k.jpg         Source background (not served to browsers)
  bg-{768,1280,1920}.{avif,webp,jpg}   Responsive variants (generated)
  og-image.jpg           1200×630 social-share card (generated)
  bg-lqip.txt            Inline base64 LQIP (generated)
  favicon / app icons
```

## Customizing

Almost everything is driven by the `CONFIG` object at the top of `script.js`
(release date, reveal date, trailer IDs, pre-order links, calendar event). Update
it and the countdown, calendar, share text, and timezone line all follow.

> When you change the date, also update the matching static strings in
> `index.html` (`<title>`, meta description, Open Graph/Twitter, and the JSON-LD
> `datePublished`) — these are the no-JavaScript fallback.

Colors/theme live in the `:root` CSS variables in `styles.css`.

## Regenerating images

The background and social card are generated from `assets/gta6-bg-8k.jpg` with
[sharp](https://sharp.pixelplumbing.com/):

```bash
npm install          # installs sharp (dev dependency)
npm run optimize     # writes bg-*.{avif,webp,jpg}, og-image.jpg, bg-lqip.txt
```

Re-run whenever the source image changes.

## Deployment

Hosted on **GitHub Pages** with the custom domain in `CNAME`. Any push to `main`
auto-deploys in ~1 minute. Keep `CNAME` in place and "Enforce HTTPS" enabled in
**Settings → Pages**.

## License

MIT.
