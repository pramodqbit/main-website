import { type ConsoleMessage, expect, test } from "@playwright/test";
import { DETAIL_PREFIXES, firstDetailPaths, isIgnorableConsoleError, STATIC_ROUTES } from "./helpers";

test("sitemap lists one slug for each detail type", async ({ request }) => {
  const details = await firstDetailPaths(request);
  for (const prefix of DETAIL_PREFIXES) expect(details[prefix], `no published ${prefix}* in sitemap`).toBeTruthy();
});

test.describe("smoke", () => {
  const routes: string[] = [...STATIC_ROUTES];

  test.beforeAll(async ({ request }) => {
    routes.push(...Object.values(await firstDetailPaths(request)).filter((p): p is string => Boolean(p)));
  });

  test("every route renders with one h1, a title and a canonical URL", async ({ page }) => {
    for (const path of routes) {
      await test.step(path, async () => {
        const errors: string[] = [];
        const onConsole = (msg: ConsoleMessage) => {
          if (msg.type() === "error" && !isIgnorableConsoleError(msg)) errors.push(msg.text());
        };
        page.on("console", onConsole);
        const res = await page.goto(path, { waitUntil: "load" });
        expect(res?.status(), `${path} status`).toBe(200);
        await expect(page.locator("h1"), `${path} h1 count`).toHaveCount(1);
        expect((await page.title()).trim(), `${path} title`).not.toBe("");
        await expect(page.locator('link[rel="canonical"]'), `${path} canonical`).toHaveAttribute("href", /^https?:\/\//);
        page.off("console", onConsole);
        expect(errors, `${path} console errors`).toEqual([]);
      });
    }
  });
});

test("unknown URLs return a noindex 404", async ({ page }) => {
  const res = await page.goto("/this-entry-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});

test.describe("phase 8 index sections", () => {
  test("disabled services/work sections stay off the live site", async ({ page }) => {
    for (const path of ["/services", "/work"] as const) {
      await page.goto(path, { waitUntil: "load" });
      await expect(page.locator("[data-hidden-section]")).toHaveCount(0);
      // Seeded Phase 8 blocks use these ids when enabled; they must not appear while enabled:false.
      for (const id of ["engagement", "working-together", "coverage", "format"]) {
        await expect(page.locator(`#${id}`)).toHaveCount(0);
      }
    }
  });

  test("work service filter combines with industry and is noindex", async ({ page }) => {
    const res = await page.goto("/work?service=ai-machine-learning", { waitUntil: "load" });
    expect(res?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("navigation", { name: "Filter by service" })).toBeVisible();
  });
});
