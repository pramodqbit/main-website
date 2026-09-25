import { cn } from "@/lib/utils";

export type EngagementCardProps = {
  name: string;
  bestFor: string;
  duration?: string | null;
  team?: string | null;
  pricing?: string | null;
  includes?: string[];
  className?: string;
};

const dt = "border-b border-line py-2.5 font-mono text-label uppercase text-muted";
const dd = "border-b border-line py-2.5 text-[15px]";

/** One way to work with us: serif name, who it suits, duration / team / pricing, and what's included. */
export function EngagementCard({ name, bestFor, duration, team, pricing, includes = [], className }: EngagementCardProps) {
  const facts = [
    ["Duration", duration],
    ["Team", team],
    ["Pricing", pricing],
  ].filter((f): f is [string, string] => Boolean(f[1]));
  return (
    <article data-reveal="up" data-reveal-stagger={140} className={cn("flex flex-col gap-5 border border-line bg-surface p-7", className)}>
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-[28px] leading-[1.15]">{name}</h3>
        <p className="text-muted">{bestFor}</p>
      </div>
      {facts.length ? (
        <dl className="grid grid-cols-[96px_1fr] gap-x-4 border-t border-line">
          {facts.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className={dt}>{label}</dt>
              <dd className={dd}>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {includes.length ? (
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px]">
          {includes.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="font-mono text-brand">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export default EngagementCard;
