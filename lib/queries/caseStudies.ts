import "server-only";
import { cache } from "react";
import type { Where } from "payload";
import type { CaseStudy } from "@/payload-types";
import { ctx, published, safe } from "./shared";

export const getCaseStudy = cache(async (slug: string): Promise<CaseStudy | null> => {
  const { payload, draft } = await ctx();
  const res = await payload.find({
    collection: "case-studies",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  });
  return res.docs[0] ?? null;
});

export type ListCaseStudiesArgs = {
  industry?: string | null;
  /** Service document id. */
  service?: string | null;
  /** Service slug, e.g. from `/work?service=`. */
  serviceSlug?: string | null;
  featured?: boolean;
  limit?: number;
  exclude?: string[];
};

export const listCaseStudies = cache(
  async ({ industry, service, serviceSlug, featured, limit = 50, exclude }: ListCaseStudiesArgs = {}): Promise<CaseStudy[]> => {
    const { payload, draft } = await ctx();
    const and: Where[] = [];
    if (!draft) and.push(published);
    if (industry) and.push({ "industry.slug": { equals: industry } });
    if (service) and.push({ services: { contains: service } });
    if (serviceSlug) and.push({ "services.slug": { equals: serviceSlug } });
    if (featured) and.push({ featured: { equals: true } });
    if (exclude?.length) and.push({ id: { not_in: exclude } });
    const res = await payload.find({
      collection: "case-studies",
      where: and.length ? { and } : undefined,
      sort: ["order", "-year"],
      limit,
      depth: 1,
      draft,
      overrideAccess: draft,
    });
    return res.docs;
  },
);

/** Published case studies per service id, from one query. */
export const caseStudyCountsByService = cache(async (): Promise<Record<string, number>> =>
  safe(async () => {
    const { payload, draft } = await ctx();
    const res = await payload.find({
      collection: "case-studies",
      where: draft ? undefined : published,
      limit: 1000,
      depth: 0,
      select: { services: true },
      draft,
      overrideAccess: draft,
    });
    const counts: Record<string, number> = {};
    for (const cs of res.docs) {
      for (const s of cs.services ?? []) {
        const id = typeof s === "object" ? s.id : s;
        counts[id] = (counts[id] ?? 0) + 1;
      }
    }
    return counts;
  }, {}),
);

export type CaseStudyLink = { href: string; client: string; title: string };

/** The case studies before and after `slug` in `order` sequence, wrapping around. Null when there is only one. */
export const caseStudyNeighbours = cache(
  async (slug: string): Promise<{ prev: CaseStudyLink; next: CaseStudyLink } | null> =>
    safe(async () => {
      const { payload, draft } = await ctx();
      const res = await payload.find({
        collection: "case-studies",
        where: draft ? undefined : published,
        sort: ["order", "-year"],
        limit: 1000,
        depth: 0,
        select: { slug: true, client: true, title: true },
        draft,
        overrideAccess: draft,
      });
      const list = res.docs.filter((d) => d.slug);
      const i = list.findIndex((d) => d.slug === slug);
      if (i === -1 || list.length < 2) return null;
      const link = (d: (typeof list)[number]): CaseStudyLink => ({ href: `/work/${d.slug}`, client: d.client, title: d.title });
      return { prev: link(list[(i - 1 + list.length) % list.length]), next: link(list[(i + 1) % list.length]) };
    }, null),
);

export const caseStudySlugs = cache(async (): Promise<string[]> =>
  safe(async () => {
    const { payload } = await ctx();
    const res = await payload.find({ collection: "case-studies", where: published, limit: 1000, depth: 0, select: { slug: true } });
    return res.docs.map((d) => d.slug).filter((s): s is string => Boolean(s));
  }, []),
);
