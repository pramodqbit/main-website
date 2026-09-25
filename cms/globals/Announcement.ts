import type { GlobalConfig } from "payload";
import { anyone, isAdminOrEditor } from "../access";
import { linkField } from "../fields/link";
import { revalidateGlobal } from "../hooks/revalidate";

export const Announcement: GlobalConfig = {
  slug: "announcement",
  label: "Announcement",
  admin: { group: "Settings", description: "A thin bar above the header on every page." },
  access: { read: anyone, update: isAdminOrEditor },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "enabled", type: "checkbox", defaultValue: false, admin: { description: "Show the bar on the site." } },
    { name: "text", type: "text", admin: { description: "Keep it to one short sentence." } },
    linkField("link", { label: "Link" }),
  ],
};
