import Link from "next/link";
import { cn } from "@/lib/utils";

export type JobRowProps = {
  href: string;
  title: string;
  department?: string | null;
  location: string;
  type?: string | null;
  className?: string;
};

/** Open role row, same pattern as `ServiceRow`. */
export function JobRow({ href, title, department, location, type, className }: JobRowProps) {
  return (
    <Link
      href={href}
      data-reveal="up"
      data-reveal-stagger={90}
      className={cn(
        "grid grid-cols-[200px_1.1fr_1fr_32px] items-baseline gap-8 border-b border-line py-[26px] no-underline transition-[padding,background-color] duration-200 first:border-t hover:bg-surface hover:px-4 max-[860px]:grid-cols-1 max-[860px]:gap-1.5",
        className,
      )}
    >
      <span className="font-mono text-label uppercase text-muted">{department}</span>
      <h3 className="font-serif text-[28px] leading-[1.15]">{title}</h3>
      <p className="font-mono text-sm text-muted">{[location, type].filter(Boolean).join(" · ")}</p>
      <span aria-hidden="true" className="text-right font-mono text-brand max-[860px]:hidden">
        →
      </span>
    </Link>
  );
}

export default JobRow;
