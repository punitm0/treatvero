import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/utils";
import { ADMIN_PATH } from "@/lib/admin/path";
import type { EnquiryInput } from "@/lib/validation/enquiry";

/**
 * Emails the coordination team when an enquiry arrives (Cloudflare Email
 * Sending, `EMAIL` binding). Recipients come from ENQUIRY_ALERT_TO.
 *
 * Email leaves our infrastructure, so the alert deliberately contains no
 * patient name, contact details, age or medical description — only enough to
 * triage, plus a link to the (Access-protected) admin record.
 */
export function sendEnquiryAlert(args: { reference: string; input: EnquiryInput; reportCount: number }): void {
  const { env, ctx } = getCloudflareContext();
  const to = String(env.ENQUIRY_ALERT_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = String(env.ENQUIRY_ALERT_FROM || "");
  if (!to.length || !from || !env.EMAIL) return;

  const { reference, input, reportCount } = args;
  const link = absoluteUrl(`${ADMIN_PATH}/requests/${reference}`);
  const plan = input.plan === "concierge" ? "Concierge" : "Basic";
  const rows: [string, string][] = [
    ["Reference", reference],
    ["Plan", plan],
    ["Treatment", input.treatment],
    ["Destination", input.city && input.city !== "No preference" ? `${input.destination} — ${input.city}` : input.destination],
    ["Timing", input.timing || "Not given"],
    ["Reports attached", String(reportCount)],
  ];

  const text = [
    `A new treatment request was submitted on ${siteConfig.name}.`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `Open it in the admin: ${link}`,
    "",
    "Patient details are only available in the admin.",
  ].join("\n");

  const esc = (v: string) => v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const html = `<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#1c1b19;line-height:1.5">
<p>A new treatment request was submitted on ${esc(siteConfig.name)}.</p>
<table cellpadding="6" style="border-collapse:collapse;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:#6b6760">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>
<p><a href="${esc(link)}" style="color:#1d5a52">Open ${esc(reference)} in the admin</a></p>
<p style="color:#6b6760;font-size:13px">Patient details are only available in the admin.</p>
</body></html>`;

  ctx.waitUntil(
    (async () => {
      try {
        await env.EMAIL.send({
          to,
          from: { email: from, name: `${siteConfig.name} alerts` },
          subject: `New ${plan} enquiry ${reference}`,
          text,
          html,
        });
      } catch {
        console.error(`[enquiry] alert email for ${reference} failed`);
      }
    })(),
  );
}
