import type { RowLabelComponent } from "payload";

/** Array row label showing `fieldName` from the row, e.g. `rowLabel("title", "Decision")`. */
export const rowLabel = (fieldName: string, fallback: string): RowLabelComponent => ({
  path: "/cms/components/RowLabel#RowLabel",
  clientProps: { fieldName, fallback },
});
