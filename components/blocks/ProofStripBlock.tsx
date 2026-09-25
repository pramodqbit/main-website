import { ProofStrip } from "@/components/ds/ProofStrip";
import { toMetric } from "@/lib/content";
import type { ProofStripBlock as ProofStripData } from "@/payload-types";

/** Standalone proof strip (when not directly under a hero). */
export function ProofStripBlock({ block }: { block: ProofStripData }) {
  if (!block.items?.length) return null;
  return (
    <div className="wrap py-12">
      <ProofStrip items={block.items.map((m) => toMetric(m, { size: "lg", countUp: true }))} />
    </div>
  );
}

export default ProofStripBlock;
