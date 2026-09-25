import type { Access, FieldAccess, PayloadRequest } from "payload";

export type Role = "admin" | "editor" | "author";

export const roleOf = (req: PayloadRequest): Role | undefined => {
  const role = (req.user as { role?: unknown } | null | undefined)?.role;
  return role === "admin" || role === "editor" || role === "author" ? role : undefined;
};

export const anyone: Access = () => true;

export const nobody: Access = () => false;

export const authenticated: Access = ({ req }) => Boolean(req.user);

export const isAdmin: Access = ({ req }) => roleOf(req) === "admin";

export const isAdminOrEditor: Access = ({ req }) => {
  const role = roleOf(req);
  return role === "admin" || role === "editor";
};

/** Posts and LogEntries: authors may create and update drafts. Publishing is blocked by `preventAuthorPublish`. */
export const isAdminEditorOrAuthor: Access = ({ req }) => roleOf(req) !== undefined;

export const publishedOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: "published" } };

export const isAdminField: FieldAccess = ({ req }) => roleOf(req) === "admin";

/** Hides admin nav items from anyone who isn't an admin or editor. */
export const hiddenUnlessAdminOrEditor = ({ user }: { user: unknown }): boolean => {
  const role = (user as { role?: unknown } | null | undefined)?.role;
  return role !== "admin" && role !== "editor";
};

export const hiddenUnlessAdmin = ({ user }: { user: unknown }): boolean =>
  (user as { role?: unknown } | null | undefined)?.role !== "admin";
