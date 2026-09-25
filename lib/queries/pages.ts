import "server-only";
import { cache } from "react";
import type { Page } from "@/payload-types";
import { ctx, published, safe } from "./shared";

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const { payload, draft } = await ctx();
  const res = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  });
  return res.docs[0] ?? null;
});

export const pageSlugs = cache(async (): Promise<string[]> =>
  safe(async () => {
    const { payload } = await ctx();
    const res = await payload.find({ collection: "pages", where: published, limit: 1000, depth: 0, select: { slug: true } });
    return res.docs.map((d) => d.slug).filter((s): s is string => Boolean(s));
  }, []),
);
