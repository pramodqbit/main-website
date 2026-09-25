"use server";

import { z } from "zod";
import type { FormState } from "@/components/forms/types";
import { fakeId, fieldErrors, isBot, textValues, verifyTurnstile } from "@/lib/forms";
import { getPayloadClient } from "@/lib/payload";

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .optional()
    .transform((v) => v || undefined);

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Keep this under 100 characters."),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  company: optional(150),
  role: optional(100),
  budget: z.enum(["<25k", "25-50k", "50-100k", "100k+", "unsure"]).optional().catch(undefined),
  timeline: z.enum(["asap", "1-3m", "3-6m", "exploring"]).optional().catch(undefined),
  services: z.array(z.enum(["web", "mobile", "ai", "design", "cloud", "other"])).max(6).catch([]),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a bit more (at least 20 characters).")
    .max(5000, "Keep this under 5,000 characters."),
  consent: z.literal("on", { message: "Please agree so we can reply to you." }),
  sourcePath: optional(300),
  referrer: optional(500),
  utm_source: optional(200),
  utm_medium: optional(200),
  utm_campaign: optional(200),
  utm_term: optional(200),
  utm_content: optional(200),
});

const TEXT_KEYS = ["name", "email", "company", "role", "budget", "timeline", "services", "message"];

export async function createLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = textValues(formData, TEXT_KEYS);
  if (isBot(formData)) return { ok: true, id: fakeId(), values };
  if (!(await verifyTurnstile(formData))) {
    return { ok: false, values, message: "We couldn't verify this submission. Please try again." };
  }

  const str = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v : undefined;
  };
  const parsed = schema.safeParse({
    name: str("name") ?? "",
    email: str("email") ?? "",
    company: str("company"),
    role: str("role"),
    budget: str("budget") || undefined,
    timeline: str("timeline") || undefined,
    services: formData.getAll("services").filter((v): v is string => typeof v === "string"),
    message: str("message") ?? "",
    consent: str("consent"),
    sourcePath: str("sourcePath"),
    referrer: str("referrer"),
    utm_source: str("utm_source"),
    utm_medium: str("utm_medium"),
    utm_campaign: str("utm_campaign"),
    utm_term: str("utm_term"),
    utm_content: str("utm_content"),
  });
  if (!parsed.success) {
    return { ok: false, values, errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  }

  const d = parsed.data;
  try {
    const payload = await getPayloadClient();
    const lead = await payload.create({
      collection: "leads",
      overrideAccess: true,
      data: {
        name: d.name,
        email: d.email,
        company: d.company,
        role: d.role,
        budget: d.budget,
        timeline: d.timeline,
        services: d.services,
        message: d.message,
        consent: true,
        sourcePath: d.sourcePath,
        referrer: d.referrer,
        utm: {
          source: d.utm_source,
          medium: d.utm_medium,
          campaign: d.utm_campaign,
          term: d.utm_term,
          content: d.utm_content,
        },
      },
    });
    return { ok: true, id: String(lead.id), values: { budget: d.budget ?? "", timeline: d.timeline ?? "" } };
  } catch {
    console.error("[contact] lead could not be saved");
    return { ok: false, values, message: "Something went wrong on our side. Please try again, or email us directly." };
  }
}
