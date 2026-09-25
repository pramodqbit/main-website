"use client";

import { useEffect, useState, type RefObject } from "react";

type Options = { threshold?: number; once?: boolean };

/** Returns true while (or once) the element is inside the viewport. */
export function useInView(ref: RefObject<Element | null>, { threshold = 0.2, once = true }: Options = {}): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);

  return inView;
}
