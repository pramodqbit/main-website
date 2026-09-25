import type { ReactNode } from "react";

export type VisuallyHiddenProps = { children: ReactNode };

/** Content for screen readers only. */
export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return <span className="sr-only">{children}</span>;
}

export default VisuallyHidden;
