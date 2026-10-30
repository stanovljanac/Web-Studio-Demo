/* Fails if dist/ holds the owner's real email or phone, the location of the
   business site this demo came from, or a link to its Serbian pages, or if
   a tracked file in the repo holds the real email or phone (see leakNeedles
   in _lib.mjs). Prints where the owner's name appears, which should only be
   the credit (demo notice, no-JS bar, JSON-LD). Run after `npm run build`.
   No browser needed. */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { ROOT, leakNeedles } from "./_lib.mjs";

const { needles, contactSource } = leakNeedles();
const contact = needles.filter(([, kind]) => kind === "email" || kind === "phone");

const distFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p) : distFiles.push(p);
  }
};
walk(join(ROOT, "dist"));
const repoFiles = execFileSync("git", ["ls-files"], { cwd: ROOT }).toString().split("\n").filter(Boolean).map((f) => join(ROOT, f));

const hits = [];
const scan = (files, list) => {
  for (const f of files) {
    const text = readFileSync(f, "latin1");
    for (const [n, kind] of list) if (text.includes(n)) hits.push(`${relative(ROOT, f)} (${kind})`);
  }
};
scan(distFiles, needles);
scan(repoFiles, contact);

const named = distFiles.filter((f) => /Mihailo (Š|S)ebek/.test(readFileSync(f, "utf8"))).map((f) => relative(ROOT, f));
console.log(`name "Mihailo Šebek" in: ${named.join(", ") || "nowhere"}`);
if (!contactSource) console.warn("⚠ no contact source (QA_CONTACT_SOURCE or ../Portfolio/src/data/contact.ts): email/phone not checked");
if (hits.length) {
  console.error("LEAK:\n  " + [...new Set(hits)].join("\n  "));
  process.exit(1);
}
console.log(`leak check: clean (${distFiles.length} files in dist/, ${repoFiles.length} tracked files, ${needles.length} needles)`);
