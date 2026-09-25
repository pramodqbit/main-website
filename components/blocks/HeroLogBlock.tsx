import { Button } from "@/components/ds/Button";
import { Heading } from "@/components/ds/Heading";
import { LogLabel } from "@/components/ds/LogLabel";
import { LogPanel, type LogPanelRow } from "@/components/ds/LogPanel";
import { MonoLabel } from "@/components/ds/MonoLabel";
import { ProofStrip } from "@/components/ds/ProofStrip";
import { HERO_INTRO_DEFAULT_LINES } from "@/cms/blocks/heroIntroDefaults";
import { IntroLog } from "@/components/motion/IntroLog";
import { LazyBitField } from "@/components/motion/LazyBitField";
import { featuredMetrics, populated, toMetric } from "@/lib/content";
import { resolveLink } from "@/lib/links";
import { getSiteSettings } from "@/lib/queries/globals";
import { slugifyText } from "@/lib/site";
import type { CaseStudy, HeroLogBlock as HeroLogData, ProofStripBlock as ProofStripData } from "@/payload-types";

type Props = { block: HeroLogData; proofStrip?: ProofStripData | null };

function metricText(m: { value: string; unit?: string | null; label: string }) {
  return (
    <>
      <b className="font-medium text-signal">
        {m.value}
        {m.unit}
      </b>{" "}
      {m.label.toLowerCase()}
    </>
  );
}

function rowsFromCaseStudy(cs: CaseStudy): LogPanelRow[] | null {
  const decisions = (cs.decisions ?? []).slice(0, 2);
  if (!decisions.length) return null;
  const phases = ["DISCOVER", "DECIDE"];
  const rows: LogPanelRow[] = decisions.map((d, i) => ({
    marker: `0${i + 1}`,
    phase: phases[i],
    text: i === 0 ? d.problem : d.decision,
  }));
  const metrics = featuredMetrics(cs, 3);
  if (metrics.length) {
    rows.push({
      marker: `0${rows.length + 1}`,
      phase: "MEASURE",
      measured: true,
      text: (
        <>
          {metrics.map((m, i) => (
            <span key={m.id ?? i}>
              {i > 0 ? " · " : null}
              {metricText(m)}
            </span>
          ))}
        </>
      ),
    });
  }
  return rows;
}

/** Hero with display headline, CTAs, trust items and a project log panel over the interactive bit field. */
export async function HeroLogBlock({ block, proofStrip }: Props) {
  const settings = await getSiteSettings();
  const cs = block.logSource !== "manual" && populated(block.caseStudy) ? block.caseStudy : null;
  const manual = block.manualLog;

  const manualRows: LogPanelRow[] = (manual?.rows ?? []).map((r, i) => ({
    marker: r.marker || `0${i + 1}`,
    phase: r.phase ?? "",
    text: r.text,
    measured: r.measured,
  }));
  const csRows = cs ? rowsFromCaseStudy(cs) : null;
  const useCs = Boolean(cs && csRows);
  const rows = useCs ? (csRows as LogPanelRow[]) : manualRows;

  const clientSlug = cs ? slugifyText(cs.client) : "";
  const panelTitle = useCs && cs ? `${clientSlug} / ${cs.slug}` : manual?.title || "";
  const footerLink = resolveLink(manual?.footerLink);
  const footer =
    useCs && cs
      ? {
          left: [cs.durationWeeks ? `${cs.durationWeeks} weeks` : null, cs.teamSize ? `${cs.teamSize} engineers` : null]
            .filter(Boolean)
            .join(" · "),
          link: { href: `/work/${cs.slug}`, label: "Read the full log" },
        }
      : manual?.footerLeft || footerLink
        ? { left: manual?.footerLeft ?? "", link: footerLink ? { href: footerLink.href, label: footerLink.label } : null }
        : null;

  const primary =
    resolveLink(block.primaryCta) ??
    (settings?.bookingUrl ? { href: settings.bookingUrl, label: "Book a scoping call", newTab: true } : { href: "/contact", label: "Book a scoping call", newTab: false });
  const secondary = resolveLink(block.secondaryCta);

  const proofItems = proofStrip?.items?.length
    ? proofStrip.items.map((m) => toMetric(m, { size: "lg", countUp: true }))
    : cs
      ? featuredMetrics(cs, 4).map((m) => toMetric(m, { size: "lg", countUp: true }))
      : [];

  const showBits = block.showBitField !== false;
  /* Hero blocks saved before the intro fields existed have no `intro` data: use the defaults. */
  const savedLines = block.intro?.lines;
  const introLines = (savedLines == null ? HERO_INTRO_DEFAULT_LINES : savedLines)
    .filter((l) => l.label && l.text)
    .map((l) => ({ label: l.label, text: l.text }));
  const showIntro = block.intro?.enabled !== false && introLines.length > 0;

  return (
    <section data-bitfield-host="" className="relative overflow-hidden pt-[104px] max-md:pt-20">
      {showIntro ? <IntroLog lines={introLines} /> : null}
      {showBits ? (
        <>
          <div aria-hidden="true" className="absolute inset-0 dotgrid bits-mask [[data-bitfield-host]:has(canvas)_&]:hidden" />
          <LazyBitField variant="field" />
          <MonoLabel className="absolute right-[clamp(24px,4vw,72px)] top-6 z-[1] text-[11px] [@media(hover:none)]:hidden" as="p">
            Move your cursor · flip some bits
          </MonoLabel>
        </>
      ) : null}
      <div className="wrap relative z-[1]">
        <div className="grid grid-cols-[1.1fr_1fr] items-center gap-14 max-[980px]:grid-cols-1 max-[980px]:gap-12">
          <div className="min-w-0">
            {block.labels?.length ? <LogLabel items={block.labels} /> : null}
            <Heading as="h1" size="display" emphasis={block.emphasis} breakEmphasis className="mt-[22px]">
              {block.title}
            </Heading>
            <p
              className="relative mt-[26px] max-w-[52ch] text-[19px] leading-[1.55] text-muted"
              data-reveal="up"
              data-reveal-delay={450}
            >
              {block.subhead}
            </p>
            <div className="mt-[34px] flex flex-wrap gap-3" data-reveal="up" data-reveal-delay={600}>
              <Button href={primary.href} newTab={primary.newTab} arrow data-cta="hero">
                {primary.label}
              </Button>
              {secondary ? (
                <Button href={secondary.href} newTab={secondary.newTab} variant="ghost" data-cta="hero">
                  {secondary.label}
                </Button>
              ) : null}
            </div>
            {block.trustItems?.length ? (
              <ul
                className="relative m-0 mt-[34px] flex list-none flex-wrap gap-x-[22px] gap-y-2.5 p-0"
                data-reveal="fade"
                data-reveal-delay={800}
              >
                {block.trustItems.map((t, i) => (
                  <li key={t.id ?? i}>
                    <MonoLabel>{t.text}</MonoLabel>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {rows.length ? (
            <LogPanel
              title={panelTitle}
              status={useCs ? { label: "Shipped", tone: "ok" } : manual?.status ? { label: manual.status, tone: "ok" } : null}
              rows={rows}
              footer={footer}
              animate
              ariaLabel={cs ? `Project log from the ${cs.client} engagement` : panelTitle || "Project log"}
            />
          ) : null}
        </div>
        {proofItems.length ? <ProofStrip items={proofItems} className="relative mt-20 bg-paper" /> : null}
      </div>
    </section>
  );
}

export default HeroLogBlock;
