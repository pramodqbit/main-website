import type { Metadata } from "next";
import { Button } from "@/components/ds/Button";
import { Heading } from "@/components/ds/Heading";
import { LogLabel } from "@/components/ds/LogLabel";
import { Section } from "@/components/ds/Section";

export const metadata: Metadata = { title: "Not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <Section bordered={false} className="py-[160px] max-md:py-24">
      <LogLabel items={["LOG", "404"]} />
      <Heading size="h1" className="mt-5">
        This entry doesn’t exist.
      </Heading>
      <p className="mt-6 text-lg text-muted measure">The page may have moved, or the link has a typo.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/" arrow>
          Home
        </Button>
        <Button href="/work" variant="ghost">
          Work
        </Button>
        <Button href="/insights" variant="ghost">
          Insights
        </Button>
      </div>
    </Section>
  );
}
