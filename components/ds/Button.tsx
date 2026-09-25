import Link from "next/link";
import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonStyles } from "./buttonStyles";

export { buttonStyles };

type Common = VariantProps<typeof buttonStyles> & {
  arrow?: boolean;
  className?: string;
  children: ReactNode;
  /** Forwarded to the element (e.g. analytics hooks). */
  "data-cta"?: string;
};

export type ButtonProps =
  | (Common & { href: string; newTab?: boolean; onClick?: never; type?: never; disabled?: never })
  | (Common & { href?: undefined; newTab?: never; onClick?: () => void; type?: "button" | "submit" | "reset"; disabled?: boolean });

export function isExternal(href: string) {
  return /^(https?:)?\/\//.test(href);
}

/** Primary / ghost button. Internal hrefs use next/link; external ones open in a new tab. */
export function Button(props: ButtonProps) {
  const { variant, size, arrow, className, children } = props;
  const cls = cn(buttonStyles({ variant, size }), className);
  const content = (
    <>
      {children}
      {arrow ? (
        <span aria-hidden="true" className="font-mono">
          →
        </span>
      ) : null}
    </>
  );

  if (props.href !== undefined) {
    const { href, newTab } = props;
    if (isExternal(href) || newTab) {
      return (
        <a href={href} target="_blank" rel="noopener" className={cls} data-cta={props["data-cta"]}>
          {content}
        </a>
      );
    }
    if (/^(mailto|tel):/.test(href)) {
      return (
        <a href={href} className={cls} data-cta={props["data-cta"]}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} data-cta={props["data-cta"]}>
        {content}
      </Link>
    );
  }
  return (
    <button type={props.type ?? "button"} onClick={props.onClick} disabled={props.disabled} className={cls} data-cta={props["data-cta"]}>
      {content}
    </button>
  );
}

export default Button;
