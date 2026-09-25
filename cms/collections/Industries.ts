import type { CollectionConfig } from "payload";
import { pageBlocks } from "../blocks";
import { rowLabel } from "../fields/rowLabel";
import { slugField } from "../fields/slug";
import { contentDefaults, orderField } from "./shared";

const d = contentDefaults("industries");

export const Industries: CollectionConfig = {
  slug: "industries",
  labels: { singular: "Industry", plural: "Industries" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "_status", "updatedAt"],
    group: "Content",
    description: "Industry landing pages at /industries/…, written for buyers in that industry.",
    preview: d.preview,
    livePreview: { url: d.livePreviewUrl },
  },
  defaultSort: "order",
  access: d.access,
  versions: d.versions,
  hooks: d.hooks,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            { name: "title", type: "text", required: true, admin: { description: 'The industry name, e.g. "Healthcare".' } },
            { name: "headline", type: "text", required: true },
            { name: "summary", type: "textarea", required: true },
            {
              name: "painPoints",
              type: "array",
              labels: { singular: "Pain point", plural: "Pain points" },
              admin: { initCollapsed: true, components: { RowLabel: rowLabel("title", "Pain point") } },
              fields: [
                { name: "title", type: "text" },
                { name: "description", type: "textarea" },
              ],
            },
            {
              name: "compliance",
              type: "array",
              labels: { singular: "Standard", plural: "Compliance" },
              admin: {
                initCollapsed: true,
                description: 'Standards we work with, e.g. "HIPAA", "GDPR".',
                components: { RowLabel: rowLabel("name", "Standard") },
              },
              fields: [{ name: "name", type: "text" }],
            },
          ],
        },
        {
          label: "Related",
          fields: [
            { name: "services", type: "relationship", relationTo: "services", hasMany: true },
            { name: "caseStudies", type: "relationship", relationTo: "case-studies", hasMany: true },
            { name: "faqs", type: "relationship", relationTo: "faqs", hasMany: true },
          ],
        },
        {
          label: "Extra sections",
          fields: [
            {
              name: "layout",
              type: "blocks",
              blocks: pageBlocks,
              admin: { initCollapsed: true, description: "Optional sections shown after the standard industry content." },
            },
          ],
        },
      ],
    },
    slugField(),
    orderField,
  ],
};
