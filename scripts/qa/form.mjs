/* Demo contact form: validation, "Sending…", the demo success message,
   double submit, and that no request leaves the page while it runs.
   npm run qa:form (with `npm run preview` running) */
import { BASE, launch, log, newContext } from "./_lib.mjs";

const browser = await launch();
const ctx = await newContext(browser, { viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.locator("#contact").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);

const requests = [];
// Same-origin GETs (a font file for the typed "Ć") are not the form sending anything.
page.on("request", (r) => { if (!r.url().startsWith(BASE) || r.method() !== "GET") requests.push(`${r.method()} ${r.url()}`); });
const errsText = () => page.$$eval(".mb-field__hint--error", (els) => els.map((e) => e.textContent));
const btn = page.locator(".contact__form button[type=submit]");

log("demo note:", await page.textContent(".contact__demo-note"));
await btn.click();
log("empty:", await errsText());
await page.fill("input[name=name]", "Test");
await page.fill("input[name=email]", "not-an-email");
await page.fill("textarea[name=message]", "Ćao, šta ima? Đak, žaba, čvor.");
await btn.click();
log("invalid email:", await errsText());
await page.fill("input[name=email]", "test@example.com");
await btn.click();
await btn.click({ force: true }).catch(() => {});
log("sending:", await btn.textContent(), "| disabled:", await btn.isDisabled());
await page.waitForSelector(".contact__success", { timeout: 5000 });
log("success:", await page.textContent(".contact__success h3"), "| successes:", await page.locator(".contact__success").count());
log("requests while submitting:", requests.length ? requests : "none");
await page.click(".contact__success button");
log("form back:", await page.isVisible(".contact__form"), errs.length ? "| pageerrors: " + errs : "| no page errors");
await browser.close();
