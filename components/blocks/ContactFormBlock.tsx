import type { ReactNode } from "react";
import { Button } from "@/components/ds/Button";
import { MonoLabel } from "@/components/ds/MonoLabel";
import { Section } from "@/components/ds/Section";
import { getSiteSettings } from "@/lib/queries/globals";
import type { ContactFormBlock as ContactFormData } from "@/payload-types";
import { LazyContactForm } from "@/components/forms/LazyContactForm";
import { SectionHeader } from "./SectionHeader";

/** Contact form beside the studio's contact details from Site Settings. */
export async function ContactFormBlock({ block }: { block: ContactFormData }) {
  const settings = await getSiteSettings();
  const contact = settings?.contact;
  const replyTime = contact?.replyTime ?? null;

  const rows: { label: string; value: ReactNode }[] = [];
  if (contact?.email) rows.push({ label: "Email", value: <span className="font-mono text-sm">{contact.email}</span> });
  if (contact?.timezoneNote) rows.push({ label: "Hours", value: contact.timezoneNote });
  if (replyTime) rows.push({ label: "Reply", value: replyTime });
  if (contact?.phone) rows.push({ label: "Phone", value: contact.phone });
  if (contact?.address) rows.push({ label: "Office", value: contact.address });

  return (
    <Section>
      <SectionHeader data={block} as="h1" />
      <div className="grid grid-cols-[1.4fr_1fr] gap-12 max-[980px]:grid-cols-1">
        <LazyContactForm replyTime={replyTime} />
        <aside aria-label="Contact details" className="self-start border border-line bg-surface p-8" data-reveal="up" data-reveal-delay={300}>
          <MonoLabel as="h2" tone="ink">
            What happens next
          </MonoLabel>
          <dl className="m-0 mt-4">
            {rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[80px_1fr] gap-3.5 border-b border-dashed border-line py-3 last:border-b-0">
                <dt className="pt-0.5 font-mono text-[11.5px] uppercase tracking-[.08em] text-muted">{r.label}</dt>
                <dd className="m-0 text-[15px]">{r.value}</dd>
              </div>
            ))}
          </dl>
          {block.showBooking !== false && settings?.bookingUrl ? (
            <div className="mt-6">
              <Button href={settings.bookingUrl} newTab variant="ghost" arrow data-cta="contact_booking">
                Book a scoping call
              </Button>
            </div>
          ) : null}
        </aside>
      </div>
    </Section>
  );
}

export default ContactFormBlock;
