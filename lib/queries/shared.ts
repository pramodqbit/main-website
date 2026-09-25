import "server-only";
import type { Where } from "payload";
import { isDraft } from "@/lib/draft";
import { getPayloadClient } from "@/lib/payload";

/** Payload client + draft flag for the current request. */
export async function ctx() {
  const [payload, draft] = await Promise.all([getPayloadClient(), isDraft()]);
  return { payload, draft };
}

export const published: Where = { _status: { equals: "published" } };

/** Build-safe wrapper: returns the fallback when the database is unreachable (e.g. a build with no DB). */
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error("[queries]", err instanceof Error ? err.message : err);
    return fallback;
  }
}
