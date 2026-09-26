import { BeforeAfterTable } from "@/components/ds/BeforeAfterTable";
import { Section } from "@/components/ds/Section";
import type { BeforeAfterBlock as BeforeAfterData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

/** "What gets easier": today's pain → what changes, one row per area of work. */
export function BeforeAfterBlock({ block }: { block: BeforeAfterData }) {
  const rows = (block.rows ?? []).map((r) => ({ aspect: r.aspect, before: r.before, after: r.after }));
  if (!rows.length) return null;
  return (
    <Section>
      <SectionHeader data={block} />
      <BeforeAfterTable rows={rows} caption={block.title ?? "What gets easier"} />
    </Section>
  );
}

export default BeforeAfterBlock;
