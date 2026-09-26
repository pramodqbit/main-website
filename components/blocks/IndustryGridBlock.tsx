import { IndustryTile } from "@/components/ds/IndustryTile";
import { Section } from "@/components/ds/Section";
import { TileGrid } from "@/components/ds/TileGrid";
import { featuredMetrics, populatedList, toMetric } from "@/lib/content";
import { listIndustries } from "@/lib/queries/industries";
import type { CaseStudy, Industry, IndustryGridBlock as IndustryGridData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

export function industryTileProps(ind: Industry) {
  const count = (ind.caseStudies ?? []).length;
  /* The first featured result of the first linked case study; editors choose it by reordering results. */
  const metric = populatedList<CaseStudy>(ind.caseStudies)
    .map((cs) => featuredMetrics(cs, 1)[0])
    .find(Boolean);
  return {
    href: `/industries/${ind.slug}`,
    label: ind.title,
    title: ind.headline,
    summary: ind.summary,
    problems: (ind.painPoints ?? []).map((p) => p.title).filter((t): t is string => Boolean(t)).slice(0, 2),
    proof: metric ? toMetric(metric) : null,
    footLabel: count ? `${count} case ${count === 1 ? "study" : "studies"}` : "Talk to us",
  };
}

/**
 * Industry tiles. Empty selection = all published industries.
 * `lead`: the block opens the page (e.g. `/industries`), so its title is the `h1`.
 */
export async function IndustryGridBlock({ block, lead = false }: { block: IndustryGridData; lead?: boolean }) {
  const picked = populatedList(block.industries);
  const industries = picked.length ? picked : await listIndustries();
  if (!industries.length) return null;
  return (
    <Section id="industries" bordered={!lead} className={lead ? "pt-[104px]" : undefined}>
      <SectionHeader data={block} as={lead ? "h1" : "h2"} />
      <TileGrid>
        {industries.map((ind) => (
          <IndustryTile key={ind.id} {...industryTileProps(ind)} />
        ))}
      </TileGrid>
    </Section>
  );
}

export default IndustryGridBlock;
