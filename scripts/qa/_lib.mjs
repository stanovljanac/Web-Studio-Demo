/* Shared helpers for the QA scripts in this folder.
   They run against a built site served by `npm run preview` (port 4173).
   Playwright is not a project dependency: it is loaded from PLAYWRIGHT_MODULE,
   a local install, or the global npm folder, in that order. */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const BASE = process.env.QA_BASE || "http://localhost:4173";
export const OUT = resolve(process.env.QA_OUT || join(ROOT, ".qa"));
mkdirSync(OUT, { recursive: true });

export const PAGES = ["/", "/privacy/"];
export const log = (...a) => console.log(...a);

export async function launch() {
  try {
    await fetch(BASE);
  } catch {
    throw new Error(`Nothing is served at ${BASE}. Run \`npm run build && npm run preview\` first.`);
  }
  return launchChromium();
}

/* Chromium without the local-server check (scripts/capture-projects.mjs uses it too). */
export async function launchChromium() {
  const candidates = [process.env.PLAYWRIGHT_MODULE, "playwright"];
  try {
    candidates.push(join(execSync("npm root -g", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(), "playwright/index.js"));
  } catch {}
  let pw;
  for (const c of candidates.filter(Boolean)) {
    try {
      const m = await import(isAbsolute(c) ? pathToFileURL(c).href : c);
      pw = m.default ?? m;
      break;
    } catch {}
  }
  if (!pw) throw new Error("Playwright not found. Set PLAYWRIGHT_MODULE=/path/to/node_modules/playwright/index.js");
  try {
    return await pw.chromium.launch();
  } catch (e) {
    // Cloud sandbox: the browser lives at a fixed path that may not match PLAYWRIGHT_BROWSERS_PATH.
    const exe = process.env.QA_CHROMIUM || "/opt/pw-browsers/chromium";
    if (!existsSync(exe)) throw e;
    return pw.chromium.launch({ executablePath: exe });
  }
}

/* ignoreHTTPSErrors: the cloud sandbox proxies HTTPS with its own CA, which
   Chromium rejects. The site itself loads nothing from other origins
   (fonts are self-hosted), so this only matters for external links. */
export async function newContext(browser, { showDemoNotice = false, ...opts } = {}) {
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, ...opts });
  /* The demo notice opens on every page load and makes the page inert. The
     checks skip that first, automatic showModal() on each page, except the
     ones about the notice; the pill and the contact links still open it. */
  if (!showDemoNotice) {
    await ctx.addInitScript(() => {
      const show = HTMLDialogElement.prototype.showModal;
      let skipped = false;
      HTMLDialogElement.prototype.showModal = function () {
        if (!skipped && this.classList.contains("demo-notice")) {
          skipped = true;
          return;
        }
        return show.call(this);
      };
    });
  }
  return ctx;
}

/* Scroll through the page so every <Reveal> section becomes visible.
   Instant scrolling: smooth scroll skips the IntersectionObserver triggers. */
export async function scrollThrough(page, step = 300) {
  await page.evaluate(async (step) => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, step);
  await page.waitForTimeout(800);
}

export const shotName = (path, w) => (path === "/" ? "en" : path.replaceAll("/", "_").replace(/^_|_$/g, "")) + "-" + w;

/* Strings that must never appear in the built files or on the page, as
   [needle, kind] pairs:
   - traces of the business site this demo was made from: its location and
     its Serbian pages
   - the owner's real email and phone. This repo holds no contact data, so
     they are decoded from the character codes in the portfolio's
     src/data/contact.ts: QA_CONTACT_SOURCE, or ../Portfolio next to this
     repo. Without that file only the other needles are checked.
   Callers print kinds and counts, never the needles themselves. */
export function leakNeedles() {
  const needles = [["Serbia", "location"], ["Srbij", "location"], ["Kragujevac", "location"], ["/sr/", "Serbian pages"]];
  const source = process.env.QA_CONTACT_SOURCE || join(ROOT, "../Portfolio/src/data/contact.ts");
  if (!existsSync(source)) return { needles, contactSource: null };
  for (const [, codes] of readFileSync(source, "utf8").matchAll(/=\s*\[([\d,\s]+)\]/g)) {
    const v = String.fromCharCode(...codes.split(",").map(Number));
    if (v.includes("@")) needles.push([v, "email"], [v.split("@")[0], "email"]);
    else if (/^\d+$/.test(v)) {
      const national = v.replace(/^381/, ""); // international digits, no "+"
      needles.push([v, "phone"], [national, "phone"], [`${national.slice(0, 2)} ${national.slice(2, 5)}`, "phone"]);
    }
  }
  return { needles, contactSource: source };
}
