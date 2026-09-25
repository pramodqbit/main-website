import type { CollectionConfig } from "payload";
import { isAdmin, isAdminEditorOrAuthor } from "../access";
import { linkField } from "../fields/link";
import { revalidateDelete, revalidateDoc } from "../hooks/revalidate";

export const LOG_ENTRY_TYPES = ["SHIPPED", "MEASURED", "DECIDED", "WROTE", "HIRED", "TALK", "LAUNCHED"] as const;

export const LogEntries: CollectionConfig = {
  slug: "log-entries",
  labels: { singular: "Log entry", plural: "Log Entries" },
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["date", "type", "subject", "text", "showInTicker"],
    group: "Studio",
    description: "The studio log at /log and in the homepage ticker. One line per event: what we shipped, measured or decided.",
  },
  defaultSort: "-date",
  access: {
    read: () => true,
    create: isAdminEditorOrAuthor,
    update: isAdminEditorOrAuthor,
    delete: isAdmin,
  },
  hooks: { afterChange: [revalidateDoc], afterDelete: [revalidateDelete] },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "date",
          type: "date",
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: { width: "33%", date: { pickerAppearance: "dayOnly" } },
        },
        {
          name: "type",
          type: "select",
          required: true,
          options: [...LOG_ENTRY_TYPES],
          admin: { width: "33%" },
        },
        {
          name: "subject",
          type: "text",
          required: true,
          admin: { width: "34%", description: 'Project or topic, e.g. "RestaurantOS".' },
        },
      ],
    },
    {
      name: "text",
      type: "text",
      required: true,
      maxLength: 120,
      admin: { description: "One line, max 120 characters." },
    },
    {
      name: "highlight",
      type: "text",
      admin: { description: 'Optional number to highlight in amber, e.g. "99%". Must be a measured result.' },
    },
    linkField("link", { label: "Link", description: "Optional: where to read more." }),
    {
      name: "showInTicker",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar", description: "Show in the homepage ticker." },
    },
  ],
};
