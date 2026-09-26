/**
 * Moves locally stored uploads (media/public, media/resumes) into Vercel Blob.
 *
 * Usage:
 *   npm run media:migrate-to-blob -- --dry-run
 *   npm run media:migrate-to-blob -- --confirm
 *
 * Env (in .env.local):
 *   BLOB_READ_WRITE_TOKEN=...   # target Blob store
 *   DATABASE_URI=...            # the Payload database whose upload docs point at these files
 *
 * Each file (original + every image size) is uploaded to `<collection prefix>/<filename>`, the key the
 * storage-vercel-blob adapter resolves for a doc, and the doc gets `prefix` set to match. Filenames are
 * kept as-is (no random suffix) so existing docs and URLs keep working. Safe to re-run: uploads overwrite.
 */
import dns from "node:dns";
import { readFile } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import path from "path";
import dotenv from "dotenv";
import { put } from "@vercel/blob";
import { MongoClient, type Document } from "mongodb";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });

const mongoDns = process.env.MONGODB_DNS_SERVERS?.trim();
if (mongoDns) {
  dns.setServers(mongoDns.split(",").map((s) => s.trim()).filter(Boolean));
}

/** Mirrors payload.config.ts (collection prefix) and cms/collections (staticDir). */
const TARGETS = [
  { collection: "media", prefix: "media", dir: "media/public" },
  { collection: "resumes", prefix: "resumes", dir: "media/resumes" },
] as const;

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const confirmed = args.has("--confirm");

type FileRef = { filename: string; mimeType?: string };

function filesOf(doc: Document): FileRef[] {
  const refs: FileRef[] = [];
  if (typeof doc.filename === "string") refs.push({ filename: doc.filename, mimeType: doc.mimeType });
  for (const size of Object.values((doc.sizes ?? {}) as Record<string, Document>)) {
    if (typeof size?.filename === "string") refs.push({ filename: size.filename, mimeType: size.mimeType });
  }
  return refs;
}

async function main() {
  if (!dryRun && !confirmed) {
    console.error("Pass --dry-run to preview or --confirm to upload.");
    process.exit(1);
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const uri = process.env.DATABASE_URI?.trim();
  if (!token && !dryRun) {
    console.error("Missing BLOB_READ_WRITE_TOKEN in .env.local.");
    process.exit(1);
  }
  if (!uri) {
    console.error("Missing DATABASE_URI in .env.local.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  console.log(`${dryRun ? "[dry run] " : ""}Database: ${db.databaseName}`);

  let uploaded = 0;
  let missing = 0;
  try {
    for (const { collection, prefix, dir } of TARGETS) {
      const docs = await db.collection(collection).find({}).toArray();
      const referenced = new Set<string>();
      console.log(`\n${collection}: ${docs.length} docs`);

      for (const doc of docs) {
        for (const { filename, mimeType } of filesOf(doc)) {
          referenced.add(filename);
          const localPath = path.join(dir, filename);
          if (!existsSync(localPath)) {
            missing++;
            console.warn(`  missing locally: ${localPath} (doc ${doc._id})`);
            continue;
          }
          const key = `${prefix}/${filename}`;
          if (!dryRun) {
            await put(key, await readFile(localPath), {
              access: "public",
              addRandomSuffix: false,
              allowOverwrite: true,
              contentType: mimeType,
              token,
            });
          }
          uploaded++;
          console.log(`  ${dryRun ? "would upload" : "uploaded"} ${key}`);
        }
        if (!dryRun && doc.prefix !== prefix) {
          await db.collection(collection).updateOne({ _id: doc._id }, { $set: { prefix } });
        }
      }

      const orphans = existsSync(dir) ? readdirSync(dir).filter((f) => !referenced.has(f)) : [];
      if (orphans.length) console.log(`  ${orphans.length} local files not referenced by any doc (skipped)`);
    }
  } finally {
    await client.close();
  }

  console.log(`\n${dryRun ? "Would upload" : "Uploaded"} ${uploaded} files; ${missing} referenced files missing locally.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
