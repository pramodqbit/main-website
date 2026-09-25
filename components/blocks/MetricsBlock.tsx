import { Metric, type MetricProps } from "@/components/ds/Metric";
import { Section } from "@/components/ds/Section";
import { toMetric } from "@/lib/content";
import type { MetricsBlock as MetricsData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

/** Hairline grid of metrics, each with its source. */
export function MetricGrid({ items }: { items: MetricProps[] }) {
  if (!items.length) return null;
  return (
    <div className="grid grid-cols-3 gap-px border border-line bg-line max-[860px]:grid-cols-2 max-[480px]:grid-cols-1">
      {items.map((m, i) => (
        <div key={`${m.label}-${i}`} className="bg-paper p-6">
          <Metric {...m} />
        </div>
      ))}
    </div>
  );
}

export function MetricsBlock({ block }: { block: MetricsData }) {
  if (!block.items?.length) return null;
  return (
    <Section>
      <SectionHeader data={block} />
      <MetricGrid items={block.items.map((m) => toMetric(m, { accent: true, size: "lg" }))} />
    </Section>
  );
}

export default MetricsBlock;
