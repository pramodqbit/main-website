import fs from "fs";
import path from "path";
import type { Payload } from "payload";
import type { CaseStudy } from "@/payload-types";
import { flags, seedContext } from "../lib/context";
import { blocksToLexical } from "../lib/html-to-lexical";
import { report } from "../lib/report";
import { findOne, idBySlug } from "../lib/upsert";

const FILE = path.resolve(process.cwd(), "content/drafts/case-studies-2026/case-studies.json");

type Draft = Pick<
  CaseStudy,
  | "title" | "client" | "summary" | "durationWeeks" | "teamSize" | "year" | "status" | "platforms"
  | "heroAnnotations" | "timeline" | "decisions" | "features" | "beforeAfter" | "teamRoles" | "lessons"
> & {
  slug: string;
  services: string[];
  technologies: string[];
  challenge: string[];
  solution: string[];
  missingTechnologies?: string[];
};

/**
 * Case studies drafted from docs/content/case-studies/*.md (School OS, merged from three drafts, and Workstack).
 * Creates each one as a DRAFT only if no case study with that slug exists, so an editor's work is never
 * overwritten. Relationships are resolved by slug; anything missing is reported, not created.
 * Hero image, gallery, industry and testimonial are left for the editor.
 */
export async function seedCaseStudyDrafts2026(payload: Payload) {
  report.step("19 case study drafts (School OS, Workstack)");
  const { caseStudies } = JSON.parse(fs.readFileSync(FILE, "utf8")) as { caseStudies: Draft[] };

  for (const cs of caseStudies) {
    if (await findOne(payload, "case-studies", { slug: { equals: cs.slug } })) {
      report.log("case-studies", cs.slug, "skipped", "already exists; edit it in /admin");
      continue;
    }
    if (cs.title.length > 90 || cs.summary.length > 200) {
      report.log("case-studies", cs.slug, "failed", "title > 90 or summary > 200 characters");
      continue;
    }

    const resolve = async (collection: "services" | "technologies", slugs: string[]) => {
      const ids: string[] = [];
      for (const slug of slugs) {
        const id = await idBySlug(payload, collection, slug);
        if (id) ids.push(id);
        else report.log(collection, slug, "skipped", `not found, not linked to ${cs.slug}`);
      }
      return ids;
    };
    const services = await resolve("services", cs.services);
    const technologies = await resolve("technologies", cs.technologies);

    if (flags.dryRun) {
      report.log("case-studies", cs.slug, "created", "dry run");
      continue;
    }
    await payload.create({
      collection: "case-studies",
      draft: true,
      overrideAccess: true,
      context: seedContext,
      data: {
        _status: "draft",
        slug: cs.slug,
        title: cs.title,
        client: cs.client,
        summary: cs.summary,
        durationWeeks: cs.durationWeeks,
        teamSize: cs.teamSize,
        year: cs.year,
        status: cs.status,
        platforms: cs.platforms,
        services,
        technologies,
        heroAnnotations: cs.heroAnnotations,
        challenge: await blocksToLexical(cs.challenge.map((p) => ({ p })), payload.config),
        solution: await blocksToLexical(cs.solution.map((p) => ({ p })), payload.config),
        timeline: cs.timeline,
        decisions: cs.decisions,
        features: cs.features,
        beforeAfter: cs.beforeAfter,
        teamRoles: cs.teamRoles,
        lessons: cs.lessons,
      } as unknown as CaseStudy,
    });
    const missing = cs.missingTechnologies?.length ? `; add technologies: ${cs.missingTechnologies.join(", ")}` : "";
    report.log("case-studies", cs.slug, "created", `draft; needs hero image, industry${missing}`);
  }
}
