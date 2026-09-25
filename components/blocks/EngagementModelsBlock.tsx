import { EngagementCard } from "@/components/ds/EngagementCard";
import { Section } from "@/components/ds/Section";
import type { EngagementModelsBlock as EngagementModelsData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

/** Ways to work with us, as bordered columns. */
export function EngagementModelsBlock({ block }: { block: EngagementModelsData }) {
  const models = block.models ?? [];
  if (!models.length) return null;
  return (
    <Section id="engagement">
      <SectionHeader data={block} />
      <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
        {models.map((m, i) => (
          <EngagementCard
            key={m.id ?? i}
            name={m.name}
            bestFor={m.bestFor}
            duration={m.duration}
            team={m.team}
            pricing={m.pricing}
            includes={(m.includes ?? []).map((x) => x.item)}
          />
        ))}
      </div>
    </Section>
  );
}

export default EngagementModelsBlock;
