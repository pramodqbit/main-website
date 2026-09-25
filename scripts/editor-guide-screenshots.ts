/**
 * Regenerates the screenshots in docs/editor-guide/ from a running local admin.
 *
 *   SCREENSHOT_BASE_URL=http://localhost:3001 npm run docs:screenshots
 *
 * Creates a temporary admin user with a random in-memory password, logs in with Playwright,
 * captures the views used in docs/editor-guide.md, then deletes the user. Local databases only.
 */
import { randomBytes } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium, type Page } from "@playwright/test";
import { getSeedPayload } from "../cms/seed/lib/payload";

const BASE = (process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");
const OUT = join(process.cwd(), "docs", "editor-guide");

function refuseRemote() {
  const db = process.env.DATABASE_URI ?? "";
  if (process.env.VERCEL_ENV === "production" || !/^mongodb:\/\/(127\.0\.0\.1|localhost|mongo)(:\d+)?\//i.test(db)) {
    console.error("Refusing to run: screenshots use a temporary admin user and only run against a local database.");
    process.exit(1);
  }
}

async function shot(page: Page, name: string) {
  // The admin keeps a connection open, so "networkidle" never fires; give client rendering a moment instead.
  await page.waitForLoadState("load");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(OUT, `${name}.png`) });
  console.log(`saved docs/editor-guide/${name}.png`);
}

async function main() {
  refuseRemote();
  const payload = await getSeedPayload();
  const email = `screenshots-${randomBytes(4).toString("hex")}@example.invalid`;
  const password = randomBytes(24).toString("base64url");
  const user = await payload.create({
    collection: "users",
    data: { email, password, name: "Screenshot bot", role: "admin" },
    overrideAccess: true,
  });

  const browser = await chromium.launch();
  try {
    await mkdir(OUT, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    await page.goto(`${BASE}/admin/login`);
    await page.locator("#field-email").fill(email);
    await page.locator("#field-password").fill(password);
    await page.getByRole("button", { name: /login/i }).click();
    await page.waitForURL(/\/admin(\/)?$/);
    await shot(page, "dashboard");

    const cs = await payload.find({
      collection: "case-studies",
      where: { slug: { equals: "medical-prescription-ocr" } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (cs.docs[0]) {
      await page.goto(`${BASE}/admin/collections/case-studies/${cs.docs[0].id}`);
      await shot(page, "case-study");
      await page.getByRole("button", { name: "Story" }).first().click();
      await page.getByText("Annotations", { exact: false }).first().scrollIntoViewIfNeeded();
      await shot(page, "annotations");
    }

    const post = await payload.find({
      collection: "posts",
      where: { slug: { equals: "ai-trends-2025" } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (post.docs[0]) {
      await page.goto(`${BASE}/admin/collections/posts/${post.docs[0].id}`);
      await page.locator(".rich-text-lexical").first().scrollIntoViewIfNeeded();
      await shot(page, "insight");
    }

    await page.goto(`${BASE}/admin/content-health`);
    await shot(page, "content-health");
  } finally {
    await browser.close();
    await payload.delete({ collection: "users", id: user.id, overrideAccess: true });
    console.log("temporary user deleted");
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
