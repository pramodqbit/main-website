import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { StepsRail } from "@/components/motion/StepsRail";

export type Step = { name: string; description?: string | null; deliverable?: string | null };

export type StepsProps = {
  steps: Step[];
  /** Colours come from the surrounding Section tone; kept for API parity. */
  tone?: "paper" | "inverted";
  className?: string;
};

/** Numbered phases with a scroll-progress rail. */
export function Steps({ steps, className }: StepsProps) {
  if (!steps.length) return null;
  return (
    <StepsRail
      style={{ "--n": steps.length } as CSSProperties}
      className={cn(
        "grid grid-cols-1 gap-px border-t border-line bg-line min-[561px]:grid-cols-2 min-[961px]:grid-cols-[repeat(var(--n),minmax(0,1fr))]",
        "min-[561px]:max-[960px]:[&>[data-step]:last-child:nth-child(even)]:col-span-2",
        className,
      )}
    >
      {steps.map((s, i) => (
        <div key={`${s.name}-${i}`} data-step="" data-reveal="up" data-reveal-stagger={130} className="flex flex-col gap-3.5 bg-paper pt-7 pr-6 pb-8 min-[561px]:max-[960px]:[&:nth-child(odd)]:pl-6 min-[961px]:[&+&]:pl-6">
          <span className="font-mono text-label uppercase text-brand">Phase {i + 1}</span>
          <h3 className="font-serif text-[28px] leading-[1.15]">{s.name}</h3>
          {s.description ? <p className="text-[15px] text-muted">{s.description}</p> : null}
          {s.deliverable ? (
            <div className="mt-auto flex flex-col gap-1 border-t border-dashed border-line pt-3 font-mono text-xs">
              You get
              <span className="text-muted">{s.deliverable}</span>
            </div>
          ) : null}
        </div>
      ))}
    </StepsRail>
  );
}

export default Steps;
