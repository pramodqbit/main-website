import "server-only";
import { cache } from "react";
import type { Industry } from "@/payload-types";
import { ctx, published, safe } from "./shared";

export const getIndustry = cache(async (slug: string): Promise<Industry | null> => {
  const { payload, draft } = await ctx();
  const res = await payload.find({
    collection: "industries",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  });
  return res.docs[0] ?? null;
});

export const listIndustries = cache(async (): Promise<Industry[]> => {
  const { payload, draft } = await ctx();
  const res = await payload.find({
    collection: "industries",
    where: draft ? undefined : published,
    sort: "order",
    limit: 50,
    depth: 1,
    draft,
    overrideAccess: draft,
  });
  return res.docs;
});

export const industrySlugs = cache(async (): Promise<string[]> =>
  safe(async () => {
    const { payload } = await ctx();
    const res = await payload.find({ collection: "industries", where: published, limit: 1000, depth: 0, select: { slug: true } });
    return res.docs.map((d) => d.slug).filter((s): s is string => Boolean(s));
  }, []),
);
