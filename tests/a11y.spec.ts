import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { firstDetailPaths } from "./helpers";

test.describe("mobile menu keyboard", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("traps focus while open and closes on Escape", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => Boolean(document.activeElement?.closest("header"))), `Tab ${i + 1} left the menu`).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});

/* Reduced motion checks the settled page: entrance animations (row highlights, reveals) are transient states. */
for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });
    test.setTimeout(120_000);

    test("no serious or critical axe violations on key templates", async ({ page, request }) => {
      const details = await firstDetailPaths(request);
      const paths = ["/", details["/work/"], details["/insights/"], details["/services/"], "/contact", details["/careers/"]].filter(
        (p): p is string => Boolean(p),
      );

      for (const path of paths) {
        await test.step(path, async () => {
          await page.goto(path);
          const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
          const blocking = violations
            .filter((v) => v.impact === "serious" || v.impact === "critical")
            .map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes[0]?.target.join(" ")}`);
          expect(blocking, `${path} axe violations`).toEqual([]);
        });
      }
    });
  });
}
