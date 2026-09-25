"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { createLead } from "@/app/(frontend)/contact/actions";
import { Button } from "@/components/ds/Button";
import { Checkbox } from "@/components/ds/Checkbox";
import { FormField, describedBy } from "@/components/ds/FormField";
import { Honeypot } from "@/components/ds/Honeypot";
import { Input } from "@/components/ds/Input";
import { LogPanel } from "@/components/ds/LogPanel";
import { Select } from "@/components/ds/Select";
import { Textarea } from "@/components/ds/Textarea";
import { track } from "@/lib/analytics";
import { BUDGET_OPTIONS, SERVICE_OPTIONS, TIMELINE_OPTIONS, initialFormState } from "./types";
import { UTM_KEYS, readAttribution } from "./UtmCapture";

export type ContactFormProps = {
  replyTime?: string | null;
  privacyHref?: string;
  submitLabel?: string | null;
};

/** Contact form (server action `createLead`), replaced by a log-style confirmation on success. */
export function ContactForm({ replyTime, privacyHref = "/privacy", submitLabel }: ContactFormProps) {
  const [state, action, pending] = useActionState(createLead, initialFormState);
  const pathname = usePathname();
  const [startedAt] = useState(() => Date.now());
  const e = state.errors ?? {};
  const v = state.values ?? {};

  const submit = (formData: FormData) => {
    const attribution = readAttribution();
    for (const k of [...UTM_KEYS, "referrer"] as const) {
      const value = attribution[k];
      if (value) formData.set(k, value);
    }
    action(formData);
  };

  useEffect(() => {
    if (state.ok) track("lead_submitted", { budget: v.budget || "none", timeline: v.timeline || "none" });
  }, [state.ok, v.budget, v.timeline]);

  if (state.ok) {
    return (
      <div role="status">
        <LogPanel
          title={`ENTRY #${(state.id ?? "").slice(-6).toUpperCase()} RECEIVED`}
          status={{ label: "Logged", tone: "ok" }}
          rows={[
            { marker: "01", phase: "RECEIVED", text: "Your message is in our inbox." },
            ...(replyTime ? [{ marker: "02", phase: "NEXT", text: `We’ll reply ${replyTime}.` }] : []),
          ]}
        />
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
    <form action={submit} noValidate className="relative grid gap-6">
      {state.message ? (
        <p role="alert" className="border-l-2 border-danger bg-surface p-4 text-sm">
          {state.message}
        </p>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Name" htmlFor="name" required error={e.name}>
          <Input {...field("name")} required autoComplete="name" maxLength={100} />
        </FormField>
        <FormField label="Work email" htmlFor="email" required error={e.email}>
          <Input {...field("email")} type="email" required autoComplete="email" />
        </FormField>
        <FormField label="Company" htmlFor="company" error={e.company}>
          <Input {...field("company")} autoComplete="organization" maxLength={150} />
        </FormField>
        <FormField label="Role" htmlFor="role" error={e.role}>
          <Input {...field("role")} autoComplete="organization-title" maxLength={100} />
        </FormField>
        <FormField label="Budget" htmlFor="budget" error={e.budget}>
          <Select {...field("budget")} options={BUDGET_OPTIONS} placeholder="Select a range" />
        </FormField>
        <FormField label="Timeline" htmlFor="timeline" error={e.timeline}>
          <Select {...field("timeline")} options={TIMELINE_OPTIONS} placeholder="Select a timeline" />
        </FormField>
      </div>

      {SERVICE_OPTIONS.length ? (
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-3 font-mono text-label uppercase text-muted">What do you need help with?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {SERVICE_OPTIONS.map((o, i) => (
              <Checkbox
                key={o.value}
                id={`service-${i}`}
                name="services"
                value={o.value}
                label={o.label}
                defaultChecked={(v.services ?? "").split("|").includes(o.value)}
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      <FormField label="What are you building?" htmlFor="message" required hint="At least 20 characters." error={e.message}>
        <Textarea {...field("message", "At least 20 characters.")} required minLength={20} maxLength={5000} rows={6} />
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
              I agree to Qbitlog storing my details to reply to this enquiry.{" "}
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

      <input type="hidden" name="sourcePath" value={pathname ?? ""} />
      <input type="hidden" name="startedAt" value={startedAt} />
      <Honeypot />

      <div>
        <Button type="submit" disabled={pending} arrow={!pending} data-cta="contact_submit">
          {pending ? "Sending…" : submitLabel || "Send message"}
        </Button>
      </div>
    </form>
  );
}

export default ContactForm;
