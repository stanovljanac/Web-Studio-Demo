/* Main QA pass:
   - CLS, horizontal overflow and console errors at 320 / 375 / 1440 px, on all four pages
   - CLS again with the web fonts delayed by 1.5 s (as on a slow connection),
     so the metric-matched fallbacks are what the first paint uses
   - nothing is loaded from Google (the fonts are self-hosted)
   - the nav fits the viewport from 320 to 1280 px
   - contact data never visible; real addresses only after a click
   - lowest text contrast and visible keyboard focus */
import { BASE, PAGES, contactNeedles, launch, log, newContext, scrollThrough } from "./_lib.mjs";

const b = await launch();
const needles = contactNeedles();

for (const slowFonts of [false, true]) {
  log(slowFonts ? "\n--- CLS with the web fonts delayed by 1.5 s" : "--- CLS, overflow, console, external requests");
  for (const path of PAGES) for (const w of [320, 375, 1440]) {
    const ctx = await newContext(b, { viewport: { width: w, height: 800 } });
    if (slowFonts) await ctx.route(/\/fonts\/.*\.woff2$/, async (r) => { await new Promise((x) => setTimeout(x, 1500)); await r.fallback(); });
    const page = await ctx.newPage();
    const errs = [], external = [];
    page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|_vercel/.test(m.text())) errs.push(m.text().slice(0, 120)); });
    page.on("pageerror", (e) => errs.push(e.message));
    page.on("request", (r) => { if (!r.url().startsWith(BASE) && !r.url().startsWith("data:")) external.push(new URL(r.url()).host); });
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    if (slowFonts) {
      await page.waitForTimeout(300);
      log(path.padEnd(16), String(w).padEnd(5), "CLS=" + (await page.evaluate(() => window.__cls)).toFixed(4), "| Manrope loaded:", await page.evaluate(() => document.fonts.check("16px Manrope")));
    } else {
      await scrollThrough(page);
      const info = await page.evaluate(() => ({ cls: window.__cls, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth }));
      log(path.padEnd(16), String(w).padEnd(5), "CLS=" + info.cls.toFixed(4), "overflow=" + info.overflow, errs.length ? "ERR " + errs : "console clean", "| external:", external.length ? [...new Set(external)].join(", ") : "none");
    }
    await ctx.close();
  }
}

/* .page clips horizontal overflow, so a nav item pushed off screen does not
   show up as a scrollbar above: check that every nav element is inside the viewport. */
log("\n--- nav fits the viewport (320–1280 px): nothing outside, no link on two lines, offer bar text not cut off");
for (const path of ["/", "/sr/"]) {
  const bad = [];
  for (const w of [320, 360, 390, 430, 480, 540, 600, 640, 768, 900, 901, 1024, 1180, 1181, 1280]) {
    const ctx = await newContext(b, { viewport: { width: w, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(BASE + path, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    const [out, cut, wrapped] = await p.evaluate(() => {
      const els = [...document.querySelectorAll(".nav *")].filter((e) => e.getClientRects().length);
      const bar = document.querySelector(".offer-bar__text");
      const wrapped = [...document.querySelectorAll(".nav__links > a")].filter((a) => a.getClientRects().length).filter((a) => {
        const r = document.createRange(); r.selectNodeContents(a); return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size > 1;
      }).map((a) => a.textContent.trim());
      return [Math.max(0, ...els.map((e) => { const r = e.getBoundingClientRect(); return Math.max(r.right - innerWidth, -r.left); })),
        bar && bar.getClientRects().length ? bar.scrollWidth - bar.clientWidth : 0, wrapped];
    });
    if (out > 0.5) bad.push(`${w}px: ${Math.round(out)}px outside`);
    if (wrapped.length) bad.push(`${w}px: wraps ${wrapped.join(", ")}`);
    if (cut > 1) bad.push(`${w}px: offer bar text cut by ${cut}px`);
    await ctx.close();
  }
  log(path.padEnd(4), bad.length ? "CLIPPED " + bad.join("; ") : "ok");
}

log("\n--- contact details not visible (text + hrefs)");
for (const path of PAGES) {
  const ctx = await newContext(b); const p = await ctx.newPage();
  await p.goto(BASE + path, { waitUntil: "networkidle" });
  const hit = await p.evaluate((needles) => {
    const t = document.body.innerText + " " + [...document.querySelectorAll("a")].map((a) => a.getAttribute("href")).join(" ");
    return needles.map((n, i) => (t.includes(n) ? "#" + (i + 1) : null)).filter(Boolean);
  }, needles);
  log(path, hit.length ? "LEAK needles " + hit : "clean");
  await ctx.close();
}
{
  /* The handler swaps the href synchronously on click, but read it only once
     it has changed (or after 2 s), so a slow hydration cannot fake a failure. */
  const clickReveal = async (loc) => {
    await loc.click({ noWaitAfter: true }).catch(() => {});
    await loc.evaluate((a) => new Promise((done) => {
      const t0 = Date.now();
      (function poll() { if (!a.getAttribute("href").startsWith("/") || Date.now() - t0 > 2000) done(); else setTimeout(poll, 50); })();
    })).catch(() => {});
    return loc.getAttribute("href");
  };
  const ctx = await newContext(b);
  const expect = [["mailto:", needles[0]], ["viber://", needles[2]], ["https://wa.me/", needles[2]]];
  const out = [];
  for (let n = 0; n < 3; n++) {
    const p = await ctx.newPage(); // fresh page per link: an app-protocol click can disturb the page
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    const pop = n === 2 ? ctx.waitForEvent("page", { timeout: 3000 }).catch(() => null) : null;
    const href = await clickReveal(p.locator(".contact__channels a").nth(n));
    const pg = pop ? await pop : null; if (pg) await pg.close();
    out.push(`${expect[n][0]} ${href.startsWith(expect[n][0]) && href.includes(expect[n][1]) ? "ok" : "WRONG"}`);
    await p.close();
  }
  log("hrefs after click:", out.join(" | "));
  const p = await ctx.newPage();
  await p.goto(BASE + "/privacy/", { waitUntil: "networkidle" });
  const pl = p.locator(".legal a", { hasText: "by email" }).first();
  const before = await pl.getAttribute("href");
  const after = await clickReveal(pl);
  log("privacy 'by email' link: before", before, "| after click", after.startsWith("mailto:") && after.includes(needles[0]) ? "mailto ok" : "WRONG " + after.slice(0, 12));
  await ctx.close();
}

log("\n--- contrast (lowest ratios of small text) + focus");
{
  const ctx = await newContext(b, { viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible")));
  const res = await p.evaluate(() => {
    const lum = (c) => { const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; const a = c.match(/[\d.]+/g); if (a && (a.length < 4 || +a[3] > 0.5)) return c; } return "rgb(255,255,255)"; };
    const sels = [".eyebrow", ".section__lede", ".work-card__label", ".work-card__desc", ".svc-note", ".steps__note", ".split__note", ".contact__privacy", ".contact__channels small", ".audience__text", ".audience__num", ".footer__links a", ".footer__meta span", ".footer__heading", ".footer__offer", ".footer__bottom span", ".offer-bar__text", ".nav__link", ".lang-switch__opt:not(.is-active)", ".offer__note", ".offer__text", ".offer .eyebrow", ".svc-card__price", ".step__num", ".hero__lede"];
    const worst = {};
    for (const s of sels) for (const el of document.querySelectorAll(s)) {
      if (!el.getClientRects().length) continue; // hidden (display: none)
      const L1 = lum(getComputedStyle(el).color), L2 = lum(bgOf(el));
      worst[s] = Math.min(worst[s] ?? 99, (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05));
    }
    return Object.entries(worst).sort((a, b) => a[1] - b[1]).slice(0, 6).map(([s, r]) => s + " " + r.toFixed(2));
  });
  const focus = [];
  for (let n = 0; n < 12; n++) {
    await p.keyboard.press("Tab");
    focus.push(await p.evaluate(() => { const e = document.activeElement; const c = e.closest(".work-card"); return getComputedStyle(e).outlineStyle !== "none" || (c && getComputedStyle(c).outlineStyle !== "none"); }));
  }
  log("lowest contrast:", res.join(" | "), "| focus visible on first 12 tabs:", focus.every(Boolean) ? "yes" : JSON.stringify(focus));
  await ctx.close();
}
await b.close();
