import "server-only";
import { cache } from "react";
import type { Announcement, Footer, Header, ServicesPage, SiteSetting, WorkPage } from "@/payload-types";
import { ctx, safe } from "./shared";

export const getHeader = cache(async (): Promise<Header | null> =>
  safe(async () => {
    const { payload, draft } = await ctx();
    return payload.findGlobal({ slug: "header", depth: 1, draft });
  }, null),
);

export const getFooter = cache(async (): Promise<Footer | null> =>
  safe(async () => {
    const { payload, draft } = await ctx();
    return payload.findGlobal({ slug: "footer", depth: 1, draft });
  }, null),
);

export const getSiteSettings = cache(async (): Promise<SiteSetting | null> =>
  safe(async () => {
    const { payload } = await ctx();
    return payload.findGlobal({ slug: "site-settings", depth: 1 });
  }, null),
);

export const getServicesPage = cache(async (): Promise<ServicesPage | null> =>
  safe(async () => {
    const { payload, draft } = await ctx();
    return payload.findGlobal({ slug: "services-page", depth: 1, draft });
  }, null),
);

export const getWorkPage = cache(async (): Promise<WorkPage | null> =>
  safe(async () => {
    const { payload, draft } = await ctx();
    return payload.findGlobal({ slug: "work-page", depth: 1, draft });
  }, null),
);

export const getAnnouncement = cache(async (): Promise<Announcement | null> =>
  safe(async () => {
    const { payload } = await ctx();
    return payload.findGlobal({ slug: "announcement", depth: 1 });
  }, null),
);
