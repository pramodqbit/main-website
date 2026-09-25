import type { Payload } from "payload";
import { report } from "../lib/report";
import { upsert } from "../lib/upsert";

/**
 * Legacy first tags (AI, RAG, Edge AI, Web, Platform) merged into three categories.
 * This mapping is the documented source of truth for post categories.
 */
export const CATEGORY_BY_FIRST_TAG: Record<string, string> = {
  AI: "ai-engineering",
  RAG: "ai-engineering",
  "Edge AI": "ai-engineering",
  Web: "web-architecture",
  Platform: "platform-engineering",
};

export const CATEGORIES = [
  { slug: "ai-engineering", title: "AI Engineering" },
  { slug: "web-architecture", title: "Web Architecture" },
  { slug: "platform-engineering", title: "Platform Engineering" },
];

export async function seedTaxonomy(payload: Payload) {
  report.step("02 taxonomy");
  for (const c of CATEGORIES) {
    await upsert(payload, "categories", c.slug, { slug: { equals: c.slug } }, { title: c.title, slug: c.slug });
  }
}
