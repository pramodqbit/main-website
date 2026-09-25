import Link from "next/link";
import { cn } from "@/lib/utils";

export type Chip = { href: string; label: string; active: boolean };

/** Filter links as mono chips; the active one carries `aria-current`. */
export function FilterChips({ chips, label }: { chips: Chip[]; label: string }) {
  if (chips.length < 2) return null;
  return (
    <nav aria-label={label} className="mb-10" data-reveal="up" data-reveal-delay={300}>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {chips.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              aria-current={c.active ? "page" : undefined}
              className={cn(
                "inline-block border px-3 py-1.5 font-mono text-label uppercase no-underline transition-colors",
                c.active ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink hover:text-ink",
              )}
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default FilterChips;
