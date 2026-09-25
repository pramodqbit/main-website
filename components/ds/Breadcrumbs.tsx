import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = { href?: string | null; label: string };
export type BreadcrumbsProps = { items: BreadcrumbItem[]; className?: string };

/** Mono breadcrumb trail. The last item is the current page. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("font-mono text-label uppercase text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              {i > 0 ? (
                <li aria-hidden="true" className="text-line">
                  /
                </li>
              ) : null}
              <li>
                {item.href && !last ? (
                  <Link href={item.href} className="hover:text-brand">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className={last ? "text-ink" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
