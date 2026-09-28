"use client";

import { startTransition, useActionState, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import type { RenderedTemplate } from "@/lib/admin/messages";
import { cn } from "@/lib/utils";

type Result = { ok: boolean; message: string } | null;

const field = "w-full rounded-xl border border-line-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand";

/**
 * Picks a template, lets the coordinator edit it, then either opens WhatsApp
 * with the text (logged when clicked) or sends it by email through Resend.
 */
export function MessageComposer({
  templates,
  whatsappDigits,
  sendEmail,
  logWhatsApp,
}: {
  templates: RenderedTemplate[];
  whatsappDigits: string;
  sendEmail: (prev: Result, formData: FormData) => Promise<Result>;
  logWhatsApp: (templateId: string) => Promise<void>;
}) {
  const initial = templates.find((t) => !t.disabled) ?? templates[0];
  const [templateId, setTemplateId] = useState(initial.id);
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);
  const [state, dispatch, sending] = useActionState(sendEmail, null);

  function pick(id: string) {
    const t = templates.find((x) => x.id === id);
    if (!t) return;
    setTemplateId(t.id);
    setSubject(t.subject);
    setBody(t.body);
  }

  const waHref = whatsappDigits ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(body)}` : null;

  return (
    <form
      // Dispatched by hand: a `<form action>` would reset the fields after sending.
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => dispatch(data));
      }}
      className="flex flex-col gap-2.5"
    >
      <input type="hidden" name="template" value={templateId} />
      <label className="flex flex-col gap-1">
        <span className="text-xs text-ink-subtle">Template</span>
        <select value={templateId} onChange={(e) => pick(e.target.value)} className={cn(field, "h-10 py-0")}>
          {templates.map((t) => (
            <option key={t.id} value={t.id} disabled={t.disabled}>
              {t.label}
              {t.disabled ? " (create a patient link first)" : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-ink-subtle">Email subject</span>
        <input name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} className={field} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-ink-subtle">Message</span>
        <textarea name="body" value={body} onChange={(e) => setBody(e.target.value)} rows={8} maxLength={8000} className={cn(field, "resize-y")} />
      </label>
      <p className="m-0 text-xs text-ink-subtle">Don&apos;t add medical details — WhatsApp text travels in a link and email leaves our systems.</p>
      <div className="flex flex-wrap gap-2">
        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => startTransition(() => logWhatsApp(templateId))}
            className={buttonClasses({ size: "sm", className: "gap-1.5" })}
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            WhatsApp
          </a>
        ) : null}
        <button type="submit" disabled={sending} className={buttonClasses({ variant: "outline", size: "sm", className: "gap-1.5" })}>
          <Mail aria-hidden="true" className="size-4" />
          {sending ? "Sending…" : "Send email"}
        </button>
      </div>
      {state ? (
        <p role="status" className={cn("m-0 text-[13px]", state.ok ? "text-brand" : "text-error")}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
