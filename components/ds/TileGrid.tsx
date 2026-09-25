import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TileGridProps = { children: ReactNode; className?: string };

/** 1px-gap hairline grid for `IndustryTile`s (4 → 2 → 1 columns). */
export function TileGrid({ children, className }: TileGridProps) {
  return (
    <div className={cn("grid grid-cols-4 gap-px border border-line bg-line max-[960px]:grid-cols-2 max-[520px]:grid-cols-1", className)}>
      {children}
    </div>
  );
}

export default TileGrid;
