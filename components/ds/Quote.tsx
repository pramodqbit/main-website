import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LogLabel } from "./LogLabel";

export type QuoteProps = {
  quote: string;
  name: string;
  role?: string | null;
  company?: string | null;
  /** Optional eyebrow in a left column, e.g. "Client note". */
  label?: string | null;
  badge?: ReactNode;
  /** `sm` for quotes in a grid. */
  size?: "md" | "sm";
  className?: string;
};

/** Serif pull quote with curly brand quotes and a mono citation. */
export function Quote({ quote, name, role, company, label, badge, size = "md", className }: QuoteProps) {
  const cite = [name, [role, company].filter(Boolean).join(", ")].filter(Boolean).join(" · ");
  const body = (
    <figure className="m-0" data-reveal="up" data-reveal-delay={150}>
      <blockquote
        className={cn(
          "m-0 max-w-[36ch] font-serif leading-[1.3] tracking-[-0.01em] before:text-brand before:content-['“'] after:text-brand after:content-['”']",
          size === "sm" ? "text-[22px]" : "text-[clamp(24px,2.8vw,34px)]",
        )}
      >
        {quote}
      </blockquote>
      <figcaption className="mt-[18px] flex flex-wrap items-center gap-3 font-mono text-label uppercase tracking-[.06em] text-muted">
        <cite className="not-italic">{cite}</cite>
        {badge}
      </figcaption>
    </figure>
  );
  if (!label) return <div className={className}>{body}</div>;
  return (
    <div className={cn("grid grid-cols-[200px_1fr] gap-8 max-[860px]:grid-cols-1 max-[860px]:gap-3", className)}>
      <LogLabel items={[label]} className="self-start" />
      {body}
    </div>
  );
}

export default Quote;
