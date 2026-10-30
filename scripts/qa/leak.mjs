/* Fails if the real email or phone number appears as plain text anywhere in
   dist/. Run after `npm run build`. No browser needed. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { ROOT, contactNeedles } from "./_lib.mjs";

const DIST = join(ROOT, "dist");
const needles = contactNeedles();
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p) : files.push(p);
  }
};
walk(DIST);

const hits = [];
for (const f of files) {
  const text = readFileSync(f, "latin1");
  needles.forEach((n, i) => { if (text.includes(n)) hits.push(`${f.slice(ROOT.length + 1)} (needle #${i + 1})`); });
}
if (hits.length) {
  console.error("LEAK: contact data in plain text:\n  " + hits.join("\n  "));
  process.exit(1);
}
console.log(`leak check: clean (${files.length} files in dist/, ${needles.length} needles)`);
