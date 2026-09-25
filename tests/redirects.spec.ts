import { expect, test } from "@playwright/test";

/** Legacy URLs whose target changed, from docs/redesign/baseline/url-inventory.md. */
const LEGACY: Array<[from: string, to: string]> = [
  ["/aboutus", "/about"],
  ["/teams", "/about/team"],
  ["/contact-us", "/contact"],
  ["/case-studies", "/work"],
  ["/case-studies/medical-prescription-ocr", "/work/medical-prescription-ocr"],
  ["/case-studies/hire-your-travel-partner", "/work/hire-your-travel-partner"],
  ["/case-studies/restaurant-os", "/work/restaurant-os"],
  ["/blog", "/insights"],
  ["/blog/ai-trends-2025", "/insights/ai-trends-2025"],
  ["/blog/secure-rag-architectures", "/insights/secure-rag-architectures"],
  ["/blog/edge-ai-inference", "/insights/edge-ai-inference"],
  ["/blog/modern-web-architecture-2025", "/insights/modern-web-architecture-2025"],
  ["/blog/platform-engineering-playbook", "/insights/platform-engineering-playbook"],
  ["/blog/ai-governance-and-ethics", "/insights/ai-governance-and-ethics"],
  ["/construction", "/"],
];

/** Inventory URLs that keep their path and must still render. */
const UNCHANGED = [
  "/services",
  "/services/ai-machine-learning",
  "/services/cloud-solutions",
  "/services/mobile-development",
  "/services/uiux",
  "/services/web-development",
  "/careers",
  "/careers/it-business-development-associate-lead-conversion",
  "/academyai/privacy-policy",
  "/academyai/terms-and-conditions",
];

for (const [from, to] of LEGACY) {
  test(`${from} → ${to}`, async ({ request }) => {
    const res = await request.get(from, { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(new URL(res.headers()["location"], "http://x").pathname).toBe(to);
    expect((await request.get(to)).status()).toBe(200);
  });
}

for (const path of UNCHANGED) {
  test(`${path} still resolves`, async ({ request }) => {
    expect((await request.get(path)).status()).toBe(200);
  });
}
