import type { GlobalConfig } from "payload";
import { anyone, isAdminOrEditor } from "../access";
import { linkField } from "../fields/link";
import { rowLabel } from "../fields/rowLabel";
import { revalidateGlobal } from "../hooks/revalidate";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  admin: { group: "Settings", description: "The footer on every page." },
  access: { read: anyone, update: isAdminOrEditor },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "tagline", type: "text", defaultValue: "Software, on the record." },
    {
      name: "columns",
      type: "array",
      maxRows: 4,
      labels: { singular: "Column", plural: "Columns" },
      admin: { initCollapsed: true, components: { RowLabel: rowLabel("title", "Column") } },
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "links",
          type: "array",
          labels: { singular: "Link", plural: "Links" },
          admin: { initCollapsed: true, components: { RowLabel: rowLabel("link.label", "Link") } },
          fields: [linkField("link", { required: true })],
        },
      ],
    },
    {
      name: "legalLinks",
      type: "array",
      labels: { singular: "Legal link", plural: "Legal links" },
      admin: {
        initCollapsed: true,
        description: "Small links at the very bottom, e.g. Privacy, Terms.",
        components: { RowLabel: rowLabel("link.label", "Legal link") },
      },
      fields: [linkField("link", { required: true })],
    },
    {
      name: "wordmarkCaption",
      type: "text",
      defaultValue: "Every bit, on the record",
      admin: { description: "Caption under the dotted QBITLOG wordmark." },
    },
  ],
};
