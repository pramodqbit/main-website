import Link from "next/link";
import { cn } from "@/lib/utils";
import { Heading } from "./Heading";

export type SectionHeadProps = {
  label?: string | null;
  title: string;
  emphasis?: string | null;
  intro?: string | null;
  more?: { href: string; label: string } | null;
  as?: "h1" | "h2";
  className?: string;
};

/** Section header: mono index label | title + intro | "more" link. */
export function SectionHead({ label, title, emphasis, intro, more, as = "h2", className }: SectionHeadProps) {
  return (
    <div className={cn("mb-12 grid grid-cols-[200px_1fr_auto] items-end gap-8 max-[860px]:grid-cols-1 max-[860px]:gap-2.5", className)}>
      <span className="self-start pt-2.5 font-mono text-sm text-brand max-[860px]:pt-0">{label}</span>
      <div>
        <Heading as={as} size="h2" emphasis={emphasis}>
          {title}
        </Heading>
        {intro ? <p className="mt-3.5 text-[17px] text-muted measure">{intro}</p> : null}
      </div>
      {more ? (
        <Link href={more.href} className="whitespace-nowrap font-mono text-sm text-brand underline-offset-[3px] hover:underline">
          {more.label} <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}

export default SectionHead;
