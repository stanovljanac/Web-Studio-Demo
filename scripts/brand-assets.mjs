/* Raster brand files, made from the sources in the repo:

     npm run build && node scripts/brand-assets.mjs

   - public/favicon.ico (16, 32, 48 px) and public/apple-touch-icon.png
     (180 px), from public/favicon.svg
   - public/og-en.png and public/og-sr.png (1200×630), the social preview:
     the hero of the built page (eyebrow, title, accent) next to the phone
     with the salon screenshot, set in the site's own fonts and colours.
     The copy is read from dist/, so it always matches the site; run the
     build first. Run the script again when the hero copy, the logo or the
     colours change. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { ROOT, launchChromium, log } from "./qa/_lib.mjs";

const PUBLIC = join(ROOT, "public");
const read = (p) => readFileSync(join(ROOT, p));
const dataUrl = (p, type) => `data:${type};base64,${read(p).toString("base64")}`;

/* --- Favicons ----------------------------------------------- */
const svg = read("public/favicon.svg");
const png = (size) => sharp(svg, { density: (72 * size) / 40 }).resize(size, size).png().toBuffer();

const icoSizes = [16, 32, 48];
const images = await Promise.all(icoSizes.map(png));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((img, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(icoSizes[i], e); // width
  header.writeUInt8(icoSizes[i], e + 1); // height
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(img.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += img.length;
});
writeFileSync(join(PUBLIC, "favicon.ico"), Buffer.concat([header, ...images]));
writeFileSync(join(PUBLIC, "apple-touch-icon.png"), await png(180));
log("favicon.ico (16, 32, 48), apple-touch-icon.png (180)");

/* --- Open Graph images ---------------------------------------- */
const text = (html, re) => {
  const m = html.match(re);
  if (!m) throw new Error(`${re} not found in the built page. Run \`npm run build\` first.`);
  return m[1].replace(/<!-- -->/g, "").trim();
};
const fontFace = (family, file, weight) =>
  `@font-face { font-family: "${family}"; font-weight: ${weight}; src: url(${dataUrl(`public/fonts/${file}`, "font/woff2")}) format("woff2"); }`;
const phoneShot = dataUrl("public/projects/mb-hair-salon-mobile-600.webp", "image/webp");
const mark = svg.toString().replace(/<svg /, '<svg class="mark" ');

/* Colours and type follow src/styles/tokens/ and the hero in site.css. */
const page = (eyebrow, lead, accent, host) => `<!doctype html><html><head><meta charset="utf-8"><style>
  ${fontFace("Manrope", "manrope-latin.woff2", "400 800")}
  ${fontFace("Manrope", "manrope-latin-ext.woff2", "400 800")}
  ${fontFace("JetBrains Mono", "jetbrains-mono-latin.woff2", "400 600")}
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative; background: #F5F7FB; color: #0B1B3F; font-family: Manrope; -webkit-font-smoothing: antialiased; }
  .copy { position: absolute; left: 72px; top: 60px; width: 720px; height: 510px; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 16px; font: 800 30px/1 Manrope; letter-spacing: -0.02em; }
  .mark { width: 56px; height: 56px; }
  .eyebrow { align-self: flex-start; margin-top: auto; padding: 8px 16px; border-radius: 999px; background: #EEF2FF; color: #1F45E0;
    font: 500 17px/1.4 "JetBrains Mono"; letter-spacing: 0.06em; text-transform: uppercase; }
  h1 { margin-top: 22px; font: 800 64px/0.96 Manrope; letter-spacing: -0.04em; text-transform: uppercase; text-wrap: balance; }
  .accent { color: #FFFFFF; padding: 0 0.12em; -webkit-box-decoration-break: clone; box-decoration-break: clone;
    background: linear-gradient(#2F5BFF, #2F5BFF) left 0 bottom 0.09em / 100% 1.13em no-repeat; }
  .host { margin-top: 30px; font: 500 22px/1 "JetBrains Mono"; color: #59627A; }
  .phone { position: absolute; right: 96px; top: 52px; width: 240px; padding: 9px; border-radius: 40px; background: #0B1B3F; box-shadow: 9px 9px 0 #2F5BFF; }
  .phone img { display: block; width: 100%; aspect-ratio: 390 / 844; border-radius: 31px; object-fit: cover; object-position: top; }
  .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 12px; background: #2F5BFF; }
</style></head><body>
  <div class="copy">
    <div class="brand">${mark}Mihailo Builds</div>
    <p class="eyebrow">${eyebrow}</p>
    <h1>${lead} <span class="accent">${accent}</span></h1>
    <p class="host">${host}</p>
  </div>
  <div class="phone"><img src="${phoneShot}" alt=""></div>
  <div class="bar"></div>
</body></html>`;

const browser = await launchChromium();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
const tab = await ctx.newPage();
for (const [locale, file] of [["en", "dist/index.html"], ["sr", "dist/sr/index.html"]]) {
  const html = read(file).toString();
  const eyebrow = text(html, /class="hero__copy"><p class="eyebrow">(.*?)<\/p>/);
  const lead = text(html, /class="hero__title">(.*?)<span class="accent">/);
  const accent = text(html, /<span class="accent">(.*?)<\/span>/);
  const host = new URL(text(html, /<link rel="canonical" href="(.*?)"/)).host;
  await tab.setContent(page(eyebrow, lead, accent, host), { waitUntil: "load" });
  await tab.evaluate(() => document.fonts.ready);
  const shot = await tab.screenshot({ type: "png" });
  await sharp(shot).png({ compressionLevel: 9, palette: true, quality: 95 }).toFile(join(PUBLIC, `og-${locale}.png`));
  log(`og-${locale}.png`);
}
await browser.close();
