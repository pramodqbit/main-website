import type { Field } from "payload";
import { linkField } from "./link";

/** Heading fields shared by page-builder sections: eyebrow label, title (+ violet emphasis), intro and an optional "more" link. */
export const sectionHeadFields = ({ withMore = true }: { withMore?: boolean } = {}): Field[] => [
  {
    type: "row",
    fields: [
      {
        name: "label",
        type: "text",
        admin: { width: "40%", description: 'Small mono eyebrow above the title, e.g. "LOG / WORK".' },
      },
      {
        name: "title",
        type: "text",
        required: true,
        admin: { width: "60%" },
      },
    ],
  },
  {
    name: "emphasis",
    type: "text",
    admin: { description: "Shown in violet italic after the title." },
  },
  {
    name: "intro",
    type: "textarea",
    admin: { description: "One or two sentences under the title." },
  },
  ...(withMore
    ? [linkField("more", { label: "“See more” link", description: "Optional link shown next to the section title." })]
    : []),
];
