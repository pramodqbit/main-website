import { cn } from "@/lib/utils";

export type LessonGridProps = { items: { title: string; text: string }[]; className?: string };

/** Hairline 2-column grid of lessons: serif title, muted text. */
export function LessonGrid({ items, className }: LessonGridProps) {
  if (!items.length) return null;
  return (
    <ul className={cn("m-0 grid list-none grid-cols-2 gap-px border border-line bg-line p-0 max-[760px]:grid-cols-1", className)}>
      {items.map((l, i) => (
        <li key={`${l.title}-${i}`} className="bg-paper p-6">
          <h3 className="m-0 font-serif text-xl">{l.title}</h3>
          <p className="mb-0 mt-2 text-muted">{l.text}</p>
        </li>
      ))}
    </ul>
  );
}

export default LessonGrid;
