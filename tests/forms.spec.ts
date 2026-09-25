import { expect, test } from "@playwright/test";

/** The server treats submissions faster than this as bots (lib/forms.ts MIN_FILL_MS) and fakes success. */
const HUMAN_DELAY_MS = 3200;

test.describe("contact form", () => {
  test("shows validation errors for an empty submission", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(HUMAN_DELAY_MS);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Work email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByRole("alert").first()).toBeVisible();
  });

  test("a valid submission shows the confirmation", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Playwright Test");
    await page.getByLabel("Work email").fill("playwright@example.com");
    await page.getByLabel("What are you building?").fill("Automated end-to-end test submission, please ignore.");
    await page.getByRole("checkbox", { name: /I agree/ }).check();
    await page.waitForTimeout(HUMAN_DELAY_MS);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Your message is in our inbox.")).toBeVisible({ timeout: 15_000 });
  });
});
