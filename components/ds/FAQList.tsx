import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FAQListProps = { items: { question: string; answer: ReactNode }[]; defaultOpen?: number; className?: string };

/** Native details/summary accordion (no JS). */
export function FAQList({ items, defaultOpen, className }: FAQListProps) {
  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item, i) => (
        <details key={`${item.question}-${i}`} open={i === defaultOpen} className="border-b border-line">
          <summary className="grid cursor-pointer grid-cols-[1fr_24px] gap-5 py-[22px] font-serif text-[23px] leading-[1.25] faq-summary">
            {item.question}
          </summary>
          <div className="pb-6 text-muted measure">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}

export default FAQList;
