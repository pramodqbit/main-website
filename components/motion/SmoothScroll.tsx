"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { INTRO_DONE, introPlaying } from "./events";

let lenis: Lenis | null = null;

/** Site-wide smooth scrolling (Lenis). Off for reduced motion and in draft/preview. Paused while the intro plays. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (root.hasAttribute("data-draft") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    if (introPlaying()) lenis.stop();
    const onIntroDone = () => lenis?.start();
    window.addEventListener(INTRO_DONE, onIntroDone);

    /* Same-page anchors glide instead of jumping. */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash || url.hash === "#") return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      lenis?.scrollTo(el, { offset: -80, duration: 1.4 });
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(INTRO_DONE, onIntroDone);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  /* After client-side navigation, re-measure the new page. */
  useEffect(() => {
    lenis?.resize();
  }, [pathname]);

  return null;
}

export default SmoothScroll;
