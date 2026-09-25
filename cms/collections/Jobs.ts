import type { ArrayField, CollectionConfig } from "payload";
import { isAdmin, isAdminOrEditor, publishedOrLoggedIn } from "../access";
import { defaultEditor } from "../fields/editor";
import { publishedAtField } from "../fields/publishedAt";
import { rowLabel } from "../fields/rowLabel";
import { slugField } from "../fields/slug";
import { revalidateDelete, revalidateDoc } from "../hooks/revalidate";
import { previewUrl } from "../utilities/previewPath";

const itemList = (name: string, singular: string, plural: string): ArrayField => ({
  name,
  type: "array",
  labels: { singular, plural },
  admin: { initCollapsed: true, components: { RowLabel: rowLabel("item", singular) } },
  fields: [{ name: "item", type: "text", required: true }],
});

export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: { singular: "Job", plural: "Jobs" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "department", "location", "_status"],
    group: "Studio",
    description: "Open roles at /careers. Set status to Closed to stop accepting applications.",
    preview: (doc) => previewUrl("jobs", doc),
    livePreview: { url: ({ data }) => previewUrl("jobs", data) },
  },
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  versions: { drafts: true, maxPerDoc: 25 },
  hooks: { afterChange: [revalidateDoc], afterDelete: [revalidateDelete] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            { name: "title", type: "text", required: true },
            {
              type: "row",
              fields: [
                {
                  name: "department",
                  type: "select",
                  options: ["Engineering", "Design", "Sales", "Marketing", "Operations"],
                  admin: { width: "33%" },
                },
                {
                  name: "employmentType",
                  type: "select",
                  options: ["Full-time", "Part-time", "Contract", "Internship"],
                  admin: { width: "33%" },
                },
                {
                  name: "location",
                  type: "text",
                  required: true,
                  admin: { width: "33%", description: 'e.g. "Remote (India)" or "Delhi, hybrid".' },
                },
              ],
            },
            { name: "salary", type: "text", admin: { description: "Optional. Shown as written, e.g. “₹12–18 LPA”." } },
            { name: "summary", type: "textarea", required: true, admin: { description: "One or two sentences for the jobs list." } },
            { name: "description", type: "richText", editor: defaultEditor },
            itemList("responsibilities", "Responsibility", "Responsibilities"),
            itemList("requirements", "Requirement", "Requirements"),
            itemList("benefits", "Benefit", "Benefits"),
          ],
        },
      ],
    },
    slugField(),
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "open",
      options: [
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
      ],
      admin: { position: "sidebar", description: "Closed jobs stay online but stop accepting applications." },
    },
    publishedAtField,
    {
      name: "validThrough",
      type: "date",
      admin: { position: "sidebar", description: "Closing date. Used by Google for Jobs." },
    },
  ],
};
