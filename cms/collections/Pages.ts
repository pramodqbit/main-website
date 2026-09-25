import type { CollectionConfig } from "payload";
import { pageBlocks } from "../blocks";
import { publishedAtField } from "../fields/publishedAt";
import { slugField } from "../fields/slug";
import { contentDefaults } from "./shared";

const d = contentDefaults("pages");

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Page", plural: "Pages" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    group: "Content",
    description: "Pages built from sections (Home, About, Contact, Privacy…). The page with slug “home” is the homepage.",
    preview: d.preview,
    livePreview: { url: d.livePreviewUrl },
  },
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
            { name: "title", type: "text", required: true },
            {
              name: "layout",
              type: "blocks",
              blocks: pageBlocks,
              required: true,
              minRows: 1,
              admin: {
                initCollapsed: true,
                description: "Add and reorder sections. The page is built top to bottom from these.",
              },
            },
          ],
        },
      ],
    },
    slugField(),
    publishedAtField,
  ],
};
