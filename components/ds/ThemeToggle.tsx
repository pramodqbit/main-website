"use client";

import { useSyncExternalStore } from "react";
import { clsx as cn } from "clsx";

type Theme = "system" | "light" | "dark";

const KEY = "qbitlog-theme";
const EVENT = "qbitlog-theme-change";
const order: Theme[] = ["system", "light", "dark"];

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

export type ThemeToggleProps = { className?: string };

/** Cycles system → light → dark and remembers the choice. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSyncExternalStore<Theme>(subscribe, read, () => "system");

  const next = () => {
    const t = order[(order.indexOf(theme) + 1) % order.length];
    if (t === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
    try {
      if (t === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, t);
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <button
      type="button"
      onClick={next}
      aria-label={`Theme: ${theme}. Switch theme`}
      className={cn("font-mono text-label uppercase text-muted hover:text-ink", className)}
    >
      Theme: {theme}
    </button>
  );
}

export default ThemeToggle;
