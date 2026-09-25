import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Level = "h1" | "h2" | "h3" | "h4";

export type HeadingProps = {
  as?: Level;
  size: "display" | "h1" | "h2" | "h3" | "h4";
  /** Appended after the title in violet italic. */
  emphasis?: string | null;
  /** Put the emphasis on its own line from `md` up. */
  breakEmphasis?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
};

const sizes = {
  display: "text-[clamp(48px,7.6vw,116px)] leading-[.98] tracking-[-0.03em]",
  h1: "text-[clamp(40px,5.6vw,84px)] leading-[.98] tracking-[-0.03em]",
  h2: "text-[clamp(32px,4vw,49px)] leading-[1.05]",
  h3: "text-[28px] leading-[1.15]",
  h4: "text-xl",
} as const;

const defaultLevel: Record<HeadingProps["size"], Level> = { display: "h1", h1: "h1", h2: "h2", h3: "h3", h4: "h4" };

/** Serif heading (weight 400) with an optional violet italic emphasis. */
export function Heading({ as, size, emphasis, breakEmphasis, id, className, children }: HeadingProps) {
  const Tag = as ?? defaultLevel[size];
  return (
    <Tag id={id} className={cn("font-serif font-normal", sizes[size], className)}>
      {children}
      {emphasis ? (
        <>
          {breakEmphasis ? <br className="max-md:hidden" /> : null} <em className="italic text-brand">{emphasis}</em>
        </>
      ) : null}
    </Tag>
  );
}

export default Heading;
