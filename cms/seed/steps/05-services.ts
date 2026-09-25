import type { Payload } from "payload";
import { readLegacy, slugify } from "../lib/context";
import { blocksToLexical } from "../lib/html-to-lexical";
import type { LegacyService } from "../lib/legacy-types";
import { report } from "../lib/report";
import { idBySlug, upsert } from "../lib/upsert";

export const SERVICE_MAP = [
  { slug: "ai-machine-learning", title: "AI & Machine Learning", category: "AI & ML", outcomeHeadline: "Automate the work your team does by hand", order: 1 },
  { slug: "web-development", title: "Web Development", category: "Web", outcomeHeadline: "Web platforms that hold up under real traffic", order: 2 },
  { slug: "mobile-development", title: "Mobile App Development", category: "Mobile", outcomeHeadline: "Apps your customers keep on their home screen", order: 3 },
  { slug: "uiux", title: "Product & UX Design", category: "Product design", outcomeHeadline: "Design that shortens the path to \u201Cdone\u201D", order: 4 },
  { slug: "cloud-solutions", title: "Cloud & DevOps", category: "Cloud", outcomeHeadline: "Infrastructure you don\u2019t have to think about", order: 5 },
] as const;

export async function seedServices(payload: Payload) {
  report.step("05 services");
  for (const s of SERVICE_MAP) {
    const legacy = readLegacy<LegacyService>(`services/${s.slug}.json`);
    const technologies: string[] = [];
    for (const t of legacy.techstack) {
      const id = await idBySlug(payload, "technologies", slugify(t.name));
      if (id) technologies.push(id);
    }
    const content = await blocksToLexical(
      [{ h2: legacy.section_name }, { p: legacy.section_description }],
      payload.config,
    );
    await upsert(
      payload,
      "services",
      s.slug,
      { slug: { equals: s.slug } },
      {
        title: s.title,
        slug: s.slug,
        category: s.category,
        outcomeHeadline: s.outcomeHeadline,
        summary: legacy.description,
        technologies,
        order: s.order,
        layout: [{ blockType: "richText", content, width: "measure" }],
        meta: { title: s.title, description: legacy.description },
      },
      { versioned: true },
    );
  }
}
