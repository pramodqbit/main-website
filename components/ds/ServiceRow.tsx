import Link from "next/link";
import { cn } from "@/lib/utils";

export type ServiceRowProps = {
  href: string;
  category: string;
  title: string;
  summary: string;
  /** Up to 3 deliverables, shown as a mono list under the summary. */
  highlights?: string[];
  /** Published case studies for this service; linked to `casesHref`. */
  caseCount?: number;
  casesHref?: string;
  className?: string;
};

/** Service list row: category | outcome headline | summary | arrow. The whole row is clickable. Stacks on mobile. */
export function ServiceRow({ href, category, title, summary, highlights, caseCount, casesHref, className }: ServiceRowProps) {
  const items = (highlights ?? []).slice(0, 3);
  return (
    <div
      className={cn(
        "relative grid grid-cols-[200px_1.1fr_1fr_32px] items-baseline gap-8 border-b border-line py-[26px] transition-[padding,background-color] duration-200 first:border-t hover:bg-surface hover:px-4 max-[860px]:grid-cols-1 max-[860px]:gap-1.5",
        className,
      )}
    >
      <span className="font-mono text-label uppercase text-muted">{category}</span>
      <h3 className="font-serif text-[28px] leading-[1.15]">
        <Link href={href} className="no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-brand">
          {title}
        </Link>
      </h3>
      <div className="flex flex-col gap-3">
        <p className="text-[15.5px] text-muted">{summary}</p>
        {items.length ? (
          <ul className="m-0 flex list-none flex-col gap-1 p-0 font-mono text-xs text-ink">
            {items.map((h) => (
              <li key={h} className="flex gap-2">
                <span aria-hidden="true" className="text-brand">
                  ✓
                </span>
                {h}
              </li>
            ))}
          </ul>
        ) : null}
        {caseCount ? (
          casesHref ? (
            <Link href={casesHref} className="relative z-10 self-start font-mono text-label uppercase text-brand no-underline hover:underline">
              {caseCount} case {caseCount === 1 ? "study" : "studies"}
            </Link>
          ) : (
            <span className="font-mono text-label uppercase text-muted">
              {caseCount} case {caseCount === 1 ? "study" : "studies"}
            </span>
          )
        ) : null}
      </div>
      <span aria-hidden="true" className="text-right font-mono text-brand max-[860px]:hidden">
        →
      </span>
    </div>
  );
}

export default ServiceRow;
