"use client";

import { useEffect } from "react";

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export const ATTRIBUTION_KEY = "qbitlog-attribution";

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number] | "referrer", string>>;

/** Stores first-landing UTM params and referrer in sessionStorage for the lead forms. */
export function UtmCapture() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;
      const params = new URLSearchParams(window.location.search);
      const data: Attribution = {};
      for (const k of UTM_KEYS) {
        const v = params.get(k);
        if (v) data[k] = v.slice(0, 200);
      }
      if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
        data.referrer = document.referrer.slice(0, 500);
      }
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data));
    } catch {
      /* storage unavailable */
    }
  }, []);
  return null;
}

export function readAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}

export default UtmCapture;
