import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Metric, type MetricProps } from "./Metric";

export type ProofStripProps = { items: MetricProps[]; className?: string };

/** Row of 2–4 headline metrics with hairline dividers. */
export function ProofStrip({ items, className }: ProofStripProps) {
  if (!items.length) return null;
  const n = Math.min(4, items.length);
  return (
    <div
      style={{ "--n": n } as CSSProperties}
      className={cn(
        "relative grid grid-cols-1 gap-px border-y border-line bg-line min-[480px]:grid-cols-2 md:grid-cols-[repeat(var(--n),minmax(0,1fr))]",
        "min-[480px]:max-md:[&>*:last-child:nth-child(odd)]:col-span-2",
        className,
      )}
    >
      {items.slice(0, 4).map((m, i) => (
        <div key={`${m.label}-${i}`} className="bg-paper px-6 py-[26px]">
          <Metric {...m} size="lg" countUp />
        </div>
      ))}
    </div>
  );
}

export default ProofStrip;
