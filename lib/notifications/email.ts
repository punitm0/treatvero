import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { siteConfig } from "@/lib/config";

/**
 * Email through the Resend API (RESEND_API_KEY Worker secret; treatvero.com
 * must be a verified sender domain in Resend).
 */

export type Email = {
  to: string[];
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  /** Resend drops repeats of the same key for 24h, so retries never double-send. */
  idempotencyKey?: string;
};

export type SendResult = { ok: true } | { ok: false; error: string };

export async function sendEmail(email: Email): Promise<SendResult> {
  const apiKey = getCloudflareContext().env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "Email isn't configured (RESEND_API_KEY is not set)." };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(email.idempotencyKey ? { "Idempotency-Key": email.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: email.from,
        to: email.to,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
    });
    return res.ok ? { ok: true } : { ok: false, error: `The email service returned ${res.status}.` };
  } catch {
    return { ok: false, error: "The email service couldn't be reached." };
  }
}

export const escapeHtml = (v: string) => v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Plain text → minimal HTML email (paragraphs, line breaks, links kept as text). */
export function textToHtml(text: string): string {
  const body = text
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
  return `<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#1c1b19;line-height:1.5;font-size:15px">${body}</body></html>`;
}

function teamRecipients(): { to: string[]; from: string } {
  const env = getCloudflareContext().env;
  const to = String(env.ENQUIRY_ALERT_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return { to, from: String(env.ENQUIRY_ALERT_FROM || "") };
}

/**
 * Background alert to the coordination team (ENQUIRY_ALERT_TO). Alerts leave
 * our infrastructure, so callers must not include patient names, contact
 * details or medical information — only a reference and an admin link.
 */
export function notifyTeam(args: { subject: string; text: string; html: string; idempotencyKey: string }): void {
  const { to, from } = teamRecipients();
  if (!to.length || !from) return;
  const { ctx } = getCloudflareContext();
  ctx.waitUntil(
    sendEmail({ ...args, to, from: `${siteConfig.name} alerts <${from}>` }).then((r) => {
      if (!r.ok) console.error(`[alerts] "${args.idempotencyKey}" not sent: ${r.error}`);
    }),
  );
}
