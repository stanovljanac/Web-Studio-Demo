/* Behaviour checks:
   - content visible without JavaScript (prerender + <noscript>)
   - reduced motion shows every section
   - keyboard: FAQ toggles, anchor lands below the fixed nav, language switch
   - links: internal 200s, anchors exist, external links open safely */
import { BASE, launch, log, newContext } from "./_lib.mjs";

const b = await launch();

{
  const ctx = await newContext(b, { javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const path of ["/", "/sr/privatnost/"]) {
    await page.goto(BASE + path, { waitUntil: "load" });
    const r = await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent?.trim().slice(0, 40),
      hidden: [...document.querySelectorAll(".reveal")].filter((e) => getComputedStyle(e).opacity !== "1").length,
    }));
    log(`no-JS ${path}: h1 "${r.h1}" | hidden .reveal: ${r.hidden}`);
  }
  await ctx.close();
}

{
  const ctx = await newContext(b, { reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const r = await page.evaluate(() => {
    const els = [...document.querySelectorAll(".reveal")];
    return { total: els.length, hidden: els.filter((e) => getComputedStyle(e).opacity !== "1").length };
  });
  log("reduced motion: .reveal", r.total, "hidden", r.hidden);
  await ctx.close();
}

{
  const ctx = await newContext(b, { viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const seen = [];
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    seen.push(await page.evaluate(() => { const e = document.activeElement; return `${e.tagName.toLowerCase()}:"${(e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 24)}"`; }));
  }
  log("tab order:", seen.join(" → "));
  const sum = page.locator(".faq__item summary").first();
  await sum.focus(); await page.keyboard.press("Enter");
  log("FAQ opens with Enter:", await page.locator(".faq__item").first().evaluate((d) => d.open));
  await page.click(".nav__link >> nth=1");
  await page.waitForTimeout(1200);
  const top = await page.evaluate(() => [document.querySelector("#services").getBoundingClientRect().top, document.querySelector(".nav").getBoundingClientRect().height]);
  log(`#services top after nav click: ${Math.round(top[0])}px (nav ${Math.round(top[1])}px)`);
  log("lang switch active:", await page.$eval(".nav .lang-switch__opt.is-active", (a) => a.getAttribute("aria-current") + " " + a.textContent));
  await page.click(".nav .lang-switch__opt:not(.is-active)"); await page.waitForLoadState();
  log("lang switch →", page.url(), await page.evaluate(() => document.documentElement.lang));
  await page.goto(BASE + "/sr/privatnost/"); await page.click(".nav .lang-switch__opt:not(.is-active)"); await page.waitForLoadState();
  log("privacy lang switch →", page.url());
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  log("honeypot visible:", await page.isVisible("input[name=botcheck]"));
  await ctx.close();
}

{
  const ctx = await newContext(b);
  const page = await ctx.newPage();
  for (const path of ["/", "/sr/", "/privacy/", "/sr/privatnost/"]) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const links = await page.$$eval("a[href]", (as) => as.map((a) => ({ href: a.getAttribute("href"), target: a.target, rel: a.rel })));
    const bad = [];
    for (const h of [...new Set(links.map((l) => l.href).filter((h) => h.startsWith("/")))]) {
      const res = await page.request.get(BASE + h.split("#")[0]);
      if (res.status() !== 200) bad.push(`${h} ${res.status()}`);
    }
    const extBad = links.filter((l) => /^https?:/.test(l.href) && (l.target !== "_blank" || !l.rel.includes("noopener")));
    const missing = [];
    for (const h of new Set(links.map((l) => l.href).filter((h) => h.startsWith("#")))) if (!(await page.$(h))) missing.push(h);
    log(`${path}: ${links.length} links | internal not 200: ${bad.length ? bad : "none"} | external w/o _blank+noopener: ${extBad.length ? JSON.stringify(extBad) : "none"} | missing anchors: ${missing.length ? missing : "none"}`);
  }
  await ctx.close();
}
await b.close();
