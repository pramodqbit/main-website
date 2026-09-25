import Link from "next/link";
import { cn } from "@/lib/utils";

export type LogStreamEntry = { date: string; type: string; text: string; href?: string | null };

export type LogStreamProps = {
  entries: LogStreamEntry[];
  title?: string;
  /** Right side of the header row, e.g. "This month". */
  meta?: string | null;
  /** Italic footnote. */
  note?: string | null;
  as?: "aside" | "div";
  className?: string;
};

function shortDate(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" });
}

/** Dated activity list (studio log). */
export function LogStream({ entries, title = "Studio log", meta, note, as: Tag = "aside", className }: LogStreamProps) {
  return (
    <Tag aria-label={title} className={cn("self-start border border-line bg-surface font-mono text-[13px]", className)}>
      <div className="flex justify-between gap-2.5 border-b border-line px-4 py-3 text-label uppercase">
        <span className="text-ink">{title}</span>
        {meta ? <span className="text-muted">{meta}</span> : null}
      </div>
      <ul>
        {entries.map((e, i) => {
          const text = <span className="font-sans text-sm leading-[1.4]">{e.text}</span>;
          return (
            <li
              key={`${e.date}-${i}`}
              className="grid grid-cols-[56px_74px_1fr] gap-2.5 border-b border-dashed border-line px-4 py-3 last:border-b-0"
            >
              <time dateTime={e.date} className="text-muted">
                {shortDate(e.date)}
              </time>
              <span className="pt-0.5 text-[11px] tracking-[.08em] text-muted uppercase">{e.type}</span>
              {e.href ? (
                <Link href={e.href} className="hover:text-brand">
                  {text}
                </Link>
              ) : (
                text
              )}
            </li>
          );
        })}
      </ul>
      {note ? <p className="border-t border-line px-4 py-2.5 font-serif text-[13px] italic text-muted">{note}</p> : null}
    </Tag>
  );
}

export default LogStream;
