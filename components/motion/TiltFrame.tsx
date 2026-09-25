"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clsx as cn } from "clsx";
import { useReducedMotion } from "./useReducedMotion";

type Props = { children: ReactNode; className?: string };

/** Tilts its child back (rotateX) and straightens it as it scrolls into view. Flat on the server. */
export function TiltFrame({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let ticking = false;
    let visible = true;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.8)));
      const e = 1 - Math.pow(1 - p, 2);
      el.style.transform = `rotateX(${((1 - e) * 24).toFixed(2)}deg) scale(${(0.88 + 0.12 * e).toFixed(3)})`;
    };
    const onScroll = () => {
      if (!visible || ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      el.style.willChange = visible ? "transform" : "";
      if (visible) onScroll();
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.style.transform = "";
      el.style.willChange = "";
    };
  }, [reduced]);

  return (
    <div className={cn("[perspective:1800px]", className)}>
      <div ref={ref} className="origin-top">
        {children}
      </div>
    </div>
  );
}

export default TiltFrame;
