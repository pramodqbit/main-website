import type { LinkField } from "../../../payload-types";

type Linkable = "pages" | "case-studies" | "services" | "industries" | "posts" | "jobs";

/** A path or URL link (site routes that aren't documents, e.g. /work, count as "external" paths). */
export function urlLink(label: string, url: string, newTab = false): LinkField {
  return { type: "external", url, label, newTab };
}

/** A link to a Payload document. Falls back to `fallbackUrl` when the document doesn't exist yet. */
export function docLink(label: string, relationTo: Linkable, id: string | null, fallbackUrl: string): LinkField {
  if (!id) return urlLink(label, fallbackUrl);
  return { type: "internal", reference: { relationTo, value: id } as LinkField["reference"], label, newTab: false };
}
