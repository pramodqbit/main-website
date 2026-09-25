import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3001",
    trace: "retain-on-failure",
  },
  projects: [
    /* Functional, SEO and a11y checks run with reduced motion: content is shown at once, so results don't depend on animation timing. */
    {
      name: "chromium",
      testIgnore: /motion\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], contextOptions: { reducedMotion: "reduce" } },
    },
    /* The story layer itself (intro, reveals, narrator) with motion on. */
    { name: "motion", testMatch: /motion\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
  ],
});
