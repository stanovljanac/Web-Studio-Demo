/* Every price and number on this demo is a placeholder. Fails if:
   (a) the visible text of a built page (title + body, without scripts,
       styles and attributes) contains a digit, or
   (b) a standalone placeholder letter (X, Y, Z, N, A, B) appears outside
       a .demo-value chip, i.e. a placeholder that does not look intentional.
   Run after `npm run build`. No browser needed. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, PAGES } from "./_lib.mjs";

/* Elements whose text may hold digits: decorative step numbers (aria-hidden). */
const EXEMPT_CLASSES = ["step__num", "audience__num"];

/* "A" is also the English article ("A landing page that…"), so it only
   counts as a placeholder when no lowercase word or demo value follows it. */
const LETTER = /(?<![\w'’])(?:[XYZNB]|A(?! (?:[a-z]|⟦)))(?![\w'’])/g;

const visibleText = (html) => {
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
  let body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? "";
  body = body.replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/g, " ");
  for (const c of EXEMPT_CLASSES) body = body.replace(new RegExp(`<(\\w+)[^>]*class="[^"]*\\b${c}\\b[^"]*"[^>]*>[\\s\\S]*?</\\1>`, "g"), " ");
  // A demo value chip stays as a marker, so (b) can tell it apart from a stray letter.
  body = body.replace(/<span[^>]*class="[^"]*\bdemo-value\b[^"]*"[^>]*>[\s\S]*?<\/span>/g, " ⟦demo⟧ ");
  const text = (title + " " + body)
    .replace(/<[^>]+>/g, " ")
    .replace(/<!-- -->/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
  return text;
};

const context = (text, i) => "…" + text.slice(Math.max(0, i - 40), i + 30).trim() + "…";
const problems = [];
for (const path of PAGES) {
  const file = join(ROOT, "dist", path, "index.html");
  const text = visibleText(readFileSync(file, "utf8"));
  for (const m of text.matchAll(/\d+/g)) problems.push(`${path} digit: ${context(text, m.index)}`);
  for (const m of text.matchAll(LETTER)) problems.push(`${path} bare "${m[0]}": ${context(text, m.index)}`);
}
if (problems.length) {
  console.error(`numbers check: ${problems.length} problem(s)\n  ` + [...new Set(problems)].join("\n  "));
  process.exit(1);
}
console.log(`numbers check: clean (${PAGES.length} pages, no digits, every placeholder in a .demo-value)`);
