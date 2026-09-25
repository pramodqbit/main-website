import { cn } from "@/lib/utils";

export type TechByCategoryProps = { groups: { category: string; names: string[] }[]; className?: string };

/** Technologies as mono category labels followed by comma-separated names. */
export function TechByCategory({ groups, className }: TechByCategoryProps) {
  const rows = groups.filter((g) => g.names.length);
  if (!rows.length) return null;
  return (
    <dl data-reveal="up" data-reveal-delay={150} className={cn("m-0 grid grid-cols-[160px_1fr] gap-x-8 gap-y-3 max-[520px]:grid-cols-1 max-[520px]:gap-y-1", className)}>
      {rows.map((g) => (
        <div key={g.category} className="contents">
          <dt className="font-mono text-label uppercase text-muted max-[520px]:mt-3">{g.category}</dt>
          <dd className="m-0 font-mono text-sm text-ink">{g.names.join(", ")}</dd>
        </div>
      ))}
    </dl>
  );
}

export default TechByCategory;
