import Link from "next/link";
import { AnnotatedMedia } from "@/components/ds/AnnotatedMedia";
import { Heading } from "@/components/ds/Heading";
import { LogLabel } from "@/components/ds/LogLabel";
import { mediaSource } from "@/components/ds/Media";
import { populated } from "@/lib/content";
import type { Media, ShowcaseBlock as ShowcaseData } from "@/payload-types";

/** Large tilted product screenshot with lettered pins and notes. */
export function ShowcaseBlock({ block, priority }: { block: ShowcaseData; priority?: boolean }) {
  const img = mediaSource(block.image as Media | null, "feature");
  if (!img) return null;
  const cs = populated(block.caseStudy) ? block.caseStudy : null;
  const labels = (block.label ?? "").split("/").map((s) => s.trim()).filter(Boolean);
  return (
    <section className="overflow-hidden border-b border-line py-24 max-md:py-16">
      <div className="wrap">
        <div className="mb-16 grid grid-cols-[1fr_minmax(0,420px)] items-end gap-10 max-[860px]:mb-10 max-[860px]:grid-cols-1 max-[860px]:gap-5">
          <div>
            {labels.length ? <LogLabel items={labels} /> : null}
            <Heading
              as="h2"
              size="h1"
              emphasis={block.emphasis}
              className="mt-[18px] text-[clamp(40px,5.6vw,84px)] leading-[.98] tracking-[-0.03em]"
            >
              {block.title}
            </Heading>
          </div>
          {block.intro || cs ? (
            <div className="text-[17px] text-muted">
              {block.intro ? <p className="m-0">{block.intro}</p> : null}
              {cs ? (
                <Link href={`/work/${cs.slug}`} className="mt-3 inline-block font-mono text-sm text-brand underline-offset-[3px] hover:underline">
                  Read the case study <span aria-hidden="true">→</span>
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
        <AnnotatedMedia
          image={{ src: img.src, width: img.width, height: img.height, alt: img.alt }}
          chromeLabel={block.chromeLabel}
          annotations={(block.annotations ?? []).map((a) => ({ x: a.x, y: a.y, title: a.title, note: a.note }))}
          variant="showcase"
          tilt={block.tilt !== false}
          priority={priority}
          sizes="(min-width: 1440px) 1400px, 100vw"
        />
      </div>
    </section>
  );
}

export default ShowcaseBlock;
