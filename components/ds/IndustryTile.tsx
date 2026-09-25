import Link from "next/link";
import { cn } from "@/lib/utils";
import { MonoLabel } from "./MonoLabel";

export type IndustryTileProps = { href: string; label: string; title: string; summary: string; footLabel: string; className?: string };

/** Industry tile. Place several inside `TileGrid`. */
export function IndustryTile({ href, label, title, summary, footLabel, className }: IndustryTileProps) {
  return (
    <Link
      href={href}
      className={cn("flex min-h-[190px] flex-col gap-2.5 bg-surface p-6 no-underline transition-colors duration-200 hover:bg-paper", className)}
    >
      <MonoLabel>{label}</MonoLabel>
      <h3 className="font-serif text-2xl leading-[1.15]">{title}</h3>
      <p className="text-[14.5px] text-muted">{summary}</p>
      <span className="mt-auto font-mono text-[11.5px] uppercase tracking-[.06em] text-brand">{footLabel}</span>
    </Link>
  );
}

export default IndustryTile;
