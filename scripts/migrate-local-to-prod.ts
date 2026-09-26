/**
 * Full MongoDB copy: local Payload database → production (e.g. Atlas).
 *
 * Usage:
 *   npm run db:migrate:local-to-prod -- --dry-run
 *   npm run db:migrate:local-to-prod -- --confirm
 *
 * Env (in .env.local):
 *   LOCAL_DATABASE_URI=mongodb://127.0.0.1:27017/qbitlog   # source
 *   DATABASE_URI or PROD_DATABASE_URI=...                    # target (Atlas)
 *
 * Does not copy Vercel Blob / S3 files — only DB documents (media URLs must still resolve in prod).
 */
import dns from "node:dns";
import path from "path";
import dotenv from "dotenv";
import { MongoClient, type Collection, type Db, type Document } from "mongodb";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });

/** Some networks refuse SRV lookups from Node (querySrv ECONNREFUSED); public DNS fixes Atlas `mongodb+srv://`. */
const mongoDns = process.env.MONGODB_DNS_SERVERS?.trim();
if (mongoDns) {
  dns.setServers(mongoDns.split(",").map((s) => s.trim()).filter(Boolean));
}

const DEFAULT_LOCAL = "mongodb://127.0.0.1:27017/qbitlog";
const BATCH = 500;

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const confirmed = args.has("--confirm");
const dropTarget = args.has("--drop-target");

function isLocalMongoUri(uri: string): boolean {
  return /^mongodb:\/\/(127\.0\.0\.1|localhost|mongo)(:\d+)?\//i.test(uri);
}

function isRemoteMongoUri(uri: string): boolean {
  return /^mongodb(\+srv)?:\/\//i.test(uri) && !isLocalMongoUri(uri);
}

function maskUri(uri: string): string {
  return uri.replace(/\/\/([^:@/]+):([^@/]+)@/i, "//$1:***@");
}

function resolveUris(): { source: string; target: string } {
  const source =
    process.env.LOCAL_DATABASE_URI?.trim() ||
    process.env.SOURCE_DATABASE_URI?.trim() ||
    DEFAULT_LOCAL;
  const target =
    process.env.PROD_DATABASE_URI?.trim() ||
    process.env.ATLAS_DATABASE_URI?.trim() ||
    process.env.DATABASE_URI?.trim() ||
    "";

  if (!target) {
    console.error("Missing target URI. Set PROD_DATABASE_URI, ATLAS_DATABASE_URI, or DATABASE_URI in .env.local.");
    process.exit(1);
  }
  if (source === target) {
    console.error("Source and target URIs are identical. Set LOCAL_DATABASE_URI for the local database.");
    process.exit(1);
  }
  if (!isLocalMongoUri(source)) {
    console.error(
      `Refusing: source must be local MongoDB (got ${maskUri(source)}). Set LOCAL_DATABASE_URI=mongodb://127.0.0.1:27017/qbitlog`,
    );
    process.exit(1);
  }
  if (!isRemoteMongoUri(target)) {
    console.error(
      `Refusing: target must be a remote URI (Atlas / mongodb+srv). Got ${maskUri(target)}. Use PROD_DATABASE_URI or DATABASE_URI.`,
    );
    process.exit(1);
  }
  return { source, target };
}

async function collectionStats(db: Db, name: string): Promise<number> {
  return db.collection(name).countDocuments();
}

async function copyIndexes(source: Collection, target: Collection): Promise<void> {
  const indexes = await source.indexes();
  for (const spec of indexes) {
    if (spec.name === "_id_") continue;
    const { key, name, v, ...rest } = spec;
    await target.createIndex(key, { ...rest, name });
  }
}

async function copyCollection(source: Collection, target: Collection, drop: boolean): Promise<number> {
  if (drop) {
    await target.drop().catch(() => undefined);
  } else {
    await target.deleteMany({});
  }

  let copied = 0;
  const cursor = source.find({});
  let batch: Document[] = [];

  for await (const doc of cursor) {
    batch.push(doc);
    if (batch.length >= BATCH) {
      await target.insertMany(batch, { ordered: false });
      copied += batch.length;
      batch = [];
    }
  }
  if (batch.length) {
    await target.insertMany(batch, { ordered: false });
    copied += batch.length;
  }

  await copyIndexes(source, target);
  return copied;
}

async function main() {
  const { source, target } = resolveUris();

  console.log("Payload DB migration (local → prod)");
  console.log(`  Source: ${maskUri(source)}`);
  console.log(`  Target: ${maskUri(target)}`);
  if (dropTarget) console.log("  Mode: drop each collection on target before copy");
  if (dryRun) console.log("  Dry run — no writes");

  const sourceClient = new MongoClient(source);
  const targetClient = dryRun ? null : new MongoClient(target);

  try {
    await sourceClient.connect();
    if (targetClient) await targetClient.connect();

    const sourceDb = sourceClient.db();
    const targetDb = targetClient?.db();

    const collections = (await sourceDb.listCollections().toArray())
      .map((c) => c.name)
      .filter((n) => !n.startsWith("system."))
      .sort();

    if (!collections.length) {
      console.error("Source database has no collections. Is local Mongo running and seeded?");
      process.exit(1);
    }

    console.log(`\nCollections on source (${sourceDb.databaseName}):`);
    let totalDocs = 0;
    for (const name of collections) {
      const n = await collectionStats(sourceDb, name);
      totalDocs += n;
      console.log(`  ${name}: ${n} document(s)`);
    }
    console.log(`  Total: ${totalDocs} document(s)\n`);

    if (dryRun) {
      console.log("Dry run complete. Re-run with --confirm to copy to Atlas.");
      return;
    }

    if (!confirmed) {
      console.error(
        "Refusing to write: pass --confirm to copy all collections to the target database (destructive for existing target data).",
      );
      process.exit(1);
    }

    if (!targetDb) throw new Error("Target database client missing");

    for (const name of collections) {
      process.stdout.write(`Copying ${name}… `);
      const n = await copyCollection(sourceDb.collection(name), targetDb.collection(name), dropTarget);
      console.log(`${n} document(s)`);
    }

    console.log("\nDone. Next steps:");
    console.log("  1. Set the same PAYLOAD_SECRET on Vercel as in local (or re-create admin users).");
    console.log("  2. Ensure BLOB_READ_WRITE_TOKEN / S3 env vars match where media files live.");
    console.log("  3. npm run seed:verify  (with DATABASE_URI pointing at Atlas)");
  } finally {
    await sourceClient.close().catch(() => undefined);
    await targetClient?.close().catch(() => undefined);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
