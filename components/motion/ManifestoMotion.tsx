"use client";

import { useEffect, useRef, type ReactNode } from "react";

const COLS = 9;
const ROWS = 16;

/**
 * Scroll-driven reading for the manifesto: words (`.mw`) fill in as the section scrolls through the viewport,
 * the last few glowing violet like a pen; beside it a 9×16 block of dots fills row by row and blinks when complete.
 * Inert (everything shown) unless `html.rv` is set.
 */
export function ManifestoMotion({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const box = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!box || !cv || !ctx) return;
    const motion = root.classList.contains("rv");
    const words = Array.from(box.querySelectorAll<HTMLElement>(".mw"));
    const cssv = (n: string) => getComputedStyle(root).getPropertyValue(n).trim();
    let progress = motion ? 0 : 1;

    const drawCursor = (now: number) => {
      const r = cv.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (cv.width !== Math.round(r.width * dpr)) {
        cv.width = Math.round(r.width * dpr);
        cv.height = Math.round(r.height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, r.width, r.height);
      const cw = r.width / COLS;
      const ch = r.height / ROWS;
      const total = COLS * ROWS;
      const filled = Math.round(progress * total);
      const complete = progress >= 1;
      const blinkOn = complete && Math.floor(now / 560) % 2 === 0;
      const dot = cssv("--dot");
      const ink = cssv("--ink");
      const brand = cssv("--brand");
      for (let i = 0; i < total; i++) {
        const cx = (i % COLS) * cw + cw / 2;
        const cy = Math.floor(i / COLS) * ch + ch / 2;
        let s = 2;
        if (i < filled) {
          ctx.fillStyle = complete ? (blinkOn ? brand : ink) : i > filled - COLS ? brand : ink;
          s = Math.min(cw, ch) * 0.62;
        } else {
          ctx.fillStyle = dot;
        }
        ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
      }
    };

    const update = () => {
      if (!motion) return;
      const vh = window.innerHeight;
      const r = box.getBoundingClientRect();
      progress = Math.min(1, Math.max(0, (vh * 0.82 - r.top) / (r.height * 0.85)));
      const lit = Math.round(progress * words.length);
      words.forEach((w, i) => {
        w.classList.toggle("lit", i < lit);
        w.classList.toggle("edge", i < lit && i >= lit - 3 && progress < 0.999);
      });
    };

    let raf = 0;
    let visible = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) drawCursor(now);
    };
    raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(cv);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    drawCursor(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div ref={wrap} data-manifesto="">
        {children}
      </div>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="sticky top-[120px] block aspect-[9/16] w-full max-w-[180px] max-[1000px]:hidden"
      />
    </>
  );
}

export default ManifestoMotion;
