import { expect, test, type Page } from "@playwright/test";

/** Scroll the whole page with the wheel (Lenis listens to wheel events), then let the reveals finish. */
async function readToTheEnd(page: Page) {
  for (let i = 0; i < 200; i++) {
    const atEnd = await page.evaluate(() => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4);
    if (atEnd) break;
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(2500);
}

/** Reveal elements still invisible after reading the page (ignores ones hidden by layout, e.g. mobile-only panels). */
async function stillHidden(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('[data-reveal="up"],[data-reveal="fade"]'))
      .filter((el) => el.offsetParent !== null || getComputedStyle(el).position === "fixed")
      .filter((el) => getComputedStyle(el).opacity === "0")
      .map((el) => `${el.tagName.toLowerCase()}.${el.className.toString().slice(0, 40)}`),
  );
}

const PAGES = ["/", "/services", "/work", "/insights", "/about"];

test.describe("story layer", () => {
  /* Warm the pages up so a slow first compile (dev server) doesn't trip the 6s no-JS safety net. */
  test.beforeAll(async ({ request }) => {
    for (const path of PAGES) await request.get(path);
  });

  test("home: the intro plays, can be skipped, and hands over to the hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/qb-intro/);
    await expect(page.locator(".qb-introlay")).toBeVisible();
    await page.getByRole("button", { name: "Skip intro" }).click();
    await expect(page.locator("html")).not.toHaveClass(/qb-intro/);
    await expect(page.locator(".qb-introlay")).toBeHidden();
    /* Not replayed in the same session. */
    await page.reload();
    await expect(page.locator("html")).not.toHaveClass(/qb-intro/);
  });

  for (const path of PAGES) {
    test(`${path}: every revealed block arrives, nothing stays hidden`, async ({ page }) => {
      await page.addInitScript(() => sessionStorage.setItem("qb-intro", "1"));
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(path);
      await expect(page.locator("html")).toHaveClass(/\brv\b/);
      await readToTheEnd(page);
      expect(await stillHidden(page)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }

  test("reduced motion: no intro, no hidden content, no smooth scroll", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/\brv\b|qb-intro|lenis/);
    expect(await stillHidden(page)).toEqual([]);
    await context.close();
  });
});
