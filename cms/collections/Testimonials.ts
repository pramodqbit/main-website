import type { CollectionConfig } from "payload";
import { revalidateDelete, revalidateDoc } from "../hooks/revalidate";
import { studioAccess } from "./shared";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Testimonial", plural: "Testimonials" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "company", "approved", "updatedAt"],
    group: "Studio",
    description: "Client quotes. Only approved quotes should be used on the site.",
  },
  access: studioAccess,
  hooks: { afterChange: [revalidateDoc], afterDelete: [revalidateDelete] },
  fields: [
    { name: "quote", type: "textarea", required: true },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "34%" } },
        { name: "role", type: "text", admin: { width: "33%" } },
        { name: "company", type: "text", admin: { width: "33%" } },
      ],
    },
    { name: "avatar", type: "upload", relationTo: "media" },
    { name: "caseStudy", type: "relationship", relationTo: "case-studies" },
    {
      name: "approved",
      type: "checkbox",
      admin: { position: "sidebar", description: "Client approved public use" },
    },
  ],
};
