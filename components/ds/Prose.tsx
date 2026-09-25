import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ProseProps = { children: ReactNode; wide?: boolean; className?: string };

/** Long-form rich text container (typography plugin mapped to tokens). */
export function Prose({ children, wide, className }: ProseProps) {
  return (
    <div className={cn("prose prose-log", wide ? "max-w-none" : "max-w-[68ch]", className)} data-reveal="up" data-reveal-delay={200}>
      {children}
    </div>
  );
}

export default Prose;
