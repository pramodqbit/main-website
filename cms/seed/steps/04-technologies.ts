import type { Payload } from "payload";
import type { Technology } from "@/payload-types";
import { readLegacy, slugify } from "../lib/context";
import type { LegacyCaseStudy, LegacyService } from "../lib/legacy-types";
import { mediaIdFor } from "../lib/media";
import { report } from "../lib/report";
import { upsert } from "../lib/upsert";
import { logoMatches } from "./01-media";

type Category = NonNullable<Technology["category"]>;

const RULES: Array<[RegExp, Category]> = [
  [/^(react|react\.js|next\.js|angular|tailwind|tailwind css|typescript)$/i, "Frontend"],
  [/^(node\.js|php|python|fastapi)$/i, "Backend"],
  [/^(flutter|kotlin|swift|react native|expo|ionic|android studio)$/i, "Mobile"],
  [/(tensorflow|pytorch|scikit|openai|gemini|natural language|computer vision|document ai|document intelligence|textract|comprehend)/i, "AI"],
  [/(aws|amazon web services|azure|gcp|google cloud|vercel|digitalocean|docker|kubernetes|terraform|ci\/cd|s3)/i, "Cloud"],
  [/^(mongodb|postgresql|redis|prisma)$/i, "Data"],
  [/(figma|adobe|photoshop|illustrator|corel)/i, "Design"],
];

function categoryFor(name: string): Category {
  for (const [re, cat] of RULES) if (re.test(name)) return cat;
  report.log("technologies", name, "skipped", "unknown category → Backend");
  return "Backend";
}

export function collectTechnologies(): Array<{ name: string; icon?: string }> {
  const out = new Map<string, { name: string; icon?: string }>();
  for (const cs of readLegacy<LegacyCaseStudy[]>("case-studies.json")) {
    for (const t of cs.technologies) if (!out.has(t.name.toLowerCase())) out.set(t.name.toLowerCase(), t);
  }
  for (const file of ["ai-machine-learning", "cloud-solutions", "mobile-development", "uiux", "web-development"]) {
    for (const t of readLegacy<LegacyService>(`services/${file}.json`).techstack) {
      const icon = t.image && logoMatches(t.name, t.image) ? t.image : undefined;
      if (!out.has(t.name.toLowerCase())) out.set(t.name.toLowerCase(), { name: t.name, icon });
    }
  }
  return [...out.values()];
}

export async function seedTechnologies(payload: Payload) {
  report.step("04 technologies");
  for (const t of collectTechnologies()) {
    const logo = await mediaIdFor(payload, t.icon);
    const slug = slugify(t.name);
    await upsert(payload, "technologies", t.name, { slug: { equals: slug } }, {
      name: t.name,
      slug,
      category: categoryFor(t.name),
      ...(logo ? { logo } : {}),
    });
  }
}
