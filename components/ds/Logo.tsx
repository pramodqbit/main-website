import Image from "next/image";
import Link from "next/link";
import { brandLogoPath } from "@/lib/site";
import { cn } from "@/lib/utils";

export type LogoProps = { className?: string };

const LOGO_WIDTH = 48;
const LOGO_HEIGHT = 46;

/** Brand mark + QBITLOG wordmark, linking home. */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Qbitlog home"
      className={cn(
        "inline-flex shrink-0 items-center gap-2 font-mono text-[15px] font-medium tracking-[.04em] no-underline",
        className,
      )}
    >
      <Image
        src={brandLogoPath}
        alt=""
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        aria-hidden
        className="h-6 w-auto"
        priority
      />
      QBITLOG
    </Link>
  );
}

export default Logo;
