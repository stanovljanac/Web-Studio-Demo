# MihailoBuilds website — working notes for Claude

Read this first in every session. The plan of work, one session per item, is in `docs/ROADMAP.md`.

## People and language
- Owner: **Mihailo**, a QA engineer starting **MihailoBuilds**. Talk to him in **Serbian**. Code, comments, commit messages and PR text are in **English**.
- He reviews every change on the Vercel preview and decides. Ask before taking anything that is his call: copy tone, prices, design direction.

## What the business is
- MihailoBuilds sells **websites and landing pages for small businesses**, with practical extras: a contact form, links to booking services, and similar.
- It is **not** SaaS and not complex web apps.
- The projects shown are **personal projects** and are labelled that way. The goal of the site is to win the **first client**.

## Locked decisions (do not reopen without Mihailo)
- **Routes:** English at `/`, Serbian at `/sr/`; privacy at `/privacy/` and `/sr/privatnost/`. hreflang `x-default` → `/`.
- **No location** anywhere on the site. He works remotely.
- **Domain:** `mihailobuilds.com` (confirmed in roadmap session 8; `SITE_URL` in `scripts/prerender.mjs`).
- **Timelines** (FAQ): landing page 1–2 weeks, business website 2–4 weeks.
- **Prices:**
  - Shown as starting prices ("from €X"): landing page from €200, business website from €400 (`src/data/pricing.ts`, roadmap session 8).
  - **Maintenance has no fixed price.** It is agreed with each client, based on their needs; the site says "By agreement". Work that takes longer is billed at €15 per hour (`PRICING.hourly`).
  - **Special offer:** "the next three client projects at a lower price".
    - Landing page from €120, business website from €250.
    - Controlled by `OFFER.open` (true/false) in `src/data/pricing.ts`.
    - No counter. Covers the core build only.
    - Never tied to Google reviews; that is against Google policy.
- **Process:**
  1. Written proposal + deposit
  2. Design approval
  3. Build with **2 revision rounds** within the agreed scope
  4. Launch + **30-day warranty**

  After design approval, a new design, new sections, new features or replacing all the content count as new work. Outages of third-party services are the provider's responsibility.
- **Contact form:** part of the base price only if the client wants one. Complex forms are add-ons.
- **Booking** must be described honestly. On the salon project it is a design concept; in production it connects to a booking service (e.g. Cal.com). Out of the box Mihailo connects a form to email; anything more is extra time and money.
- **Copy must not expand the scope.** No promises of Google rankings, more customers, guaranteed results and the like.
- **Live project sites** (`*.mihailobuilds.com`) are separate projects. Never change them from this repo.

## Contact data rule (hard requirement from Mihailo)
- The email address and phone number are **never visible** on the page and **never appear as plain text** in `dist/`.
- They are also **never written in plain text anywhere in the repo**: code, docs, comments, commit messages, PR descriptions. Scrapers read GitHub too.
- They are stored as character codes in `src/data/contact.ts`.
- `<ContactLink kind="email|viber|whatsapp">` (`src/components/Email.tsx`) links to `#contact`. The real `mailto:` / `viber:` / `wa.me` address is set only on click or middle-click.
- `{email}` in a dictionary string renders an inline "by email" link (`<WithEmail>`).
- The hints under the links ("Opens your email app" etc.) stay. They tell the visitor that an app will open, since no address is shown.
- This deters scrapers; it is not security.
- **Check:** after every build run `npm run qa:leak`, plus the contact block of `npm run qa:main`.
- **Form:** Web3Forms (`VITE_WEB3FORMS_ACCESS_KEY`), hidden honeypot `botcheck`, and a guard against double submits.
- **Privacy policy** (`privacy` in `en.ts` / `sr.ts`): every statement about Web3Forms, Vercel and Google comes from their own terms (sources in the session 8 PR). Email is Gmail. When the services, the form or the analytics change, re-check the text against their current terms and update the "Last updated" date.

## Architecture
- **Stack:** Vite 5 multi-page app (`appType: "mpa"`), React 18 + TypeScript, plain CSS. There is no router.
- **Pages:** four real HTML entries — `index.html` (en), `sr/index.html`, `privacy/index.html`, `sr/privatnost/index.html`.
  - Each holds its own `<title>`, description, canonical, hreflang, OG tags and `<div id="root" data-page="home|privacy"><!--app-html--></div>`.
- **Prerender:** `npm run build` runs these steps:
  1. `tsc`
  2. client build
  3. SSR build of `src/entry-server.tsx`
  4. `scripts/prerender.mjs`, which injects the markup, replaces `__SITE_URL__` (HTML, `sitemap.xml`, `robots.txt`) and `__THEME_COLOR__` (`themeColor` in `src/entry-server.tsx`: the offer bar's colour while `OFFER.open`, else white), and checks for leftover `[[…]]` placeholders (fails the production build, see below)
- **Client:** `src/main.tsx` hydrates the page. Locale comes from `<html lang>`, page from `data-page`.
- **i18n:** `src/i18n/en.ts` and `sr.ts` hold **all copy**. They are typed, so `sr` must match the shape of `en`.
  - `useLocale()` / `useT()` read it.
  - `PATHS` and `sectionHref(locale, page, id)` build links.
  - Never hardcode copy in components.
- **Data:** `src/data/projects.ts` (work cards), `src/data/pricing.ts` (prices + offer), `src/data/contact.ts`, `src/data/shots.ts` (screenshot `srcset`/size; generated by `scripts/capture-projects.mjs`, never edited by hand).
- **Components** (`src/components/`): Nav (with the special-offer bar), Hero, Audience, Projects, Services (contains the offer block), Process, About, Faq, Contact, Privacy, Footer, LangSwitch, Logo, Email (ContactLink), Reveal.
  - The hero deliberately does not use `<Reveal>`: it must be visible before JS runs.
- **Styles:** `src/styles/index.css` imports, in this order:
  1. `fonts.css` (self-hosted `@font-face` + metric-matched fallbacks, see "Design")
  2. `tokens/` (colours, type, spacing, radii/shadows/motion, base reset)
  3. `ds.css` (Button, Input, Textarea: the primitives exported from `src/ds`)
  4. `site.css` (page layout and sections, using the tokens only)
- **Logo:** MB monogram drawn as SVG paths in `src/components/Logo.tsx`, coloured by CSS variables; also `public/favicon.svg`. Keep it simple: no font tooling.
- **Brand files:** `public/favicon.ico`, `public/apple-touch-icon.png` and the OG images (`public/og-en.png`, `og-sr.png`, 1200×630) come from `npm run build && node scripts/brand-assets.mjs`: icons from `favicon.svg`, OG images from the built hero copy in the site's fonts and colours. Run it again when the hero copy, the logo or the colours change.
- **Other:** `vercel.json` sets `trailingSlash: true`. Locally, URLs without a trailing slash return 404 in `vite preview`; that is expected.
- **Placeholders:** written as `[[…]]`. The build lists the ones left in the four pages, `sitemap.xml` and `robots.txt`. **None may reach `main`:** with `VERCEL_ENV=production` (the production deploy from `main`) or `STRICT_PLACEHOLDERS=1` the build fails; preview and local builds only warn.

## Design (Kobalt)
- Chosen in roadmap session 7. White canvas, navy ink `#0B1B3F`, cobalt accent `#2F5BFF`, rounded corners, soft navy shadows. All values are tokens in `src/styles/tokens/`; there are no theme classes.
- **Type:** Manrope (text and headings; display headings uppercase or 800 with tight tracking) and JetBrains Mono (eyebrows, labels, language switch).
  - Self-hosted in `public/fonts/` (latin + latin-ext, as served by Google Fonts, unmodified), with `OFL.txt` (licence + copyright lines). Nothing is loaded from Google; `qa:main` checks that the pages make no external requests.
  - Do not run your own subsetter over the fonts; to update them, download the new files from Google Fonts, give them new names (`vercel.json` caches `/fonts/` for a year) and update `fonts.css`, the preload links and `OFL.txt`.
  - `font-display: swap` with metric-matched fallbacks in `fonts.css` (Arial/Liberation Sans, Roboto on Android, one face per weight; the uppercase hero title has its own). The latin Manrope file is preloaded on every page, latin-ext too on the Serbian ones.
- **Hero:** uppercase Manrope 800 title with a marker accent (accent band behind the last words), hard offset phone shadow (6px; the work-card phone 4px).
- **Special offer bar** above the nav (`.offer-bar` in `Nav.tsx`, fixed with it) while `OFFER.open`. Its height is `--bar-h` (40px, 36px with shorter text up to 640px), which the hero, the privacy page and anchor offsets add. It and the footer reminder link to `#offer` (from the privacy page to `/#offer`).
- **Tablets (641–900px):** the hero and the About section keep the desktop layout (copy left, phone 210px or photo right), so the whole hero fits the first screen. They stack at 640px and below.
- **Contact hints** ("Opens your email app") are deliberately quieter (12px, contrast 4.68).
- **Language switch:** inline SVG flags (decorative, `aria-hidden`) + EN/SR; Mihailo decided to keep the flags (session 7).

## Branches, previews, PRs
- **`main` is production** (the old site is live). Do not touch it until launch (roadmap session 8).
- **The integration branch is `claude/loving-noether-cqi5ff`.** It has a Vercel preview (`<preview-url>/`).
- **One session = one roadmap item:**
  1. Start from `origin/claude/loving-noether-cqi5ff`, not from `main`. Use the branch name the session gives you, but base it on the integration branch:
     `git fetch origin claude/loving-noether-cqi5ff && git checkout -B <session-branch> origin/claude/loving-noether-cqi5ff`
  2. Do only that item.
  3. Build, QA and look at the screenshots.
  4. Commit and push.
  5. Open a PR with **base `claude/loving-noether-cqi5ff`**, never `main`.
  6. Put the Vercel preview link in the PR description and set the item's status in `docs/ROADMAP.md`.
  7. Mihailo reviews the preview and merges.
- **Order:** code sessions run one after another, because they all touch `site.css`; merge the previous PR first. Research sessions can run at any time, in parallel.
- **Tooling:** there is no `gh` CLI; use the GitHub MCP tools.
- **Finding the preview URL:** the Vercel bot comments on the PR. Otherwise use the GitHub deployments API: `deployments?ref=<branch>`, then `/statuses`, and read `environment_url`.

## Commands and QA
```bash
npm install
npm run build                    # tsc + build + prerender; lists placeholders left
npm run qa:leak                  # contact data in dist/? (no browser needed)
npm run preview                  # serves dist/ on :4173 — run it in the background for the checks below
npm run qa:main                  # CLS (also with the fonts delayed 1.5 s), overflow, console, no external requests, nav fits 320–1280 px, contacts, contrast, focus (~2 min)
npm run qa:site                  # no-JS, reduced motion, keyboard, FAQ, anchors, language switch, links
npm run qa:shots -- pages=/,/sr/ widths=375,1440 viewport=1   # screenshots → .qa/ (git-ignored); see the header of scripts/qa/shots.mjs
node scripts/qa/form.mjs nokey   # form states, build without a Web3Forms key
VITE_WEB3FORMS_ACCESS_KEY=test npm run build && node scripts/qa/form.mjs key   # mocked API: loading, success, errors, one call on double submit
```
- **Look at the screenshots** (open the PNGs) before calling a visual change done. Check 320, 375 and 1440 px (and 641–900 px when the hero or About changes), `/` and `/sr/`; Serbian text is longer.
- **Baseline** (after session 7):
  - no horizontal overflow, clean console, no external requests; nothing in the nav outside the viewport (`.page` clips overflow, so it would not show as a scrollbar)
  - CLS 0.000 on all four pages; at most ~0.01 with the fonts delayed. Keep it **< 0.05**.
  - contacts clean
  - lowest contrast 4.68 (the contact hints, deliberately quieter); keep small text at **≥ 4.5**. Hidden elements are skipped.
  - focus visible

## Cloud environment limits
- **Certificates:** Chromium rejects the sandbox proxy's certificate, so Playwright contexts use `ignoreHTTPSErrors: true` (`scripts/qa/_lib.mjs`). The site itself loads nothing from other origins.
- **Browser:** Playwright is used from the global npm install; the scripts find it. If `PLAYWRIGHT_BROWSERS_PATH` points to the wrong folder, they fall back to `/opt/pw-browsers/chromium`. Never run `playwright install`.
- **Network:** the environment uses a custom allowlist.
  - Allowed (since 4 Oct 2026): `*.mihailobuilds.com` (the live projects, for screenshots), the GitHub API, Google Fonts (only needed to download new font files), npm.
  - Blocked: `vercel.com` and `*.vercel.app`. Run QA locally against `npm run preview` and get the preview URL from the GitHub deployments API. Mihailo can add `*.vercel.app` if a session ever needs to open the preview itself.
  - `invoice.mihailobuilds.com` redirects to `/login`. Never log in with a real account or create one. Its card uses Mihailo's own dashboard screenshot with the app's nav (`scripts/sources/invoice-dashboard.webp`).
  - Chromium's own connections to the live sites often fail through the proxy (`net::ERR_TOO_MANY_RETRIES`), even when `curl` gets 200. `scripts/capture-projects.mjs` therefore fetches every request through Playwright (`route.fetch`) with retries.

## Conventions
- **CSS:** use the tokens (`src/styles/tokens/`); no raw colours in `site.css`.
- **Accessibility:**
  - keyboard focus always visible
  - small-text contrast ≥ 4.5
  - `prefers-reduced-motion` respected
  - content visible without JS
- **Images:** set `width`/`height` on every image (no layout shift). Project screenshots live in `public/projects/` and come only from `node scripts/capture-projects.mjs` (desktop 1440×900 @2x, mobile 390×844 @3x, WebP + `srcset`); see `public/projects/README.txt`. The card frames are 16:10 browser frames drawn in CSS (`.browser` in `site.css`); the `sizes` in `Projects.tsx` follow the card widths.
- **Docs:** keep `README.md` and this file up to date when you change how something works or where it is edited.
