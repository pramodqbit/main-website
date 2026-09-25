import type { CollectionConfig } from "payload";
import { isAdmin, isAdminOrEditor, publishedOrLoggedIn } from "../access";
import { revalidateDelete, revalidateDoc } from "../hooks/revalidate";
import { previewUrl } from "../utilities/previewPath";

/** Drafts, autosave, scheduled publish, preview, live preview and revalidation for the Content group. */
export const contentDefaults = (slug: string) =>
  ({
    access: {
      read: publishedOrLoggedIn,
      create: isAdminOrEditor,
      update: isAdminOrEditor,
      delete: isAdmin,
    },
    versions: {
      drafts: { autosave: { interval: 375 }, schedulePublish: true },
      maxPerDoc: 25,
    },
    hooks: {
      afterChange: [revalidateDoc],
      afterDelete: [revalidateDelete],
    },
    preview: (doc: unknown) => previewUrl(slug, doc),
    livePreviewUrl: ({ data }: { data: unknown }) => previewUrl(slug, data),
  }) satisfies Pick<CollectionConfig, "access" | "versions"> & Record<string, unknown>;

/** Studio collections: plain published data, readable by anyone, edited by admins/editors. */
export const studioAccess: CollectionConfig["access"] = {
  read: () => true,
  create: isAdminOrEditor,
  update: isAdminOrEditor,
  delete: isAdmin,
};

export const orderField = {
  name: "order",
  type: "number",
  admin: { position: "sidebar", description: "Lower numbers are shown first." },
} as const;
