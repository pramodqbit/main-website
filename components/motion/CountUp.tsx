"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

type Props = { value: string };

/**
 * Renders the final value on the server, then counts the leading integer up
 * from 0 once in view. Non-integer values ("24/7" is fine, "3–5s" animates "3") render as-is.
 */
export function CountUp({ value }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const match = /^\d+/.exec(value);
  const lead = match ? match[0] : "";
  const rest = match ? value.slice(lead.length) : value;

  useEffect(() => {
    const el = ref.current;
    if (!el || !lead || reduced || !("IntersectionObserver" in window)) return;
    const target = parseInt(lead, 10);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t1 = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, Math.max(0, (now - t1) / 1400));
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = lead;
    };
  }, [lead, reduced]);

  if (!lead) return <>{value}</>;
  return (
    <span>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        <span ref={ref}>{lead}</span>
        {rest}
      </span>
    </span>
  );
}

export default CountUp;
