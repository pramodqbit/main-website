import { Logo } from "@/components/ds/Logo";
import { resolveLink, resolveLinks } from "@/lib/links";
import { getHeader } from "@/lib/queries/globals";
import { HeaderNav, type NavLink } from "./HeaderNav";

export async function SiteHeader() {
  const header = await getHeader();
  const links: NavLink[] = resolveLinks(header?.nav);
  const cta = header?.cta ? resolveLink(header.cta, "Book a scoping call") : null;

  return (
    <header className="sticky top-[env(safe-area-inset-top)] z-30 border-b border-line bg-[color-mix(in_srgb,var(--paper)_92%,transparent)] backdrop-blur-[6px]">
      <div className="wrap relative flex items-center gap-5 py-3.5">
        <Logo className="relative z-10 shrink-0" />
        <HeaderNav links={links} cta={cta} />
      </div>
    </header>
  );
}

export default SiteHeader;
