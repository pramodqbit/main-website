import type { CollectionConfig } from "payload";
import { pageBlocks } from "../blocks";
import { rowLabel } from "../fields/rowLabel";
import { slugField } from "../fields/slug";
import { contentDefaults, orderField } from "./shared";

const d = contentDefaults("services");

export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Service", plural: "Services" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "order", "_status", "updatedAt"],
    group: "Content",
    description: "What we sell, shown at /services.",
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
            {
              type: "row",
              fields: [
                { name: "title", type: "text", required: true, admin: { width: "60%" } },
                {
                  name: "category",
                  type: "text",
                  required: true,
                  admin: { width: "40%", description: 'Short label, e.g. "AI & ML".' },
                },
              ],
            },
            {
              name: "outcomeHeadline",
              type: "text",
              required: true,
              admin: { description: 'The result for the client, e.g. "Automate the work your team does by hand".' },
            },
            { name: "summary", type: "textarea", required: true, maxLength: 200, admin: { description: "Max 200 characters." } },
            {
              name: "problems",
              type: "array",
              labels: { singular: "Problem", plural: "Problems we solve" },
              admin: { initCollapsed: true, components: { RowLabel: rowLabel("title", "Problem") } },
              fields: [
                { name: "title", type: "text" },
                { name: "description", type: "textarea" },
              ],
            },
            {
              name: "deliverables",
              type: "array",
              labels: { singular: "Deliverable", plural: "Deliverables" },
              admin: { initCollapsed: true, components: { RowLabel: rowLabel("item", "Deliverable") } },
              fields: [{ name: "item", type: "text" }],
            },
            {
              name: "process",
              type: "array",
              labels: { singular: "Step", plural: "Process" },
              admin: { initCollapsed: true, components: { RowLabel: rowLabel("name", "Step") } },
              fields: [
                { name: "name", type: "text" },
                { name: "description", type: "textarea" },
                { name: "deliverable", type: "text" },
              ],
            },
            {
              name: "typicalProjects",
              type: "array",
              maxRows: 5,
              labels: { singular: "Typical project", plural: "Typical projects" },
              admin: {
                initCollapsed: true,
                description: "Example projects with a realistic length. Buyers use this to picture their own project.",
                components: { RowLabel: rowLabel("name", "Project") },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "name", type: "text", required: true, admin: { width: "60%" } },
                    { name: "duration", type: "text", admin: { width: "40%", description: 'e.g. "8–12 weeks".' } },
                  ],
                },
                { name: "description", type: "textarea" },
              ],
            },
          ],
        },
        {
          label: "Related",
          fields: [
            { name: "technologies", type: "relationship", relationTo: "technologies", hasMany: true },
            { name: "industries", type: "relationship", relationTo: "industries", hasMany: true },
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
              admin: { initCollapsed: true, description: "Optional sections shown after the standard service content." },
            },
          ],
        },
      ],
    },
    slugField(),
    orderField,
  ],
};
