import type { CollectionConfig } from "payload";
import { annotationsField } from "../fields/annotations";
import { defaultEditor } from "../fields/editor";
import { metricsField } from "../fields/metrics";
import { rowLabel } from "../fields/rowLabel";
import { slugField } from "../fields/slug";
import { requirePrototypeSourceLabels } from "../hooks/requirePrototypeSourceLabels";
import { contentDefaults } from "./shared";

const d = contentDefaults("case-studies");

const TIMELINE_PHASES = ["DISCOVER", "DECIDE", "BUILD", "LAUNCH", "MEASURE"];

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Case Study", plural: "Case Studies (Work)" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "featured", "_status", "updatedAt"],
    group: "Content",
    description: "Client projects, shown at /work. Built around decisions and measured results.",
    preview: d.preview,
    livePreview: { url: d.livePreviewUrl },
  },
  defaultSort: "order",
  access: d.access,
  versions: d.versions,
  hooks: { ...d.hooks, beforeChange: [requirePrototypeSourceLabels] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Overview",
          fields: [
            { name: "title", type: "text", required: true, maxLength: 90 },
            {
              type: "row",
              fields: [
                { name: "client", type: "text", required: true, admin: { width: "50%" } },
                {
                  name: "clientLogo",
                  type: "upload",
                  relationTo: "media",
                  admin: { width: "50%", description: "Only with the client's permission." },
                },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "industry", type: "relationship", relationTo: "industries", admin: { width: "50%" } },
                { name: "services", type: "relationship", relationTo: "services", hasMany: true, admin: { width: "50%" } },
              ],
            },
            {
              name: "summary",
              type: "textarea",
              required: true,
              maxLength: 200,
              admin: { description: "Shown on cards and in Google. Max 200 characters." },
            },
            {
              type: "row",
              fields: [
                { name: "durationWeeks", type: "number", min: 1, admin: { width: "33%", description: "Project length in weeks." } },
                { name: "teamSize", type: "number", min: 1, admin: { width: "33%", description: "People on the project." } },
                { name: "year", type: "number", min: 2000, max: 2100, admin: { width: "33%" } },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "status",
                  type: "select",
                  defaultValue: "live",
                  options: [
                    { label: "Live", value: "live" },
                    { label: "Prototype", value: "prototype" },
                  ],
                  admin: { width: "33%", description: "Is the product live with real users?" },
                },
                { name: "liveUrl", type: "text", admin: { width: "67%", description: "Public product URL, if any." } },
              ],
            },
            {
              name: "platforms",
              type: "text",
              hasMany: true,
              admin: { description: 'Where it runs, e.g. "Web app", "iOS", "Android", "REST API".' },
            },
            {
              type: "row",
              fields: [
                {
                  name: "featured",
                  type: "checkbox",
                  admin: { width: "50%", description: "Show in “featured” grids on the homepage." },
                },
                { name: "order", type: "number", admin: { width: "50%", description: "Lower numbers are shown first." } },
              ],
            },
          ],
        },
        {
          label: "Proof",
          fields: [
            metricsField("metrics"),
            {
              name: "testimonial",
              type: "relationship",
              relationTo: "testimonials",
              admin: { description: "A client quote about this project (must be approved)." },
            },
          ],
        },
        {
          label: "Story",
          fields: [
            { name: "heroImage", type: "upload", relationTo: "media", required: true },
            annotationsField("heroAnnotations"),
            {
              name: "challenge",
              type: "richText",
              required: true,
              editor: defaultEditor,
              admin: { description: "The situation before we started, and why it mattered." },
            },
            {
              name: "decisions",
              type: "array",
              labels: { singular: "Decision", plural: "Decisions" },
              admin: {
                initCollapsed: true,
                description: "The heart of the case study: what we weighed and why we chose it",
                components: { RowLabel: rowLabel("title", "Decision") },
              },
              fields: [
                { name: "title", type: "text", required: true },
                { name: "problem", type: "textarea", required: true },
                {
                  name: "options",
                  type: "array",
                  labels: { singular: "Option", plural: "Options" },
                  admin: {
                    initCollapsed: true,
                    description: "The options we weighed. Tick the one we chose.",
                    components: { RowLabel: rowLabel("label", "Option") },
                  },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "label", type: "text", required: true, admin: { width: "75%" } },
                        { name: "chosen", type: "checkbox", admin: { width: "25%" } },
                      ],
                    },
                  ],
                },
                { name: "decision", type: "textarea", required: true },
                { name: "why", type: "textarea", required: true },
              ],
            },
            {
              name: "timeline",
              type: "array",
              maxRows: 12,
              labels: { singular: "Timeline entry", plural: "Timeline" },
              admin: {
                initCollapsed: true,
                description: "The project week by week. Shown in the log-panel style.",
                components: { RowLabel: rowLabel("marker", "Entry") },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "marker", type: "text", required: true, admin: { width: "50%", description: 'e.g. "Wk 03–04".' } },
                    {
                      name: "phase",
                      type: "select",
                      required: true,
                      options: TIMELINE_PHASES,
                      admin: { width: "50%" },
                    },
                  ],
                },
                { name: "text", type: "text", required: true, maxLength: 160 },
              ],
            },
            {
              name: "beforeAfter",
              type: "array",
              maxRows: 6,
              labels: { singular: "Change", plural: "Before → After" },
              admin: {
                initCollapsed: true,
                description: "What changed for the people using it. Only describe what you actually observed.",
                components: { RowLabel: rowLabel("aspect", "Change") },
              },
              fields: [
                { name: "aspect", type: "text", required: true },
                {
                  type: "row",
                  fields: [
                    { name: "before", type: "textarea", required: true, admin: { width: "50%" } },
                    { name: "after", type: "textarea", required: true, admin: { width: "50%" } },
                  ],
                },
              ],
            },
            {
              name: "teamRoles",
              type: "array",
              maxRows: 8,
              labels: { singular: "Role", plural: "Team roles" },
              admin: { initCollapsed: true, components: { RowLabel: rowLabel("role", "Role") } },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "role", type: "text", required: true, admin: { width: "75%" } },
                    { name: "count", type: "number", min: 1, admin: { width: "25%", description: "Leave empty if unknown." } },
                  ],
                },
              ],
            },
            {
              name: "lessons",
              type: "array",
              maxRows: 5,
              labels: { singular: "Lesson", plural: "Lessons" },
              admin: {
                initCollapsed: true,
                description: "What we'd do differently. Honest lessons build more trust than perfect stories.",
                components: { RowLabel: rowLabel("title", "Lesson") },
              },
              fields: [
                { name: "title", type: "text", required: true },
                { name: "text", type: "textarea", required: true },
              ],
            },
            { name: "solution", type: "richText", editor: defaultEditor },
            {
              name: "features",
              type: "array",
              labels: { singular: "Feature", plural: "Features" },
              admin: { initCollapsed: true, components: { RowLabel: rowLabel("title", "Feature") } },
              fields: [
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea" },
              ],
            },
            {
              name: "gallery",
              type: "array",
              labels: { singular: "Image", plural: "Gallery" },
              admin: { initCollapsed: true, components: { RowLabel: rowLabel("caption", "Image") } },
              fields: [
                { name: "image", type: "upload", relationTo: "media", required: true },
                { name: "caption", type: "text" },
                annotationsField(),
              ],
            },
            {
              name: "body",
              type: "richText",
              editor: defaultEditor,
              admin: { description: "Optional long-form write-up; migrated articles land here" },
            },
            { name: "technologies", type: "relationship", relationTo: "technologies", hasMany: true },
            {
              name: "related",
              type: "relationship",
              relationTo: "case-studies",
              hasMany: true,
              maxRows: 2,
              admin: { description: "Up to 2 case studies shown at the end." },
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
            },
          ],
        },
      ],
    },
    slugField(),
  ],
};
