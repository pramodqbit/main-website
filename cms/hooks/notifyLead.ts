import type { CollectionAfterChangeHook } from "payload";
import type { Lead } from "../../payload-types";
import { autoReplyHtml, sendSafely, tableHtml } from "./email";

export const notifyLead: CollectionAfterChangeHook<Lead> = async ({ doc, operation, req }) => {
  if (operation !== "create") return doc;

  const html = tableHtml(
    "New lead",
    [
      ["Name", doc.name],
      ["Email", doc.email],
      ["Company", doc.company],
      ["Role", doc.role],
      ["Website", doc.website],
      ["Budget", doc.budget],
      ["Timeline", doc.timeline],
      ["Services", doc.services],
      ["Message", doc.message],
      ["Page", doc.sourcePath],
      ["UTM source", doc.utm?.source],
      ["UTM medium", doc.utm?.medium],
      ["UTM campaign", doc.utm?.campaign],
      ["Referrer", doc.referrer],
    ],
    `/admin/collections/leads/${doc.id}`,
  );

  await sendSafely(req, {
    kind: "lead notification",
    to: process.env.LEADS_NOTIFY_TO,
    subject: `New lead: ${doc.name}${doc.company ? ` (${doc.company})` : ""}`,
    html,
  });

  await sendSafely(req, {
    kind: "lead auto-reply",
    to: doc.email,
    subject: "Thanks for contacting Qbitlog",
    html: autoReplyHtml(doc.name, "Thanks, we'll reply within one business day."),
  });

  return doc;
};
