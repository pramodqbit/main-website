import type { Payload } from "payload";
import { readLegacy, slugify } from "../lib/context";
import type { LegacyTeamMember } from "../lib/legacy-types";
import { report } from "../lib/report";
import { upsert } from "../lib/upsert";

export const TEAM_AUTHOR_SLUG = "qbitlog-engineering";

export async function seedTeam(payload: Payload) {
  report.step("03 team");
  const team = readLegacy<LegacyTeamMember[]>("team.json");
  for (const m of team) {
    const slug = slugify(m.name);
    await upsert(payload, "team", m.name, { name: { equals: m.name } }, {
      name: m.name,
      slug,
      kind: "person",
      role: m.role,
      bio: m.description,
      expertise: m.skills,
      order: m.order,
      leadership: m.role.includes("Chief"),
      showOnSite: true,
    });
  }
  await upsert(payload, "team", "Qbitlog Engineering", { slug: { equals: TEAM_AUTHOR_SLUG } }, {
    name: "Qbitlog Engineering",
    slug: TEAM_AUTHOR_SLUG,
    kind: "team",
    role: "Engineering team",
    bio: "Notes from the engineers who build Qbitlog's web, mobile and AI products.",
    showOnSite: false,
    leadership: false,
    order: 100,
  });
}
