import Image from "next/image";
import type { Media as MediaDoc } from "@/payload-types";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

type Size = "thumb" | "card" | "feature" | "og";

export type MediaProps = {
  media: MediaDoc | string | number | null | undefined;
  size?: Size;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
};

/** Resolved `src`/dimensions for a Payload media doc, preferring the requested size. */
export function mediaSource(media: MediaProps["media"], size?: Size) {
  if (!media || typeof media !== "object" || !media.url) return null;
  const variant = size ? media.sizes?.[size] : null;
  const raw = variant?.url || media.url;
  // Payload prefixes local uploads with serverURL; next/image only optimises same-origin files as local paths.
  const url = raw.startsWith(`${siteUrl}/`) ? raw.slice(siteUrl.length) : raw;
  const width = (variant?.url ? variant.width : media.width) ?? 1600;
  const height = (variant?.url ? variant.height : media.height) ?? 900;
  const objectPosition =
    typeof media.focalX === "number" && typeof media.focalY === "number" ? `${media.focalX}% ${media.focalY}%` : undefined;
  return { src: url, width, height, alt: media.alt ?? "", objectPosition };
}

/** Payload media → next/image, with focal-point object positioning. Renders nothing if media isn't populated. */
export function Media({ media, size, sizes = "100vw", priority, fill, className }: MediaProps) {
  const src = mediaSource(media, size);
  if (!src) return null;
  if (fill) {
    return (
      <Image
        src={src.src}
        alt={src.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
        style={{ objectPosition: src.objectPosition }}
      />
    );
  }
  return (
    <Image
      src={src.src}
      alt={src.alt}
      width={src.width}
      height={src.height}
      sizes={sizes}
      priority={priority}
      className={cn("h-auto w-full", className)}
      style={{ objectPosition: src.objectPosition }}
    />
  );
}

export default Media;
