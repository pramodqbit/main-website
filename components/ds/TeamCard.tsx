import Image from "next/image";
import { cn } from "@/lib/utils";
import { MonoLabel } from "./MonoLabel";

export type TeamCardProps = {
  id?: string;
  name: string;
  role: string;
  photo?: { src: string; alt: string } | null;
  bio?: string | null;
  links?: { label: string; href: string }[];
  className?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Team member: square grayscale photo (or monogram), role and name. */
export function TeamCard({ id, name, role, photo, bio, links, className }: TeamCardProps) {
  return (
    <article id={id} className={cn("group flex scroll-mt-24 flex-col gap-3", className)}>
      <div className="relative aspect-square overflow-hidden border border-line bg-surface">
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 960px) 25vw, (min-width: 520px) 50vw, 100vw"
            className="object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
          />
        ) : (
          <div aria-hidden="true" className="grid h-full place-items-center dotgrid">
            <span className="bg-surface px-3 font-serif text-5xl text-muted">{initials(name)}</span>
          </div>
        )}
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
