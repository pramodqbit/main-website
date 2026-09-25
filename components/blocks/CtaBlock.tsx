import { CTABox } from "@/components/ds/CTABox";
import { Section } from "@/components/ds/Section";
import { resolveLink } from "@/lib/links";
import { getSiteSettings } from "@/lib/queries/globals";
import type { CtaBlock as CtaData } from "@/payload-types";

export type CtaContent = {
  label?: string | null;
  title: string;
  emphasis?: string | null;
  body?: string | null;
  button?: CtaData["button"];
  details?: CtaData["details"];
};

/** Booking button from Site Settings, falling back to /contact. */
export async function bookingButton() {
  const settings = await getSiteSettings();
  return settings?.bookingUrl
    ? { href: settings.bookingUrl, label: "Book a scoping call", newTab: true }
    : { href: "/contact", label: "Book a scoping call", newTab: false };
}

export async function CtaSection({ content }: { content: CtaContent }) {
  const button = resolveLink(content.button) ?? (await bookingButton());
  return (
    <Section id="contact" bordered={false}>
      <CTABox
        label={content.label}
        title={content.title}
        emphasis={content.emphasis}
        body={content.body}
        button={button}
        details={(content.details ?? []).map((d) => ({ label: d.label, value: d.value }))}
      />
    </Section>
  );
}

export function CtaBlock({ block }: { block: CtaData }) {
  return <CtaSection content={block} />;
}

export default CtaBlock;
