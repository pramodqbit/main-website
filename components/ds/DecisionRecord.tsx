import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DecisionRecordProps = {
  problem: ReactNode;
  options: { label: string; chosen?: boolean | null }[];
  decision: ReactNode;
  why: ReactNode;
  className?: string;
};

const dt = "border-b border-line py-2.5 font-mono text-label uppercase text-muted";
const dd = "border-b border-line py-2.5";

/**
 * Problem / Options / Decision / Why. Rejected options are struck through.
 * With motion on, the decision plays out when it scrolls into view: rejected options are crossed out one by one,
 * then the chosen one lights up (CSS in globals.css, `[data-reveal="decision"]`).
 */
export function DecisionRecord({ problem, options, decision, why, className }: DecisionRecordProps) {
  const rejected = options.filter((o) => !o.chosen).length;
  let x = 0;
  return (
    <dl
      data-reveal="decision"
      style={{ ["--n" as string]: rejected }}
      className={cn("grid grid-cols-[96px_1fr] gap-x-4 border-t border-line", className)}
    >
      <dt className={dt}>Problem</dt>
      <dd className={dd}>{problem}</dd>
      {options.length ? (
        <>
          <dt className={dt}>Options</dt>
          <dd className={dd}>
            <ul className="flex flex-col gap-1">
              {options.map((o, i) => (
                <li key={`${o.label}-${i}`} className={o.chosen ? "self-start" : ""}>
                  {o.chosen ? (
                    <span className="dr-ok">{o.label}</span>
                  ) : (
                    <span className="dr-x" style={{ ["--i" as string]: x++ }}>
                      {o.label}
                    </span>
                  )}
                  {o.chosen ? (
                    <span aria-hidden="true" className="dr-ok-mark">
                      ✓ CHOSEN
                    </span>
                  ) : null}
                  <span className="sr-only">{o.chosen ? " (chosen)" : " (rejected)"}</span>
                </li>
              ))}
            </ul>
          </dd>
        </>
      ) : null}
      <dt className={dt}>Decision</dt>
      <dd className={cn(dd, "font-semibold")}>{decision}</dd>
      <dt className={dt}>Why</dt>
      <dd className={dd}>{why}</dd>
    </dl>
  );
}

export default DecisionRecord;
