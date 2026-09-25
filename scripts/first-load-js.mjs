// Sums the gzipped size of every script a page loads (First Load JS). Usage: node scripts/first-load-js.mjs [url]
import zlib from "node:zlib";

const url = process.argv[2] ?? "http://localhost:3001/";
const origin = new URL(url).origin;
const html = await (await fetch(url)).text();
// Legacy polyfills load with `noModule` and are skipped by modern browsers.
const noModule = new Set(
  [...html.matchAll(/<script\b[^>]*>/gi)]
    .map((m) => m[0])
    .filter((tag) => /\bnomodule\b/i.test(tag))
    .map((tag) => tag.match(/src="([^"]+)"/)?.[1])
    .filter(Boolean),
);
const srcs = [...new Set([...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]))].filter(
  (s) => !noModule.has(s),
);
let raw = 0;
let gz = 0;
const verbose = process.argv.includes("--verbose");
for (const s of srcs) {
  const b = Buffer.from(await (await fetch(origin + s)).arrayBuffer());
  const g = zlib.gzipSync(b).length;
  raw += b.length;
  gz += g;
  if (verbose) console.log(`  ${(g / 1024).toFixed(1).padStart(6)} kB  ${s}  ${b.toString("utf8", 0, 20000).match(/node_modules\/[@\w.-]+(\/[\w.-]+)?/g)?.slice(0, 3).join(", ") ?? ""}`);
}
console.log(`${url}: ${srcs.length} scripts, ${(raw / 1024).toFixed(1)} kB raw, ${(gz / 1024).toFixed(1)} kB gzip`);
