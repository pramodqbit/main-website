import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Media } from "@/payload-types";
import { absoluteUrl } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/* The image renderer can't read CSS variables, so these mirror the light-theme tokens in globals.css. */
const PAPER = "#F1F2EE";
const INK = "#121418";
const MUTED = "#5A5F67";
const DOT = "#C6C9C1";
const BRAND = "#5B2BE0";
const SIGNAL = "#A95F00";

const FONT_DIR = join(process.cwd(), "app", "(frontend)", "_og", "fonts");

async function fonts() {
  const [serif, mono] = await Promise.all([
    readFile(join(FONT_DIR, "source-serif-4-latin-400-normal.woff")),
    readFile(join(FONT_DIR, "geist-mono-latin-400-normal.woff")),
  ]);
  return [
    { name: "Source Serif 4", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

/** Editor-set `meta.image` as a data URI, or null when missing or in a format the renderer can't draw (e.g. WebP). */
async function editorImage(image: Media | string | number | null | undefined): Promise<string | null> {
  if (!image || typeof image !== "object") return null;
  const src = image.sizes?.og?.url || image.url;
  if (!src) return null;
  try {
    const res = await fetch(absoluteUrl(src));
    const type = res.headers.get("content-type")?.split(";")[0] ?? "";
    if (!res.ok || !/^image\/(png|jpeg)$/.test(type)) return null;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

const DOT_GAP = 30;
const COLS = Math.ceil(OG_SIZE.width / DOT_GAP);
const ROWS = Math.ceil(OG_SIZE.height / DOT_GAP);

function DotGrid() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 14 }}>
      {Array.from({ length: ROWS }, (_, r) => (
        <div key={r} style={{ display: "flex", height: DOT_GAP }}>
          {Array.from({ length: COLS }, (_, c) => (
            <div key={c} style={{ width: DOT_GAP, display: "flex" }}>
              <div style={{ width: 2, height: 2, borderRadius: 1, background: DOT }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export type OgArgs = {
  label: Array<string | null | undefined>;
  title: string;
  metric?: string | null;
  metaImage?: Media | string | number | null;
};

export async function renderOg({ label, title, metric, metaImage }: OgArgs): Promise<ImageResponse> {
  const override = await editorImage(metaImage);
  if (override) {
    return new ImageResponse(
      // eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only
      <img src={override} alt="" width={OG_SIZE.width} height={OG_SIZE.height} style={{ objectFit: "cover" }} />,
      OG_SIZE,
    );
  }

  const line = label.filter(Boolean).join("  /  ").toUpperCase();
  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: PAPER, color: INK }}>
        <DotGrid />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Geist Mono", fontSize: 22, letterSpacing: 2 }}>
            <div style={{ width: 18, height: 18, background: BRAND }} />
            QBITLOG
          </div>
          <div style={{ display: "flex", marginTop: "auto", fontFamily: "Geist Mono", fontSize: 20, letterSpacing: 2, color: MUTED }}>
            {line}
          </div>
          <div
            style={{
              display: "block",
              marginTop: 20,
              maxWidth: 980,
              fontFamily: "Source Serif 4",
              fontSize: 64,
              lineHeight: 1.1,
              lineClamp: 2,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", minHeight: 28, marginTop: 28, fontFamily: "Geist Mono", fontSize: 24, color: SIGNAL }}>
            {metric ?? ""}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
