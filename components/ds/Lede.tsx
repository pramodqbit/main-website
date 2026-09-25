import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LedeProps = { children: ReactNode; className?: string };

/** Intro paragraph under a heading. */
export function Lede({ children, className }: LedeProps) {
  return (
    <p className={cn("text-lg text-muted measure", className)} data-reveal="up" data-reveal-delay={300}>
      {children}
    </p>
  );
}

export default Lede;
