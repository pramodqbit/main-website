import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MonoLabelProps = {
  children: ReactNode;
  tone?: "muted" | "ink" | "brand";
  as?: "span" | "p" | "div" | "h2" | "h3";
  className?: string;
};

const tones = { muted: "text-muted", ink: "text-ink", brand: "text-brand" } as const;

/** Mono uppercase metadata label. */
export function MonoLabel({ children, tone = "muted", as: Tag = "span", className }: MonoLabelProps) {
  return (
    <Tag className={cn("font-mono font-normal text-label uppercase tracking-[.08em]", tones[tone], className)}>{children}</Tag>
  );
}

export default MonoLabel;
