"use client";

import { useEffect, useRef } from "react";
import { clsx as cn } from "clsx";

export type BitFieldProps = {
  variant: "field" | "wordmark";
  /** Wordmark only. */
  text?: string;
  className?: string;
  ariaLabel?: string;
};

type Point = { x: number; y: number; e: number; s: number };

type Opts = {
  text?: string;
  aspect?: number;
  restVar: string;
  gap: (w: number) => number;
  radius: (w: number) => number;
  rest: (g: number) => number;
  grow: (g: number) => number;
  decay: number;
  ambient: number;
};

const FIELD: Opts = {
  restVar: "--dot",
  gap: (w) => (w < 600 ? 18 : 22),
  radius: (w) => (w < 600 ? 90 : 150),
  rest: () => 2,
  grow: () => 7,
  decay: 0.955,
  ambient: 7000,
};

const WORDMARK: Opts = {
  aspect: 0.2,
  restVar: "--ink",
  gap: (w) => Math.max(5, Math.round(w / 190)),
  radius: (w) => w / 9,
  rest: (g) => g * 0.5,
  grow: (g) => g * 0.45,
  decay: 0.94,
  ambient: 9000,
};

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

    const cssv = (n: string) => getComputedStyle(root).getPropertyValue(n).trim();
    const readColors = () => {
      colors = { rest: cssv(opts.restVar), brand: cssv("--brand"), signal: cssv("--signal") };
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      const R = opts.radius(W);
      let sx = -1e9;
      if (!reduce) sx = (((now - t0) % opts.ambient) / opts.ambient) * (W + 400) - 200;
      const rest = opts.rest(gap);
      const hot: Point[] = [];
      ctx.fillStyle = colors.rest;
      for (const p of pts) {
        if (mouse.on) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < R) p.e = Math.max(p.e, (1 - d / R) * (0.55 + 0.45 * p.s));
        }
        if (Math.abs(p.x - sx) < gap * 0.9 && Math.random() < 0.07) p.e = Math.max(p.e, 0.5 + Math.random() * 0.5);
        p.e *= opts.decay;
        if (p.e > 0.04) hot.push(p);
        else ctx.fillRect(p.x - rest / 2, p.y - rest / 2, rest, rest);
      }
      for (const q of hot) {
        const sz = rest + q.e * opts.grow(gap);
        ctx.globalAlpha = 0.25 + 0.75 * q.e;
        ctx.fillStyle = q.s < 0.12 ? colors.signal : colors.brand;
        ctx.fillRect(q.x - sz / 2, q.y - sz / 2, sz, sz);
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
          pts.push({ x, y, e: 0, s: Math.random() });
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
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    start();

    return () => {
      disposed = true;
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
