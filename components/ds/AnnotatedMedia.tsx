import Image from "next/image";
import { cn } from "@/lib/utils";
import { TiltFrame } from "@/components/motion/TiltFrame";
import { Pin } from "./Pin";

export type Annotation = { x: number; y: number; title: string; note?: string | null };

export type AnnotatedMediaProps = {
  image: { src: string; width: number; height: number; alt: string };
  chromeLabel?: string | null;
  annotations?: Annotation[];
  variant?: "showcase" | "inline";
  tilt?: boolean;
  priority?: boolean;
  sizes?: string;
  caption?: string | null;
  className?: string;
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function idFor(src: string) {
  let h = 0;
  for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) | 0;
  return `am${Math.abs(h).toString(36)}`;
}

/** Screenshot in a browser-chrome frame with lettered pins and a notes list. */
export function AnnotatedMedia({
  image,
  chromeLabel,
  annotations = [],
  variant = "inline",
  tilt,
  priority,
  sizes = "100vw",
  caption,
  className,
}: AnnotatedMediaProps) {
  const base = idFor(`${image.src}-${chromeLabel ?? ""}`);
  const showcase = variant === "showcase";

  const frame = (
    <figure className={cn("m-0 border border-line bg-surface", showcase && "mx-auto max-w-[1400px] shadow-frame")}>
      <div className="flex items-center gap-2 border-b border-line px-3.5 py-[11px]">
        <span aria-hidden="true" className="size-[9px] rounded-full bg-line" />
        <span aria-hidden="true" className="size-[9px] rounded-full bg-line" />
        <span aria-hidden="true" className="size-[9px] rounded-full bg-line" />
        {chromeLabel ? <span className="ml-3.5 truncate font-mono text-xs text-muted">{chromeLabel}</span> : null}
      </div>
      <div className="relative">
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          sizes={sizes}
          priority={priority}
          className="block h-auto w-full"
        />
        {annotations.map((a, i) => (
          <button
            key={`${a.title}-${i}`}
            type="button"
            aria-describedby={`${base}-n${i}`}
            aria-label={`Annotation ${LETTERS[i]}`}
            className="absolute z-[2] -translate-1/2 cursor-default rounded-full"
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
          >
            <Pin letter={LETTERS[i]} size="lg" className="relative pin-ring" />
          </button>
        ))}
      </div>
      {caption ? <figcaption className="border-t border-line px-3.5 py-2.5 text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );

  return (
    <div className={cn("min-w-0", className)}>
      {tilt ? <TiltFrame>{frame}</TiltFrame> : frame}
      {annotations.length ? (
        <ol
          className={cn(
            "mt-10 grid grid-cols-3 border-t border-line max-[860px]:grid-cols-1",
            showcase && "mx-auto max-w-[1400px]",
          )}
        >
          {annotations.map((a, i) => (
            <li
              key={`${a.title}-${i}`}
              id={`${base}-n${i}`}
              className="grid grid-cols-[30px_1fr] gap-3.5 pt-[22px] pr-6 text-[15.5px] [&+&]:border-l [&+&]:border-line [&+&]:pl-6 max-[860px]:pr-0 max-[860px]:pt-[18px] max-[860px]:[&+&]:border-l-0 max-[860px]:[&+&]:pl-0"
            >
              <Pin letter={LETTERS[i]} />
              <span>
                {a.title}
                {a.note ? <em className="mt-1 block font-serif text-muted">{a.note}</em> : null}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export default AnnotatedMedia;
