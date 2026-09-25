"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clsx as cn } from "clsx";
import { buttonStyles } from "@/components/ds/buttonStyles";

function CtaLink({ link, size, location }: { link: NavLink; size?: "sm"; location: string }) {
  const external = link.newTab || /^(https?:)?\/\//.test(link.href);
  return (
    <Link
      href={link.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      className={buttonStyles({ size })}
      data-cta={location}
    >
      {link.label}
      {size ? null : (
        <span aria-hidden="true" className="font-mono">
          →
        </span>
      )}
    </Link>
  );
}

export type NavLink = { href: string; label: string; newTab?: boolean };

export type HeaderNavProps = {
  links: NavLink[];
  cta?: NavLink | null;
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop nav links + CTA, collapsing below 860px into a full-height MENU panel. */
export function HeaderNav({ links, cta }: HeaderNavProps) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  if (open && openedAt !== pathname) {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = [buttonRef.current, ...(panelRef.current?.querySelectorAll<HTMLElement>("a,button") ?? [])].filter(
        (el): el is HTMLElement => Boolean(el),
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkEls = (mobile: boolean) =>
    links.map((l) => {
      const active = isActive(pathname, l.href);
      return (
        <li key={l.href}>
          <Link
            href={l.href}
            target={l.newTab ? "_blank" : undefined}
            rel={l.newTab ? "noopener" : undefined}
            aria-current={active ? "page" : undefined}
            onClick={mobile ? () => setOpen(false) : undefined}
            className={cn(
              "no-underline transition-colors",
              active ? "text-ink" : "text-muted hover:text-ink",
              mobile ? "block border-b border-line py-4 font-serif text-3xl" : "text-[15px]",
            )}
          >
            {l.label}
          </Link>
        </li>
      );
    });

  return (
    <>
      <nav aria-label="Primary" className="flex items-center gap-7 max-[859px]:hidden">
        <ul className="m-0 flex list-none items-center gap-7 p-0">{linkEls(false)}</ul>
        {cta ? <CtaLink link={cta} size="sm" location="header" /> : null}
      </nav>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => {
          setOpenedAt(pathname);
          setOpen((o) => !o);
        }}
        className="border border-ink px-3 py-2 font-mono text-label uppercase min-[860px]:hidden"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open ? (
        <div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+61px)] z-40 overflow-y-auto bg-paper px-6 pb-10 min-[860px]:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="m-0 list-none p-0">{linkEls(true)}</ul>
          </nav>
          {cta ? (
            <div className="mt-8">
              <CtaLink link={cta} location="mobile_nav" />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default HeaderNav;
