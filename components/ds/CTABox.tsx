import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Heading } from "./Heading";
import { LogLabel } from "./LogLabel";

export type CTABoxProps = {
  label?: string | null;
  title: string;
  emphasis?: string | null;
  body?: string | null;
  button: { href: string; label: string; newTab?: boolean };
  details?: { label: string; value: string }[];
  className?: string;
};

/** Closing call-to-action: pitch | "what happens next" details. */
export function CTABox({ label, title, emphasis, body, button, details = [], className }: CTABoxProps) {
  return (
    <div data-reveal="fade" className={cn("grid grid-cols-[1.3fr_1fr] border border-ink bg-surface max-[860px]:grid-cols-1", className)}>
      <div className="flex flex-col gap-5 p-12 max-[860px]:p-7">
        {label ? <LogLabel items={[label]} /> : null}
        <Heading size="h2" emphasis={emphasis} revealDelay={150} className="text-[clamp(34px,4.4vw,56px)] leading-[1.02]">
          {title}
        </Heading>
        {body ? (
          <p className="max-w-[46ch] text-[17px] text-muted" data-reveal="up" data-reveal-delay={350}>
            {body}
          </p>
        ) : null}
        <div data-reveal="up" data-reveal-delay={480}>
          <Button href={button.href} newTab={button.newTab} arrow data-cta="cta_block">
            {button.label}
          </Button>
        </div>
      </div>
      {details.length ? (
        <dl className="flex flex-col border-l border-line px-9 py-10 max-[860px]:border-t max-[860px]:border-l-0 max-[860px]:px-7 max-[860px]:py-6">
          {details.map((d, i) => (
            <div
              key={`${d.label}-${i}`}
              data-reveal="up"
              data-reveal-delay={400}
              data-reveal-stagger={100}
              className="grid grid-cols-[90px_1fr] gap-3.5 border-b border-dashed border-line py-3 text-[15px] last:border-b-0"
            >
              <dt className="pt-[3px] font-mono text-[11.5px] uppercase tracking-[.08em] text-muted">{d.label}</dt>
              <dd className={cn(d.value.includes("@") && "font-mono text-sm")}>{d.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

export default CTABox;
