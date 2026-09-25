import { CapabilityTable } from "@/components/ds/CapabilityTable";
import { Section } from "@/components/ds/Section";
import { industryOf, populatedList } from "@/lib/content";
import { listCaseStudies } from "@/lib/queries/caseStudies";
import { listIndustries } from "@/lib/queries/industries";
import { listServices } from "@/lib/queries/services";
import type { CapabilityMatrixBlock as CapabilityMatrixData, CaseStudy } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

/** Industries × services, built from published content. */
export async function CapabilityMatrixBlock({ block }: { block: CapabilityMatrixData }) {
  const [industries, services, caseStudies] = await Promise.all([listIndustries(), listServices(), listCaseStudies()]);
  if (!industries.length || !services.length) return null;

  const firstMatch = new Map<string, CaseStudy>();
  for (const cs of caseStudies) {
    const industry = industryOf(cs)?.id;
    if (!industry) continue;
    for (const s of populatedList(cs.services)) {
      const key = `${industry}:${s.id}`;
      if (!firstMatch.has(key)) firstMatch.set(key, cs);
    }
  }

  return (
    <Section id="coverage">
      <SectionHeader data={block} />
      <CapabilityTable
        caption={block.title || "Industries and services"}
        emptyLabel={block.emptyCellLabel || "Ask us"}
        columns={services.map((s) => ({ key: s.id, label: s.category, href: `/services/${s.slug}` }))}
        rows={industries.map((ind) => ({
          key: ind.id,
          label: ind.title,
          href: `/industries/${ind.slug}`,
          cells: services.map((s) => {
            const cs = firstMatch.get(`${ind.id}:${s.id}`);
            return cs ? { href: `/work/${cs.slug}`, label: cs.client } : null;
          }),
        }))}
      />
    </Section>
  );
}

export default CapabilityMatrixBlock;
