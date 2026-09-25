import Link from "next/link";

type QuickLink = { href: string; label: string; hint: string };

const EDITOR_GUIDE_URL = "https://github.com/pramodqbit/main-website/blob/main/docs/editor-guide.md";

const links: QuickLink[] = [
  { href: "/admin/collections/case-studies/create", label: "New case study", hint: "Work" },
  { href: "/admin/collections/posts/create", label: "New insight", hint: "Article" },
  { href: "/admin/collections/log-entries/create", label: "Add a log entry", hint: "Studio log" },
  { href: "/admin/collections/leads?where[status][equals]=new", label: "View new leads", hint: "Inbox" },
  { href: "/admin/content-health", label: "Content health", hint: "Report" },
  { href: EDITOR_GUIDE_URL, label: "Editor guide", hint: "How to publish" },
];

const mono = "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)";

export function BeforeDashboard() {
  return (
    <section
      aria-label="Quick actions"
      style={{
        border: "1px solid var(--theme-elevation-150)",
        background: "var(--theme-elevation-50)",
        padding: "calc(var(--base) * 1)",
        marginBottom: "calc(var(--base) * 1.5)",
      }}
    >
      <p style={{ fontFamily: mono, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
        <span aria-hidden style={{ display: "inline-block", width: 8, height: 8, background: "var(--theme-success-500)", marginRight: 8 }} />
        Qbitlog CMS · Software, on the record
      </p>
      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "calc(var(--base) * 0.5)",
          marginTop: "calc(var(--base) * 0.75)",
        }}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "block",
              padding: "calc(var(--base) * 0.6)",
              border: "1px solid var(--theme-elevation-200)",
              background: "var(--theme-elevation-0)",
              color: "var(--theme-text)",
              textDecoration: "none",
            }}
          >
            <span style={{ display: "block", fontFamily: mono, fontSize: "10px", textTransform: "uppercase", opacity: 0.6 }}>
              {link.hint}
            </span>
            <span style={{ display: "block", fontWeight: 600, marginTop: 4 }}>{link.label} →</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
