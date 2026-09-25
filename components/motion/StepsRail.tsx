"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clsx as cn } from "clsx";
import { useReducedMotion } from "./useReducedMotion";

type Props = { children: ReactNode; className?: string; style?: React.CSSProperties };

/**
 * Container for `Steps`: fills a 2px rail with scroll progress and marks reached
 * steps (`[data-step]` children) with `data-on`. Fully visible with reduced motion.
 */
export function StepsRail({ children, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const fill = fillRef.current;
    if (!el || !fill || reduced) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    el.classList.add("steps-tracking");
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const q = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height * 0.9 + vh * 0.2)));
      fill.style.transform = `scaleX(${q.toFixed(3)})`;
      items.forEach((s, i) => {
        if (q > i / items.length + 0.01 || q > 0.97) s.setAttribute("data-on", "");
        else s.removeAttribute("data-on");
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.classList.remove("steps-tracking");
      fill.style.transform = "";
      items.forEach((s) => s.removeAttribute("data-on"));
    };
  }, [reduced]);

  return (
    <div ref={ref} className={cn("relative", className)} style={style}>
      <div aria-hidden="true" className="absolute inset-x-0 -top-px z-10 h-0.5">
        <span ref={fillRef} className="block h-full w-full origin-left bg-brand" />
      </div>
      {children}
    </div>
  );
}

export default StepsRail;
