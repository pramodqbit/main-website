import type { Payload } from "payload";
import { readLegacy } from "../lib/context";
import { convertHtml, htmlWordCount, lexicalWordCount, nodeTypeCounts } from "../lib/html-to-lexical";
import type { LegacyPost } from "../lib/legacy-types";
import { mediaIdFor } from "../lib/media";
import { report } from "../lib/report";
import { idBySlug, upsert } from "../lib/upsert";
import { CATEGORY_BY_FIRST_TAG } from "./02-taxonomy";
import { TEAM_AUTHOR_SLUG } from "./03-team";

export async function seedPosts(payload: Payload) {
  report.step("08 posts");
  const posts = readLegacy<LegacyPost[]>("posts.json");
  const author = await idBySlug(payload, "team", TEAM_AUTHOR_SLUG);
  if (!author) throw new Error("Team author missing; run step 03 first");

  for (const post of posts) {
    const categorySlug = CATEGORY_BY_FIRST_TAG[post.tags[0]] ?? "ai-engineering";
    const category = await idBySlug(payload, "categories", categorySlug);
    if (!category) throw new Error(`Category ${categorySlug} missing; run step 02 first`);

    const content = await convertHtml(post.contentHtml, payload.config);
    const before = htmlWordCount(post.contentHtml);
    const after = lexicalWordCount(content);
    const loss = before ? (before - after) / before : 0;
    const types = Object.entries(nodeTypeCounts(content))
      .map(([k, v]) => `${k}:${v}`)
      .join(" ");
    if (loss > 0.02) {
      report.log("posts", post.slug, "failed", `word count ${before} → ${after} (${(loss * 100).toFixed(1)}% loss)`);
      continue;
    }
    const heroImage = await mediaIdFor(payload, post.heroImage);

    await upsert(
      payload,
      "posts",
      post.slug,
      { slug: { equals: post.slug } },
      {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        ...(heroImage ? { heroImage } : {}),
        content,
        authors: [author],
        category,
        tags: post.tags,
        publishedAt: new Date(post.date).toISOString(),
        meta: { title: post.title, description: post.excerpt, image: null },
      },
      { versioned: true },
    );
    report.log("posts", post.slug, "skipped", `words ${before} → ${after}; nodes ${types}`);
  }
}
