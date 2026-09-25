import Link from "next/link";
import { cn } from "@/lib/utils";

export type LogoProps = { className?: string };

/** Brand square + QBITLOG wordmark, linking home. */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Qbitlog home"
      className={cn("inline-flex items-center gap-2.5 font-mono text-[15px] font-medium tracking-[.04em] no-underline", className)}
    >
      <span aria-hidden="true" className="size-3 bg-brand" />
      QBITLOG
    </Link>
  );
}

export default Logo;
