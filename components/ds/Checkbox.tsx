import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode };

/** Native checkbox with an inline label. */
export function Checkbox({ label, className, id, ...rest }: CheckboxProps) {
  return (
    <label htmlFor={id} className={cn("inline-flex cursor-pointer items-start gap-2.5 text-[15px]", className)}>
      <input id={id} type="checkbox" className="mt-1 size-4 shrink-0 accent-brand" {...rest} />
      <span>{label}</span>
    </label>
  );
}

export default Checkbox;
