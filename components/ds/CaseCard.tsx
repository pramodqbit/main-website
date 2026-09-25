import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MetricProps } from "./Metric";
import { MonoLabel } from "./MonoLabel";
import { Pill } from "./Pill";

export type CaseCardProps = {
  href: string;
  industry?: string | null;
  /** e.g. "14 wks · 5 eng" */
  meta?: string | null;
  client: string;
  title: string;
  summary: string;
  image?: { src: string; alt: string; width?: number; height?: number; objectPosition?: string } | null;
  metrics: MetricProps[];
  priority?: boolean;
  /** Shows a "Prototype" pill in the meta row. */
  prototype?: boolean;
  className?: string;
};

/** Case study card: optional 16:9 screenshot, meta row, title, two amber metrics. */
export function CaseCard({ href, industry, meta, client, title, summary, image, metrics, priority, prototype, className }: CaseCardProps) {
  return (
    <Link
      href={href}
      data-reveal={priority ? undefined : "up"}
      className={cn(
        "group flex flex-col border border-line bg-surface no-underline transition-colors duration-200 hover:border-ink",
        className,
      )}
    >
      {image ? (
        <div className="relative aspect-video overflow-hidden border-b border-line bg-paper">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(min-width: 760px) 50vw, 100vw"
            className="object-cover object-left-top transition-transform duration-[800ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
            style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
          />
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-[22px] py-3.5">
        <span className="flex flex-wrap items-center gap-2.5">
          <MonoLabel tone="ink">{industry}</MonoLabel>
          {prototype ? <Pill tone="signal">Prototype</Pill> : null}
        </span>
        {meta ? <MonoLabel>{meta}</MonoLabel> : null}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 px-[22px] py-[26px]">
        <MonoLabel>{client}</MonoLabel>
        <h3 className="font-serif text-[26px] leading-[1.15]">{title}</h3>
        <p className="text-[15px] text-muted">{summary}</p>
      </div>
      {metrics.length ? (
        <div className="grid grid-cols-2 border-t border-line">
          {metrics.slice(0, 2).map((m, i) => (
            <div key={`${m.label}-${i}`} className="flex flex-col px-[22px] py-3.5 [&+&]:border-l [&+&]:border-line">
              <span className="font-mono text-2xl text-signal tabular">
                {m.value}
                {m.unit}
              </span>
              <span className="text-[13px] text-muted">{m.label}</span>
              <span className="sr-only">Source: {m.source}</span>
            </div>
          ))}
        </div>
      ) : null}
    </Link>
  );
}

export default CaseCard;
