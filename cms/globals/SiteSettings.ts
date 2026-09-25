import type { GlobalConfig } from "payload";
import { anyone, isAdmin } from "../access";
import { rowLabel } from "../fields/rowLabel";
import { revalidateGlobal } from "../hooks/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Settings",
    description: "Site-wide details used in SEO, structured data and contact sections. Only admins can edit.",
  },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "siteName", type: "text", defaultValue: "Qbitlog" },
    {
      name: "bookingUrl",
      type: "text",
      admin: { description: "Cal.com or Calendly link used by every “Book a scoping call” button." },
    },
    {
      name: "defaultSeo",
      type: "group",
      label: "Default SEO",
      admin: { description: "Used when a page has no SEO title, description or image of its own." },
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "ogImage", type: "upload", relationTo: "media", label: "Social share image (1200×630)" },
      ],
    },
    {
      name: "contact",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "email", type: "email", admin: { width: "50%" } },
            { name: "phone", type: "text", admin: { width: "50%" } },
          ],
        },
        { name: "address", type: "textarea" },
        {
          name: "timezoneNote",
          type: "text",
          defaultValue: "4+ hours overlap with US and EU",
        },
        {
          name: "replyTime",
          type: "text",
          defaultValue: "within one business day",
          admin: { description: "Shown after a contact form is sent: “We’ll reply …”. Leave empty to make no promise." },
        },
      ],
    },
    {
      name: "prototypeDisclaimer",
      type: "text",
      defaultValue: "Prototype built on synthetic/demo data. Results are from demo testing.",
      admin: { description: "Shown under the title of every case study marked Prototype." },
    },
    {
      name: "organization",
      type: "group",
      admin: { description: "Company details for Google (Organization structured data)." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "legalName", type: "text", admin: { width: "50%" } },
            { name: "foundingDate", type: "date", admin: { width: "50%", date: { pickerAppearance: "dayOnly" } } },
          ],
        },
        { name: "logo", type: "upload", relationTo: "media" },
        {
          name: "sameAs",
          type: "array",
          labels: { singular: "Profile URL", plural: "Official profiles" },
          admin: {
            initCollapsed: true,
            description: "Official company profiles (LinkedIn, Clutch, GitHub…).",
            components: { RowLabel: rowLabel("url", "Profile URL") },
          },
          fields: [{ name: "url", type: "text", required: true }],
        },
      ],
    },
    {
      name: "socials",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "linkedin", type: "text", admin: { width: "50%" } },
            { name: "x", type: "text", label: "X (Twitter)", admin: { width: "50%" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "github", type: "text", admin: { width: "50%" } },
            { name: "clutch", type: "text", admin: { width: "50%" } },
          ],
        },
      ],
    },
  ],
};
