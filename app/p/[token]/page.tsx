import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CheckCircle2, FileSignature, FileText, Lock, MessageCircle, Upload } from "lucide-react";
import { resolvePatientLink } from "@/lib/patient-links";
import { MAX_FILES_PER_UPLOAD } from "@/lib/patient-links";
import { getRequestDetail, listReports } from "@/lib/admin/requests";
import { listOptions } from "@/lib/admin/options";
import { firstName } from "@/lib/admin/messages";
import { ComparisonNotes, OptionsComparison } from "@/components/admin/options-comparison";
import { ActionForm } from "@/components/admin/action-form";
import { PrintButton } from "@/components/admin/print-button";
import { formatDate, formatDateTime } from "@/components/admin/format";
import { LogoMark } from "@/components/ui/logo";
import { buttonClasses } from "@/components/ui/button";
import { ACCEPT_ATTR, MAX_UPLOAD_BYTES } from "@/lib/uploads/validate";
import { whatsappUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/config";
import { formatBytes } from "@/lib/utils";
import { currentAgreement, listAgreements } from "@/lib/agreements";
import { AgreementBody, SignatureBlock } from "@/components/agreements/agreement-document";
import { markViewed, signServiceAgreement, submitReply } from "./actions";
import { ViewBeacon } from "./view-beacon";

export const metadata: Metadata = {
  title: "Your treatment options",
  robots: { index: false, follow: false, nocache: true },
  referrer: "same-origin",
};

const UPLOAD_MESSAGES: Record<string, { ok: boolean; text: string }> = {
  ok: { ok: true, text: "Thank you — your reports were uploaded securely. Your coordinator has been notified." },
  partial: { ok: false, text: "Some files couldn't be uploaded. Only PDF, JPG or PNG files up to 20 MB each are accepted." },
  toolarge: { ok: false, text: "Those files are too large together. Please upload fewer at a time." },
  toomany: { ok: false, text: `Please upload up to ${MAX_FILES_PER_UPLOAD} files at a time.` },
  empty: { ok: false, text: "Choose at least one file to upload." },
  busy: { ok: false, text: "Too many uploads just now. Please wait a few minutes and try again." },
  invalid: { ok: false, text: "The upload didn't go through. Please try again." },
};

/**
 * A patient's private page, reached from the link their coordinator sends.
 * Shows the options prepared for them, takes their reply and accepts more
 * reports. The URL token is the only credential, so the page is never
 * cached or indexed, and never sends its URL to other sites as a referrer.
 */
export default async function PatientOptionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const { token } = await params;
  const link = await resolvePatientLink(token);
  const r = link ? await getRequestDetail(link.reference) : null;
  if (!link || !r) notFound();
  const [options, reports, agreements, sp] = await Promise.all([
    listOptions(r.reference),
    listReports(r.reference),
    listAgreements(r.reference),
    searchParams,
  ]);
  const agreement = currentAgreement(agreements);
  const upload = typeof sp.upload === "string" ? UPLOAD_MESSAGES[sp.upload] : undefined;
  const chosen = link.choice ? (link.choice === "call" ? "a call with your coordinator" : options.find((o) => o.id === link.choice)?.hospital_name) : null;

  return (
    <div className="min-h-dvh bg-canvas print:bg-white">
      <ViewBeacon markViewed={markViewed.bind(null, token)} />
      <header className="border-b border-line bg-surface print:hidden">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center gap-2.5 px-4 md:px-6">
          <LogoMark />
          <span className="text-[17px] font-semibold tracking-[-0.035em]">{siteConfig.name}</span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-ink-subtle">
            <Lock aria-hidden="true" className="size-3.5" /> Private page · {r.reference}
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1100px] flex-col gap-8 px-4 py-8 md:px-6 md:py-10 print:p-0">
        <section className="flex flex-col gap-2">
          <p className="label-mono m-0 text-ink-subtle">Reference {r.reference}</p>
          <h1 className="m-0 font-serif text-[34px] leading-tight font-normal tracking-[-0.02em] md:text-[42px]">
            Hi {firstName(r.full_name)}, here are your treatment options
          </h1>
          <p className="m-0 max-w-[680px] text-[15px] text-ink-muted">
            For {r.treatment.toLowerCase().startsWith("not sure") ? "your enquiry" : r.treatment}
            {r.city && r.city !== "No preference" ? ` in ${r.city}` : ""}. Compare the hospitals below, then tell us which one you&apos;d
            like to go ahead with — or ask for a call first. This page is personal to you; please don&apos;t share the link.
          </p>
        </section>

        {agreement && !agreement.signed_at ? (
          <section aria-labelledby="agreement-heading" className="rounded-2xl border border-brand-line bg-surface p-6 print:hidden">
            <p className="label-mono mt-0 mb-2 flex items-center gap-1.5 text-brand">
              <FileSignature aria-hidden="true" className="size-4" /> Action needed
            </p>
            <h2 id="agreement-heading" className="mt-0 mb-1 text-lg font-semibold">
              Please read and sign your {agreement.document.title.toLowerCase()}
            </h2>
            <p className="mt-0 mb-5 max-w-[680px] text-sm text-ink-muted">
              It sets out what we&apos;ll do for you, our fee and refund policy, and your permission for us to talk to hospitals for
              you. Questions? Message your coordinator before signing.
            </p>
            <div className="max-h-[420px] overflow-y-auto rounded-xl border border-line-soft p-5" tabIndex={0} aria-label="Agreement text">
              <AgreementBody document={agreement.document} />
            </div>
            <ActionForm action={signServiceAgreement.bind(null, token, agreement.id)} className="mt-5 flex max-w-[560px] flex-col gap-3">
              <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                <legend className="mb-1 p-0 text-sm font-medium">Who is signing?</legend>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input type="radio" name="capacity" value="patient" defaultChecked className="size-4 accent-brand" />I am the patient
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input type="radio" name="capacity" value="representative" className="size-4 accent-brand" />
                  I&apos;m signing for the patient (parent, guardian or family member)
                </label>
              </fieldset>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-ink-subtle">If signing for the patient: your relationship to them</span>
                <input
                  name="relationship"
                  maxLength={60}
                  placeholder="e.g. son, wife, legal guardian"
                  className="h-11 rounded-xl border border-line-strong bg-surface px-3 text-sm outline-none focus:border-brand"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-ink-subtle">Type your full name to sign</span>
                <input
                  name="name"
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  className="h-12 rounded-xl border border-line-strong bg-surface px-3 font-serif text-lg italic outline-none focus:border-brand"
                />
              </label>
              <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                <input type="checkbox" name="agree" required className="mt-0.5 size-4 shrink-0 accent-brand" />
                I have read this agreement and agree to it, and I understand that typing my name is my electronic signature.
              </label>
              <button type="submit" className={buttonClasses({ size: "sm", className: "self-start" })}>
                Sign agreement
              </button>
            </ActionForm>
          </section>
        ) : null}

        {agreement?.signed_at && agreement.signer_name ? (
          <details className="group rounded-2xl border border-line bg-surface print:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-6 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
              <CheckCircle2 aria-hidden="true" className="size-4 text-brand" />
              Your {agreement.document.title.toLowerCase()} — signed {formatDate(agreement.signed_at.slice(0, 10))}
              <span className="ml-auto text-ink-subtle transition-transform group-open:rotate-90">›</span>
            </summary>
            <div className="flex flex-col gap-5 border-t border-line-soft p-6">
              <AgreementBody document={agreement.document} />
              <SignatureBlock
                signerName={agreement.signer_name}
                relationship={agreement.signer_relationship}
                signedAt={agreement.signed_at}
                version={agreement.version}
              />
              <p className="m-0 text-xs text-ink-subtle">Need a copy? Ask your coordinator and we&apos;ll email you a PDF.</p>
            </div>
          </details>
        ) : null}

        {options.length ? (
          <section aria-labelledby="options-heading" className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="options-heading" className="m-0 text-lg font-semibold">
                {options.length} {options.length === 1 ? "option" : "options"}
              </h2>
              <span className="print:hidden">
                <PrintButton label="Save as PDF" />
              </span>
            </div>
            <OptionsComparison options={options} />
            <ComparisonNotes />
          </section>
        ) : (
          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="mt-0 mb-1 text-lg font-semibold">Your options are being prepared</h2>
            <p className="m-0 text-sm text-ink-muted">
              Your coordinator is collecting advice and estimates from hospitals. They&apos;ll appear here — you can upload any
              further reports below in the meantime.
            </p>
          </section>
        )}

        <div className="grid items-start gap-5 md:grid-cols-2 print:hidden">
          <section aria-labelledby="reply-heading" className="rounded-2xl border border-line bg-surface p-6">
            <h2 id="reply-heading" className="mt-0 mb-1 text-lg font-semibold">
              Your reply
            </h2>
            {chosen ? (
              <p className="mt-0 mb-3 flex items-start gap-2 rounded-xl bg-brand-tint px-3 py-2 text-sm">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
                You asked for {chosen} on {formatDateTime(link.choice_at ?? "")}. You can change your answer below.
              </p>
            ) : (
              <p className="mt-0 mb-3 text-sm text-ink-muted">Choosing an option isn&apos;t a commitment — your coordinator will confirm everything with you first.</p>
            )}
            <ActionForm action={submitReply.bind(null, token)} className="flex flex-col gap-2.5">
              {options.map((o, i) => (
                <label key={o.id} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand-tint">
                  <input type="radio" name="choice" value={o.id} defaultChecked={link.choice === o.id} className="size-4 accent-brand" />
                  Option {String.fromCharCode(65 + i)} — {o.hospital_name}
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand-tint">
                <input type="radio" name="choice" value="call" defaultChecked={link.choice === "call"} className="size-4 accent-brand" />
                I&apos;d like a call to discuss first
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-ink-subtle">Message or questions (optional)</span>
                <textarea
                  name="message"
                  rows={3}
                  maxLength={1000}
                  className="w-full resize-y rounded-xl border border-line-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </label>
              <button type="submit" className={buttonClasses({ size: "sm", className: "self-start" })}>
                Send reply
              </button>
            </ActionForm>
          </section>

          <section id="reports" aria-labelledby="reports-heading" className="rounded-2xl border border-line bg-surface p-6">
            <h2 id="reports-heading" className="mt-0 mb-1 text-lg font-semibold">
              Medical reports
            </h2>
            <p className="mt-0 mb-3 text-sm text-ink-muted">
              If the hospitals asked for more reports, add them here. PDF, JPG or PNG, up to {MAX_UPLOAD_BYTES / (1024 * 1024)} MB each,{" "}
              {MAX_FILES_PER_UPLOAD} at a time.
            </p>
            {upload ? (
              <p role="status" className={`mt-0 mb-3 rounded-xl px-3 py-2 text-sm ${upload.ok ? "bg-brand-tint text-brand-deep" : "bg-warn-bg text-warn-ink"}`}>
                {upload.text}
              </p>
            ) : null}
            <form action={`/api/p/${token}/reports`} method="post" encType="multipart/form-data" className="flex flex-col gap-3">
              <input
                type="file"
                name="files"
                multiple
                required
                accept={ACCEPT_ATTR}
                aria-label="Choose reports"
                className="text-sm file:mr-3 file:rounded-full file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-sm"
              />
              <button type="submit" className={buttonClasses({ variant: "outline", size: "sm", className: "gap-1.5 self-start" })}>
                <Upload aria-hidden="true" className="size-4" /> Upload securely
              </button>
            </form>
            {reports.length ? (
              <ul className="mt-4 mb-0 flex list-none flex-col gap-1.5 p-0 text-sm">
                {reports.map((f) => (
                  <li key={f.report_id} className="flex items-center gap-2 text-ink-muted">
                    <FileText aria-hidden="true" className="size-4 shrink-0 text-brand" />
                    <span className="truncate">{f.file_name}</span>
                    <span className="shrink-0 text-xs text-ink-subtle">{formatBytes(f.size_bytes)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-4 mb-0 flex items-start gap-2 text-xs text-ink-subtle">
              <Lock aria-hidden="true" className="mt-px size-3.5 shrink-0" />
              Reports are stored privately and shared only with hospitals reviewing your case.
            </p>
          </section>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-sm text-ink-muted print:hidden">
          <span>This link works until {formatDate(link.expires_at.slice(0, 10))}.</span>
          <a href={whatsappUrl(`Hi TreatVero, I have a question about my request ${r.reference}.`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
            <MessageCircle aria-hidden="true" className="size-4" /> Message us on WhatsApp
          </a>
        </footer>
      </main>
    </div>
  );
}
