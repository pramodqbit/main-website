import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { rowLabel } from "../fields/rowLabel";

export const Manifesto: Block = {
  slug: "manifesto",
  interfaceName: "ManifestoBlock",
  labels: { singular: "Manifesto (why we exist)", plural: "Manifestos" },
  admin: { group: "Story" },
  fields: [
    blockHelp(
      "Large serif lines that fill in word by word as visitors scroll, next to a block of dots that fills like a cursor. Best right after the hero.",
    ),
    {
      name: "label",
      type: "text",
      defaultValue: "ENTRY 001 / WHY WE EXIST",
      admin: { description: "Mono label on the left. Also names this chapter in the narrator." },
    },
    {
      name: "lines",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 6,
      labels: { singular: "Line", plural: "Lines" },
      defaultValue: [
        { text: "In 2025, a few engineers got tired of building for everyone else." },
        { text: "Other people’s roadmaps. Other people’s shortcuts. Deadlines paid for by tired teams." },
        { text: "So we started Qbitlog to build for ourselves, at a pace that keeps people sharp." },
        { text: "Now we build yours the same way: *like it’s ours*, with every decision on the record." },
      ],
      admin: {
        description: "Each line is its own paragraph. Wrap words in *asterisks* to show them in violet italic.",
        components: { RowLabel: rowLabel("text", "Line") },
      },
      fields: [{ name: "text", type: "textarea", required: true, maxLength: 160 }],
    },
    { name: "signature", type: "text", defaultValue: "The Qbitlog team · 2025" },
  ],
};
