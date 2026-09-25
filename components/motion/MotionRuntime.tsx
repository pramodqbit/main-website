"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { afterIntro, INTRO_DONE } from "./events";

type QbWindow = Window & { __qbMotion?: boolean };

const STAGGERED = ["up", "fade"];
const DONE_AFTER = 1200;

/**
 * Drives every `[data-reveal]` element on the page (see globals.css "Story layer"):
 * - `up` / `fade`: content blocks. Siblings under the same parent are staggered (`data-reveal-stagger`, default 110ms,
 *   capped at 6 steps) on top of `data-reveal-delay`.
 * - `words`, `decision`, `pins`: CSS-driven sequences; this only adds `.rv-in` when they scroll into view.
 * Re-scans on every route change. Does nothing unless MotionScript set `html.rv`.
 */
export function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    (window as QbWindow).__qbMotion = true;
    if (!root.classList.contains("rv")) return;

    /* The intro only exists on pages that render it; don't leave the page locked if it isn't there. */
    if (root.classList.contains("qb-intro") && !document.querySelector(".qb-introlay")) {
      root.classList.remove("qb-intro");
      window.dispatchEvent(new Event(INTRO_DONE));
    }

    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.classList.add("rv-in");
          if (STAGGERED.includes(el.dataset.reveal ?? "")) {
            const delay = parseFloat(el.style.getPropertyValue("--rv-d")) || 0;
            /* Once it has arrived, hand the element back its own hover transitions. */
            timers.push(window.setTimeout(() => el.classList.add("rv-done"), delay + DONE_AFTER));
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    const scan = () => {
      const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-rv-seen])");
      const perParent = new Map<Element | null, number>();
      els.forEach((el) => {
        el.setAttribute("data-rv-seen", "");
        const base = Number(el.dataset.revealDelay ?? 0);
        if (STAGGERED.includes(el.dataset.reveal ?? "")) {
          const n = perParent.get(el.parentElement) ?? 0;
          perParent.set(el.parentElement, n + 1);
          const step = Number(el.dataset.revealStagger ?? 110);
          el.style.setProperty("--rv-d", `${base + Math.min(n, 6) * step}ms`);
        } else if (base) {
          el.style.setProperty("--rv-d", `${base}ms`);
        }
        io.observe(el);
      });
    };

    const cancelIntroWait = afterIntro(scan);
    /* Content streamed in later (Suspense, client lists) gets picked up too. */
    const mo = new MutationObserver(() => {
      if (!root.classList.contains("qb-intro")) scan();
    });
    mo.observe(document.getElementById("main") ?? document.body, { childList: true, subtree: true });

    return () => {
      cancelIntroWait();
      mo.disconnect();
      io.disconnect();
      timers.forEach(clearTimeout);
      /* Elements that survive navigation (header/footer) and never arrived get observed again next time. */
      document.querySelectorAll("[data-rv-seen]:not(.rv-in)").forEach((el) => el.removeAttribute("data-rv-seen"));
    };
  }, [pathname]);

  return null;
}

export default MotionRuntime;
