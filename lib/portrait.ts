import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { Media } from "@/payload-types";

/** Dots per side of a portrait. Must match `DotPortrait`. */
export const PORTRAIT_GRID = 48;

/** Mirrors payload.config.ts (Blob prefix) and cms/collections/Media.ts (staticDir). */
const BLOB_PREFIX = "media";
const LOCAL_DIR = "media/public";

const cache = new Map<string, Promise<string | null>>();

/** Public store URL, built the same way as @payloadcms/storage-vercel-blob (store id from the token). */
function blobBaseUrl(): string | null {
  if (process.env.STORAGE_VERCEL_BLOB_BASE_URL) return process.env.STORAGE_VERCEL_BLOB_BASE_URL;
  const storeId = process.env.BLOB_READ_WRITE_TOKEN?.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase();
  return storeId ? `https://${storeId}.public.blob.vercel-storage.com` : null;
}

async function readImage(media: Media): Promise<Buffer | null> {
  /* The 480px "thumb" is plenty for a 48×48 grid; fall back to the original. */
  const filename = media.sizes?.thumb?.filename || media.filename;
  if (!filename) return null;
  const base = blobBaseUrl();
  if (base) {
    /* Same key as the storage adapter: <prefix>/<_objectKey>/<filename>. Uploads made before Payload
       added _objectKey (and the migrated files) have no object-key folder. */
    const folder = [media.prefix || BLOB_PREFIX, media._objectKey].filter(Boolean).join("/");
    const res = await fetch(`${base}/${folder}/${encodeURIComponent(filename)}`);
    if (!res.ok) throw new Error(`Blob responded ${res.status} for ${folder}/${filename}`);
    return Buffer.from(await res.arrayBuffer());
  }
  return fs.readFile(path.join(process.cwd(), LOCAL_DIR, filename));
}

/**
 * The square to draw, so the face fills the portrait instead of a jacket or the background.
 * - Focal point set in the media editor (anything but the default centre): a head-and-shoulders
 *   square around it, the face 40% from the top.
 * - Tall photos without one: the upper part, where the head usually is.
 * - Otherwise null: sharp's attention crop picks the square.
 */
function faceSquare(media: Media, w: number, h: number) {
  if (!w || !h) return null;
  const fx = media.focalX ?? 50;
  const fy = media.focalY ?? 50;
  const clamp = (v: number, max: number) => Math.round(Math.min(max, Math.max(0, v)));
  if (fx !== 50 || fy !== 50) {
    const side = Math.round(Math.min(w, h) * 0.62);
    return { left: clamp((fx / 100) * w - side / 2, w - side), top: clamp((fy / 100) * h - side * 0.4, h - side), width: side, height: side };
  }
  if (h > w * 1.15) {
    const side = Math.round(w * 0.85);
    return { left: clamp((w - side) / 2, w - side), top: clamp(h * 0.02, h - side), width: side, height: side };
  }
  return null;
}

async function toDots(media: Media): Promise<string | null> {
  const input = await readImage(media);
  if (!input) return null;
  const rotated = await sharp(input).rotate().toBuffer();
  const { width: w = 0, height: h = 0 } = await sharp(rotated).metadata();
  const square = faceSquare(media, w, h);
  const img = sharp(rotated);
  const { data } = await (square ? img.extract(square) : img)
    .resize(PORTRAIT_GRID, PORTRAIT_GRID, { fit: "cover", position: sharp.strategy.attention })
    .greyscale()
    .normalise()
    .raw()
    .toBuffer({ resolveWithObject: true });
  /* One hex digit per dot: 0 = paper, f = full ink (darkness, not brightness). */
  let out = "";
  for (let i = 0; i < PORTRAIT_GRID * PORTRAIT_GRID; i++) out += (15 - (data[i] >> 4)).toString(16);
  return out;
}

/**
 * A team photo reduced to a 48×48 grid of dot strengths on the server. Only this string reaches the
 * browser, never the photo itself, so the team can be shown without publishing their faces.
 * Returns null (the card falls back to a generated pattern) when there is no photo or it can't be read.
 */
export function portraitDots(photo: Media | string | null | undefined): Promise<string | null> {
  if (!photo || typeof photo !== "object" || !photo.mimeType?.startsWith("image/")) return Promise.resolve(null);
  const key = `${photo.id}:${photo.updatedAt}`;
  let hit = cache.get(key);
  if (!hit) {
    hit = toDots(photo).catch((err) => {
      console.error(`[portrait] could not read media ${photo.id}:`, err instanceof Error ? err.message : err);
      cache.delete(key); // retry on the next render instead of remembering the failure
      return null;
    });
    cache.set(key, hit);
  }
  return hit;
}
