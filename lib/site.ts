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

/** Every origin this deployment answers on, for Payload's CORS/CSRF allowlists. */
export const siteOrigins = [
  ...new Set(
    [siteUrl, process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
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
