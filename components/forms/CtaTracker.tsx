"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

const BOOKING = /cal\.com|calendly\.com|savvycal\.com|zcal\.co/;

/** Delegated click listener: every `[data-cta]` link or button sends `cta_click` (and `booking_click` for booking links). */
export function CtaTracker({ bookingUrl }: { bookingUrl?: string | null }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-cta]");
      if (!el) return;
      const location = el.dataset.cta ?? "unknown";
      if (location.endsWith("_submit")) return;
      track("cta_click", { location, label: (el.textContent ?? "").replace(/[→↗]/g, "").trim().slice(0, 60) });
      const href = el.getAttribute("href") ?? "";
      if ((bookingUrl && href === bookingUrl) || BOOKING.test(href)) track("booking_click", { location });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [bookingUrl]);
  return null;
}

export default CtaTracker;
