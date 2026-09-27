import type { CollectionBeforeChangeHook } from "payload";

export const firstUserIsAdmin: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== "create") return data;
  // Not payload.count(): with no filter it runs MongoDB's estimatedDocumentCount, which is not allowed
  // inside the transaction Payload opens for the create, so every new user failed ("Something went wrong").
  const { docs } = await req.payload.find({
    collection: "users",
    limit: 1,
    pagination: false,
    depth: 0,
    overrideAccess: true,
    req,
  });
  if (docs.length === 0) return { ...data, role: "admin" };
  return data;
};
