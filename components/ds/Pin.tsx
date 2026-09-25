import { cn } from "@/lib/utils";

export type PinProps = { letter: string; size?: "sm" | "md" | "lg"; className?: string };

const sizes = { sm: "size-[18px] text-[10px]", md: "size-[26px] text-[11px]", lg: "size-[30px] text-xs" } as const;

/** Lettered brand circle used to reference annotations. */
export function Pin({ letter, size = "md", className }: PinProps) {
  return (
    <span
      className={cn("inline-grid shrink-0 place-items-center rounded-full bg-brand font-mono text-on-brand", sizes[size], className)}
    >
      {letter}
    </span>
  );
}

export default Pin;
