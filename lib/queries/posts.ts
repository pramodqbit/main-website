import "server-only";
import { cache } from "react";
import type { Where } from "payload";
import type { Category, Post } from "@/payload-types";
import { ctx, published, safe } from "./shared";

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const { payload, draft } = await ctx();
  const res = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  });
  return res.docs[0] ?? null;
});

export type ListPostsArgs = { page?: number; limit?: number; category?: string | null; exclude?: string[] };

export const listPosts = cache(async ({ page = 1, limit = 12, category, exclude }: ListPostsArgs = {}) => {
  const { payload, draft } = await ctx();
  const and: Where[] = [];
  if (!draft) and.push(published);
  if (category) and.push({ "category.slug": { equals: category } });
  if (exclude?.length) and.push({ id: { not_in: exclude } });
  return payload.find({
    collection: "posts",
    where: and.length ? { and } : undefined,
    sort: "-publishedAt",
    page,
    limit,
    depth: 1,
    draft,
    overrideAccess: draft,
  });
});

export const postSlugs = cache(async (): Promise<string[]> =>
  safe(async () => {
    const { payload } = await ctx();
    const res = await payload.find({ collection: "posts", where: published, limit: 1000, depth: 0, select: { slug: true } });
    return res.docs.map((d) => d.slug).filter((s): s is string => Boolean(s));
  }, []),
);

export const listCategories = cache(async (): Promise<Category[]> =>
  safe(async () => {
    const { payload } = await ctx();
    const res = await payload.find({ collection: "categories", sort: "title", limit: 100, depth: 0 });
    return res.docs;
  }, []),
);

/** Post category slug for each service; services not listed get the latest posts. */
const SERVICE_CATEGORIES: Record<string, string> = {
  "ai-machine-learning": "ai-engineering",
  "web-development": "web-architecture",
  "cloud-solutions": "platform-engineering",
};

/** Up to `max` posts related to a service: its mapped category, or the latest posts. */
export async function postsForService(service: { slug?: string | null } | null | undefined, max = 3): Promise<Post[]> {
  return safe(async () => {
    const category = (service?.slug && SERVICE_CATEGORIES[service.slug]) || null;
    return (await listPosts({ limit: max, category })).docs;
  }, []);
}

/** The post's `related` field, topped up with the latest posts in the same category (max 3). */
export async function relatedPosts(post: Post, max = 3): Promise<Post[]> {
  const picked = (post.related ?? []).filter((p): p is Post => typeof p === "object" && p !== null).slice(0, max);
  if (picked.length >= max) return picked;
  const category = typeof post.category === "object" && post.category ? post.category.slug : null;
  const more = await listPosts({ limit: max, category, exclude: [post.id, ...picked.map((p) => p.id)] });
  return [...picked, ...more.docs].slice(0, max);
}
