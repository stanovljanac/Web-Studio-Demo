// Prerenders the React app into the four built HTML pages, so every
// page ships its real content (not an empty <div id="root">).
// Runs after `vite build` and `vite build --ssr src/entry-server.tsx`.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Final public origin of the site — used in canonical, hreflang,
// og:url/og:image, JSON-LD, sitemap.xml and robots.txt.
const SITE_URL = "https://mihailobuilds.com";

const root = process.cwd();
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, themeColor } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

const PAGES = [
  { file: "index.html", locale: "en", page: "home" },
  { file: "sr/index.html", locale: "sr", page: "home" },
  { file: "privacy/index.html", locale: "en", page: "privacy" },
  { file: "sr/privatnost/index.html", locale: "sr", page: "privacy" },
];

for (const p of PAGES) {
  const file = path.join(dist, p.file);
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes("<!--app-html-->")) throw new Error(`Missing <!--app-html--> in ${p.file}`);
  const out = html
    .replace("<!--app-html-->", render(p.locale, p.page))
    .replaceAll("__SITE_URL__", SITE_URL)
    .replaceAll("__THEME_COLOR__", themeColor);
  fs.writeFileSync(file, out);
}

for (const f of ["sitemap.xml", "robots.txt"]) {
  const file = path.join(dist, f);
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").replaceAll("__SITE_URL__", SITE_URL));
}

fs.rmSync(ssrDir, { recursive: true, force: true });

// Placeholders ([[…]]) must never reach production. The production build on
// Vercel (VERCEL_ENV=production, i.e. `main`) fails while any are left;
// preview and local builds only warn, so previews keep working in the
// meantime. STRICT_PLACEHOLDERS=1 makes a local build fail the same way.
const leftovers = [];
for (const f of [...PAGES.map((p) => p.file), "sitemap.xml", "robots.txt"]) {
  const matches = fs.readFileSync(path.join(dist, f), "utf8").match(/\[\[[^\]]*\]\]/g) ?? [];
  if (matches.length) leftovers.push(`  ${f}: ${[...new Set(matches)].join(", ")}`);
}
console.log(`prerendered ${PAGES.length} pages`);
if (leftovers.length) {
  const strict = process.env.VERCEL_ENV === "production" || process.env.STRICT_PLACEHOLDERS === "1";
  const msg = "Placeholders left — fill these in before production:\n" + leftovers.join("\n");
  if (strict) {
    console.error(`\n✖ ${msg}\n`);
    process.exit(1);
  }
  console.warn(`\n⚠ ${msg}\n`);
}
