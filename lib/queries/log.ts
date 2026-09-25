import "server-only";
import { cache } from "react";
import type { Where } from "payload";
import type { LogEntry } from "@/payload-types";
import { ctx } from "./shared";

type ListLogEntriesArgs = { limit?: number; page?: number; tickerOnly?: boolean; types?: LogEntry["type"][] | null };

export const listLogEntries = cache(async ({ limit = 50, page = 1, tickerOnly = false, types }: ListLogEntriesArgs = {}) => {
  const { payload } = await ctx();
  const and: Where[] = [];
  if (tickerOnly) and.push({ showInTicker: { equals: true } });
  if (types?.length) and.push({ type: { in: types } });
  return payload.find({
    collection: "log-entries",
    where: and.length ? { and } : undefined,
    sort: "-date",
    limit,
    page,
    depth: 1,
  });
});

export type { LogEntry };
