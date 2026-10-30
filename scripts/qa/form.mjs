/* Contact form states, with the Web3Forms API mocked (no real submissions).
   node scripts/qa/form.mjs nokey  -> build WITHOUT VITE_WEB3FORMS_ACCESS_KEY: validation + "not connected" error
   node scripts/qa/form.mjs key    -> build WITH a key (any value): loading, success, double submit, API and network errors */
import { BASE, launch, log, newContext } from "./_lib.mjs";

const mode = process.argv[2];
if (!["nokey", "key"].includes(mode)) { console.error("usage: node scripts/qa/form.mjs nokey|key"); process.exit(1); }
const browser = await launch();
async function fresh(path, route) {
  const ctx = await newContext(browser, { viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = []; page.on("pageerror", e => errs.push(e.message));
  let calls = 0;
  if (route) await page.route("https://api.web3forms.com/**", async r => { calls++; await new Promise(x => setTimeout(x, 800)); await route(r); });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.locator("#contact").scrollIntoViewIfNeeded(); await page.waitForTimeout(900);
  return { ctx, page, calls: () => calls, errs };
}
const errsText = p => p.$$eval(".mb-field__hint--error, .contact__error", els => els.map(e => e.textContent));
for (const path of ["/", "/sr/"]) {
  if (mode === "nokey") {
    const { ctx, page } = await fresh(path);
    await page.click(".contact__form button[type=submit]");
    log(path, "empty:", await errsText(page));
    await page.fill("input[name=name]", "Test"); await page.fill("input[name=email]", "not-an-email"); await page.fill("textarea[name=message]", "Ćao, šta ima? Đak, žaba, čvor.");
    await page.click(".contact__form button[type=submit]");
    log(path, "invalid email:", await errsText(page));
    await page.fill("input[name=email]", "test@example.com");
    await page.click(".contact__form button[type=submit]");
    log(path, "valid, no key:", await errsText(page));
    await ctx.close();
  } else {
    // success + double submit + loading state
    let s = await fresh(path, r => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) }));
    await s.page.fill("input[name=name]", "Test"); await s.page.fill("input[name=email]", "test@example.com");
    await s.page.fill("textarea[name=message]", "x".repeat(5000));
    const btn = s.page.locator(".contact__form button[type=submit]");
    await btn.click(); await btn.click({ force: true }).catch(() => {}); await btn.dblclick({ force: true }).catch(() => {});
    log(path, "loading state:", await btn.textContent(), "disabled:", await btn.isDisabled());
    await s.page.waitForSelector(".contact__success", { timeout: 5000 });
    log(path, "success:", await s.page.textContent(".contact__success h3"), "| API calls:", s.calls());
    await s.page.reload({ waitUntil: "networkidle" });
    log(path, "after refresh form visible:", await s.page.isVisible(".contact__form"));
    await s.ctx.close();
    // API returns failure
    s = await fresh(path, r => r.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ success: false, message: "Invalid access key" }) }));
    await s.page.fill("input[name=name]", "Test"); await s.page.fill("input[name=email]", "test@example.com"); await s.page.fill("textarea[name=message]", "Hi");
    await s.page.click(".contact__form button[type=submit]");
    await s.page.waitForSelector(".contact__error", { timeout: 5000 });
    log(path, "API failure:", await errsText(s.page), "| button:", await s.page.locator(".contact__form button[type=submit]").textContent());
    await s.ctx.close();
    // network error
    s = await fresh(path, r => r.abort());
    await s.page.fill("input[name=name]", "Test"); await s.page.fill("input[name=email]", "test@example.com"); await s.page.fill("textarea[name=message]", "Hi");
    await s.page.click(".contact__form button[type=submit]");
    await s.page.waitForSelector(".contact__error", { timeout: 5000 });
    log(path, "network error:", await errsText(s.page), s.errs.length ? "pageerrors: " + s.errs : "");
    await s.ctx.close();
  }
}
await browser.close();
