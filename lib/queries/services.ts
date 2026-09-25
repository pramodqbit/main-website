import "server-only";
import { cache } from "react";
import type { Service } from "@/payload-types";
import { ctx, published, safe } from "./shared";

export const getService = cache(async (slug: string): Promise<Service | null> => {
  const { payload, draft } = await ctx();
  const res = await payload.find({
    collection: "services",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  });
  return res.docs[0] ?? null;
});

export const listServices = cache(async (): Promise<Service[]> => {
  const { payload, draft } = await ctx();
  const res = await payload.find({
    collection: "services",
    where: draft ? undefined : published,
    sort: "order",
    limit: 50,
    depth: 1,
    draft,
    overrideAccess: draft,
  });
  return res.docs;
});

export const serviceSlugs = cache(async (): Promise<string[]> =>
  safe(async () => {
    const { payload } = await ctx();
    const res = await payload.find({ collection: "services", where: published, limit: 1000, depth: 0, select: { slug: true } });
    return res.docs.map((d) => d.slug).filter((s): s is string => Boolean(s));
  }, []),
);
