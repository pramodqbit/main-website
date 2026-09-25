import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { controlClass } from "./controlStyles";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
  placeholder?: string;
};

/** Native select. */
export function Select({ className, options, placeholder, ...rest }: SelectProps) {
  return (
    <select className={cn(controlClass, "appearance-auto", className)} {...rest}>
      {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
