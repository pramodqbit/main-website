import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gapClass, type Gap } from "./Stack";

export type ClusterProps = {
  gap?: Gap;
  as?: "div" | "ul" | "ol" | "nav";
  className?: string;
  children: ReactNode;
};

/** Wrapping horizontal row. */
export function Cluster({ gap = 3, as: Tag = "div", className, children }: ClusterProps) {
  return <Tag className={cn("flex flex-wrap items-center", gapClass[gap], className)}>{children}</Tag>;
}

export default Cluster;
