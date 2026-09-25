import type { DateField, FieldHook } from "payload";

const setOnFirstPublish: FieldHook = ({ value, siblingData }) => {
  if (value) return value;
  if ((siblingData as { _status?: unknown } | undefined)?._status === "published") return new Date().toISOString();
  return value;
};

export const publishedAtField: DateField = {
  name: "publishedAt",
  type: "date",
  admin: {
    position: "sidebar",
    date: { pickerAppearance: "dayAndTime" },
    description: "Set automatically the first time this is published. You can back-date it.",
  },
  hooks: { beforeChange: [setOnFirstPublish] },
};
