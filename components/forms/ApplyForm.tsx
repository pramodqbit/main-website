"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { applyForJob } from "@/app/(frontend)/careers/[slug]/actions";
import { Button } from "@/components/ds/Button";
import { Checkbox } from "@/components/ds/Checkbox";
import { FileInput } from "@/components/ds/FileInput";
import { FormField, describedBy } from "@/components/ds/FormField";
import { Honeypot } from "@/components/ds/Honeypot";
import { Input } from "@/components/ds/Input";
import { Textarea } from "@/components/ds/Textarea";
import { track } from "@/lib/analytics";
import { initialFormState } from "./types";

export type ApplyFormProps = {
  jobId: string;
  jobSlug: string;
  successMessage?: string | null;
  privacyHref?: string;
};

/** Job application form with résumé upload (server action `applyForJob`). */
export function ApplyForm({ jobId, jobSlug, successMessage, privacyHref = "/privacy" }: ApplyFormProps) {
  const [state, action, pending] = useActionState(applyForJob, initialFormState);
  const [startedAt] = useState(() => Date.now());
  const e = state.errors ?? {};
  const v = state.values ?? {};

  useEffect(() => {
    if (state.ok) track("application_submitted", { job: jobSlug });
  }, [state.ok, jobSlug]);

  if (state.ok) {
    return (
      <div role="status" className="border border-line bg-surface p-6">
        <p className="m-0 font-mono text-label uppercase text-ok">Application received</p>
        {successMessage ? <p className="mb-0 mt-3">{successMessage}</p> : null}
      </div>
    );
  }

  const field = (id: string, hint?: string) => ({
    id,
    name: id,
    defaultValue: v[id] ?? "",
    "aria-invalid": e[id] ? true : undefined,
    "aria-describedby": describedBy(id, { hint, error: e[id] }),
  });

  return (
    <form action={action} noValidate className="relative grid gap-6">
      {state.message ? (
        <p role="alert" className="border-l-2 border-danger bg-surface p-4 text-sm">
          {state.message}
        </p>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Name" htmlFor="name" required error={e.name}>
          <Input {...field("name")} required autoComplete="name" maxLength={100} />
        </FormField>
        <FormField label="Email" htmlFor="email" required error={e.email}>
          <Input {...field("email")} type="email" required autoComplete="email" />
        </FormField>
        <FormField label="Phone" htmlFor="phone" error={e.phone}>
          <Input {...field("phone")} type="tel" autoComplete="tel" maxLength={40} />
        </FormField>
        <FormField label="LinkedIn URL" htmlFor="linkedin" error={e.linkedin}>
          <Input {...field("linkedin")} type="url" inputMode="url" maxLength={300} />
        </FormField>
        <FormField label="Portfolio URL" htmlFor="portfolio" error={e.portfolio} className="md:col-span-2">
          <Input {...field("portfolio")} type="url" inputMode="url" maxLength={300} />
        </FormField>
      </div>
      <FormField label="Cover letter" htmlFor="coverLetter" error={e.coverLetter}>
        <Textarea {...field("coverLetter")} maxLength={5000} rows={6} />
      </FormField>
      <FormField label="Résumé" htmlFor="resume" required hint="PDF, DOC or DOCX, up to 5 MB." error={e.resume}>
        <FileInput
          id="resume"
          name="resume"
          aria-invalid={e.resume ? true : undefined}
          aria-describedby={describedBy("resume", { hint: "PDF, DOC or DOCX, up to 5 MB.", error: e.resume })}
          accept=".pdf,.doc,.docx"
          required
        />
      </FormField>
      <div>
        <Checkbox
          id="consent"
          name="consent"
          value="on"
          required
          aria-invalid={e.consent ? true : undefined}
          aria-describedby={e.consent ? "consent-error" : undefined}
          label={
            <>
              I agree to Qbitlog storing my application and résumé to assess it.{" "}
              <Link href={privacyHref} className="underline">
                Privacy policy
              </Link>
            </>
          }
        />
        {e.consent ? (
          <p id="consent-error" role="alert" className="mt-2 text-sm text-danger">
            {e.consent}
          </p>
        ) : null}
      </div>
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="startedAt" value={startedAt} />
      <Honeypot />
      <div>
        <Button type="submit" disabled={pending} arrow={!pending} data-cta="apply_submit">
          {pending ? "Sending…" : "Send application"}
        </Button>
      </div>
    </form>
  );
}

export default ApplyForm;
