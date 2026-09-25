import type { CaseCardProps } from "@/components/ds/CaseCard";
import type { MetricProps } from "@/components/ds/Metric";
import { mediaSource } from "@/components/ds/Media";
import type { CaseStudy, Industry, Media, MetricItems, Service, Team, Technology } from "@/payload-types";

export function populated<T extends object>(v: T | string | number | null | undefined): v is T {
  return typeof v === "object" && v !== null;
}

export function populatedList<T extends object>(list: Array<T | string | number> | null | undefined): T[] {
  return (list ?? []).filter(populated) as T[];
}

export function toMetric(m: NonNullable<MetricItems>[number], extra: Partial<MetricProps> = {}): MetricProps {
  return { value: m.value, unit: m.unit, label: m.label, source: m.source, ...extra };
}

export function featuredMetrics(cs: Pick<CaseStudy, "metrics">, max = 4): NonNullable<MetricItems> {
  return (cs.metrics ?? []).filter((m) => m.featured !== false).slice(0, max);
}

export function industryOf(cs: Pick<CaseStudy, "industry">): Industry | null {
  return populated(cs.industry) ? cs.industry : null;
}

export function durationLabel(cs: Pick<CaseStudy, "durationWeeks" | "teamSize">, short = false): string | null {
  const parts = [
    cs.durationWeeks ? (short ? `${cs.durationWeeks} wks` : `${cs.durationWeeks} weeks`) : null,
    cs.teamSize ? (short ? `${cs.teamSize} eng` : `${cs.teamSize} engineers`) : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

export function caseStudyCard(cs: CaseStudy, priority = false): CaseCardProps {
  const img = mediaSource(cs.heroImage as Media | null, "card");
  return {
    href: `/work/${cs.slug}`,
    industry: industryOf(cs)?.title ?? null,
    meta: durationLabel(cs, true),
    client: cs.client,
    title: cs.title,
    summary: cs.summary,
    image: img ? { src: img.src, alt: img.alt, width: img.width, height: img.height, objectPosition: img.objectPosition ?? "top" } : null,
    metrics: featuredMetrics(cs, 2).map((m) => toMetric(m, { hideSource: false })),
    priority,
    prototype: cs.status === "prototype",
  };
}

export function serviceRow(s: Service) {
  return { href: `/services/${s.slug}`, category: s.category, title: s.outcomeHeadline || s.title, summary: s.summary };
}

const TECH_CATEGORIES = ["Frontend", "Backend", "Mobile", "AI", "Cloud", "Data", "Design"];

/** Technologies grouped by category in a fixed order; uncategorised ones go last under "Other". */
export function technologiesByCategory(techs: Technology[]): { category: string; names: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const t of techs) {
    const key = t.category ?? "Other";
    groups.set(key, [...(groups.get(key) ?? []), t.name]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (TECH_CATEGORIES.indexOf(a) + 1 || 99) - (TECH_CATEGORIES.indexOf(b) + 1 || 99))
    .map(([category, names]) => ({ category, names }));
}

export function teamPhoto(t: Team) {
  const img = mediaSource(t.photo as Media | null, "thumb");
  return img ? { src: img.src, alt: img.alt || t.name } : null;
}

export function teamLinks(t: Team) {
  const l = t.links;
  return [
    l?.linkedin ? { label: "LinkedIn", href: l.linkedin } : null,
    l?.github ? { label: "GitHub", href: l.github } : null,
    l?.x ? { label: "X", href: l.x } : null,
    l?.website ? { label: "Website", href: l.website } : null,
  ].filter((x): x is { label: string; href: string } => x !== null);
}
