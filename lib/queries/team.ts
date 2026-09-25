import "server-only";
import { cache } from "react";
import type { Where } from "payload";
import type { Team } from "@/payload-types";
import { ctx } from "./shared";

/** Team members shown on the site: leadership first, then by `order`. */
export const listTeam = cache(async ({ leadership }: { leadership?: boolean } = {}): Promise<Team[]> => {
  const { payload } = await ctx();
  const and: Where[] = [{ showOnSite: { equals: true } }, { kind: { not_equals: "team" } }];
  if (leadership) and.push({ leadership: { equals: true } });
  const res = await payload.find({ collection: "team", where: { and }, sort: "order", limit: 200, depth: 1 });
  return [...res.docs].sort((a, b) => Number(Boolean(b.leadership)) - Number(Boolean(a.leadership)));
});
