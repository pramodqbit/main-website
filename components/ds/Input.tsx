import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { controlClass } from "./controlStyles";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/** Native text input. */
export function Input({ className, ...rest }: InputProps) {
  return <input className={cn(controlClass, className)} {...rest} />;
}

export default Input;
