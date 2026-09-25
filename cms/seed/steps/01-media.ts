import type { Payload } from "payload";
import { readLegacy } from "../lib/context";
import type { LegacyCaseStudy, LegacyPost, LegacyService } from "../lib/legacy-types";
import { saveMediaMap, uploadLocalImage, uploadRemoteImage } from "../lib/media";
import { report } from "../lib/report";

function shortClient(client: string) {
  return client.replace(/\s*\(.*\)\s*$/, "");
}

/** Upload every image referenced by migrated content. */
export async function seedMedia(payload: Payload) {
  report.step("01 media");
  const studies = readLegacy<LegacyCaseStudy[]>("case-studies.json");
  const seen = new Set<string>();
  const once = async (p: string | undefined, alt: string, credit?: string) => {
    if (!p || seen.has(p)) return;
    seen.add(p);
    await uploadLocalImage(payload, p, alt, credit);
  };

  for (const cs of studies) {
    const client = shortClient(cs.client);
    await once(cs.heroImage, `${client} dashboard`);
    for (const s of cs.screenshots) await once(s.image, `${client} ${s.caption.toLowerCase()} screen`);
    await once(cs.mobileImage, `${client} mobile app screen`);
    await once(cs.iconImage, `${client} project illustration`);
    for (const t of cs.technologies) await once(t.icon, `${t.name} logo`);
    await once(cs.testimonial?.avatar, `${cs.testimonial?.name ?? "Client"} portrait`);
  }

  for (const file of ["ai-machine-learning", "cloud-solutions", "mobile-development", "uiux", "web-development"]) {
    const svc = readLegacy<LegacyService>(`services/${file}.json`);
    for (const t of svc.techstack) if (t.image && logoMatches(t.name, t.image)) await once(t.image, `${t.name} logo`);
  }

  const posts = readLegacy<LegacyPost[]>("posts.json");
  for (const post of posts) {
    if (post.heroImage) await uploadRemoteImage(payload, post.heroImage, `Illustration for "${post.title}"`, "Image: Freepik");
    if (post.iconImage) await uploadRemoteImage(payload, post.iconImage, `Thumbnail illustration for "${post.title}"`, "Image: Freepik");
  }
  saveMediaMap();
}

/**
 * Legacy service JSON reuses icons for unrelated tools (e.g. TensorFlow → python.webp).
 * Only attach a logo when the file name plausibly matches the technology.
 */
export function logoMatches(name: string, image: string): boolean {
  const file = image.split("/").pop()?.replace(/\.[a-z]+$/, "").replace(/-icon$/, "").toLowerCase() ?? "";
  const n = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const aliases: Record<string, string[]> = {
    adobe: ["adobesuite"],
    photoshop: ["adobephotoshop"],
    illustrator: ["adobeillustrator"],
    "corel-draw": ["coreldraw"],
    "android-studio": ["androidstudio"],
    mongo: ["mongodb"],
    nextjs: ["nextjs"],
    tailwind: ["tailwindcss"],
    react: ["react", "reactnative"],
  };
  const f = file.replace(/[^a-z0-9-]/g, "");
  return n === f.replace(/-/g, "") || (aliases[f] ?? []).includes(n);
}
