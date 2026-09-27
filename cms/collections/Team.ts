import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";
import { revalidateDelete, revalidateDoc } from "../hooks/revalidate";
import { orderField, studioAccess } from "./shared";

export const Team: CollectionConfig = {
  slug: "team",
  labels: { singular: "Team member", plural: "Team" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "leadership", "showOnSite", "order"],
    group: "Studio",
    description: "People shown at /about/team and as Insight authors.",
  },
  defaultSort: "order",
  access: studioAccess,
  hooks: { afterChange: [revalidateDoc], afterDelete: [revalidateDelete] },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "kind",
      type: "select",
      defaultValue: "person",
      options: [
        { label: "Person", value: "person" },
        { label: "Team", value: "team" },
      ],
      admin: { description: "Use “Team” for group bylines such as “Qbitlog Engineering”." },
    },
    { name: "role", type: "text", required: true, admin: { description: 'Job title, e.g. "Lead Engineer".' } },
    { name: "bio", type: "textarea" },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Never shown as a photo: the site turns it into a dot portrait. Use a head-and-shoulders shot on a plain background, and set the image's focal point on the face. Without a photo, the card shows a dot silhouette.",
      },
    },
    {
      name: "expertise",
      type: "text",
      hasMany: true,
      admin: { description: 'Skills, e.g. "React Native", "LLM agents". Press Enter after each.' },
    },
    {
      name: "links",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "linkedin", type: "text", label: "LinkedIn URL", admin: { width: "50%" } },
            { name: "github", type: "text", label: "GitHub URL", admin: { width: "50%" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "x", type: "text", label: "X (Twitter) URL", admin: { width: "50%" } },
            { name: "website", type: "text", label: "Website", admin: { width: "50%" } },
          ],
        },
      ],
    },
    slugField("name"),
    {
      name: "leadership",
      type: "checkbox",
      admin: { position: "sidebar", description: "Show in the leadership section." },
    },
    {
      name: "showOnSite",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar", description: "Untick to hide from the team page (still usable as an author)." },
    },
    orderField,
  ],
};
