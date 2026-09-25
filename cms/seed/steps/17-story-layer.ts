import type { Payload } from "payload";
import { flags, seedContext } from "../lib/context";
import { report } from "../lib/report";

/**
 * Phase 9 (story layer): adds the "Why we exist" manifesto block to the home page, right after the hero
 * (and its proof strip / ticker), as a DRAFT version. The published home page is untouched until an editor publishes.
 * Skips if the latest version already has a manifesto block.
 */
const MANIFESTO = {
  blockType: "manifesto",
  label: "ENTRY 001 / WHY WE EXIST",
  lines: [
    { text: "In 2025, a few engineers got tired of building for everyone else." },
    { text: "Other people’s roadmaps. Other people’s shortcuts. Deadlines paid for by tired teams." },
    { text: "So we started Qbitlog to build for ourselves, at a pace that keeps people sharp." },
    { text: "Now we build yours the same way: *like it’s ours*, with every decision on the record." },
  ],
  signature: "The Qbitlog team · 2025",
};

type LayoutItem = { blockType: string; [k: string]: unknown };

export async function seedStoryLayer(payload: Payload) {
  report.step("17 story layer: manifesto on the home page (draft)");
  const res = await payload.find({
    collection: "pages",
    where: { slug: { equals: "home" } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  });
  const home = res.docs[0] as unknown as { id: string | number; layout?: LayoutItem[] } | undefined;
  if (!home) {
    report.log("pages", "home", "failed", "home page not found (run the pages step first)");
    return;
  }
  const layout = home.layout ?? [];
  if (layout.some((b) => b.blockType === "manifesto")) {
    report.log("pages", "home", "skipped", "latest version already has a manifesto block");
    return;
  }
  /* After the hero, and after the proof strip / ticker that belong to it. */
  let at = layout.findIndex((b) => b.blockType === "heroLog") + 1;
  while (at > 0 && at < layout.length && ["proofStrip", "logTicker"].includes(layout[at].blockType)) at++;
  const next = [...layout.slice(0, at), MANIFESTO, ...layout.slice(at)];
  if (flags.dryRun) {
    report.log("pages", "home", "updated", `dry run: manifesto at position ${at + 1}`);
    return;
  }
  await payload.update({
    collection: "pages",
    id: home.id,
    data: { layout: next, _status: "draft" } as never,
    draft: true,
    overrideAccess: true,
    context: seedContext,
  });
  report.log("pages", "home", "updated", `manifesto added at position ${at + 1} as a draft version`);
}
