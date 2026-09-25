import { IndustryTile } from "@/components/ds/IndustryTile";
import { Section } from "@/components/ds/Section";
import { TileGrid } from "@/components/ds/TileGrid";
import { populatedList } from "@/lib/content";
import { listIndustries } from "@/lib/queries/industries";
import type { Industry, IndustryGridBlock as IndustryGridData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

export function industryTileProps(ind: Industry) {
  const count = (ind.caseStudies ?? []).length;
  return {
    href: `/industries/${ind.slug}`,
    label: ind.title,
    title: ind.headline,
    summary: ind.summary,
    footLabel: count ? `${count} case ${count === 1 ? "study" : "studies"}` : "Talk to us",
  };
}

/** Industry tiles. Empty selection = all published industries. */
export async function IndustryGridBlock({ block }: { block: IndustryGridData }) {
  const picked = populatedList(block.industries);
  const industries = picked.length ? picked : await listIndustries();
  if (!industries.length) return null;
  return (
    <Section id="industries">
      <SectionHeader data={block} />
      <TileGrid>
        {industries.map((ind) => (
          <IndustryTile key={ind.id} {...industryTileProps(ind)} />
        ))}
      </TileGrid>
    </Section>
  );
}

export default IndustryGridBlock;
