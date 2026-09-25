import { track as vercelTrack } from "@vercel/analytics";

type Events = {
  cta_click: { location: string; label: string };
  booking_click: { location: string };
  lead_submitted: { budget: string; timeline: string };
  application_submitted: { job: string };
  case_study_view_depth: { slug: string; reached: "decisions" | "results" };
};

/** Typed wrapper around Vercel Analytics `track()`. Never pass PII. */
export function track<E extends keyof Events>(event: E, props: Events[E]) {
  try {
    vercelTrack(event, props);
  } catch {
    /* analytics unavailable */
  }
}
