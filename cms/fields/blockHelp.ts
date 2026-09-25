import type { UIField } from "payload";

/** Read-only description at the top of a block (blocks have no `admin.description` in Payload). */
export const blockHelp = (text: string): UIField => ({
  name: "help",
  type: "ui",
  admin: {
    components: {
      Field: { path: "/cms/components/BlockHelp#BlockHelp", clientProps: { text } },
    },
  },
});
