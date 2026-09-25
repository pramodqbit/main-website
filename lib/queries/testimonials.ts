import "server-only";
import { cache } from "react";
import type { Testimonial } from "@/payload-types";
import { ctx, safe } from "./shared";

/** Client-approved testimonials only, newest first, with their case study populated. */
export const listApprovedTestimonials = cache(async (limit = 3): Promise<Testimonial[]> =>
  safe(async () => {
    const { payload } = await ctx();
    const res = await payload.find({
      collection: "testimonials",
      where: { approved: { equals: true } },
      sort: "-updatedAt",
      limit,
      depth: 1,
    });
    return res.docs;
  }, []),
);
