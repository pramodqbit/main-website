import "server-only";
import type { ZodError } from "zod";

export const MIN_FILL_MS = 3000;

/** True when the submission looks automated: honeypot filled, or submitted faster than a human could. */
export function isBot(formData: FormData): boolean {
  if (String(formData.get("company_website") ?? "").trim()) return true;
  const startedAt = Number(formData.get("startedAt"));
  return !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS;
}

/** Verifies a Cloudflare Turnstile token when `TURNSTILE_SECRET_KEY` is configured; otherwise passes. */
export async function verifyTurnstile(formData: FormData): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  const token = String(formData.get("cf-turnstile-response") ?? "");
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

export function fieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function textValues(formData: FormData, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of keys) {
    const all = formData.getAll(k).filter((v): v is string => typeof v === "string");
    if (all.length) out[k] = all.join("|").slice(0, 5000);
  }
  return out;
}

export function fakeId(): string {
  return Math.random().toString(16).slice(2, 14).padEnd(12, "0");
}
