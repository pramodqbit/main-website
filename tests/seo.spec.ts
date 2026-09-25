import { expect, test } from "@playwright/test";
import { sitemapPaths, STATIC_ROUTES } from "./helpers";

const COLLECTIONS: Array<[collection: string, prefix: string]> = [
  ["case-studies", "/work/"],
  ["services", "/services/"],
  ["industries", "/industries/"],
  ["posts", "/insights/"],
];

test("sitemap lists every published document and nothing else", async ({ request }) => {
  const inSitemap = new Set(await sitemapPaths(request));
  const allowed = new Set(STATIC_ROUTES);

  for (const [collection, prefix] of COLLECTIONS) {
    const res = await request.get(`/api/${collection}?depth=0&limit=500&where[_status][equals]=published`);
    expect(res.ok(), `GET /api/${collection}`).toBeTruthy();
    const { docs } = (await res.json()) as { docs: Array<{ slug?: string }> };
    for (const doc of docs) {
      const path = `${prefix}${doc.slug}`;
      allowed.add(path);
      expect(inSitemap.has(path), `${path} missing from sitemap`).toBeTruthy();
    }
  }

  const jobs = await request.get(`/api/jobs?depth=0&limit=500&where[_status][equals]=published&where[status][equals]=open`);
  for (const job of ((await jobs.json()) as { docs: Array<{ slug?: string }> }).docs) allowed.add(`/careers/${job.slug}`);

  const pages = await request.get(`/api/pages?depth=0&limit=500&where[_status][equals]=published`);
  for (const p of ((await pages.json()) as { docs: Array<{ slug?: string }> }).docs) if (p.slug !== "home") allowed.add(`/${p.slug}`);

  const unexpected = [...inSitemap].filter((p) => !allowed.has(p));
  expect(unexpected, "sitemap URLs that are not published documents or static routes").toEqual([]);
});

test("robots.txt disallows the admin and points at the sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toMatch(/Disallow: \/admin/);
  expect(body).toMatch(/Sitemap: .*\/sitemap\.xml/);
});

test("security headers are set", async ({ request }) => {
  const headers = (await request.get("/")).headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["content-security-policy-report-only"]).toContain("default-src 'self'");
});

test("case study has an Open Graph image", async ({ page }) => {
  await page.goto("/work/medical-prescription-ocr");
  const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
  expect(og).toBeTruthy();
  const res = await page.request.get(new URL(og!).pathname);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toMatch(/^image\//);
});
