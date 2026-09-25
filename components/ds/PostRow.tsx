import Link from "next/link";
import { cn } from "@/lib/utils";

export type PostRowProps = { href: string; date: string; category?: string | null; title: string; className?: string };

/** Article list row: ISO date + category | serif title. */
export function PostRow({ href, date, category, title, className }: PostRowProps) {
  const iso = date.slice(0, 10);
  return (
    <Link
      href={href}
      data-reveal="up"
      data-reveal-stagger={90}
      className={cn(
        "group grid grid-cols-[110px_1fr] gap-6 border-b border-line py-[22px] no-underline first:border-t max-[520px]:grid-cols-1 max-[520px]:gap-1.5",
        className,
      )}
    >
      <span className="flex flex-col gap-1 pt-1.5 font-mono text-xs text-muted">
        <time dateTime={iso}>{iso}</time>
        {category ? <span>{category}</span> : null}
      </span>
      <h3 className="font-serif text-[23px] leading-[1.2] transition-colors duration-150 group-hover:text-brand">{title}</h3>
    </Link>
  );
}

export default PostRow;
