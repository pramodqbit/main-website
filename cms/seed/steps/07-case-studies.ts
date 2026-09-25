import type { Payload } from "payload";
import type { CaseStudy } from "@/payload-types";
import { escapeHtml, readLegacy, slugify, yearOf } from "../lib/context";
import { blocksToLexical, convertHtml } from "../lib/html-to-lexical";
import type { LegacyCaseStudy } from "../lib/legacy-types";
import { isPlaceholderSvg, mediaIdFor } from "../lib/media";
import { report } from "../lib/report";
import { idBySlug, upsert } from "../lib/upsert";
import { INDUSTRY_BY_LEGACY } from "./06-industries";

const ORDER: Record<string, number> = { "medical-prescription-ocr": 1, "restaurant-os": 2, "hire-your-travel-partner": 3 };

/** Values that are not results: imported, but not featured. */
const NOT_RESULTS = [
  { value: "2018", label: "Trusted Since" },
  { value: "1", label: "Unified Operations Platform" },
];

type MetricRow = NonNullable<CaseStudy["metrics"]>[number];

export function splitMetric(raw: string): { value: string; unit?: string } {
  const pct = /^(\d+)(%|x)$/.exec(raw);
  if (pct) return { value: pct[1], unit: pct[2] };
  const range = /^(\d+)\s*[-–]\s*(\d+)\s*([a-z]+)$/i.exec(raw);
  if (range) return { value: `${range[1]}\u2013${range[2]}`, unit: range[3] };
  return { value: raw };
}

function servicesFor(cs: LegacyCaseStudy): string[] {
  const hay = [...cs.categories, ...cs.tags].join(" ").toLowerCase();
  const out = new Set<string>();
  if (/\bai\b|ocr|machine learning/.test(hay)) out.add("ai-machine-learning");
  if (/mobile/.test(hay) || cs.mobileImage) out.add("mobile-development");
  if (/web|dashboard|platform|management|automation|operations/.test(hay)) out.add("web-development");
  return [...out];
}

export async function seedCaseStudies(payload: Payload) {
  report.step("07 case studies");
  const studies = readLegacy<LegacyCaseStudy[]>("case-studies.json");

  for (const cs of studies) {
    const year = yearOf(cs.date);
    const industrySlug = INDUSTRY_BY_LEGACY[cs.industry];
    const industry = industrySlug ? await idBySlug(payload, "industries", industrySlug) : null;
    const services = (await Promise.all(servicesFor(cs).map((s) => idBySlug(payload, "services", s)))).filter(
      (x): x is string => Boolean(x),
    );
    const technologies = (
      await Promise.all(cs.technologies.map((t) => idBySlug(payload, "technologies", slugify(t.name))))
    ).filter((x): x is string => Boolean(x));

    const heroImage = await mediaIdFor(payload, cs.heroImage);
    if (!heroImage) {
      report.log("case-studies", cs.slug, "failed", "hero image missing; run step 01 first");
      continue;
    }

    const metrics: MetricRow[] = cs.metrics.map((m) => ({
      ...splitMetric(m.value),
      label: m.label,
      source: `${cs.client}, ${year}`,
      featured: !NOT_RESULTS.some((n) => n.value === m.value && n.label === m.label),
    }));

    const gallery: NonNullable<CaseStudy["gallery"]> = [];
    for (const s of cs.screenshots) {
      if (isPlaceholderSvg(s.image)) continue;
      const image = await mediaIdFor(payload, s.image);
      if (image) gallery.push({ image, caption: s.caption });
    }
    for (const [p, caption] of [
      [cs.mobileImage, "Mobile app"],
      [cs.iconImage, "Project illustration"],
    ] as const) {
      if (!p || isPlaceholderSvg(p)) continue;
      const image = await mediaIdFor(payload, p);
      if (image) gallery.push({ image, caption });
    }

    const bodyHtml =
      cs.contentHtml +
      `<h2>What we built</h2><ul>${cs.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>` +
      `<h2>Results</h2><p>${escapeHtml(cs.results)}</p>`;

    const existing = await idBySlug(payload, "case-studies", cs.slug);
    let testimonial: string | undefined;
    if (existing) {
      const doc = await payload.findByID({ collection: "case-studies", id: existing, depth: 0, draft: true, overrideAccess: true });
      testimonial = typeof doc.testimonial === "string" ? doc.testimonial : undefined;
    }

    const id = await upsert(
      payload,
      "case-studies",
      cs.slug,
      { slug: { equals: cs.slug } },
      {
        title: cs.title,
        slug: cs.slug,
        client: cs.client,
        summary: cs.excerpt.length > 200 ? `${cs.excerpt.slice(0, 197).replace(/\s+\S*$/, "")}…` : cs.excerpt,
        ...(industry ? { industry } : {}),
        services,
        durationWeeks: parseInt(cs.duration, 10),
        teamSize: parseInt(cs.teamSize, 10),
        year,
        status: cs.isPrototype ? "prototype" : "live",
        liveUrl: cs.liveUrl ?? cs.demoUrl,
        featured: true,
        order: ORDER[cs.slug] ?? 10,
        metrics,
        ...(testimonial ? { testimonial } : {}),
        heroImage,
        challenge: await blocksToLexical([{ p: cs.challenge }, { p: cs.overviewAbout }], payload.config),
        solution: await blocksToLexical([{ p: cs.solutionIntro }, { p: cs.solution }], payload.config),
        features: cs.solutionFeatures.map((f) => ({ title: f.title, description: f.description })),
        gallery,
        body: await convertHtml(bodyHtml, payload.config),
        technologies,
        meta: {
          title: cs.title,
          description: `${cs.projectType}. ${cs.description}`,
          image: null,
        },
      },
      { versioned: true },
    );

    if (id && industry && industrySlug) {
      const ind = await payload.findByID({ collection: "industries", id: industry, depth: 0, draft: true, overrideAccess: true });
      const current = (ind.caseStudies ?? []).map((c) => (typeof c === "string" ? c : c.id));
      if (!current.includes(id)) {
        await payload.update({
          collection: "industries",
          id: industry,
          data: { caseStudies: [...current, id] },
          draft: true,
          overrideAccess: true,
          context: { disableRevalidate: true },
        });
        report.log("industries", industrySlug, "updated", `linked ${cs.slug}`);
      }
    }
  }
}
