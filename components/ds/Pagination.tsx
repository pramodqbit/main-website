import { cn } from "@/lib/utils";
import { Button } from "./Button";

export type PaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
  /** Extra query params to keep (e.g. category). */
  query?: Record<string, string | undefined>;
  className?: string;
};

function hrefFor(basePath: string, page: number, query: PaginationProps["query"]) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query ?? {})) if (v) params.set(k, v);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Previous / next links with a mono page counter. */
export function Pagination({ page, totalPages, basePath, query, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-between gap-4 pt-8", className)}>
      {page > 1 ? (
        <Button href={hrefFor(basePath, page - 1, query)} variant="ghost" size="sm">
          <span aria-hidden="true" className="font-mono">←</span> Previous
        </Button>
      ) : (
        <span />
      )}
      <span className="font-mono text-label uppercase text-muted">
        Page {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Button href={hrefFor(basePath, page + 1, query)} variant="ghost" size="sm" arrow>
          Next
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}

export default Pagination;
