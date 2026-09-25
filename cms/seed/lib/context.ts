import fs from "fs";
import path from "path";

export const LEGACY = path.resolve(process.cwd(), "content/legacy");
export const PUBLIC = path.resolve(process.cwd(), "public");
export const CACHE = path.resolve(process.cwd(), "cms/seed/.cache");

export const flags = {
  dryRun: process.argv.includes("--dry-run"),
  only: process.argv.find((a) => a.startsWith("--only="))?.slice("--only=".length) ?? null,
  /** Overwrite globals and pages that already have content (off by default so editor work survives re-runs). */
  refresh: process.argv.includes("--refresh"),
};

/** Every create/update passes this so hooks don't try to revalidate outside Next. */
export const seedContext = { disableRevalidate: true } as const;

export function readLegacy<T>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(LEGACY, rel), "utf8")) as T;
}

/** Same slug function as the legacy careers pages. */
export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function yearOf(date: string): number {
  return new Date(date).getUTCFullYear();
}
