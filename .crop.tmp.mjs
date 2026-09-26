import { chromium } from "playwright";
const [,, path, name, tag = "d"] = process.argv;
const vp = tag === "d" ? { width: 1440, height: 1100 } : { width: 390, height: 1400 };
const b = await chromium.launch();
const c = await b.newContext({ viewport: vp, reducedMotion: "reduce" });
const p = await c.newPage();
await p.goto("http://localhost:3001/" + path.replace(/^_$/, ""), { waitUntil: "networkidle", timeout: 90000 });
const H = await p.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < H; y += vp.height) {
  await p.screenshot({ path: `${process.env.OUT}/${name}-${tag}-${i++}.png`, fullPage: true, clip: { x: 0, y, width: vp.width, height: Math.min(vp.height, H - y) } });
}
console.log(i, "shots");
await b.close();
