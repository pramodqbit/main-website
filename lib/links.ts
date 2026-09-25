import { publicUrlFor } from "@/cms/utilities/paths";

type RefValue = { slug?: string | null } | string | number | null | undefined;

/** Structural shape of Payload's `linkField` group. */
export type LinkValue = {
  type?: "internal" | "external" | null;
  reference?: { relationTo: string; value: RefValue } | null;
  url?: string | null;
  label?: string | null;
  newTab?: boolean | null;
} | null | undefined;

export type ResolvedLink = { href: string; label: string; newTab: boolean };

/** Resolves a linkField value to an href. Returns null when the link is empty or its target is missing. */
export function resolveLink(link: LinkValue, fallbackLabel = ""): ResolvedLink | null {
  if (!link) return null;
  const label = link.label?.trim() || fallbackLabel;
  if (link.type === "external" || (!link.type && link.url)) {
    const href = link.url?.trim();
    if (!href || !label) return null;
    return { href, label, newTab: Boolean(link.newTab) };
  }
  const ref = link.reference;
  if (!ref || !label) return null;
  const value = ref.value;
  const slug = value && typeof value === "object" ? value.slug : null;
  if (!slug) return null;
  return { href: publicUrlFor(ref.relationTo, slug), label, newTab: Boolean(link.newTab) };
}

/** Resolves an array of `{ link }` rows or bare link groups, dropping empty ones. */
export function resolveLinks(rows: Array<LinkValue | { link?: LinkValue }> | null | undefined): ResolvedLink[] {
  return (rows ?? [])
    .map((row) => resolveLink(row && "link" in row ? row.link : (row as LinkValue)))
    .filter((l): l is ResolvedLink => l !== null);
}
