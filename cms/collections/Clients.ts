import type { CollectionConfig } from "payload";
import { revalidateDelete, revalidateDoc } from "../hooks/revalidate";
import { studioAccess } from "./shared";

export const Clients: CollectionConfig = {
  slug: "clients",
  labels: { singular: "Client", plural: "Clients" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "showLogo", "updatedAt"],
    group: "Studio",
    description: "Client companies. Logos only appear on the site when “Show logo” is ticked.",
  },
  access: studioAccess,
  hooks: { afterChange: [revalidateDoc], afterDelete: [revalidateDelete] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "url", type: "text", label: "Website" },
    {
      name: "showLogo",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Only enable with written permission" },
    },
  ],
};
