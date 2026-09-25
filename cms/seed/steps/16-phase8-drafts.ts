import fs from "fs";
import path from "path";
import type { Payload } from "payload";
import type { Faq } from "@/payload-types";
import { flags, seedContext } from "../lib/context";
import { report } from "../lib/report";
import { findOne, upsert } from "../lib/upsert";

const DRAFTS = path.resolve(process.cwd(), "content/drafts/phase-8");

type ServiceDraft = {
  slug: string;
  problems?: unknown[];
  process?: unknown[];
  deliverables?: unknown[];
  typicalProjects?: unknown[];
};

type CaseDraft = {
  slug: string;
  platforms?: string[];
  timeline?: unknown[];
  beforeAfter?: unknown[];
  teamRoles?: unknown[];
  lessons?: unknown[];
};

type IndexSection = Record<string, unknown> & { blockType: string; note?: string; sampleCaseStudySlug?: string };

type IndexPagesDraft = {
  servicesPage: { hero: Record<string, unknown>; sections: IndexSection[] };
  workPage: { hero: Record<string, unknown>; sections: IndexSection[] };
  faqs: Array<{ question: string; answer: string; topic: Faq["topic"] }>;
};

const METHOD_STEPS = [
  {
    name: "Discover",
    description: "We sit with the people doing the work and write down what actually slows them down.",
    deliverable: "Problem brief · success metrics",
  },
  {
    name: "Decide",
    description: "We weigh the options on paper, including the ones we reject, before writing code.",
    deliverable: "Decision log · architecture · estimate",
  },
  {
    name: "Build",
    description: "Two-week sprints, a demo every sprint, and a written update every Friday in your time zone.",
    deliverable: "Working software · weekly log",
  },
  {
    name: "Measure",
    description: "We check the metrics we agreed in Phase 1 and publish the results, good or bad.",
    deliverable: "Results report · roadmap",
  },
];

function readDrafts<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(DRAFTS, file), "utf8")) as T;
}

function isEmpty(v: unknown): boolean {
  if (v == null) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "string") return !v.trim();
  return false;
}

async function findDraftDoc<T extends { id: string | number }>(
  payload: Payload,
  collection: "services" | "case-studies",
  slug: string,
): Promise<T | null> {
  const res = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
    pagination: false,
  });
  return (res.docs[0] as unknown as T | undefined) ?? null;
}

async function seedServices(payload: Payload) {
  const { services } = readDrafts<{ services: ServiceDraft[] }>("services.json");
  for (const s of services) {
    const doc = await findDraftDoc<ServiceDraft & { id: string }>(payload, "services", s.slug);
    if (!doc) {
      report.log("services", s.slug, "failed", "service not found");
      continue;
    }
    const patch: Record<string, unknown> = {};
    for (const key of ["problems", "process", "deliverables", "typicalProjects"] as const) {
      const incoming = s[key];
      if (!incoming?.length) continue;
      if (isEmpty(doc[key])) patch[key] = incoming;
    }
    if (!Object.keys(patch).length) {
      report.log("services", s.slug, "skipped", "latest version already has these fields");
      continue;
    }
    if (flags.dryRun) {
      report.log("services", s.slug, "updated", `dry run: ${Object.keys(patch).join(", ")}`);
      continue;
    }
    await payload.update({
      collection: "services",
      id: doc.id,
      data: { ...patch, _status: "draft" },
      draft: true,
      overrideAccess: true,
      context: seedContext,
    });
    report.log("services", s.slug, "updated", `draft: ${Object.keys(patch).join(", ")}`);
  }
}

async function seedCaseStudies(payload: Payload) {
  const { caseStudies } = readDrafts<{ caseStudies: CaseDraft[] }>("case-studies.json");
  for (const cs of caseStudies) {
    const doc = await findDraftDoc<CaseDraft & { id: string }>(payload, "case-studies", cs.slug);
    if (!doc) {
      report.log("case-studies", cs.slug, "failed", "case study not found");
      continue;
    }
    const patch: Record<string, unknown> = {};
    for (const key of ["platforms", "timeline", "beforeAfter", "teamRoles", "lessons"] as const) {
      const incoming = cs[key];
      if (!incoming?.length) continue;
      if (isEmpty(doc[key])) patch[key] = incoming;
    }
    if (!Object.keys(patch).length) {
      report.log("case-studies", cs.slug, "skipped", "latest version already has these fields (or draft empty)");
      continue;
    }
    if (flags.dryRun) {
      report.log("case-studies", cs.slug, "updated", `dry run: ${Object.keys(patch).join(", ")}`);
      continue;
    }
    await payload.update({
      collection: "case-studies",
      id: doc.id,
      data: { ...patch, _status: "draft" },
      draft: true,
      overrideAccess: true,
      context: seedContext,
    });
    report.log("case-studies", cs.slug, "updated", `draft: ${Object.keys(patch).join(", ")}`);
  }
}

function mapIncludes(includes: unknown): { item: string }[] | undefined {
  if (!Array.isArray(includes)) return undefined;
  return includes.map((x) => (typeof x === "string" ? { item: x } : (x as { item: string })));
}

async function resolveSection(payload: Payload, section: IndexSection): Promise<Record<string, unknown>> {
  const { sampleCaseStudySlug, ...rest } = section;
  const { note: _seedNote, ...blockFields } = rest;
  void _seedNote;
  const out: Record<string, unknown> = { ...blockFields, enabled: false };

  if (section.blockType === "method" && (!Array.isArray(section.steps) || !section.steps.length)) {
    out.label = section.label ?? "LOG / METHOD";
    out.title = section.title ?? "How a Qbitlog project runs";
    out.intro =
      section.intro ??
      "Four phases, each ending in something you can read, not just a status meeting. You always know what we decided and why.";
    out.steps = METHOD_STEPS;
    out.inverted = true;
  }

  if (section.blockType === "engagementModels" && Array.isArray(section.models)) {
    out.models = (section.models as Array<Record<string, unknown>>).map((m) => ({
      ...m,
      includes: mapIncludes(m.includes),
    }));
  }

  if (section.blockType === "writeupExplainer" && sampleCaseStudySlug) {
    const id = (await findOne(payload, "case-studies", { slug: { equals: sampleCaseStudySlug } }))?.id ?? null;
    if (id) out.sampleCaseStudy = id;
    delete out.sampleCaseStudySlug;
  }

  return out;
}

async function seedIndexGlobal(
  payload: Payload,
  slug: "services-page" | "work-page",
  data: { hero: Record<string, unknown>; sections: IndexSection[] },
) {
  const current = await payload.findGlobal({ slug, depth: 0, overrideAccess: true });
  const existing = (current as { sections?: unknown[] | null }).sections;
  if (existing?.length) {
    report.log(slug, "sections", "skipped", "sections already set");
    return;
  }
  const sections = await Promise.all(data.sections.map((s) => resolveSection(payload, s)));
  if (flags.dryRun) {
    report.log(slug, "sections", "updated", `dry run: hero + ${sections.length} disabled sections`);
    return;
  }
  await payload.updateGlobal({
    slug,
    data: { hero: data.hero, sections },
    overrideAccess: true,
    context: seedContext,
  });
  report.log(slug, "sections", "updated", `hero + ${sections.length} sections (enabled: false)`);
}

async function seedFaqs(payload: Payload) {
  const { faqs } = readDrafts<IndexPagesDraft>("index-pages.json");
  let order = 100;
  for (const f of faqs) {
    const bare = f.question.replace(/^\[REVIEW\]\s*/, "");
    const existing = await payload.find({
      collection: "faqs",
      where: { or: [{ question: { equals: f.question } }, { question: { equals: bare } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs[0] && existing.docs[0].question === bare) {
      report.log("faqs", bare, "skipped", "already approved by marketing");
      continue;
    }
    // Engagement/pricing FAQs feed the /services FAQ section (topic: engagement).
    const topic = f.topic === "pricing" || f.topic === "engagement" ? "engagement" : f.topic;
    await upsert(payload, "faqs", f.question, { question: { equals: f.question } }, {
      question: f.question,
      answer: f.answer,
      topic,
      order: order++,
    });
  }
}

/**
 * Phase 8: import drafted depth content as drafts / disabled sections.
 * Never overwrites non-empty editor fields. Never applies recommended.* case-study corrections.
 */
export async function seedPhase8Drafts(payload: Payload) {
  report.step("16 phase-8 drafts");
  await seedServices(payload);
  await seedCaseStudies(payload);
  const pages = readDrafts<IndexPagesDraft>("index-pages.json");
  await seedIndexGlobal(payload, "services-page", pages.servicesPage);
  await seedIndexGlobal(payload, "work-page", pages.workPage);
  await seedFaqs(payload);
}
