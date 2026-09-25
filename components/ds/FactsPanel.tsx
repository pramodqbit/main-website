import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FactsPanelRow = { label: string; value: ReactNode };

export type FactsPanelProps = { rows: FactsPanelRow[]; title?: string; className?: string };

/** Bordered project facts: mono labels, ink values. */
export function FactsPanel({ rows, title = "Project facts", className }: FactsPanelProps) {
  if (!rows.length) return null;
  return (
    <section aria-label={title} data-reveal="up" data-reveal-delay={200} className={cn("border border-line bg-surface", className)}>
      <h2 className="m-0 border-b border-line px-5 py-3 font-mono text-label font-normal uppercase text-ink">{title}</h2>
      <dl className="m-0 grid grid-cols-[104px_1fr] gap-x-4 px-5">
        {rows.map((r, i) => (
          <div key={r.label} className="contents">
            <dt className={cn("py-3 font-mono text-label uppercase text-muted", i > 0 && "border-t border-dashed border-line")}>
              {r.label}
            </dt>
            <dd className={cn("m-0 py-3 text-[15px] text-ink", i > 0 && "border-t border-dashed border-line")}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default FactsPanel;
