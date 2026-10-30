/* Screenshots of the live project sites, for the work cards and the hero phone.
   Run it again whenever one of the sites changes:

     node scripts/capture-projects.mjs                  capture every site, then export
     node scripts/capture-projects.mjs sites=keeper     capture only these sites, then export
     node scripts/capture-projects.mjs export           export only, from the last capture

   1. Capture (Playwright): every FRAME of every site, on desktop (1440×900 @2x)
      and mobile (390×844 @3x), viewport only (no full-page strips), after fonts,
      images and canvas/3D animations have settled. The PNGs go to
      .capture/projects/ (git-ignored); look through them to pick a frame.
   2. Export (sharp): the frames listed in USE become WebP files in several
      widths in public/projects/, and src/data/shots.ts (srcset, width, height)
      is regenerated. Only what USE lists is exported.

   The invoice app needs a login, so it is never captured: its card uses
   Mihailo's own dashboard screenshot (with the app's nav) from scripts/sources/.
   Never log in to it or create an account. */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { ROOT, launchChromium, log } from "./qa/_lib.mjs";

const CAPTURE = join(ROOT, ".capture/projects");
const PUBLIC = join(ROOT, "public/projects");

const UA_DESKTOP = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
const UA_MOBILE = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36";
const DEVICES = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, userAgent: UA_DESKTOP },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: UA_MOBILE },
};
/* Exported widths (px). Desktop: the largest card frame is ~720 CSS px, so 1600
   covers it on 2x screens. Mobile: the hero phone screen is at most 270 CSS px. */
const WIDTHS = { desktop: [640, 960, 1280, 1600], mobile: [300, 450, 600, 810] };

/* Frames: null = top of the page; a selector = that section, scrolled to just
   below the site's own fixed or sticky nav, so the nav stays in the shot.
   The salon's hero is not used on the cards: the phone in our own hero shows it. */
const SITES = {
  "mb-hair-salon": {
    url: "https://mbhairsalon.mihailobuilds.com/",
    frames: { top: null, services: "#services", stylists: "#stylists", gallery: "#gallery", book: "#book", visit: "#visit" },
  },
  keeper: { url: "https://keeper.mihailobuilds.com/", frames: { top: null } },
  "automation-desk": { url: "https://automationdesk.mihailobuilds.com/", frames: { top: null } },
};

/* What goes on the site: output name → a captured frame or a source file. */
const USE = {
  "mb-hair-salon": { site: "mb-hair-salon", device: "desktop", frame: "book" },
  "mb-hair-salon-mobile": { site: "mb-hair-salon", device: "mobile", frame: "top" },
  "mb-hair-salon-mobile-gallery": { site: "mb-hair-salon", device: "mobile", frame: "gallery" },
  keeper: { site: "keeper", device: "desktop", frame: "top" },
  "automation-desk": { site: "automation-desk", device: "desktop", frame: "top" },
  invoice: { file: "scripts/sources/invoice-dashboard.webp", device: "desktop" },
};

const arg = Object.fromEntries(process.argv.slice(2).map((a) => [a.split("=")[0], a.split("=")[1] ?? true]));
const capturePath = (site, device, frame) => join(CAPTURE, `${site}-${device}-${frame}.png`);

if (!arg.export) await capture((arg.sites || Object.keys(SITES).join(",")).split(","));
await exportShots();

/* --- Capture ------------------------------------------------ */
async function capture(sites) {
  mkdirSync(CAPTURE, { recursive: true });
  const browser = await launchChromium();
  const cache = new Map();
  for (const slug of sites) {
    const site = SITES[slug];
    if (!site) throw new Error(`Unknown site "${slug}". Known: ${Object.keys(SITES).join(", ")}`);
    for (const [device, opts] of Object.entries(DEVICES)) {
      const ctx = await browser.newContext({ ignoreHTTPSErrors: true, ...opts });
      await routeWithRetries(ctx, cache);
      const page = await ctx.newPage();
      await page.goto(site.url, { waitUntil: "networkidle", timeout: 120_000 });
      await page.evaluate(() => document.fonts.ready);
      await scrollThrough(page);
      for (const [frame, selector] of Object.entries(site.frames)) {
        await scrollToFrame(page, selector);
        await settle(page);
        await page.screenshot({ path: capturePath(slug, device, frame), animations: "allow", caret: "hide" });
        log("captured", slug, device, frame);
      }
      await ctx.close();
    }
  }
  await browser.close();
}

/* The sandbox proxy drops some of Chromium's own connections
   (net::ERR_TOO_MANY_RETRIES), so every request is fetched by Playwright
   with retries. Successful GETs are cached across devices. */
async function routeWithRetries(ctx, cache) {
  await ctx.route(/^https?:/, async (route) => {
    const req = route.request();
    const key = req.method() === "GET" ? req.url() : null;
    if (key && cache.has(key)) return route.fulfill(cache.get(key)).catch(() => {});
    for (let i = 0; ; i++) {
      try {
        const res = await route.fetch({ maxRetries: 2, timeout: 45_000 });
        const headers = res.headers();
        delete headers["content-encoding"]; // the body is already decoded
        delete headers["content-length"];
        const hit = { status: res.status(), headers, body: await res.body() };
        if (key && res.ok()) cache.set(key, hit);
        return await route.fulfill(hit);
      } catch (e) {
        if (i === 3 || /closed|disposed/i.test(e.message)) return route.abort().catch(() => {});
      }
    }
  });
}

/* Scroll the whole page once, so scroll-triggered reveals and lazy images load. */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.round(innerHeight / 2);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 120));
    }
  });
}

/* Top of the page, or the section just below the site's fixed/sticky nav.
   It scrolls past the target first and then back up, because some navs hide
   while the page scrolls down. */
async function scrollToFrame(page, selector) {
  await page.evaluate(async (selector) => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    let y = 0;
    if (selector) {
      const el = document.querySelector(selector);
      if (!el) throw new Error(`${selector} not found on ${location.href}`);
      const nav = [...document.querySelectorAll("header, nav")].find((n) => {
        const s = getComputedStyle(n);
        return (s.position === "fixed" || s.position === "sticky") && n.getBoundingClientRect().top <= 1;
      });
      y = el.getBoundingClientRect().top + scrollY - (nav ? nav.getBoundingClientRect().height : 0);
    }
    window.scrollTo({ top: y + 400, behavior: "instant" });
    await wait(150);
    window.scrollTo({ top: y, behavior: "instant" });
  }, selector);
}

/* Fonts, every image in the viewport decoded, then time for entrance
   animations and canvas/3D scenes. */
async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const visible = [...document.images].filter((img) => {
      const r = img.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight && r.width > 0;
    });
    await Promise.all(visible.map((img) => (img.complete ? img.decode().catch(() => {}) : new Promise((r) => { img.onload = img.onerror = r; }))));
  });
  await page.waitForTimeout(3000);
}

/* --- Export ------------------------------------------------- */
async function exportShots() {
  for (const f of readdirSync(PUBLIC)) if (/\.(webp|png)$/.test(f)) rmSync(join(PUBLIC, f));
  const entries = [];
  for (const [name, use] of Object.entries(USE)) {
    const input = use.file ? join(ROOT, use.file) : capturePath(use.site, use.device, use.frame);
    // Desktop shots are cut to exactly 16:10 (the source screenshot of the invoice app is not).
    let img = sharp(input);
    const meta = await img.metadata();
    let { width, height } = meta;
    if (use.device === "desktop" && Math.abs(width / height - 1.6) > 0.001) {
      height = Math.round(width / 1.6);
      img = img.extract({ left: 0, top: 0, width, height });
    }
    const master = await img.png().toBuffer();
    const widths = WIDTHS[use.device].filter((w) => w < width).concat(width > Math.max(...WIDTHS[use.device]) ? [] : [width]);
    const files = [];
    for (const w of widths) {
      const file = `${name}-${w}.webp`;
      await sharp(master).resize({ width: w }).webp({ quality: 82, smartSubsample: true, effort: 6 }).toFile(join(PUBLIC, file));
      files.push({ file, w });
    }
    // width/height on the <img>: the CSS size of the capture (only the ratio matters).
    const dpr = use.file ? 1 : DEVICES[use.device].deviceScaleFactor;
    const fallback = files.find((f) => f.w >= (use.device === "desktop" ? 960 : 600)) ?? files.at(-1);
    entries.push({
      name,
      src: `/projects/${fallback.file}`,
      srcSet: files.map((f) => `/projects/${f.file} ${f.w}w`).join(", "),
      width: Math.round(width / dpr),
      height: Math.round(height / dpr),
    });
    log("exported", name, files.map((f) => f.w).join(", "));
  }
  const body = entries
    .map((e) => `  "${e.name}": {\n    src: "${e.src}",\n    srcSet: "${e.srcSet}",\n    width: ${e.width},\n    height: ${e.height},\n  },`)
    .join("\n");
  writeFileSync(
    join(ROOT, "src/data/shots.ts"),
    `/* Generated by scripts/capture-projects.mjs. Do not edit by hand. */\n` +
      `export type Shot = { src: string; srcSet: string; width: number; height: number };\n\n` +
      `export const SHOTS = {\n${body}\n} satisfies Record<string, Shot>;\n`,
  );
  log("→ public/projects/, src/data/shots.ts");
}
