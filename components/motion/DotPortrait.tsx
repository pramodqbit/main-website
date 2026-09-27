"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Dots per side. Must match `PORTRAIT_GRID` in lib/portrait.ts. */
const N = 48;

type Dot = { x: number; y: number; v: number; sx: number; sy: number; d: number; e: number; bit: boolean };

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Strength of a shaded shape (0 outside): lit side light, far side dark, like a halftone print. */
function shade(nx: number, ny: number, lx: number, ly: number) {
  const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
  const lambert = Math.min(1, Math.max(0, nx * lx + ny * ly + nz * 0.35));
  return 0.14 + 0.72 * Math.pow(1 - lambert, 1.4);
}

/**
 * No photo: a neutral head-and-shoulders silhouette shaded in dots. The light angle and a few violet
 * "bits" come from the name, so each person's card is their own and the same on every visit.
 */
function silhouette(seed: string): { values: number[]; bits: Set<number> } {
  let h = hash(seed) || 1;
  const rnd = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
  const a = (rnd() - 0.5) * 1.8 - Math.PI / 2;
  const lx = Math.cos(a);
  const ly = Math.sin(a) * 0.6;
  const values: number[] = [];
  const inside: number[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const u = (x + 0.5) / N;
      const v = (y + 0.5) / N;
      /* Head: circle. Shoulders: wide ellipse cut by the bottom edge. Neck: short bridge. */
      const hx = (u - 0.5) / 0.165;
      const hy = (v - 0.42) / 0.2;
      const sx = (u - 0.5) / 0.38;
      const sy = (v - 1.06) / 0.34;
      let s = 0;
      if (hx * hx + hy * hy <= 1) s = shade(hx, hy, lx, ly);
      else if (sx * sx + sy * sy <= 1) s = shade(sx, sy * 0.6, lx, ly);
      else if (Math.abs(u - 0.5) < 0.075 && v > 0.58 && v < 0.74) s = 0.78;
      values.push(s);
      if (s > 0) inside.push(y * N + x);
    }
  }
  const bits = new Set<number>();
  for (let i = 0; i < 5; i++) bits.add(inside[Math.floor(rnd() * inside.length)]);
  return { values, bits };
}

/**
 * A team member drawn in dots, from the same bits as the hero. `dots` is the server-made grid from
 * lib/portrait.ts (the photo itself is never sent); without it the card shows a shaded silhouette.
 * Dots fly into place the first time the card scrolls into view and turn violet under the pointer.
 */
export function DotPortrait({ dots, seed, className }: { dots?: string | null; seed: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* Same switch as the rest of the story layer: no animation in draft/preview or before MotionScript. */
    const animate = !reduce && root.classList.contains("rv");
    const photo = typeof dots === "string" && dots.length === N * N ? dots : null;
    const made = photo ? null : silhouette(seed);
    const values = photo ? Array.from(photo, (c) => parseInt(c, 16) / 15) : (made?.values ?? []);
    const bits = made?.bits ?? new Set<number>();

    let W = 0;
    let g = 0;
    let pts: Dot[] = [];
    let colors = { ink: "", rest: "", brand: "" };
    let dark = false;
    const mouse = { x: -9999, y: -9999, on: false };
    let asmStart: number | null = animate ? null : -Infinity;
    let raf = 0;
    let disposed = false;

    const cssv = (n: string) => getComputedStyle(root).getPropertyValue(n).trim();
    const readTheme = () => {
      colors = { ink: cssv("--ink"), rest: cssv("--dot"), brand: cssv("--brand") };
      const t = root.dataset.theme;
      dark = t === "dark" || (t !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    };

    /**
     * Strength 0..1 of a dot. Photos are stored as darkness; on the dark theme light dots mean light areas.
     * The curve opens up the mid-tones, otherwise ink dots on paper merge into a dark block.
     */
    const strength = (v: number) => (photo ? Math.pow(dark ? 1 - v : v, dark ? 1.15 : 1.4) : v);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, W);
      const R = W * 0.22;
      let busy = false;
      for (const p of pts) {
        const k = asmStart === null ? 0 : Math.min(1, Math.max(0, (now - asmStart - p.d) / 950));
        if (k < 1) busy = true;
        const ek = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        const x = p.sx + (p.x - p.sx) * ek;
        const y = p.sy + (p.y - p.sy) * ek;
        if (mouse.on) {
          const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (dist < R) p.e = Math.max(p.e, 1 - dist / R);
        }
        p.e *= 0.93;
        if (p.e > 0.02) busy = true;
        const s = strength(p.v);
        const lit = s > 0.12;
        const base = lit ? g * (0.14 + 0.66 * Math.sqrt(s)) : g * 0.16;
        const sz = base + (lit ? p.e * g * 0.25 : 0);
        ctx.globalAlpha = k;
        ctx.fillStyle = lit ? (p.bit || p.e > 0.15 ? colors.brand : colors.ink) : colors.rest;
        ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1;
      return busy;
    };

    const loop = (now: number) => {
      raf = 0;
      if (disposed) return;
      if (draw(now) || mouse.on) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(loop);
    };

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.getBoundingClientRect().width;
      if (!W) return;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(W * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      g = W / N;
      pts = values.map((v, i) => {
        const x = ((i % N) + 0.5) * g;
        const y = (Math.floor(i / N) + 0.5) * g;
        /* Printed top to bottom, each dot flying in from somewhere nearby. */
        return {
          x, y, v, e: 0, bit: bits.has(i),
          sx: x + (Math.random() - 0.5) * W * 0.9,
          sy: y + (Math.random() - 0.5) * W * 0.9,
          d: (y / W) * 650 + Math.random() * 300,
        };
      });
      draw(performance.now());
    };

    readTheme();
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(canvas);
    const recolor = () => {
      readTheme();
      draw(performance.now());
    };
    const mo = new MutationObserver(recolor);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", recolor);

    const host = canvas.parentElement ?? canvas;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.on = true;
      kick();
    };
    const onLeave = () => {
      mouse.on = false;
    };
    if (!reduce) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (asmStart === null && entry.intersectionRatio >= 0.35) {
          asmStart = performance.now() + 250;
          kick();
          io.disconnect();
        }
      },
      { threshold: [0, 0.35] },
    );
    if (animate) io.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      mq.removeEventListener("change", recolor);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [dots, seed]);

  return <canvas ref={ref} aria-hidden="true" className={cn("absolute inset-0 block h-full w-full", className)} />;
}

export default DotPortrait;
