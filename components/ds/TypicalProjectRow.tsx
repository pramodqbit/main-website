import { cn } from "@/lib/utils";
import { Pill } from "./Pill";

export type TypicalProjectRowProps = { name: string; duration?: string | null; description?: string | null; className?: string };

/** Example project: serif name, mono duration pill, muted description. */
export function TypicalProjectRow({ name, duration, description, className }: TypicalProjectRowProps) {
  return (
    <li
      className={cn(
        "grid grid-cols-[1fr_auto_1.2fr] items-baseline gap-8 border-b border-line py-6 first:border-t max-[860px]:grid-cols-1 max-[860px]:gap-2",
        className,
      )}
    >
      <h3 className="m-0 font-serif text-2xl leading-[1.2]">{name}</h3>
      <span>{duration ? <Pill tone="brand">{duration}</Pill> : null}</span>
      {description ? <p className="m-0 text-muted">{description}</p> : <span />}
    </li>
  );
}

export default TypicalProjectRow;
