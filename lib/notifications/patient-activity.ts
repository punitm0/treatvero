import "server-only";
import { absoluteUrl } from "@/lib/utils";
import { ADMIN_PATH } from "@/lib/admin/path";
import { escapeHtml, notifyTeam } from "@/lib/notifications/email";

/**
 * Tells the coordination team a patient did something on their private page.
 * Like enquiry alerts, it carries only the reference and an admin link.
 */
export function notifyPatientActivity(reference: string, what: string, idempotencyKey: string): void {
  const link = absoluteUrl(`${ADMIN_PATH}/requests/${reference}`);
  notifyTeam({
    subject: `Patient ${what} — ${reference}`,
    text: `The patient for ${reference} ${what}.\n\nOpen it in the admin: ${link}`,
    html: `<p>The patient for <strong>${escapeHtml(reference)}</strong> ${escapeHtml(what)}.</p><p><a href="${escapeHtml(link)}">Open ${escapeHtml(reference)} in the admin</a></p>`,
    idempotencyKey,
  });
}
