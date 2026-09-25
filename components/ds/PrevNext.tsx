import Link from "next/link";
import { cn } from "@/lib/utils";

type Item = { href: string; client: string; title: string };

export type PrevNextProps = { prev: Item; next: Item; label?: string; className?: string };

const link =
  "group flex flex-col gap-2 border-line p-7 no-underline transition-colors duration-200 hover:bg-surface max-[760px]:px-0";

/** Two large links to the previous and next entries. */
export function PrevNext({ prev, next, label = "More case studies", className }: PrevNextProps) {
  return (
    <nav aria-label={label} className={cn("grid grid-cols-2 border-y border-line max-[760px]:grid-cols-1", className)}>
      <Link href={prev.href} rel="prev" className={cn(link, "border-r max-[760px]:border-b max-[760px]:border-r-0")}>
        <span className="font-mono text-label uppercase text-muted">
          <span aria-hidden="true">← </span>Previous
        </span>
        <span className="font-mono text-label uppercase text-ink">{prev.client}</span>
        <span className="font-serif text-[26px] leading-[1.15] transition-colors group-hover:text-brand">{prev.title}</span>
      </Link>
      <Link href={next.href} rel="next" className={cn(link, "text-right max-[760px]:text-left")}>
        <span className="font-mono text-label uppercase text-muted">
          Next<span aria-hidden="true"> →</span>
        </span>
        <span className="font-mono text-label uppercase text-ink">{next.client}</span>
        <span className="font-serif text-[26px] leading-[1.15] transition-colors group-hover:text-brand">{next.title}</span>
      </Link>
    </nav>
  );
}

export default PrevNext;
