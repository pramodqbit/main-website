"use client";

import { useEffect, useRef } from "react";
import { clsx as cn } from "clsx";
import { BITS_BURST } from "./events";

export type BitFieldProps = {
  variant: "field" | "wordmark";
  /** Wordmark only. */
  text?: string;
  className?: string;
  ariaLabel?: string;
};

/** px/py: drawn position (differs from x/y while the wordmark assembles); sx/sy: scattered start; d: assemble delay. */
type Point = { x: number; y: number; e: number; s: number; px: number; py: number; sx: number; sy: number; d: number };

type Opts = {
  text?: string;
  aspect?: number;
  restVar: string;
  gap: (w: number) => number;
  radius: (w: number) => number;
  rest: (g: number) => number;
  grow: (g: number) => number;
  decay: number;
  /** One quick sweep of flipping bits every `every` ms, lasting `sweep` ms, first after `first` ms. Calm, not busy. */
  every: number;
  sweep: number;
  first: number;
  /** Dots fly in from scattered positions the first time the canvas scrolls into view. */
  assemble?: boolean;
  /** Listen for the intro's "burst" event. */
  burst?: boolean;
};

const FIELD: Opts = {
  restVar: "--dot",
  gap: (w) => (w < 600 ? 18 : 22),
  radius: (w) => (w < 600 ? 90 : 150),
  rest: () => 2,
  grow: () => 7,
  decay: 0.955,
  every: 25000,
  sweep: 2600,
  first: 9000,
  burst: true,
};

const WORDMARK: Opts = {
  aspect: 0.2,
  restVar: "--ink",
  gap: (w) => Math.max(5, Math.round(w / 190)),
  radius: (w) => w / 9,
  rest: (g) => g * 0.5,
  grow: (g) => g * 0.45,
  decay: 0.94,
  every: 28000,
  sweep: 3200,
  first: 4000,
  assemble: true,
};

const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

/**
 * Interactive dot grid: dots flip into violet "bits" under the pointer.
 * `field` fills its positioned parent; `wordmark` draws `text` out of dots.
 * Load it with `LazyBitField` (next/dynamic, ssr:false) so it never blocks LCP.
 */
export function BitField({ variant, text = "QBITLOG", className, ariaLabel }: BitFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const opts: Opts = variant === "wordmark" ? { ...WORDMARK, text } : FIELD;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const host: HTMLElement =
      canvas.closest<HTMLElement>("[data-bitfield-host]") ?? canvas.parentElement ?? canvas;
    const root = document.documentElement;

    let W = 0;
    let H = 0;
    let gap = 20;
    let pts: Point[] = [];
    let colors = { rest: "", brand: "", signal: "" };
    const mouse = { x: -9999, y: -9999, on: false };
    let running = false;
    let visible = true;
    let disposed = false;
    const t0 = performance.now();
    let asmStart: number | null = null;

    const cssv = (n: string) => getComputedStyle(root).getPropertyValue(n).trim();
    const readColors = () => {
      colors = { rest: cssv(opts.restVar), brand: cssv("--brand"), signal: cssv("--signal") };
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      const R = opts.radius(W);
      let sx = -1e9;
      const since = now - t0 - opts.first;
      if (!reduce && since > 0) {
        const inCycle = since % opts.every;
        if (inCycle < opts.sweep) sx = (inCycle / opts.sweep) * (W + 400) - 200;
      }
      const rest = opts.rest(gap);
      const hot: Point[] = [];
      const assembling = opts.assemble && !reduce;
      ctx.fillStyle = colors.rest;
      for (const p of pts) {
        if (assembling) {
          const k = asmStart === null ? 0 : Math.min(1, Math.max(0, (now - asmStart - p.d) / 1100));
          const ek = easeInOut(k);
          p.px = p.sx + (p.x - p.sx) * ek;
          p.py = p.sy + (p.y - p.sy) * ek;
          if (k > 0 && k < 1) p.e = Math.max(p.e, 0.6 * (1 - k));
        } else {
          p.px = p.x;
          p.py = p.y;
        }
        if (mouse.on) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < R) p.e = Math.max(p.e, (1 - d / R) * (0.55 + 0.45 * p.s));
        }
        if (Math.abs(p.x - sx) < gap * 0.9 && Math.random() < 0.07) p.e = Math.max(p.e, 0.5 + Math.random() * 0.5);
        p.e *= opts.decay;
        if (p.e > 0.04) hot.push(p);
        else ctx.fillRect(p.px - rest / 2, p.py - rest / 2, rest, rest);
      }
      for (const q of hot) {
        const sz = rest + q.e * opts.grow(gap);
        ctx.globalAlpha = 0.25 + 0.75 * q.e;
        ctx.fillStyle = q.s < 0.12 ? colors.signal : colors.brand;
        ctx.fillRect(q.px - sz / 2, q.py - sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1;
    };

    const layout = () => {
      if (disposed) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.getBoundingClientRect().width;
      if (opts.aspect) {
        H = Math.round(W * opts.aspect);
        canvas.style.height = `${H}px`;
      } else {
        H = canvas.getBoundingClientRect().height;
      }
      if (!W || !H) return;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = opts.gap(W);
      let mask: Uint8ClampedArray | null = null;
      let mw = 0;
      if (opts.text) {
        const off = document.createElement("canvas");
        mw = Math.ceil(W);
        off.width = mw;
        off.height = Math.ceil(H);
        const o = off.getContext("2d");
        if (o) {
          const family = cssv("--font-sans") || "Geist, system-ui, sans-serif";
          let fs = H * 1.05;
          o.font = `600 ${fs}px ${family}`;
          fs = fs * Math.min(1, (W * 0.995) / o.measureText(opts.text).width);
          o.font = `600 ${fs}px ${family}`;
          o.textAlign = "center";
          o.textBaseline = "middle";
          o.fillStyle = "black";
          o.fillText(opts.text, W / 2, H / 2 + fs * 0.03);
          mask = o.getImageData(0, 0, off.width, off.height).data;
        }
      }
      pts = [];
      for (let y = gap / 2; y < H; y += gap) {
        for (let x = gap / 2; x < W; x += gap) {
          if (mask && mask[(Math.floor(y) * mw + Math.floor(x)) * 4 + 3] < 128) continue;
          pts.push({
            x, y, e: 0, s: Math.random(), px: x, py: y,
            sx: Math.random() * W, sy: Math.random() * H, d: (x / W) * 500 + Math.random() * 350,
          });
        }
      }
      draw(performance.now());
    };

    const loop = (now: number) => {
      if (disposed || !visible) {
        running = false;
        return;
      }
      draw(now);
      requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running && !reduce && visible && !disposed) {
        running = true;
        requestAnimationFrame(loop);
      }
    };

    readColors();
    layout();
    const ro = new ResizeObserver(() => layout());
    ro.observe(canvas.parentElement ?? canvas);
    const recolor = () => {
      readColors();
      draw(performance.now());
    };
    const mo = new MutationObserver(recolor);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", recolor);
    if (opts.text && document.fonts) void document.fonts.ready.then(layout);

    if (reduce) {
      return () => {
        disposed = true;
        ro.disconnect();
        mo.disconnect();
        mq.removeEventListener("change", recolor);
      };
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.on = true;
      start();
    };
    const onLeave = () => {
      mouse.on = false;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && opts.assemble && asmStart === null && entry.intersectionRatio >= 0.3) asmStart = performance.now() + 150;
        if (visible) start();
      },
      { threshold: opts.assemble ? [0, 0.3] : 0 },
    );
    io.observe(canvas);
    start();

    /* The intro hands over by flashing a share of the bits. */
    const onBurst = (e: Event) => {
      const amount = (e as CustomEvent<number>).detail ?? 0.2;
      for (const p of pts) if (Math.random() < amount) p.e = 0.5 + Math.random() * 0.5;
      start();
    };
    if (opts.burst) window.addEventListener(BITS_BURST, onBurst);

    return () => {
      disposed = true;
      if (opts.burst) window.removeEventListener(BITS_BURST, onBurst);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      mq.removeEventListener("change", recolor);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [variant, text]);

  if (variant === "wordmark") {
    return (
      <canvas
        ref={ref}
        role="img"
        aria-label={ariaLabel ?? "Qbitlog"}
        className={cn("block h-auto w-full", className)}
      />
    );
  }
  return <canvas ref={ref} aria-hidden="true" className={cn("absolute inset-0 block h-full w-full bits-mask", className)} />;
}

export default BitField;
