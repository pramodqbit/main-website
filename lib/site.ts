/**
 * Origin the app is running on, from the env Vercel sets automatically: the production domain in
 * production, the deployment URL on previews, and localhost in dev. Server-only (VERCEL_* are not
 * exposed to the browser); client code should use `window.location.origin`.
 */
function resolveSiteUrl(): string {
  const host =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
      : process.env.VERCEL_URL;
  return host ? `https://${host}` : `http://localhost:${process.env.PORT ?? 3001}`;
}

export const siteUrl = resolveSiteUrl();

/** Primary brand mark (navbar, favicon, structured data fallbacks). */
export const brandLogoPath = "/logo (4).webp";

/**
 * Custom domains the site is served on. Vercel exposes no env for these, and Payload ignores the
 * login cookie on requests from an origin missing from `csrf`, so add any new domain here.
 */
const CUSTOM_DOMAINS = ["qbitlog.com", "www.qbitlog.com", "staging.qbitlog.com"];

/** Every origin this deployment answers on, for Payload's CORS/CSRF allowlists. */
export const siteOrigins = [
  ...new Set(
    [siteUrl, process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, ...CUSTOM_DOMAINS]
      .filter((v): v is string => Boolean(v))
      .map((v) => (v.startsWith("http") ? v : `https://${v}`)),
  ),
];

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatDate(date: string | null | undefined, opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

export function slugifyText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
