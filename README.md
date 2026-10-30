# Web Studio Demo — Northlane Studio

A demo business website for **Northlane Studio**, a fictional web studio that builds websites and landing pages for small businesses. Designed and built by [MihailoBuilds](https://mihailobuilds.com/).

Live: https://demostudio.mihailobuilds.com/

## What is real and what is made up

| Made up | Real |
|---|---|
| The studio, its name and logo | The projects in the Work section: each card links to its live site |
| Every price and number (shown as X, Y, Z, A, B, N chips) | The design, the build and the QA behind this site |
| The email address and phone number | |
| The contact form: it validates, then says nothing was sent | |
| The privacy policy (a sample) | |

The site collects nothing: the form makes no request, and there are no cookies or analytics. A notice on every page load, a "Web Studio Demo" pill in the nav and a no-JS bar say all of this on the page itself; the footer credits Mihailo Builds.

## Stack

- **Vite + React 18 + TypeScript**, two prerendered pages (`/` and `/privacy/`): each ships its full content in the HTML and React hydrates it (`src/entry-server.tsx` + `scripts/prerender.mjs`)
- Plain CSS: tokens in `src/styles/tokens/`, components in `src/styles/ds.css`, page styles in `src/styles/site.css` (white, navy `#0B1B3F`, cobalt `#2F5BFF`)
- Fonts: Manrope + JetBrains Mono, self-hosted in `public/fonts/` (licence in `public/fonts/OFL.txt`), with metric-matched fallbacks so nothing shifts when they load
- No runtime dependencies besides React

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + build + prerender → dist/
npm run preview  # serve dist/ on http://localhost:4173
```

## QA

```bash
npm run qa:numbers  # no digit in the visible text; every placeholder is a demo chip (no browser)
npm run qa:leak     # no real contact data, old location or old page links in dist/ (no browser)
npm run qa:main     # layout shift (also with slow fonts), overflow, console, external requests, nav, contacts, contrast, focus
npm run qa:site     # no-JS, reduced motion, demo notice, keyboard, anchors, links (external links must answer 2xx)
npm run qa:form     # the demo form: validation, "Sending…", success, no request
npm run qa:shots -- pages=/ widths=375,1440   # screenshots → .qa/
```

The browser checks run against `npm run preview` with Playwright, which is not a project dependency: set `PLAYWRIGHT_MODULE` to a Playwright `index.js` (see `scripts/qa/_lib.mjs`) and `QA_BASE` if the preview runs on another port.

## Where to edit

- **Copy**: `src/i18n/en.ts`
- **Prices and numbers**: `src/data/pricing.ts`. Each value is a placeholder written as `{{X}}`; `<DemoText>` shows it as a chip
- **Projects**: `src/data/projects.ts`. Screenshots come from `node scripts/capture-projects.mjs` (see `public/projects/README.txt`)
- **Demo notice and pill**: `src/components/DemoNotice.tsx`; the no-JS bar is in `index.html` and `privacy/index.html`
- **Logo**: `src/components/Logo.tsx` and `public/favicon.svg`. Icons and `public/og.png` come from `npm run build && node scripts/brand-assets.mjs`
- **Domain**: `SITE_URL` in `scripts/prerender.mjs`
