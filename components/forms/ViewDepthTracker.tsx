"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

const SECTIONS = ["decisions", "results"] as const;

/** Sends `case_study_view_depth` once per section when `#decisions` / `#results` scroll into view. */
export function ViewDepthTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const seen = new Set<string>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const id = e.target.id as (typeof SECTIONS)[number];
        if (!e.isIntersecting || seen.has(id)) continue;
        seen.add(id);
        track("case_study_view_depth", { slug, reached: id });
        io.unobserve(e.target);
      }
    }, { threshold: 0.2 });
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [slug]);
  return null;
}

export default ViewDepthTracker;
