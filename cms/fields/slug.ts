import type { FieldHook, TextField } from "payload";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugify = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const generateSlug =
  (from: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === "string" && value.trim()) return slugify(value);
    const source = data?.[from] ?? originalDoc?.[from];
    return typeof source === "string" && source.trim() ? slugify(source) : value;
  };

export const slugField = (from = "title"): TextField => ({
  name: "slug",
  type: "text",
  unique: true,
  index: true,
  required: true,
  admin: {
    position: "sidebar",
    description: "URL part. Changing it after publishing breaks links; add a redirect.",
  },
  hooks: { beforeValidate: [generateSlug(from)] },
  validate: (value: string | null | undefined) => {
    if (!value) return "A slug is required.";
    return SLUG_PATTERN.test(value) || "Use lowercase letters, numbers and single hyphens only (e.g. my-page).";
  },
});
