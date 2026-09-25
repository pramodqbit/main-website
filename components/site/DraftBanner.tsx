import Link from "next/link";

/** Fixed banner shown while draft mode is on. */
export function DraftBanner() {
  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-4 border border-ink bg-ink px-4 py-2.5 font-mono text-label uppercase text-paper"
    >
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className="size-[7px] rounded-full bg-signal animate-pulse-dot" />
        Preview
      </span>
      <Link href="/next/exit-preview" prefetch={false} className="text-paper underline underline-offset-4">
        Exit
      </Link>
    </div>
  );
}

export default DraftBanner;
