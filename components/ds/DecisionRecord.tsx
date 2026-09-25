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

/** Problem / Options / Decision / Why. Rejected options are struck through. */
export function DecisionRecord({ problem, options, decision, why, className }: DecisionRecordProps) {
  return (
    <dl className={cn("grid grid-cols-[96px_1fr] gap-x-4 border-t border-line", className)}>
      <dt className={dt}>Problem</dt>
      <dd className={dd}>{problem}</dd>
      {options.length ? (
        <>
          <dt className={dt}>Options</dt>
          <dd className={dd}>
            <ul className="flex flex-col gap-1">
              {options.map((o, i) => (
                <li key={`${o.label}-${i}`} className={o.chosen ? "" : "text-muted line-through"}>
                  {o.label}
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
