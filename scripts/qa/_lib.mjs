/* Shared helpers for the QA scripts in this folder.
   They run against a built site served by `npm run preview` (port 4173).
   Playwright is not a project dependency: it is loaded from PLAYWRIGHT_MODULE,
   a local install, or the global npm folder, in that order. */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const BASE = process.env.QA_BASE || "http://localhost:4173";
export const OUT = resolve(process.env.QA_OUT || join(ROOT, ".qa"));
mkdirSync(OUT, { recursive: true });

export const PAGES = ["/", "/sr/", "/privacy/", "/sr/privatnost/"];
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
      const m = await import(c.startsWith("/") ? pathToFileURL(c).href : c);
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
export async function newContext(browser, opts = {}) {
  return browser.newContext({ ignoreHTTPSErrors: true, ...opts });
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

/* Strings that must never appear in the built files or on the page.
   They are derived from the character codes in src/data/contact.ts, so the
   real email and phone number are never written in plain text in the repo. */
export function contactNeedles() {
  const src = readFileSync(join(ROOT, "src/data/contact.ts"), "utf8");
  const codes = (name) => {
    const m = src.match(new RegExp(name + "\\s*=\\s*\\[([\\d,\\s]+)\\]"));
    if (!m) throw new Error(`${name} not found in src/data/contact.ts`);
    return String.fromCharCode(...m[1].split(",").map(Number));
  };
  const email = codes("EMAIL_CODES");
  const phone = codes("PHONE_CODES"); // international digits, no "+"
  const national = phone.replace(/^381/, "");
  return [email, email.split("@")[0], phone, national, `${national.slice(0, 2)} ${national.slice(2, 5)}`];
}
