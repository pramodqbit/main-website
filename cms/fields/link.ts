import type { CollectionSlug, GroupField } from "payload";

export const linkableCollections: CollectionSlug[] = [
  "pages",
  "case-studies",
  "services",
  "industries",
  "posts",
  "jobs",
];

type LinkSibling = { type?: "internal" | "external"; reference?: unknown; url?: string | null };

const isFilled = (link: LinkSibling | undefined): boolean =>
  Boolean(link && ((link.type !== "external" && link.reference) || (link.type === "external" && link.url)));

type LinkOptions = {
  label?: string;
  required?: boolean;
  description?: string;
  defaultLabel?: string;
};

/**
 * Internal (relationship) or external (URL) link. The frontend resolves internal links with `publicUrlFor`.
 * When `required` is false the link can be left empty; the label is only enforced once a target is chosen.
 */
export const linkField = (name: string, options: LinkOptions = {}): GroupField => {
  const { label, required = false, description, defaultLabel } = options;
  return {
    name,
    type: "group",
    label,
    interfaceName: "LinkField",
    admin: {
      description,
      hideGutter: true,
    },
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "type",
            type: "radio",
            defaultValue: "internal",
            options: [
              { label: "Page on this site", value: "internal" },
              { label: "External URL", value: "external" },
            ],
            admin: { layout: "horizontal", width: "50%" },
          },
          {
            name: "newTab",
            type: "checkbox",
            label: "Open in a new tab",
            admin: { width: "50%", style: { alignSelf: "flex-end" } },
          },
        ],
      },
      {
        name: "reference",
        type: "relationship",
        relationTo: linkableCollections,
        label: "Link to",
        maxDepth: 1,
        admin: { condition: (_, sibling: LinkSibling) => sibling?.type !== "external" },
        validate: (value: unknown, { siblingData }: { siblingData: LinkSibling }) =>
          !required || siblingData?.type === "external" || value ? true : "Choose a page to link to.",
      },
      {
        name: "url",
        type: "text",
        label: "URL",
        admin: {
          condition: (_, sibling: LinkSibling) => sibling?.type === "external",
          description: "Full address including https://, or mailto: / tel:",
        },
        validate: (value: string | null | undefined, { siblingData }: { siblingData: LinkSibling }) => {
          if (siblingData?.type !== "external") return true;
          if (!value) return required ? "Enter a URL." : true;
          return /^(https?:\/\/|mailto:|tel:|\/)/.test(value) || "Start with https://, mailto:, tel: or /";
        },
      },
      {
        name: "label",
        type: "text",
        defaultValue: defaultLabel,
        admin: { description: "The visible link text." },
        validate: (value: string | null | undefined, { siblingData }: { siblingData: LinkSibling }) =>
          value || (!required && !isFilled(siblingData)) ? true : "Add the link text.",
      },
    ],
  };
};
