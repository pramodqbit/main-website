import "server-only";
import { cache } from "react";
import type { Job } from "@/payload-types";
import { ctx, published, safe } from "./shared";

export const getJob = cache(async (slug: string): Promise<Job | null> => {
  const { payload, draft } = await ctx();
  const res = await payload.find({
    collection: "jobs",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  });
  return res.docs[0] ?? null;
});

export const listOpenJobs = cache(async (): Promise<Job[]> => {
  const { payload, draft } = await ctx();
  const res = await payload.find({
    collection: "jobs",
    where: draft ? { status: { equals: "open" } } : { and: [published, { status: { equals: "open" } }] },
    sort: "-publishedAt",
    limit: 100,
    depth: 1,
    draft,
    overrideAccess: draft,
  });
  return res.docs;
});

export const jobSlugs = cache(async (): Promise<string[]> =>
  safe(async () => {
    const { payload } = await ctx();
    const res = await payload.find({ collection: "jobs", where: published, limit: 1000, depth: 0, select: { slug: true } });
    return res.docs.map((d) => d.slug).filter((s): s is string => Boolean(s));
  }, []),
);
