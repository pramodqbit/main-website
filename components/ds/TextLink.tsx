import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TextLinkProps = { href: string; children: ReactNode; arrow?: boolean; className?: string };

/** Inline brand link. External URLs open in a new tab. */
export function TextLink({ href, children, arrow, className }: TextLinkProps) {
  const cls = cn("text-brand underline-offset-[3px] hover:underline", className);
  const body = (
    <>
      {children}
      {arrow ? <span aria-hidden="true"> →</span> : null}
    </>
  );
  if (/^(https?:)?\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener" className={cls}>
        {body}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {body}
    </Link>
  );
}

export default TextLink;
