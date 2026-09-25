import type { PayloadRequest } from "payload";
import { escapeHtml } from "../utilities/escapeHtml";
import { siteUrl } from "../utilities/previewPath";

export const isEmailDryRun = (): boolean => process.env.EMAIL_DRY_RUN === "true";

export type EmailRow = [label: string, value: unknown];

export function tableHtml(heading: string, rows: EmailRow[], adminPath: string): string {
  const body = rows
    .filter(([, value]) => value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && !value.length))
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:4px 12px 4px 0;vertical-align:top">${escapeHtml(label)}</th><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const adminUrl = `${siteUrl}${adminPath}`;
  return `<h2>${escapeHtml(heading)}</h2><table>${body}</table><p><a href="${escapeHtml(adminUrl)}">Open in the CMS</a></p>`;
}

type SendArgs = { to: string | undefined; subject: string; html: string; kind: string };

/** Sends an email without ever throwing. Logs never include recipient addresses or form content. */
export async function sendSafely(req: PayloadRequest, { to, subject, html, kind }: SendArgs): Promise<void> {
  if (isEmailDryRun()) {
    req.payload.logger.info(`[email:dry-run] ${kind} email skipped (EMAIL_DRY_RUN=true)`);
    return;
  }
  if (!to) {
    req.payload.logger.warn(`[email] ${kind} email skipped: no recipient configured`);
    return;
  }
  try {
    await req.payload.sendEmail({ to, subject, html });
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown error";
    req.payload.logger.error(`[email] ${kind} email failed (${reason})`);
  }
}

export const autoReplyHtml = (name: unknown, body: string): string =>
  `<p>Hi ${escapeHtml(name)},</p><p>${escapeHtml(body)}</p><p>The Qbitlog team<br/><a href="${escapeHtml(siteUrl)}">${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}</a></p>`;
