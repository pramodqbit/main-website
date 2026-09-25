import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";
import { studioAccess } from "./shared";

export const Technologies: CollectionConfig = {
  slug: "technologies",
  labels: { singular: "Technology", plural: "Technologies" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "updatedAt"],
    group: "Studio",
    description: "Tools and frameworks we use, linked from case studies and services.",
  },
  access: studioAccess,
  fields: [
    { name: "name", type: "text", required: true },
    slugField("name"),
    { name: "logo", type: "upload", relationTo: "media" },
    {
      name: "category",
      type: "select",
      options: ["Frontend", "Backend", "Mobile", "AI", "Cloud", "Data", "Design"],
    },
  ],
};
