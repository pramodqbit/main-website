import { AnnotatedMedia } from "@/components/ds/AnnotatedMedia";
import { mediaSource } from "@/components/ds/Media";
import { Section } from "@/components/ds/Section";
import type { Media, MediaAnnotatedBlock as MediaAnnotatedData } from "@/payload-types";

export function MediaAnnotatedBlock({ block }: { block: MediaAnnotatedData }) {
  const img = mediaSource(block.image as Media | null, "feature");
  if (!img) return null;
  return (
    <Section>
      <AnnotatedMedia
        image={{ src: img.src, width: img.width, height: img.height, alt: img.alt }}
        chromeLabel={block.chromeLabel}
        annotations={(block.annotations ?? []).map((a) => ({ x: a.x, y: a.y, title: a.title, note: a.note }))}
        caption={block.caption}
        sizes="(min-width: 1280px) 1200px, 100vw"
      />
    </Section>
  );
}

export default MediaAnnotatedBlock;
