# MihailoBuilds — Website

The website for **MihailoBuilds**: websites and landing pages for small businesses. Bilingual (English at `/`, Serbian at `/sr/`), prerendered to static HTML.

## Stack

- **Vite + React + TypeScript**, multi-page build: one real HTML file per page and language
- **Prerendered**: each page ships its full content in the HTML and React hydrates it (`src/entry-server.tsx` + `scripts/prerender.mjs`)
- Plain CSS design system ("Kobalt": white, navy, cobalt `#2F5BFF`): tokens in `src/styles/tokens/`, components in `src/styles/ds.css`, page styles in `src/styles/site.css`
- Contact form via Web3Forms (`VITE_WEB3FORMS_ACCESS_KEY` in `.env` / Vercel env)
- Fonts: Manrope + JetBrains Mono, self-hosted in `public/fonts/` (latin + latin-ext, licence in `public/fonts/OFL.txt`), declared in `src/styles/fonts.css` with metric-matched fallbacks so nothing shifts when they load
- Logo: MB monogram drawn as SVG shapes in `src/components/Logo.tsx` (coloured by CSS variables); `public/favicon.svg`

## Develop

```bash
npm install
npm run dev      # http://localhost:5173  (Serbian: /sr/)
npm run build    # type-check + build + prerender → dist/
npm run preview  # serve dist/ locally
```

## QA

Browser checks use Playwright (not a project dependency; see `scripts/qa/_lib.mjs`) against `npm run preview`:

```bash
npm run qa:leak     # contact data must not appear in dist/
npm run qa:main     # layout shift (also with slow fonts), overflow, console, external requests, nav, contacts, contrast, focus
npm run qa:site     # no-JS, reduced motion, keyboard, anchors, language switch, links
npm run qa:shots -- pages=/ widths=375,1440   # screenshots → .qa/
node scripts/qa/form.mjs nokey|key            # contact form states (Web3Forms mocked)
node scripts/capture-projects.mjs             # recapture the project screenshots (live sites → public/projects/)
node scripts/brand-assets.mjs                 # favicon.ico, apple-touch-icon.png, OG images (after npm run build)
```

Working notes for Claude are in `CLAUDE.md`; the session-by-session plan is in `docs/ROADMAP.md`.

## Pages

| URL | File |
|---|---|
| `/` | `index.html` (en) |
| `/sr/` | `sr/index.html` |
| `/privacy/` | `privacy/index.html` |
| `/sr/privatnost/` | `sr/privatnost/index.html` |

Each HTML file holds that page's `<title>`, description, canonical, hreflang, Open Graph tags, icons and the font preload. `__SITE_URL__` is replaced with the real domain at build time (set in `scripts/prerender.mjs`), `__THEME_COLOR__` with `themeColor` from `src/entry-server.tsx`. `vercel.json` enforces trailing slashes and caches `/fonts/` for a year.

## Where to edit

- **All copy** (both languages): `src/i18n/en.ts`, `src/i18n/sr.ts`
- **Prices, the hourly rate and the special offer** (`open: false` hides it once the three spots are taken): `src/data/pricing.ts`
- **Email / phone** (Viber, WhatsApp): `src/data/contact.ts` — stored as character codes and never shown on the page. `<ContactLink>` (`src/components/Email.tsx`) points to the contact form and gets its real `mailto:` / `viber:` / `wa.me` address only when clicked. This deters scrapers; it is not a security measure. Use `{email}` in dictionary strings for an inline "by email" link.
- **Projects**: `src/data/projects.ts` (cards). Screenshots are made by `node scripts/capture-projects.mjs` (Playwright + sharp): it captures the live sites, exports WebP in several widths to `public/projects/` and regenerates `src/data/shots.ts`. Run it again when a site changes; see `public/projects/README.txt`
- **Hero phone screenshot**: `SALON_MOBILE_SHOT` in `src/components/Hero.tsx` (also from the capture script)
- **Portrait**: `PHOTO` in `src/components/About.tsx`
- **OG images and icons**: `public/og-en.png`, `public/og-sr.png` (1200×630), `favicon.ico`, `apple-touch-icon.png`: made by `node scripts/brand-assets.mjs` from the built hero and `public/favicon.svg`; run it again after changing the hero copy, the logo or the colours
- **Fonts**: `src/styles/fonts.css` (+ the preload links in the four HTML files)

## Placeholders

Values written as `[[…]]` are placeholders. `npm run build` lists every one that is left — **none may reach production**: the production build on Vercel (`VERCEL_ENV=production`) fails while any remain, and `STRICT_PLACEHOLDERS=1 npm run build` does the same locally. Preview builds only warn. The privacy policy's `[[proveriti]]` items must be checked against the actual terms of Web3Forms and Vercel, not guessed.
