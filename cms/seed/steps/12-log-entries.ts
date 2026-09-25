import type { Payload } from "payload";
import type { LogEntry } from "@/payload-types";
import { readLegacy } from "../lib/context";
import type { LegacyCaseStudy, LegacyPost } from "../lib/legacy-types";
import { report } from "../lib/report";
import { idBySlug, upsert } from "../lib/upsert";

type Entry = Omit<LogEntry, "id" | "createdAt" | "updatedAt">;

/** Only real, verifiable events from legacy data. No invented hires, talks or dates. */
export async function seedLogEntries(payload: Payload) {
  report.step("12 log entries");
  const entries: Entry[] = [
    { date: "2024-12-26T00:00:00.000Z", type: "MEASURED", subject: "Batra Hospital", text: "99% prescription extraction accuracy", highlight: "99%", showInTicker: true },
    { date: "2024-12-26T00:00:00.000Z", type: "SHIPPED", subject: "Batra Hospital", text: "Prescription processing in 3–5 seconds", highlight: "3–5s", showInTicker: true },
  ];

  for (const post of readLegacy<LegacyPost[]>("posts.json")) {
    const id = await idBySlug(payload, "posts", post.slug);
    entries.push({
      date: new Date(post.date).toISOString(),
      type: "WROTE",
      subject: "Insights",
      text: post.title.slice(0, 120),
      showInTicker: true,
      ...(id ? { link: { type: "internal", reference: { relationTo: "posts", value: id }, label: "Read the article" } } : {}),
    });
  }

  const shipped: Record<string, string> = {
    "restaurant-os": "One operations platform for orders, inventory, menus and reporting",
    "hire-your-travel-partner": "One platform for bookings, companions, itineraries and family updates",
  };
  for (const cs of readLegacy<LegacyCaseStudy[]>("case-studies.json")) {
    const text = shipped[cs.slug];
    if (!text) continue;
    const id = await idBySlug(payload, "case-studies", cs.slug);
    entries.push({
      date: new Date(cs.date).toISOString(),
      type: "SHIPPED",
      subject: cs.client.replace(/\s*\(.*\)$/, ""),
      text,
      showInTicker: true,
      ...(id ? { link: { type: "internal", reference: { relationTo: "case-studies", value: id }, label: "Read the case study" } } : {}),
    });
  }

  for (const e of entries) {
    await upsert(payload, "log-entries", `${e.date.slice(0, 10)} ${e.type} ${e.subject}`, {
      and: [{ text: { equals: e.text } }, { subject: { equals: e.subject } }],
    }, e);
  }
}
