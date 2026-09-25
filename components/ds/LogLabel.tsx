import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type LogLabelProps = { items: Array<string | null | undefined | false>; className?: string };

/** Mono uppercase eyebrow with a violet square: `■ CASE STUDY / HEALTHCARE / 10 WEEKS`. */
export function LogLabel({ items, className }: LogLabelProps) {
  const parts = items.filter((i): i is string => Boolean(i));
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-2.5 font-mono text-label uppercase text-muted", className)}>
      <span aria-hidden="true" className="size-2 shrink-0 bg-brand" />
      {parts.map((item, i) => (
        <Fragment key={`${item}-${i}`}>
          {i > 0 ? (
            <span aria-hidden="true" className="text-line">
              /
            </span>
          ) : null}
          <span>{item}</span>
        </Fragment>
      ))}
    </span>
  );
}

export default LogLabel;
