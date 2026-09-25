"use client";

import { useEffect, useState } from "react";

const TOKENS = [
  "paper", "surface", "ink", "muted", "line", "dot", "brand", "brand-soft",
  "signal", "signal-soft", "ok", "danger", "inv-bg", "inv-ink", "inv-muted", "inv-line", "inv-brand", "inv-signal",
];

/** Reads token values from CSS variables so the page never hardcodes colours. */
export function TokenSwatches() {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      setValues(Object.fromEntries(TOKENS.map((t) => [t, cs.getPropertyValue(`--${t}`).trim()])));
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", read);
    return () => {
      mo.disconnect();
      mq.removeEventListener("change", read);
    };
  }, []);

  return (
    <ul className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
      {TOKENS.map((t) => (
        <li key={t} className="flex flex-col gap-2 bg-surface p-3">
          <span className="h-14 border border-line" style={{ background: `var(--${t})` }} />
          <span className="font-mono text-label uppercase text-ink">{t}</span>
          <span className="font-mono text-label text-muted">{values[t] || "…"}</span>
        </li>
      ))}
    </ul>
  );
}

export default TokenSwatches;
