import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { linkField } from "../fields/link";
import { rowLabel } from "../fields/rowLabel";

type HeroSibling = { logSource?: "caseStudy" | "manual" };

export const HeroLog: Block = {
  slug: "heroLog",
  interfaceName: "HeroLogBlock",
  labels: { singular: "Hero (log panel)", plural: "Heroes (log panel)" },
  admin: { group: "Hero" },
  fields: [
    blockHelp("The top of the page: headline, buttons and a live-looking project log. Use once per page, first."),
    {
      name: "labels",
      type: "text",
      hasMany: true,
      admin: { description: 'Mono eyebrow items, e.g. "Software studio", "Web · Mobile · AI".' },
    },
    { name: "title", type: "text", required: true, admin: { description: "The big serif headline." } },
    { name: "emphasis", type: "text", admin: { description: "Shown in violet italic after the title." } },
    { name: "subhead", type: "textarea", required: true },
    {
      type: "row",
      fields: [
        linkField("primaryCta", { label: "Primary button", description: "Leave empty to use the booking link." }),
        linkField("secondaryCta", { label: "Secondary button" }),
      ],
    },
    {
      name: "trustItems",
      type: "array",
      maxRows: 4,
      labels: { singular: "Trust item", plural: "Trust items" },
      admin: {
        initCollapsed: true,
        description: 'Short proof points under the buttons, e.g. "4+ hours overlap with US & EU".',
        components: { RowLabel: rowLabel("text", "Trust item") },
      },
      fields: [{ name: "text", type: "text", required: true }],
    },
    {
      name: "logSource",
      type: "radio",
      defaultValue: "caseStudy",
      options: [
        { label: "Build the log from a case study", value: "caseStudy" },
        { label: "Write the log manually", value: "manual" },
      ],
      admin: {
        layout: "horizontal",
        description: "The log panel beside the headline. A case study fills it from its decisions and metrics.",
      },
    },
    {
      name: "caseStudy",
      type: "relationship",
      relationTo: "case-studies",
      admin: { condition: (_, sibling: HeroSibling) => sibling?.logSource !== "manual" },
    },
    {
      name: "manualLog",
      type: "group",
      admin: { condition: (_, sibling: HeroSibling) => sibling?.logSource === "manual" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "title", type: "text", admin: { width: "60%", description: 'e.g. "restaurantos.log"' } },
            { name: "status", type: "text", admin: { width: "40%", description: 'e.g. "LIVE"' } },
          ],
        },
        {
          name: "rows",
          type: "array",
          labels: { singular: "Log row", plural: "Log rows" },
          admin: { initCollapsed: true, components: { RowLabel: rowLabel("text", "Log row") } },
          fields: [
            {
              type: "row",
              fields: [
                { name: "marker", type: "text", admin: { width: "25%", description: 'e.g. "01" or a date' } },
                {
                  name: "phase",
                  type: "select",
                  options: ["DISCOVER", "DECIDE", "BUILD", "MEASURE"],
                  admin: { width: "35%" },
                },
                {
                  name: "measured",
                  type: "checkbox",
                  admin: { width: "40%", description: "Highlight as a measured result (amber)." },
                },
              ],
            },
            { name: "text", type: "text", required: true },
          ],
        },
        { name: "footerLeft", type: "text", admin: { description: "Small text at the bottom-left of the panel." } },
        linkField("footerLink", { label: "Footer link" }),
      ],
    },
    {
      name: "showBitField",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Show the interactive dot grid behind the hero." },
    },
  ],
};
