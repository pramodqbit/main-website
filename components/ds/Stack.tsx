import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

export const gapClass: Record<Gap, string> = {
  0: "gap-0", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4", 5: "gap-5",
  6: "gap-6", 8: "gap-8", 10: "gap-10", 12: "gap-12", 16: "gap-16",
};

export type StackProps = {
  gap?: Gap;
  as?: "div" | "ul" | "ol" | "section" | "article";
  className?: string;
  children: ReactNode;
};

/** Vertical flex column. */
export function Stack({ gap = 4, as: Tag = "div", className, children }: StackProps) {
  return <Tag className={cn("flex flex-col", gapClass[gap], className)}>{children}</Tag>;
}

export default Stack;
