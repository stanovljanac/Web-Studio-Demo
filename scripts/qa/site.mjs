/* Behaviour checks:
   - content visible without JavaScript (prerender + <noscript>)
   - reduced motion shows every section
   - demo notice: opens on load with focus inside, keeps focus inside,
     closes with Esc, opens again after a reload, the pill reopens it
   - keyboard: FAQ toggles, anchor lands below the fixed nav
   - links: internal 200s, anchors exist, external links open safely and
     answer with 2xx (HEAD, then GET for servers that refuse HEAD). A dead
     project link fails the run (exit code 1). */
import { BASE, launch, log, newContext } from "./_lib.mjs";

const b = await launch();

{
  const ctx = await newContext(b, { javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const path of ["/", "/privacy/"]) {
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
  const ctx = await newContext(b, { showDemoNotice: true, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  // It opens after hydration, which can finish after "networkidle".
  await page.waitForSelector(".demo-notice[open]", { timeout: 5000 }).catch(() => {});
  const state = () => page.evaluate(() => {
    const d = document.querySelector(".demo-notice");
    const a = document.activeElement;
    // body = focus left the page for the browser's own UI, which a modal dialog allows
    return { open: d.open, inside: d.contains(a), onPage: a !== document.body && !d.contains(a) };
  });
  const first = await state();
  let escaped = 0;
  for (let i = 0; i < 8; i++) { await page.keyboard.press("Tab"); if ((await state()).onPage) escaped++; }
  // Tab can leave the document for the browser's UI; Esc only reaches the page from inside it.
  await page.focus(".demo-notice__close");
  await page.keyboard.press("Escape");
  const afterEsc = await state();
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector(".demo-notice[open]", { timeout: 5000 }).catch(() => {});
  const afterReload = await state();
  await page.keyboard.press("Escape");
  await page.click(".demo-pill");
  const pill = await state();
  // Empty space inside the card keeps it open; the backdrop around it closes it.
  const box = await page.locator(".demo-notice").boundingBox();
  await page.mouse.click(box.x + 10, box.y + 10);
  const padding = await state();
  await page.mouse.click(5, 450);
  const backdrop = await state();
  await page.click(".demo-pill");
  await page.click(".demo-notice__close");
  const closed = await state();
  log(`demo notice: on load open ${first.open}, focus inside ${first.inside} | Tab reached the page ${escaped}/8 | Esc closes ${!afterEsc.open} | after reload open again ${afterReload.open} | pill reopens ${pill.open} | click in the card keeps it open ${padding.open} | backdrop closes ${!backdrop.open} | button closes ${!closed.open}`);
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
  await ctx.close();
}

/* Status of an external URL after redirects, or the network error. */
async function externalStatus(url) {
  let last = "";
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(15000) });
      if (res.ok) return String(res.status);
      last = String(res.status);
    } catch (e) {
      last = e.cause?.code || e.name;
    }
  }
  return "FAIL " + last;
}

{
  const ctx = await newContext(b);
  const page = await ctx.newPage();
  const external = new Set();
  for (const path of ["/", "/privacy/"]) {
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
    links.filter((l) => /^https?:/.test(l.href)).forEach((l) => external.add(l.href));
    log(`${path}: ${links.length} links | internal not 200: ${bad.length ? bad : "none"} | external w/o _blank+noopener: ${extBad.length ? JSON.stringify(extBad) : "none"} | missing anchors: ${missing.length ? missing : "none"}`);
  }
  await ctx.close();
  const dead = [];
  for (const url of external) {
    const status = await externalStatus(url);
    if (status.startsWith("FAIL")) dead.push(`${url} ${status}`);
  }
  log(`external links: ${external.size} checked | dead: ${dead.length ? dead.join(", ") : "none"}`);
  if (dead.length) process.exitCode = 1;
}
await b.close();
