"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { INTRO_DONE } from "./events";

/**
 * The narrator: a small fixed panel (bottom-right) that tells you which chapter of the page you're in.
 * Chapters come from every `[data-chapter]` on the page (SectionHead labels, the manifesto), so it works on every route.
 * A 12×12 grid of bits changes shape per chapter. Hidden until the first screen has scrolled away,
 * on pages with fewer than 3 chapters, and for reduced motion / draft.
 */

type Shape = [number, number, number][]; // [col, row, highlight] on a 12×12 grid; highlight 2–5 = cycling cluster

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const SHAPES: Record<string, Shape> = {
  cursor: range(1, 10).flatMap((y) => range(4, 7).map((x): [number, number, number] => [x, y, 1])),
  screen: [
    ...range(0, 11).flatMap((x): [number, number, number][] => [[x, 1, 0], [x, 8, 0]]),
    ...range(2, 7).flatMap((y): [number, number, number][] => [[0, y, 0], [11, y, 0]]),
    ...range(2, 5).map((x): [number, number, number] => [x, 3, 1]),
    ...range(2, 8).map((x): [number, number, number] => [x, 5, 0]),
    [5, 9, 0], [6, 9, 0],
    ...range(3, 8).map((x): [number, number, number] => [x, 10, 0]),
  ],
  branch: [
    ...range(7, 11).map((y): [number, number, number] => [6, y, 1]),
    [5, 6, 0], [4, 5, 0], [3, 4, 0], [2, 3, 0], [1, 2, 0],
    [6, 6, 0], [6, 5, 0], [6, 4, 0], [6, 3, 0], [6, 2, 0],
    [7, 6, 1], [8, 5, 1], [9, 4, 1], [10, 3, 1], [11, 2, 1],
    [0, 1, 0], [6, 1, 0], [11, 1, 1], [10, 1, 1],
  ],
  clusters: [[1, 1], [8, 1], [1, 8], [8, 8]].flatMap(([ox, oy], q) =>
    range(0, 2).flatMap((y) => range(0, 2).map((x): [number, number, number] => [ox + x, oy + y, q + 2])),
  ),
  lines: [[2, 10], [4, 8], [6, 11], [8, 6], [10, 9]].flatMap(([row, len], i) =>
    range(0, len - 1).map((x): [number, number, number] => [x + 0.5, row, i === 0 ? 1 : 0]),
  ),
  people: [[2, 2], [7, 2], [2, 7], [7, 7]].flatMap(([ox, oy]) => [
    [ox + 1, oy, 1], [ox + 2, oy, 1], [ox + 1, oy + 1, 1], [ox + 2, oy + 1, 1],
    [ox, oy + 2, 0], [ox + 1, oy + 2, 0], [ox + 2, oy + 2, 0], [ox + 3, oy + 2, 0],
  ] as [number, number, number][]),
  square: range(4, 7).flatMap((y) => range(4, 7).map((x): [number, number, number] => [x, y, 1])),
};

const ORDER = ["screen", "branch", "clusters", "lines", "people", "cursor"];

/** Pick a shape from the chapter's words; otherwise cycle. */
function shapeFor(label: string, i: number): string {
  const l = label.toLowerCase();
  if (/why|story|exist|manifesto|about/.test(l)) return "cursor";
  if (/work|case|built|showcase|result|gallery|screen/.test(l)) return "screen";
  if (/method|decid|decision|process|how|timeline/.test(l)) return "branch";
  if (/service|industr|what we|capabilit|engagement/.test(l)) return "clusters";
  if (/insight|log|learn|faq|question|story|lesson|article/.test(l)) return "lines";
  if (/team|people|career|job|client|testimonial/.test(l)) return "people";
  if (/contact|entry|cta|start|next/.test(l)) return "square";
  return ORDER[i % ORDER.length];
}

function cleanLabel(raw: string): string {
  return raw
    .replace(/^\s*(log|entry)\s*(\d+)?\s*\/\s*/i, "")
    .replace(/^\s*\d+\s+/, "")
    .trim();
}

type Chapter = { el: Element; label: string; shape: string };

export function Narrator() {
  const pathname = usePathname();
  const canvas = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [on, setOn] = useState(false);
  const [chapter, setChapter] = useState({ n: 0, label: "" });
  const [swap, setSwap] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("rv")) return;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    let chapters: Chapter[] = [];
    const collect = () => {
      chapters = Array.from(document.querySelectorAll("#main [data-chapter]"))
        .map((el, i) => {
          const label = cleanLabel(el.getAttribute("data-chapter") || el.textContent || "");
          return { el, label, shape: shapeFor(label, i) };
        })
        .filter((c) => c.label);
      setEnabled(chapters.length >= 3);
    };
    collect();

    /* bits */
    const S = cv.width;
    const cell = S / 12;
    const N = 144;
    const pts = Array.from({ length: N }, () => ({ x: Math.random() * S, y: Math.random() * S, a: 0.5, tx: 0, ty: 0, ta: 0.5, hi: 0 }));
    let shape = "";
    const setShape = (name: string) => {
      if (name === shape) return;
      shape = name;
      const target = SHAPES[name];
      pts.forEach((p, i) => {
        if (!target) {
          p.tx = Math.random() * S; p.ty = Math.random() * S; p.ta = 0.5; p.hi = 0;
        } else if (i < target.length) {
          p.tx = (target[i][0] + 0.5) * cell; p.ty = (target[i][1] + 0.5) * cell; p.ta = 1; p.hi = target[i][2];
        } else {
          p.tx = S / 2 + (Math.random() - 0.5) * cell * 2; p.ty = S / 2 + (Math.random() - 0.5) * cell * 2; p.ta = 0; p.hi = 0;
        }
      });
    };
    setShape("scatter");

    const cssv = (n: string) => getComputedStyle(root).getPropertyValue(n).trim();
    let visible = false;
    let raf = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, S, S);
      const muted = cssv("--muted");
      const brand = cssv("--brand");
      const pulse = 0.55 + 0.45 * Math.sin(now / 320);
      const blink = Math.floor(now / 520) % 2 === 0;
      const q = Math.floor(now / 900) % 4;
      for (const p of pts) {
        p.x += (p.tx - p.x) * 0.12;
        p.y += (p.ty - p.y) * 0.12;
        p.a += (p.ta - p.a) * 0.12;
        if (p.a < 0.02) continue;
        const isHi = p.hi === 1 || (p.hi >= 2 && p.hi - 2 === q);
        let a = p.a;
        if (shape === "cursor") a *= blink ? 1 : 0.25;
        if (shape === "square") a *= pulse;
        ctx.globalAlpha = a;
        ctx.fillStyle = isHi ? brand : muted;
        const s = cell * (isHi ? 0.62 : 0.5);
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    let active = -1;
    let ticking = false;
    let swapTimer = 0;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      let idx = -1;
      chapters.forEach((c, i) => {
        if (c.el.getBoundingClientRect().top < vh * 0.55) idx = i;
      });
      const show = chapters.length >= 3 && window.scrollY > vh * 0.6 && !root.classList.contains("qb-intro");
      visible = show;
      setOn(show);
      if (idx !== active) {
        active = idx;
        const c = chapters[idx];
        setSwap(true);
        window.clearTimeout(swapTimer);
        swapTimer = window.setTimeout(() => {
          setChapter({ n: idx + 1, label: c ? c.label : "Start" });
          setSwap(false);
        }, 200);
        setShape(c ? c.shape : "scatter");
      }
      const docH = document.documentElement.scrollHeight - vh;
      if (bar.current) bar.current.style.transform = `scaleX(${docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener(INTRO_DONE, onScroll);
    /* Pages render their sections server-side, but give streamed content a moment. */
    const recollect = window.setTimeout(() => {
      collect();
      update();
    }, 600);
    update();

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(recollect);
      window.clearTimeout(swapTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener(INTRO_DONE, onScroll);
    };
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] right-4 z-40 flex items-center gap-3 border border-line bg-surface/90 py-2 pl-2 pr-4 backdrop-blur-md transition-[opacity,translate] duration-500 max-[600px]:bottom-[calc(10px+env(safe-area-inset-bottom,0px))] max-[600px]:right-2.5",
        enabled && on ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0",
      ].join(" ")}
    >
      <canvas
        ref={canvas}
        width={112}
        height={112}
        className="box-content block size-14 border-r border-line pr-2 max-[600px]:size-10"
      />
      <span className="flex min-w-[190px] flex-col gap-[5px] max-[600px]:min-w-[150px]">
        <span className="font-mono text-[10.5px] tracking-[.1em] text-brand">
          ENTRY {String(chapter.n).padStart(3, "0")}
        </span>
        <span className={`font-mono text-[11.5px] uppercase tracking-[.08em] text-ink transition-opacity duration-200 ${swap ? "opacity-0" : "opacity-100"}`}>
          {chapter.label || "Start"}
        </span>
        <span className="mt-0.5 block h-0.5 bg-line">
          <span ref={bar} className="block h-full origin-left bg-brand" style={{ transform: "scaleX(0)" }} />
        </span>
      </span>
    </div>
  );
}

export default Narrator;
