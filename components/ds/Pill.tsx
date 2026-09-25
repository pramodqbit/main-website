import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PillProps = { tone?: "ok" | "signal" | "brand" | "muted"; children: ReactNode; className?: string };

const tones = { ok: "text-ok", signal: "text-signal", brand: "text-brand", muted: "text-muted" } as const;

/** Small bordered status tag. */
export function Pill({ tone = "muted", children, className }: PillProps) {
  return (
    <span className={cn("inline-block border border-current px-1.5 py-0.5 text-center font-mono text-[10.5px] tracking-[.04em] uppercase", tones[tone], className)}>
      {children}
    </span>
  );
}

export default Pill;
