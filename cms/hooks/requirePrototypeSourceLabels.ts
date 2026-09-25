import { APIError, type CollectionBeforeChangeHook } from "payload";

export const PROTOTYPE_SOURCE = /prototype|demo|synthetic/i;
export const PROTOTYPE_SOURCE_MESSAGE = "Prototype metrics must say they come from demo or prototype testing.";

type CaseStudyData = { status?: unknown; _status?: unknown; metrics?: Array<{ source?: string | null }> | null };

/** Blocks publishing a prototype case study whose metric sources don't say they come from demo or prototype testing. */
export const requirePrototypeSourceLabels: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const next = data as CaseStudyData;
  const prev = (originalDoc ?? {}) as CaseStudyData;
  const status = next.status ?? prev.status;
  const publishing = (next._status ?? prev._status) === "published";
  const metrics = next.metrics ?? prev.metrics ?? [];
  if (status === "prototype" && publishing && metrics.some((m) => !PROTOTYPE_SOURCE.test(m.source ?? ""))) {
    throw new APIError(PROTOTYPE_SOURCE_MESSAGE, 400, undefined, true);
  }
  return data;
};
