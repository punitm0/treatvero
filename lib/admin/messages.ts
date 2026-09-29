import { siteConfig } from "@/lib/config";

/**
 * Message templates coordinators send to patients over WhatsApp or email.
 * The coordinator can edit the text before sending.
 *
 * WhatsApp text ends up in a URL, and email leaves our infrastructure:
 * templates never include medical details, only the reference and the
 * patient's private link.
 */

export type TemplateContext = {
  firstName: string;
  reference: string;
  plan: string;
  /** The patient's active private link, if one exists. */
  link: string | null;
};

export type MessageTemplate = {
  id: string;
  label: string;
  needsLink: boolean;
  subject: (c: TemplateContext) => string;
  body: (c: TemplateContext) => string;
};

const signOff = `\n\nWarm regards,\n${siteConfig.name} coordination team`;

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "first_contact",
    label: "First contact",
    needsLink: false,
    subject: (c) => `Your ${siteConfig.name} request ${c.reference}`,
    body: (c) =>
      `Hi ${c.firstName},\n\nThank you for contacting ${siteConfig.name} (reference ${c.reference}). I'm your coordinator and will help you through the next steps.\n\nWhen would be a good time for a short call? We can also continue here if you prefer.${signOff}`,
  },
  {
    id: "options_ready",
    label: "Options ready",
    needsLink: true,
    subject: (c) => `Your treatment options are ready (${c.reference})`,
    body: (c) =>
      `Hi ${c.firstName},\n\nYour treatment options are ready. You can compare them and tell us which one you'd like to go ahead with on your private page:\n${c.link ?? ""}\n\nThe link is personal to you — please don't share it. Reply here if you have any questions.${signOff}`,
  },
  {
    id: "more_reports",
    label: "Request more reports",
    needsLink: true,
    subject: (c) => `Additional reports for your request ${c.reference}`,
    body: (c) =>
      `Hi ${c.firstName},\n\nThe hospitals reviewing your case have asked for some additional reports so they can give accurate advice and estimates. You can upload them securely here:\n${c.link ?? ""}\n\nPDF, JPG or PNG files are fine.${signOff}`,
  },
  {
    id: "agreement",
    label: "Agreement to sign",
    needsLink: true,
    subject: (c) => `Your ${siteConfig.name} service agreement (${c.reference})`,
    body: (c) =>
      `Hi ${c.firstName},\n\nBefore we go ahead, please read and sign your ${c.plan} service agreement on your private page. It sets out what we'll do, the fees, our refund policy and your authorisation for us to talk to hospitals for you:\n${c.link ?? ""}\n\nSigning takes a minute — you just type your name. If anything isn't clear, reply here and we'll talk it through.${signOff}`,
  },
  {
    id: "follow_up",
    label: "Follow-up",
    needsLink: false,
    subject: (c) => `Following up on your request ${c.reference}`,
    body: (c) =>
      `Hi ${c.firstName},\n\nI wanted to check in on your request ${c.reference}. Do you have any questions, or is there anything we can help with to move forward?${signOff}`,
  },
  {
    id: "blank",
    label: "Blank message",
    needsLink: false,
    subject: (c) => `Your ${siteConfig.name} request ${c.reference}`,
    body: (c) => `Hi ${c.firstName},\n\n${signOff.trimStart()}`,
  },
];

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

export type RenderedTemplate = { id: string; label: string; disabled: boolean; subject: string; body: string };

export function renderTemplates(c: TemplateContext): RenderedTemplate[] {
  return MESSAGE_TEMPLATES.map((t) => ({
    id: t.id,
    label: t.label,
    disabled: t.needsLink && !c.link,
    subject: t.subject(c),
    body: t.body(c),
  }));
}
