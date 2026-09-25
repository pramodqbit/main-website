"use server";

import { z } from "zod";
import type { FormState } from "@/components/forms/types";
import { fakeId, fieldErrors, isBot, textValues, verifyTurnstile } from "@/lib/forms";
import { getPayloadClient } from "@/lib/payload";
import { slugifyText } from "@/lib/site";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const url = z
  .string()
  .trim()
  .max(300)
  .optional()
  .transform((v) => v || undefined)
  .refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), "Please enter a full URL starting with https://");

const schema = z.object({
  jobId: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Keep this under 100 characters."),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => v || undefined),
  linkedin: url,
  portfolio: url,
  coverLetter: z
    .string()
    .trim()
    .max(5000, "Keep this under 5,000 characters.")
    .optional()
    .transform((v) => v || undefined),
  consent: z.literal("on", { message: "Please agree so we can review your application." }),
});

const TEXT_KEYS = ["name", "email", "phone", "linkedin", "portfolio", "coverLetter"];

export async function applyForJob(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = textValues(formData, TEXT_KEYS);
  if (isBot(formData)) return { ok: true, id: fakeId() };
  if (!(await verifyTurnstile(formData))) {
    return { ok: false, values, message: "We couldn't verify this submission. Please try again." };
  }

  const str = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v : undefined;
  };
  const parsed = schema.safeParse({
    jobId: str("jobId") ?? "",
    name: str("name") ?? "",
    email: str("email") ?? "",
    phone: str("phone"),
    linkedin: str("linkedin"),
    portfolio: str("portfolio"),
    coverLetter: str("coverLetter"),
    consent: str("consent"),
  });
  const errors = parsed.success ? {} : fieldErrors(parsed.error);

  const file = formData.get("resume");
  let ext: string | undefined;
  if (!(file instanceof File) || file.size === 0) errors.resume = "Please attach your résumé.";
  else if (file.size > MAX_BYTES) errors.resume = "Your résumé must be 5 MB or smaller.";
  else if (!(ext = ALLOWED[file.type])) errors.resume = "Please upload a PDF, DOC or DOCX file.";

  if (!parsed.success || Object.keys(errors).length || !(file instanceof File) || !ext) {
    return { ok: false, values, errors, message: "Please fix the highlighted fields." };
  }

  const d = parsed.data;
  try {
    const payload = await getPayloadClient();
    const job = await payload.findByID({ collection: "jobs", id: d.jobId, depth: 0, overrideAccess: true }).catch(() => null);
    if (!job || job.status !== "open") {
      return { ok: false, values, message: "This role is no longer accepting applications." };
    }

    const safeName = `${slugifyText(d.name) || "applicant"}-${Date.now()}.${ext}`;
    const resume = await payload.create({
      collection: "resumes",
      overrideAccess: true,
      data: {},
      file: { data: Buffer.from(await file.arrayBuffer()), mimetype: file.type, name: safeName, size: file.size },
    });
    const application = await payload.create({
      collection: "applications",
      overrideAccess: true,
      data: {
        job: job.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        linkedin: d.linkedin,
        portfolio: d.portfolio,
        coverLetter: d.coverLetter,
        resume: resume.id,
        consent: true,
      },
    });
    return { ok: true, id: String(application.id) };
  } catch {
    console.error("[careers] application could not be saved");
    return { ok: false, values, message: "Something went wrong on our side. Please try again." };
  }
}
