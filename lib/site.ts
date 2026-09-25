export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://qbitlog.com").replace(/\/$/, "");

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
