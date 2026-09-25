import { cn } from "@/lib/utils";

export type BeforeAfterRow = { aspect: string; before: string; after: string };

export type BeforeAfterTableProps = { rows: BeforeAfterRow[]; caption?: string; className?: string };

const th = "border-b border-line py-3 pr-6 text-left font-mono text-label font-normal uppercase text-muted";
const td = "border-b border-line py-4 pr-6 align-top max-[760px]:border-0 max-[760px]:py-1 max-[760px]:pr-0";
const stacked =
  "max-[760px]:block max-[760px]:before:mb-1 max-[760px]:before:block max-[760px]:before:font-mono max-[760px]:before:text-label max-[760px]:before:uppercase max-[760px]:before:text-muted max-[760px]:before:content-[attr(data-label)]";

/** ASPECT / BEFORE / → / AFTER. Stacks into label/value pairs on small screens. */
export function BeforeAfterTable({ rows, caption = "What changed", className }: BeforeAfterTableProps) {
  if (!rows.length) return null;
  return (
    <table className={cn("w-full border-collapse border-t border-line max-[760px]:block", className)}>
      <caption className="sr-only">{caption}</caption>
      <thead className="max-[760px]:sr-only">
        <tr>
          <th scope="col" className={cn(th, "w-[22%]")}>
            Aspect
          </th>
          <th scope="col" className={th}>
            Before
          </th>
          <th scope="col" className={cn(th, "w-10")}>
            <span className="sr-only">Changed to</span>
          </th>
          <th scope="col" className={th}>
            After
          </th>
        </tr>
      </thead>
      <tbody className="max-[760px]:block">
        {rows.map((r, i) => (
          <tr key={`${r.aspect}-${i}`} className="max-[760px]:block max-[760px]:border-b max-[760px]:border-line max-[760px]:py-4">
            <th scope="row" className={cn(td, "text-left font-serif text-xl font-normal max-[760px]:block max-[760px]:pb-2")}>
              {r.aspect}
            </th>
            <td data-label="Before" className={cn(td, stacked, "text-muted")}>
              {r.before}
            </td>
            <td aria-hidden="true" className={cn(td, "font-mono text-brand max-[760px]:hidden")}>
              →
            </td>
            <td data-label="After" className={cn(td, stacked, "text-ink")}>
              {r.after}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BeforeAfterTable;
