import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";
import { revalidateDelete, revalidateDoc } from "../hooks/revalidate";
import { studioAccess } from "./shared";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Category", plural: "Categories" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    group: "Studio",
    description: "Topics used to group Insights.",
  },
  access: studioAccess,
  hooks: { afterChange: [revalidateDoc], afterDelete: [revalidateDelete] },
  fields: [{ name: "title", type: "text", required: true }, slugField()],
};
