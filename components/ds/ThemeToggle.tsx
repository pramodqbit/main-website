"use client";

import { useSyncExternalStore } from "react";
import { clsx as cn } from "clsx";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "system" | "light" | "dark";

const KEY = "qbitlog-theme";
const EVENT = "qbitlog-theme-change";
const order: Theme[] = ["system", "light", "dark"];
const icons = { system: Monitor, light: Sun, dark: Moon } as const;
const labels = { system: "System theme", light: "Light theme", dark: "Dark theme" } as const;

function read(): Theme {
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "dark" ? t : "system";
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function apply(t: Theme) {
  if (t === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  try {
    if (t === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, t);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(EVENT));
}

export type ThemeToggleProps = { className?: string };

/**
 * Icon button that cycles system → light → dark and remembers the choice. The new theme spreads out
 * from the button in a circle (View Transitions API); instant for reduced motion or older browsers.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSyncExternalStore<Theme>(subscribe, read, () => "system");
  const nextTheme = order[(order.indexOf(theme) + 1) % order.length];
  const Icon = icons[theme];

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !document.startViewTransition) return apply(nextTheme);
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const root = document.documentElement;
    root.classList.add("theme-vt");
    const vt = document.startViewTransition(() => apply(nextTheme));
    vt.ready
      .then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {});
    vt.finished.finally(() => root.classList.remove("theme-vt"));
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${labels[theme]}. Switch to ${labels[nextTheme].toLowerCase()}`}
      title={`${labels[theme]} (click for ${labels[nextTheme].toLowerCase()})`}
      className={cn(
        "grid size-9 cursor-pointer place-items-center border border-line text-muted transition-colors hover:border-ink hover:text-ink",
        className,
      )}
    >
      <Icon key={theme} aria-hidden="true" size={16} strokeWidth={1.75} className="theme-icon" />
    </button>
  );
}

export default ThemeToggle;
