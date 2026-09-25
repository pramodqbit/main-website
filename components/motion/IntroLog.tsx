"use client";

import { useEffect, useRef } from "react";
import { BITS_BURST, INTRO_DONE } from "./events";

export type IntroLine = { label: string; text: string };

/**
 * "The first entry": on the first home-page visit of a session, the founding story types out on a blank page,
 * then the letters break into dots that fly into the hero's bit field. Skippable (button, scroll, key, touch).
 * Only runs while MotionScript has set `html.qb-intro` (home page, not reduced motion, not seen this session).
 */
export function IntroLog({ lines }: { lines: IntroLine[] }) {
  const overlay = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = overlay.current;
    const lineBox = box.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !lineBox || !cv || !ctx) return;
    if (!root.classList.contains("qb-intro") || !lines.length) {
      root.classList.remove("qb-intro");
      return;
    }

    const timers: number[] = [];
    let raf = 0;
    let done = false;
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const cssv = (n: string) => getComputedStyle(root).getPropertyValue(n).trim();

    const finish = (skipped: boolean) => {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      root.classList.remove("qb-intro");
      try {
        sessionStorage.setItem("qb-intro", "1");
      } catch {
        /* private mode: the intro may play again, that's fine */
      }
      if (skipped) window.dispatchEvent(new CustomEvent(BITS_BURST, { detail: 0.12 }));
      window.dispatchEvent(new Event(INTRO_DONE));
    };

    window.scrollTo(0, 0);

    /* 1. Type the lines */
    const cursor = document.createElement("span");
    cursor.className = "ml-[3px] inline-block h-[1.1em] w-[.6em] align-[-.18em] bg-brand animate-blink";
    let t = 250;
    lines.forEach((l, i) => {
      const row = document.createElement("div");
      row.className = "grid min-h-[1.9em] grid-cols-[120px_1fr] gap-[18px] max-[560px]:mb-2.5 max-[560px]:grid-cols-1 max-[560px]:gap-0";
      const k = document.createElement("span");
      k.className = "tracking-[.08em] text-brand";
      k.dataset.kind = "k";
      const tx = document.createElement("span");
      tx.className = "text-ink";
      tx.dataset.kind = "t";
      row.append(k, tx);
      lineBox.appendChild(row);
      later(() => {
        k.textContent = l.label;
        tx.appendChild(cursor);
      }, t);
      t += 180;
      for (let c = 1; c <= l.text.length; c++) {
        later(() => {
          tx.textContent = l.text.slice(0, c);
          tx.appendChild(cursor);
        }, t);
        t += 32 + (Math.random() * 14 - 7);
      }
      t += i === lines.length - 1 ? 850 : 380;
    });

    /* 2. Break the letters into dots that fly into the hero's grid */
    const dissolve = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = window.innerWidth;
      const H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cursor.remove();
      const brand = cssv("--brand");
      const ink = cssv("--ink");
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d");
      if (!o) return finish(false);
      o.textBaseline = "middle";
      lineBox.querySelectorAll<HTMLElement>("[data-kind]").forEach((s) => {
        const r = s.getBoundingClientRect();
        const cs = getComputedStyle(s);
        o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        /* Offscreen mask only: red marks labels, blue marks text, so each dot keeps its colour. */
        o.fillStyle = s.dataset.kind === "k" ? "red" : "blue";
        const lh = parseFloat(cs.lineHeight) || r.height;
        o.fillText(s.textContent ?? "", r.left, r.top + Math.min(r.height, lh) / 2);
      });
      const data = o.getImageData(0, 0, W, H).data;
      const hero = (el.closest("section") ?? document.body).getBoundingClientRect();
      const g = W < 600 ? 18 : 22;
      type P = { x0: number; y0: number; x1: number; y1: number; c: string; d: number; a: number };
      const parts: P[] = [];
      for (let y = 0; y < H; y += 3) {
        for (let x = 0; x < W; x += 3) {
          const idx = (y * W + x) * 4;
          if (data[idx + 3] > 120) {
            parts.push({
              x0: x,
              y0: y,
              x1: Math.round(Math.random() * (W / g)) * g + g / 2,
              y1: Math.max(0, hero.top) + Math.round(Math.random() * ((hero.height * 0.7) / g)) * g + g / 2,
              c: data[idx] > data[idx + 2] ? brand : ink,
              d: Math.random() * 260 + (x / W) * 240,
              a: (Math.random() - 0.5) * 120,
            });
          }
        }
      }
      lineBox.style.visibility = "hidden";
      el.setAttribute("data-clear", "");
      const t0 = performance.now();
      const dur = 1150;
      const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
      const frame = (now: number) => {
        ctx.clearRect(0, 0, W, H);
        let alive = false;
        for (const p of parts) {
          const k = Math.min(1, Math.max(0, (now - t0 - p.d) / dur));
          if (k < 1) alive = true;
          const e = ease(k);
          const arc = Math.sin(k * Math.PI) * p.a;
          const x = p.x0 + (p.x1 - p.x0) * e + arc * 0.3;
          const y = p.y0 + (p.y1 - p.y0) * e - Math.abs(arc);
          ctx.globalAlpha = k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
          ctx.fillStyle = k > 0.25 ? brand : p.c;
          const sz = 2 + Math.sin(k * Math.PI) * 1.6;
          ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
        }
        ctx.globalAlpha = 1;
        if (alive) raf = requestAnimationFrame(frame);
        else finish(false);
      };
      raf = requestAnimationFrame(frame);
      later(() => window.dispatchEvent(new CustomEvent(BITS_BURST, { detail: 0.22 })), 750);
    };
    later(dissolve, t);

    const skip = () => finish(true);
    const skipBtn = el.querySelector("button");
    skipBtn?.addEventListener("click", skip);
    const events = ["wheel", "touchstart", "keydown"] as const;
    events.forEach((ev) => window.addEventListener(ev, skip, { passive: true }));

    return () => {
      skipBtn?.removeEventListener("click", skip);
      events.forEach((ev) => window.removeEventListener(ev, skip));
      /* Reset rather than finish: React dev mode mounts twice, and a real unmount (navigating away)
         is handled by MotionRuntime, which clears `qb-intro` when no overlay is left on the page. */
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      lineBox.replaceChildren();
      lineBox.style.visibility = "";
      el.removeAttribute("data-clear");
      ctx.clearRect(0, 0, cv.width, cv.height);
    };
  }, [lines]);

  return (
    <div ref={overlay} className="qb-introlay">
      {/* Decorative: the same story is on the page as the manifesto; screen readers skip the typing. */}
      <div
        ref={box}
        aria-hidden="true"
        className="relative z-[1] w-[min(820px,100%)] px-6 font-mono text-[clamp(14px,1.55vw,18px)] leading-[1.9]"
      />
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] h-full w-full" />
      <button
        type="button"
        className="qb-skip absolute bottom-[calc(24px+env(safe-area-inset-bottom,0px))] right-6 z-[3] cursor-pointer border border-line bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[.08em] text-muted transition-opacity hover:border-ink hover:text-ink"
      >
        Skip intro
      </button>
    </div>
  );
}

export default IntroLog;
