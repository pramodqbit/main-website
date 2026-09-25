import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FormFieldProps = {
  label: ReactNode;
  htmlFor: string;
  hint?: string | null;
  error?: string | null;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

/** Ids to wire into a control's `aria-describedby`. */
export function describedBy(id: string, { hint, error }: { hint?: string | null; error?: string | null }) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

/** Label + control + hint + error. */
export function FormField({ label, htmlFor, hint, error, required, className, children }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="font-mono text-label uppercase text-muted">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-brand">
            {" "}*
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default FormField;
