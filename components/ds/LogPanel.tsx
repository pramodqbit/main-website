import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LogPanelRow = { marker: string; phase: string; text: ReactNode; measured?: boolean | null };

export type LogPanelProps = {
  title: string;
  status?: { label: string; tone: "ok" | "brand" } | null;
  rows: LogPanelRow[];
  footer?: { left: string; link?: { href: string; label: string } | null } | null;
  animate?: boolean;
  ariaLabel?: string;
  className?: string;
};

/** Project log panel: dated phases, amber measured values, blinking caret on the last row. */
export function LogPanel({ title, status, rows, footer, animate, ariaLabel, className }: LogPanelProps) {
  return (
    <figure
      aria-label={ariaLabel ?? title}
      className={cn(
        "m-0 min-w-0 border border-line bg-surface font-mono text-[13px] shadow-[0_1px_0_var(--line),0_24px_48px_-32px_var(--shadow-frame-color)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <span className="text-label uppercase text-ink">{title}</span>
        {status ? (
          <span
            className={cn(
              "inline-flex items-center gap-2 text-[11.5px] tracking-[.08em] uppercase",
              status.tone === "ok" ? "text-ok" : "text-brand",
            )}
          >
            <span aria-hidden="true" className="size-[7px] rounded-full bg-current animate-pulse-dot" />
            {status.label}
          </span>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        {rows.map((row, i) => {
          const last = i === rows.length - 1;
          return (
            <div
              key={`${row.marker}-${i}`}
              className={cn(
                "grid min-w-[420px] grid-cols-[52px_76px_minmax(230px,1fr)] gap-3.5 px-4 py-[13px]",
                !last && "border-b border-dashed border-line",
                animate && "animate-row-in",
              )}
              style={animate ? { animationDelay: `${250 + i * 420}ms` } : undefined}
            >
              <span className="text-muted">{row.marker}</span>
              <span className={cn("pt-px text-[11.5px] tracking-[.08em] uppercase", row.measured ? "text-signal" : "text-muted")}>
                {row.phase}
              </span>
              <span className="font-sans text-[14.5px] leading-[1.45] [&_b]:font-mono [&_b]:font-medium [&_b]:text-signal">
                {row.text}
                {last ? (
                  <span aria-hidden="true" className="ml-[5px] inline-block h-[15px] w-2 bg-brand align-[-2px] animate-blink" />
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
      {footer ? (
        <div className="flex flex-wrap justify-between gap-2.5 border-t border-line px-4 py-2.5 text-label uppercase">
          <span className="text-muted">{footer.left}</span>
          {footer.link ? (
            <Link href={footer.link.href} className="text-brand no-underline hover:underline">
              {footer.link.label} <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      ) : null}
    </figure>
  );
}

export default LogPanel;
