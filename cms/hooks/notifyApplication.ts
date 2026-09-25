import type { CollectionAfterChangeHook } from "payload";
import type { Application } from "../../payload-types";
import { autoReplyHtml, sendSafely, tableHtml } from "./email";

export const notifyApplication: CollectionAfterChangeHook<Application> = async ({ doc, operation, req }) => {
  if (operation !== "create") return doc;

  const jobTitle = typeof doc.job === "object" && doc.job ? doc.job.title : undefined;

  const html = tableHtml(
    "New job application",
    [
      ["Role", jobTitle],
      ["Name", doc.name],
      ["Email", doc.email],
      ["Phone", doc.phone],
      ["LinkedIn", doc.linkedin],
      ["Portfolio", doc.portfolio],
      ["Cover letter", doc.coverLetter],
    ],
    `/admin/collections/applications/${doc.id}`,
  );

  await sendSafely(req, {
    kind: "application notification",
    to: process.env.CAREERS_NOTIFY_TO,
    subject: `New application: ${doc.name}${jobTitle ? ` (${jobTitle})` : ""}`,
    html,
  });

  await sendSafely(req, {
    kind: "application auto-reply",
    to: doc.email,
    subject: "We received your application",
    html: autoReplyHtml(
      doc.name,
      "Thanks for applying to Qbitlog. We read every application and will get back to you within five business days.",
    ),
  });

  return doc;
};
