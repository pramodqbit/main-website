import type { ArrayField } from "payload";
import { rowLabel } from "./rowLabel";

export const annotationsField = (name = "annotations"): ArrayField => ({
  name,
  type: "array",
  maxRows: 6,
  interfaceName: "AnnotationItems",
  labels: { singular: "Pin", plural: "Pins" },
  admin: {
    initCollapsed: true,
    description: "Pin position in % from the top-left of the image. Pins are lettered A, B, C in order.",
    components: { RowLabel: rowLabel("title", "Pin") },
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "x", type: "number", required: true, min: 0, max: 100, admin: { width: "50%", description: "% from the left" } },
        { name: "y", type: "number", required: true, min: 0, max: 100, admin: { width: "50%", description: "% from the top" } },
      ],
    },
    { name: "title", type: "text", required: true },
    { name: "note", type: "text" },
  ],
});
