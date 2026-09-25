import "server-only";
import type { Metadata } from "next";
import type { Media } from "@/payload-types";
import { isDraft } from "@/lib/draft";
import { getSiteSettings } from "@/lib/queries/globals";
import { absoluteUrl } from "@/lib/site";

type SeoDoc = {
  title?: string | null;
  summary?: string | null;
  excerpt?: string | null;
  heroImage?: Media | string | number | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: Media | string | number | null;
    noindex?: boolean | null;
  } | null;
};

export type BuildMetadataArgs = {
  doc?: SeoDoc | null;
  path: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  type?: "website" | "article";
  authors?: string[];
  noindex?: boolean;
  /** Set when the route has an `opengraph-image.tsx`; Next adds that image automatically when no Payload image is set. */
  generatedImage?: boolean;
};

const SUFFIX = /\s*[·|-]\s*Qbitlog\s*$/i;

export function truncate(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 20)).replace(/[\s,.;:–-]+$/, "")}…`;
}

function imageUrl(img: SeoDoc["heroImage"]): { url: string; width?: number; height?: number; alt?: string } | null {
  if (!img || typeof img !== "object" || !img.url) return null;
  const og = img.sizes?.og;
  if (og?.url) return { url: absoluteUrl(og.url), width: og.width ?? 1200, height: og.height ?? 630, alt: img.alt ?? undefined };
  return { url: absoluteUrl(img.url), width: img.width ?? undefined, height: img.height ?? undefined, alt: img.alt ?? undefined };
}

/** Shared Next metadata builder: title, description, canonical, Open Graph, Twitter and robots. */
export async function buildMetadata({
  doc,
  path,
  fallbackTitle,
  fallbackDescription,
  type = "website",
  authors,
  noindex,
  generatedImage,
}: BuildMetadataArgs): Promise<Metadata> {
  const [settings, draft] = await Promise.all([getSiteSettings(), isDraft()]);
  const rawTitle = doc?.meta?.title || doc?.title || fallbackTitle || settings?.defaultSeo?.title || "Qbitlog";
  const title = rawTitle.replace(SUFFIX, "");
  const description = truncate(
    doc?.meta?.description || doc?.summary || doc?.excerpt || fallbackDescription || settings?.defaultSeo?.description || "",
  );
  const canonicalPath = path === "/" ? "/" : path.replace(/\/+$/, "").split("?")[0];
  const url = absoluteUrl(canonicalPath);

  const explicit = imageUrl(doc?.meta?.image ?? null);
  const fallback = generatedImage ? null : imageUrl(doc?.heroImage ?? null) ?? imageUrl(settings?.defaultSeo?.ogImage ?? null);
  const image = explicit ?? fallback;
  const images = image ? [image] : undefined;

  const robotsOff = draft || noindex || Boolean(doc?.meta?.noindex);

  return {
    title,
    description: description || undefined,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: "Qbitlog",
      locale: "en_US",
      title,
      description: description || undefined,
      ...(images ? { images } : {}),
      ...(type === "article"
        ? {
            publishedTime: doc?.publishedAt ?? undefined,
            modifiedTime: doc?.updatedAt ?? undefined,
            authors,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(robotsOff ? { robots: { index: false, follow: false } } : {}),
  };
}
