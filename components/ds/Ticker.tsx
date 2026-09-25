import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TickerItem = { type: string; subject: string; text: string; highlight?: string | null };

export type TickerProps = {
  items: TickerItem[];
  /** Seconds for one loop. */
  duration?: number;
  ariaLabel?: string;
  className?: string;
};

function renderText(text: string, highlight?: string | null): ReactNode {
  if (!highlight) return text;
  const at = text.indexOf(highlight);
  if (at === -1) {
    return (
      <>
        <span className="text-signal">{highlight}</span> {text}
      </>
    );
  }
  return (
    <>
      {text.slice(0, at)}
      <span className="text-signal">{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
}

function Items({ items, hidden }: { items: TickerItem[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex">
      {items.map((item, i) => (
        <li
          key={`${item.subject}-${i}`}
          className="whitespace-nowrap border-r border-dashed border-line px-[30px] py-[15px] font-mono text-[12.5px] text-muted"
        >
          <span className="mr-2 text-brand">{item.type}</span>
          <span className="font-medium text-ink">{item.subject}</span> · {renderText(item.text, item.highlight)}
        </li>
      ))}
    </ul>
  );
}

/** CSS-only marquee of log entries. Pauses on hover; static with reduced motion. */
export function Ticker({ items, duration = 70, ariaLabel = "Recent studio activity", className }: TickerProps) {
  if (!items.length) return null;
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={cn("overflow-hidden border-b border-line bg-surface [&:hover>div]:[animation-play-state:paused]", className)}
    >
      <div className="flex w-max animate-ticker" style={{ "--ticker-duration": `${duration}s` } as CSSProperties}>
        <Items items={items} />
        <Items items={items} hidden />
      </div>
    </div>
  );
}

export default Ticker;
