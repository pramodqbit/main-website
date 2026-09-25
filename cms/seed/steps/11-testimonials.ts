import type { Payload } from "payload";
import { readLegacy } from "../lib/context";
import type { LegacyCaseStudy } from "../lib/legacy-types";
import { isPlaceholderSvg, mediaIdFor } from "../lib/media";
import { report } from "../lib/report";
import { idBySlug, upsert } from "../lib/upsert";

export async function seedTestimonials(payload: Payload) {
  report.step("11 testimonials");
  for (const cs of readLegacy<LegacyCaseStudy[]>("case-studies.json")) {
    const t = cs.testimonial;
    if (!t) continue;
    const caseStudy = await idBySlug(payload, "case-studies", cs.slug);
    const avatar = t.avatar && !isPlaceholderSvg(t.avatar) ? await mediaIdFor(payload, t.avatar) : null;
    const id = await upsert(payload, "testimonials", `${t.name} (${cs.client})`, { name: { equals: t.name } }, {
      quote: t.quote,
      name: t.name,
      role: t.position,
      company: cs.client,
      ...(avatar ? { avatar } : {}),
      ...(caseStudy ? { caseStudy } : {}),
      approved: false,
    });
    if (id && caseStudy) {
      await payload.update({
        collection: "case-studies",
        id: caseStudy,
        data: { testimonial: id },
        overrideAccess: true,
        context: { disableRevalidate: true },
      });
      report.log("case-studies", cs.slug, "updated", "linked testimonial");
    }
  }
}
