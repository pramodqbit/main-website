import Link from "next/link";
import { cn } from "@/lib/utils";

export type CapabilityCell = { href: string; label: string } | null;

export type CapabilityTableProps = {
  caption: string;
  columns: { key: string; label: string; href?: string }[];
  rows: { key: string; label: string; href?: string; cells: CapabilityCell[] }[];
  emptyLabel?: string;
  emptyHref?: string;
  className?: string;
};

const cell = "border-b border-l border-line px-4 py-3 text-left align-top";

/** Industries × services: a real table, scrolling inside its own box, with a sticky first column. */
export function CapabilityTable({ caption, columns, rows, emptyLabel = "Ask us", emptyHref = "/contact", className }: CapabilityTableProps) {
  if (!rows.length || !columns.length) return null;
  return (
    <div className={cn("max-w-full overflow-x-auto border-r border-t border-line", className)} tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[640px] border-collapse text-[15px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <td className={cn(cell, "sticky left-0 z-10 bg-paper")} />
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn(cell, "font-mono text-label font-normal uppercase text-muted")}>
                {c.href ? (
                  <Link href={c.href} className="no-underline hover:text-brand">
                    {c.label}
                  </Link>
                ) : (
                  c.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <th scope="row" className={cn(cell, "sticky left-0 z-10 bg-paper font-serif text-lg font-normal")}>
                {r.href ? (
                  <Link href={r.href} className="no-underline hover:text-brand">
                    {r.label}
                  </Link>
                ) : (
                  r.label
                )}
              </th>
              {r.cells.map((c, i) => (
                <td key={`${r.key}-${columns[i]?.key ?? i}`} className={cell}>
                  {c ? (
                    <Link href={c.href} className="text-ink underline-offset-[3px] hover:text-brand hover:underline">
                      {c.label}
                    </Link>
                  ) : (
                    <Link href={emptyHref} className="text-muted no-underline hover:text-brand">
                      {emptyLabel}
                    </Link>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CapabilityTable;
