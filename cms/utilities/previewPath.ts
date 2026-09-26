import { siteUrl } from "../../lib/site";
import { publicUrlFor } from "./paths";

export { siteUrl };

export function previewPath({ collection, slug }: { collection: string; slug?: string | null }): string {
  return (
    "/next/preview?" +
    new URLSearchParams({
      path: publicUrlFor(collection, slug),
      collection,
      slug: slug ?? "",
      secret: process.env.PREVIEW_SECRET ?? "",
    }).toString()
  );
}

/** Absolute preview URL for `admin.preview` and `admin.livePreview.url`. */
export function previewUrl(collection: string, data: unknown): string {
  const slug = (data as { slug?: unknown } | null | undefined)?.slug;
  return `${siteUrl}${previewPath({ collection, slug: typeof slug === "string" ? slug : null })}`;
}
