import type { MetadataRoute } from "next";
import type { CollectionSlug, Where } from "payload";
import { publicUrlFor } from "@/cms/utilities/paths";
import { getPayloadClient } from "@/lib/payload";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

const LEGAL_UPDATED = new Date("2026-09-18");

const STATIC_PATHS = ["/work", "/services", "/insights", "/about/team", "/careers", "/log"];

type Row = { slug?: string | null; updatedAt?: string | null };

async function published(collection: CollectionSlug, extra?: Where): Promise<Row[]> {
  try {
    const payload = await getPayloadClient();
    const where: Where = { _status: { equals: "published" } };
    const res = await payload.find({
      collection,
      where: extra ? { and: [where, extra] } : where,
      limit: 1000,
      depth: 0,
      pagination: false,
      select: { slug: true, updatedAt: true },
    });
    return res.docs as Row[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, caseStudies, services, industries, posts, jobs] = await Promise.all([
    published("pages", { "meta.noindex": { not_equals: true } }),
    published("case-studies"),
    published("services"),
    published("industries"),
    published("posts"),
    published("jobs", { status: { equals: "open" } }),
  ]);

  const entry = (path: string, updatedAt?: string | null): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    ...(updatedAt ? { lastModified: new Date(updatedAt) } : {}),
  });

  const docs = (collection: string, rows: Row[]) =>
    rows.filter((r) => r.slug).map((r) => entry(publicUrlFor(collection, r.slug), r.updatedAt));

  const home = pages.find((p) => p.slug === "home");
  return [
    entry("/", home?.updatedAt),
    ...docs("pages", pages.filter((p) => p.slug !== "home")),
    ...STATIC_PATHS.map((p) => entry(p)),
    ...docs("case-studies", caseStudies),
    ...docs("services", services),
    ...docs("industries", industries),
    ...docs("posts", posts),
    ...docs("jobs", jobs),
    { url: absoluteUrl("/academyai/privacy-policy"), lastModified: LEGAL_UPDATED },
    { url: absoluteUrl("/academyai/terms-and-conditions"), lastModified: LEGAL_UPDATED },
  ];
}
