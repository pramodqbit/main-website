import { DecisionRecord } from "@/components/ds/DecisionRecord";
import { Section } from "@/components/ds/Section";
import type { DecisionRecordBlock as DecisionRecordData } from "@/payload-types";

export function DecisionRecordBlock({ block }: { block: DecisionRecordData }) {
  if (!block.problem && !block.decision) return null;
  return (
    <Section>
      <div className="measure">
        <DecisionRecord
          problem={block.problem}
          options={(block.options ?? []).map((o) => ({ label: o.label, chosen: o.chosen }))}
          decision={block.decision}
          why={block.why}
        />
      </div>
    </Section>
  );
}

export default DecisionRecordBlock;
