import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LogLabel } from "./LogLabel";
import { Metric, type MetricProps } from "./Metric";
import { Pill } from "./Pill";

export type FeatureCaseProps = {
  href: string;
  labels: string[];
  title: string;
  summary: string;
  metrics: MetricProps[];
  visual: ReactNode;
  /** Shows a "Prototype" pill next to the labels. */
  prototype?: boolean;
  className?: string;
};

/** Large two-column case study card: text + metrics | dot-grid visual. */
export function FeatureCase({ href, labels, title, summary, metrics, visual, prototype, className }: FeatureCaseProps) {
  return (
    <Link
      href={href}
      className={cn(
        "grid grid-cols-[1fr_1.1fr] border border-line bg-surface no-underline transition-colors duration-200 hover:border-ink max-[900px]:grid-cols-1",
        className,
      )}
    >
      <div className="flex flex-col justify-between gap-[18px] p-9 max-[900px]:p-[26px]">
        <div className="flex flex-col gap-4">
          <span className="flex flex-wrap items-center gap-3">
            <LogLabel items={labels} />
            {prototype ? <Pill tone="signal">Prototype</Pill> : null}
          </span>
          <h3 className="font-serif text-[clamp(28px,3vw,39px)] leading-[1.08]">{title}</h3>
          <p className="max-w-[48ch] text-[16.5px] text-muted">{summary}</p>
        </div>
        {metrics.length ? (
          <div className="grid grid-cols-3 border-t border-line">
            {metrics.slice(0, 3).map((m, i) => (
              <Metric key={`${m.label}-${i}`} {...m} size="md" accent hideSource className="gap-0 py-3.5 pr-2.5" />
            ))}
          </div>
        ) : null}
      </div>
      <div className="relative flex items-center justify-center border-l border-line bg-paper p-8 dotgrid max-[900px]:border-t max-[900px]:border-l-0">
        {visual}
      </div>
    </Link>
  );
}

export default FeatureCase;
