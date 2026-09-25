import { cn } from "@/lib/utils";
import { CountUp } from "@/components/motion/CountUp";

export type MetricProps = {
  value: string;
  unit?: string | null;
  label: string;
  /** Mandatory: who measured it, e.g. "Batra Hospital, 2024". */
  source: string;
  size?: "lg" | "md" | "sm";
  accent?: boolean;
  countUp?: boolean;
  /** Keep the source for screen readers only (cards show it on the detail page). */
  hideSource?: boolean;
  className?: string;
};

const valueSize = {
  lg: "text-[clamp(30px,3.4vw,44px)] leading-none",
  md: "text-[26px] leading-tight",
  sm: "text-[22px] leading-tight",
} as const;

/** A measured result: value + unit + label + source. */
export function Metric({ value, unit, label, source, size = "md", accent, countUp, hideSource, className }: MetricProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className={cn("font-mono tabular tracking-[-0.03em]", valueSize[size], accent && "text-signal")}>
        {countUp ? <CountUp value={value} /> : value}
        {unit ? <small className="ml-0.5 text-[.5em] text-muted">{unit}</small> : null}
      </span>
      <span className={cn("text-sm", size !== "lg" && "text-muted leading-[1.35]")}>{label}</span>
      <span className={cn("font-mono text-[11px] uppercase tracking-[.05em] text-muted", hideSource && "sr-only")}>
        {hideSource ? `Source: ${source}` : source}
      </span>
    </div>
  );
}

export default Metric;
