import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { controlClass } from "./controlStyles";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Native textarea. */
export function Textarea({ className, rows = 5, ...rest }: TextareaProps) {
  return <textarea rows={rows} className={cn(controlClass, "resize-y", className)} {...rest} />;
}

export default Textarea;
