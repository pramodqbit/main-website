import type { Access, CollectionConfig } from "payload";
import { isAdmin, isAdminField, roleOf } from "../access";
import { firstUserIsAdmin } from "../hooks/firstUserIsAdmin";

const adminOrSelf: Access = ({ req }) => {
  if (roleOf(req) === "admin") return true;
  return req.user ? { id: { equals: req.user.id } } : false;
};

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "User", plural: "Users" },
  auth: {
    tokenExpiration: 28800,
    maxLoginAttempts: 5,
    lockTime: 900000,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role", "updatedAt"],
    group: "Settings",
    description: "People who can sign in to the CMS. Only admins can add users or change roles.",
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    read: adminOrSelf,
    create: isAdmin,
    update: adminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [firstUserIsAdmin],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      saveToJWT: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Author", value: "author" },
      ],
      access: { create: isAdminField, update: isAdminField },
      admin: {
        position: "sidebar",
        description:
          "Admin: everything. Editor: create, edit and publish all content, read leads. Author: write drafts of Insights and Log Entries only.",
      },
    },
  ],
};
