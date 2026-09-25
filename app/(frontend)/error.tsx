"use client";

import { buttonStyles } from "@/components/ds/buttonStyles";

/** Loaded on every page as the error boundary, so it avoids the ds components that pull in tailwind-merge. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="py-24 max-md:py-16">
      <div className="wrap">
        <span className="font-mono text-label uppercase tracking-[.08em] text-muted">LOG / ERROR</span>
        <h1 className="mt-4 font-serif text-[clamp(40px,5.6vw,84px)] font-normal leading-[.98] tracking-[-0.03em]">
          Something broke on our side.
        </h1>
        <div className="mt-8">
          <button type="button" onClick={reset} className={buttonStyles()}>
            Try again
          </button>
        </div>
      </div>
    </section>
  );
}
