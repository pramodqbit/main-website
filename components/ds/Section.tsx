import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionProps = {
  id?: string;
  tone?: "paper" | "surface" | "inverted";
  bordered?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

/**
 * Page band with vertical rhythm and the `wrap` gutters.
 * `inverted` remaps the colour tokens for everything inside (see `tone-inverted` in globals.css).
 */
export function Section({ id, tone = "paper", bordered = true, className, innerClassName, children }: SectionProps) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={cn(
        "py-24 max-md:py-16",
        tone === "surface" && "bg-surface",
        tone === "inverted" && "tone-inverted",
        bordered && tone !== "inverted" && "border-b border-line",
        className,
      )}
    >
      <div className={cn("wrap", innerClassName)}>{children}</div>
    </section>
  );
}

export default Section;
