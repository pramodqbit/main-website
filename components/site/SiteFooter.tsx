import Link from "next/link";
import { Logo } from "@/components/ds/Logo";
import { ThemeToggle } from "@/components/ds/ThemeToggle";
import { LazyBitField } from "@/components/motion/LazyBitField";
import { resolveLinks } from "@/lib/links";
import { getFooter, getSiteSettings } from "@/lib/queries/globals";

export async function SiteFooter() {
  const [footer, settings] = await Promise.all([getFooter(), getSiteSettings()]);
  const siteName = settings?.siteName || "Qbitlog";
  const columns = (footer?.columns ?? [])
    .map((c) => ({ title: c.title, links: resolveLinks(c.links) }))
    .filter((c) => c.links.length > 0);
  const legal = resolveLinks(footer?.legalLinks);

  return (
    <footer className="bg-paper pb-5 pt-14">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-8 min-[761px]:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-full min-[761px]:col-span-1" data-reveal="up" data-reveal-stagger={100}>
            <Logo />
            {footer?.tagline ? <p className="mt-3.5 max-w-[18ch] font-serif text-[24px] leading-[1.25]">{footer.tagline}</p> : null}
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} data-reveal="up" data-reveal-stagger={100}>
              <h2 className="mb-3 font-mono text-xs font-normal uppercase tracking-[.08em] text-muted">{col.title}</h2>
              <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px]">
                {col.links.map((l) => (
                  <li key={`${l.href}-${l.label}`}>
                    <Link
                      href={l.href}
                      target={l.newTab ? "_blank" : undefined}
                      rel={l.newTab ? "noopener" : undefined}
                      className="no-underline hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="relative mt-14 aspect-[5/1] border-t border-line">
          <LazyBitField variant="wordmark" ariaLabel={siteName} />
          <noscript>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-7xl font-semibold">
              QBITLOG
            </span>
          </noscript>
          {footer?.wordmarkCaption ? (
            <span className="absolute bottom-2 left-0 font-mono text-[11px] uppercase tracking-[.08em] text-muted">
              {footer.wordmarkCaption}
            </span>
          ) : null}
        </div>

        <div
          className="mt-12 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-line pt-4.5 max-[640px]:grid-cols-1 max-[640px]:justify-items-center max-[640px]:text-center"
          data-reveal="fade"
          data-reveal-delay={200}
        >
          <span className="font-mono text-label uppercase text-muted">
            © {new Date().getFullYear()} {siteName}
          </span>
          <ThemeToggle className="max-[640px]:order-last" />
          {legal.length ? (
            <ul className="m-0 flex list-none flex-wrap justify-end gap-x-4 gap-y-2 p-0 max-[640px]:justify-center">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-mono text-label uppercase text-muted no-underline hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
