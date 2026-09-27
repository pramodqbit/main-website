import { DotPortrait } from "@/components/motion/DotPortrait";
import { cn } from "@/lib/utils";
import { MonoLabel } from "./MonoLabel";

export type TeamCardProps = {
  id?: string;
  name: string;
  role: string;
  /** Server-made dot grid from `portraitDots()` (lib/portrait.ts). Without it the card shows a shaded silhouette. */
  portrait?: string | null;
  bio?: string | null;
  links?: { label: string; href: string }[];
  className?: string;
};

/** Team member: a dot-matrix portrait (never the photo itself), role and name. */
export function TeamCard({ id, name, role, portrait, bio, links, className }: TeamCardProps) {
  return (
    <article id={id} data-reveal="up" className={cn("group flex scroll-mt-24 flex-col gap-3", className)}>
      <div className="relative aspect-square overflow-hidden border border-line bg-surface">
        <DotPortrait dots={portrait} seed={name} />
      </div>
      <MonoLabel>{role}</MonoLabel>
      <h3 className="font-serif text-2xl leading-[1.15]">{name}</h3>
      {bio ? <p className="text-sm text-muted">{bio}</p> : null}
      {links?.length ? (
        <ul className="flex flex-wrap gap-3 font-mono text-label uppercase">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener" className="text-brand hover:underline">
                {l.label}
                <span className="sr-only"> for {name}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export default TeamCard;
