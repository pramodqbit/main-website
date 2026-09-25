import Link from "next/link";
import { resolveLink } from "@/lib/links";
import { getAnnouncement } from "@/lib/queries/globals";

export async function AnnouncementBar() {
  const a = await getAnnouncement();
  if (!a?.enabled || !a.text) return null;
  const link = resolveLink(a.link, "Read more");

  return (
    <div className="bg-ink text-paper">
      <p className="wrap m-0 py-2 font-mono text-label uppercase tracking-[.06em]">
        {a.text}
        {link ? (
          <>
            {" "}
            <Link
              href={link.href}
              target={link.newTab ? "_blank" : undefined}
              rel={link.newTab ? "noopener" : undefined}
              className="text-paper underline underline-offset-2"
            >
              {link.label} →
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}

export default AnnouncementBar;
