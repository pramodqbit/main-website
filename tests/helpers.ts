import type { APIRequestContext, ConsoleMessage } from "@playwright/test";

export const STATIC_ROUTES = [
  "/",
  "/work",
  "/services",
  "/insights",
  "/about",
  "/about/team",
  "/contact",
  "/careers",
  "/log",
  "/academyai/privacy-policy",
  "/academyai/terms-and-conditions",
];

export const DETAIL_PREFIXES = ["/work/", "/insights/", "/services/", "/industries/", "/careers/"] as const;

/** Paths listed in /sitemap.xml, relative to the site root. */
export async function sitemapPaths(request: APIRequestContext): Promise<string[]> {
  const xml = await (await request.get("/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

/** The first published slug path for each detail route, e.g. { "/work/": "/work/medical-prescription-ocr" }. */
export async function firstDetailPaths(request: APIRequestContext): Promise<Partial<Record<(typeof DETAIL_PREFIXES)[number], string>>> {
  const paths = await sitemapPaths(request);
  const out: Partial<Record<(typeof DETAIL_PREFIXES)[number], string>> = {};
  for (const prefix of DETAIL_PREFIXES) {
    const hit = paths.find((p) => p.startsWith(prefix) && p.length > prefix.length);
    if (hit) out[prefix] = hit;
  }
  return out;
}

/** Console noise that isn't a site error: Vercel Analytics/Speed Insights scripts only exist on Vercel. */
export function isIgnorableConsoleError(msg: ConsoleMessage): boolean {
  return /_vercel\/(insights|speed-insights)|va\.vercel-scripts\.com/.test(`${msg.text()} ${msg.location().url}`);
}
