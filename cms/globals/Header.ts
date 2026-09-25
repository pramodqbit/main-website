import type { GlobalConfig } from "payload";
import { anyone, isAdminOrEditor } from "../access";
import { linkField } from "../fields/link";
import { rowLabel } from "../fields/rowLabel";
import { revalidateGlobal } from "../hooks/revalidate";

export const Header: GlobalConfig = {
  slug: "header",
  label: "Header",
  admin: { group: "Settings", description: "The top navigation on every page." },
  access: { read: anyone, update: isAdminOrEditor },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: "nav",
      type: "array",
      maxRows: 6,
      labels: { singular: "Nav link", plural: "Navigation" },
      admin: { initCollapsed: true, components: { RowLabel: rowLabel("link.label", "Nav link") } },
      fields: [linkField("link", { required: true })],
    },
    linkField("cta", {
      label: "Header button",
      defaultLabel: "Book a scoping call",
      description: "Leave the target empty to use the booking link from Site Settings.",
    }),
  ],
};
