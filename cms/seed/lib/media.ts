import fs from "fs";
import path from "path";
import type { Payload } from "payload";
import { CACHE, PUBLIC, flags, seedContext } from "./context";
import { report } from "./report";

const MAP_FILE = path.join(CACHE, "media-map.json");
let mediaMap: Record<string, string> | null = null;

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
};

function loadMap(): Record<string, string> {
  if (mediaMap) return mediaMap;
  try {
    mediaMap = JSON.parse(fs.readFileSync(MAP_FILE, "utf8")) as Record<string, string>;
  } catch {
    mediaMap = {};
  }
  return mediaMap;
}

export function saveMediaMap() {
  if (flags.dryRun) return;
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(MAP_FILE, JSON.stringify(loadMap(), null, 2));
}

/** Stable, collision-free upload name: "/images/case-studies/hytp/dash.png" → "case-studies-hytp-dash.png". */
export function uploadNameFor(source: string): string {
  const clean = source.replace(/^https?:\/\/[^/]+/, "").replace(/\?.*$/, "");
  const parts = clean.split("/").filter(Boolean);
  const file = parts.pop() ?? "file";
  const dir = parts.filter((p) => p !== "images" && p !== "free-vector").slice(-2);
  return [...dir, file].join("-").toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
}

export function isPlaceholderSvg(p: string): boolean {
  return /-(shot-\d+|avatar|mobile)\.svg$/.test(p);
}

async function findByFilename(payload: Payload, filename: string): Promise<string | null> {
  const res = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const doc = res.docs[0];
  return doc ? String(doc.id) : null;
}

async function uploadBuffer(
  payload: Payload,
  source: string,
  buffer: Buffer,
  mimetype: string,
  alt: string,
  credit?: string,
): Promise<string | null> {
  const name = uploadNameFor(source);
  const map = loadMap();
  const existing = await findByFilename(payload, name);
  if (flags.dryRun) {
    report.log("media", name, existing ? "skipped" : "created", "dry-run");
    return existing ?? null;
  }
  try {
    if (existing) {
      await payload.update({
        collection: "media",
        id: existing,
        data: { alt, ...(credit ? { credit } : {}) },
        overrideAccess: true,
        context: seedContext,
      });
      map[source] = existing;
      report.log("media", name, "skipped", "exists; alt refreshed");
      return existing;
    }
    const doc = await payload.create({
      collection: "media",
      data: { alt, ...(credit ? { credit } : {}) },
      file: { data: buffer, mimetype, name, size: buffer.length },
      overrideAccess: true,
      context: seedContext,
    });
    map[source] = String(doc.id);
    report.log("media", name, "created");
    return String(doc.id);
  } catch (err) {
    report.log("media", name, "failed", err instanceof Error ? err.message : String(err));
    return null;
  }
}

/** Upload a file from `public/` (path like "/images/…"). */
export async function uploadLocalImage(payload: Payload, publicPath: string, alt: string, credit?: string): Promise<string | null> {
  if (isPlaceholderSvg(publicPath)) {
    report.log("media", publicPath, "skipped", "generated SVG placeholder");
    return null;
  }
  const abs = path.join(PUBLIC, publicPath.replace(/^\//, ""));
  if (!fs.existsSync(abs)) {
    report.log("media", publicPath, "skipped", "file not found");
    return null;
  }
  const mimetype = MIME[path.extname(abs).toLowerCase()] ?? "application/octet-stream";
  return uploadBuffer(payload, publicPath, fs.readFileSync(abs), mimetype, alt, credit);
}

/** Download and upload a remote image. Failures are logged; the caller continues without an image. */
export async function uploadRemoteImage(payload: Payload, url: string, alt: string, credit: string): Promise<string | null> {
  const known = await findByFilename(payload, uploadNameFor(url));
  if (known) {
    loadMap()[url] = known;
    report.log("media", uploadNameFor(url), "skipped", "exists");
    return known;
  }
  try {
    // Redirects are followed by hand: the Freepik CDN now 301s to another host and the
    // Local API runtime's fetch doesn't always follow it.
    let target = url;
    let res = await fetch(target, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0 (qbitlog-seed)" } });
    for (let hop = 0; hop < 5 && res.status >= 300 && res.status < 400; hop++) {
      const next = res.headers.get("location");
      if (!next) break;
      target = new URL(next, target).toString();
      res = await fetch(target, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0 (qbitlog-seed)" } });
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const type = res.headers.get("content-type")?.split(";")[0] ?? MIME[path.extname(url).toLowerCase()] ?? "image/jpeg";
    return uploadBuffer(payload, url, buf, type, alt, credit);
  } catch (err) {
    // Not a failure: the post imports without its image (Phase 4 §4.3).
    report.log("media", url, "skipped", `download failed, imported without image: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

/** Media id previously uploaded for a legacy path or URL (looked up in the database). */
export async function mediaIdFor(payload: Payload, source: string | undefined | null): Promise<string | null> {
  if (!source) return null;
  const id = await findByFilename(payload, uploadNameFor(source));
  if (id) loadMap()[source] = id;
  return id;
}
