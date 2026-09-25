import "server-only";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { publicUrlFor } from "@/cms/utilities/paths";
import { getPayloadClient } from "@/lib/payload";

type RedirectTo = {
  type?: "reference" | "custom" | null;
  url?: string | null;
  reference?: { relationTo: string; value: { slug?: string | null } | string | number | null } | null;
};

/** Looks up an editor-managed redirect (Payload redirects plugin) for a path. Returns the destination or null. */
export const findRedirect = cache(async (path: string): Promise<string | null> => {
  try {
    const clean = path.replace(/\/+$/, "") || "/";
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "redirects",
      where: { or: [{ from: { equals: clean } }, { from: { equals: `${clean}/` } }] },
      limit: 1,
      depth: 1,
    });
    const doc = res.docs[0] as { to?: RedirectTo } | undefined;
    const to = doc?.to;
    if (!to) return null;
    if (to.type === "custom" && to.url) return to.url;
    const value = to.reference?.value;
    if (to.reference && value && typeof value === "object" && value.slug) return publicUrlFor(to.reference.relationTo, value.slug);
    return null;
  } catch {
    return null;
  }
});

/** For a missing document: follow an editor redirect for `path` if one exists, otherwise render the 404. */
export async function redirectOrNotFound(path: string): Promise<never> {
  const to = await findRedirect(path);
  if (to && to !== path) permanentRedirect(to);
  notFound();
}
