import path from "path";
import dotenv from "dotenv";
import type { Payload } from "payload";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });

let cached: Payload | null = null;

/** Payload Local API for scripts. Env is loaded before the config is imported. */
export async function getSeedPayload(): Promise<Payload> {
  if (cached) return cached;
  const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../../../payload.config")]);
  cached = await getPayload({ config });
  return cached;
}
