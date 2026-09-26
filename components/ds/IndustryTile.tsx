import Link from "next/link";
import { cn } from "@/lib/utils";
import { Metric, type MetricProps } from "./Metric";
import { MonoLabel } from "./MonoLabel";

export type IndustryTileProps = {
  href: string;
  label: string;
  title: string;
  summary: string;
  footLabel: string;
  /** Up to two problems we solve in this industry. */
  problems?: string[];
  /** One measured result from a case study in this industry. */
  proof?: Pick<MetricProps, "value" | "unit" | "label" | "source"> | null;
  className?: string;
};

/** Industry tile: the problems we solve → one measured result. Place several inside `TileGrid`. */
export function IndustryTile({ href, label, title, summary, footLabel, problems, proof, className }: IndustryTileProps) {
  return (
    <Link
      href={href}
      data-reveal="up"
      className={cn("flex min-h-[190px] flex-col gap-2.5 bg-surface p-6 no-underline transition-colors duration-200 hover:bg-paper", className)}
    >
      <MonoLabel>{label}</MonoLabel>
      <h3 className="font-serif text-2xl leading-[1.15]">{title}</h3>
      <p className="text-[14.5px] text-muted">{summary}</p>
      {problems?.length ? (
        <ul className="m-0 mt-1 flex list-none flex-col gap-1 p-0 text-[13.5px]">
          {problems.map((p) => (
            <li key={p} className="flex gap-2">
              <span aria-hidden="true" className="font-mono text-brand">
                ↳
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto flex flex-col gap-4 pt-3">
        {proof ? <Metric {...proof} size="sm" accent className="border-t border-line pt-4" /> : null}
        <span className="font-mono text-[11.5px] uppercase tracking-[.06em] text-brand">{footLabel}</span>
      </div>
    </Link>
  );
}

export default IndustryTile;
