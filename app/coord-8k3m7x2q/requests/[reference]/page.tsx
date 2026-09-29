import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Download,
  FileSignature,
  FileText,
  Printer,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import {
  FIRST_CONTACT_SLA_HOURS,
  OPEN_STATUSES,
  PATIENT_ACTOR,
  REQUEST_STATUSES,
  getRequest,
  knownAdmins,
  missedFirstContact,
  statusLabel,
  type RequestEvent,
} from "@/lib/admin/requests";
import { listOptions } from "@/lib/admin/options";
import { SEND_STATUSES, listHospitalSends } from "@/lib/admin/hospital-sends";
import { firstName, renderTemplates } from "@/lib/admin/messages";
import { listPatientLinks } from "@/lib/patient-links";
import { agreementStatus, currentAgreement, listAgreements } from "@/lib/agreements";
import { CONCIERGE_EXTRA_WEEK_USD, CONCIERGE_INCLUDED_DAYS, plans } from "@/data/pricing";
import { TERMS_VERSION } from "@/data/legal";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatCostRange, formatDate, formatDateTime, planLabel, todayIST } from "@/components/admin/format";
import { Card, Disclosure, Field, Label, inputClass, textareaClass } from "@/components/admin/ui";
import { HospitalSelect, OptionForm } from "@/components/admin/option-form";
import { MessageComposer } from "@/components/admin/message-composer";
import { ActionForm } from "@/components/admin/action-form";
import { CopyButton } from "@/components/admin/copy-button";
import { buttonClasses } from "@/components/ui/button";
import { treatments } from "@/data/treatments";
import { BUDGET_OPTIONS, CITY_OPTIONS, DESTINATION_OPTIONS, TIMING_OPTIONS, TREATMENT_OPTIONS } from "@/lib/validation/enquiry";
import { cn, formatBytes } from "@/lib/utils";
import {
  assign,
  cancelAgreement,
  changeStatus,
  editDetails,
  eraseRequest,
  followUp,
  logWhatsApp,
  newPatientLink,
  payment,
  prepareAgreement,
  recordHospitalSend,
  removeHospitalSend,
  removeOption,
  reorderOption,
  revokeLinks,
  saveNote,
  saveOption,
  sendPatientEmail,
  setHospitalSendStatus,
} from "./actions";

export const metadata = { title: "Enquiry" };

function eventText(e: RequestEvent) {
  if (e.kind === "status") return `Status: ${statusLabel(e.from_status ?? "")} → ${statusLabel(e.to_status ?? "")}`;
  if (e.kind === "download") return `Downloaded ${e.body}`;
  return e.body;
}

const smallButton = (variant: "outline" | "dark" = "outline", className?: string) =>
  buttonClasses({ variant, size: "sm", className: cn("h-9 px-3.5 text-[13px]", className) });

export default async function AdminRequestPage({ params }: { params: Promise<{ reference: string }> }) {
  const user = await requireAdmin();
  const { reference } = await params;
  const data = await getRequest(reference);
  if (!data) notFound();
  const { request: r, reports, events } = data;
  const [options, links, sends, admins, agreements] = await Promise.all([
    listOptions(reference),
    listPatientLinks(reference),
    listHospitalSends(reference),
    knownAdmins(),
    listAgreements(reference),
  ]);

  const waDigits = r.whatsapp.replace(/\D/g, "");
  const treatmentSlug = treatments.find((t) => t.name === r.treatment)?.slug;
  const activeLink = links.find((l) => l.active) ?? null;
  const templates = renderTemplates({ firstName: firstName(r.full_name), reference: r.reference, plan: planLabel(r.plan), link: activeLink?.url ?? null });
  const today = todayIST();
  const isOpen = (OPEN_STATUSES as string[]).includes(r.status);
  const followUpDue = Boolean(r.follow_up_on && r.follow_up_on <= today && isOpen);
  const uncontacted = missedFirstContact(r);
  const assignees = [...new Set([user.email, ...admins])];
  const base = `${ADMIN_PATH}/requests/${r.reference}`;
  const agreement = currentAgreement(agreements);
  const signing = agreementStatus(agreement);
  const needsAgreement = signing !== "signed" && (r.status === "booked" || Boolean(r.paid_at));
  const planFee = plans[r.plan === "concierge" ? "concierge" : "basic"].priceUSD;
  const optionById = new Map(options.map((o, i) => [o.id, `Option ${String.fromCharCode(65 + i)} — ${o.hospital_name}`]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link href={ADMIN_PATH} className="flex w-fit items-center gap-1 text-sm text-ink-muted no-underline">
          <ArrowLeft aria-hidden="true" className="size-4" />
          All enquiries
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="m-0 font-serif text-[32px] leading-none font-normal tracking-[-0.02em]">{r.full_name}</h1>
          <StatusBadge status={r.status} />
          {r.paid_at ? <span className="rounded-full border border-brand-line bg-brand-tint px-2.5 py-0.5 text-xs font-medium text-brand">Paid</span> : null}
          {signing === "signed" ? (
            <span className="rounded-full border border-brand-line bg-brand-tint px-2.5 py-0.5 text-xs font-medium text-brand">Agreement signed</span>
          ) : signing === "awaiting" ? (
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-muted">Awaiting signature</span>
          ) : null}
        </div>
        <p className="m-0 text-sm text-ink-subtle">
          <span className="font-mono">{r.reference}</span> · received {formatDateTime(r.created_at)} · {planLabel(r.plan)} plan
          {r.assigned_to ? ` · owner ${r.assigned_to}` : " · unassigned"}
        </p>
        {needsAgreement ? (
          <p className="m-0 flex w-fit items-center gap-2 rounded-xl border border-warn-line bg-warn-bg px-3 py-2 text-sm text-warn-ink">
            <AlertTriangle aria-hidden="true" className="size-4" />
            {signing === "awaiting"
              ? "The service agreement hasn't been signed yet. Remind the patient before on-ground work starts."
              : "No service agreement yet. Prepare one below and send the patient their link to sign."}
          </p>
        ) : null}
        {uncontacted || followUpDue ? (
          <p className="m-0 flex w-fit items-center gap-2 rounded-xl border border-warn-line bg-warn-bg px-3 py-2 text-sm text-warn-ink">
            <AlertTriangle aria-hidden="true" className="size-4" />
            {uncontacted
              ? `Not contacted yet — received over ${FIRST_CONTACT_SLA_HOURS} hours ago.`
              : `Follow-up ${r.follow_up_on === today ? "due today" : `overdue since ${formatDate(r.follow_up_on ?? "")}`}.`}
          </p>
        ) : null}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-5">
          <Card title="Case">
            <dl className="m-0 grid gap-4 sm:grid-cols-2">
              <Field label="Treatment">{r.treatment}</Field>
              <Field label="Patient age">{r.age}</Field>
              <Field label="Country of residence">{r.country}</Field>
              <Field label="Destination">{r.city && r.city !== "No preference" ? `${r.destination} · ${r.city}` : r.destination}</Field>
              <Field label="Travel timing">{r.timing}</Field>
              <Field label="Budget">{r.budget}</Field>
            </dl>
            <div className="mt-5 border-t border-line-soft pt-4">
              <p className="mt-0 mb-1.5 text-xs text-ink-subtle">Medical condition, in the patient&apos;s words</p>
              <p className="m-0 text-[15px] leading-relaxed whitespace-pre-wrap">{r.description}</p>
            </div>
            <Disclosure summary="Edit details" className="mt-4">
              <form action={editDetails.bind(null, r.reference)} className="grid gap-3 sm:grid-cols-2">
                <Label text="Full name">
                  <input name="full_name" defaultValue={r.full_name} required maxLength={120} className={inputClass} />
                </Label>
                <Label text="Email">
                  <input name="email" type="email" defaultValue={r.email} required maxLength={200} className={inputClass} />
                </Label>
                <Label text="WhatsApp">
                  <input name="whatsapp" defaultValue={r.whatsapp} required maxLength={40} className={inputClass} />
                </Label>
                <Label text="Country of residence">
                  <input name="country" defaultValue={r.country} required maxLength={80} className={inputClass} />
                </Label>
                <Label text="Patient age">
                  <input name="age" inputMode="numeric" defaultValue={r.age} required maxLength={3} className={inputClass} />
                </Label>
                <Label text="Treatment">
                  <select name="treatment" defaultValue={r.treatment} className={inputClass}>
                    {[...new Set([r.treatment, ...TREATMENT_OPTIONS])].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Label>
                <Label text="Destination">
                  <select name="destination" defaultValue={r.destination} className={inputClass}>
                    {[...new Set([r.destination, ...DESTINATION_OPTIONS])].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Label>
                <Label text="City">
                  <select name="city" defaultValue={r.city ?? ""} className={inputClass}>
                    <option value="">Not given</option>
                    {[...new Set([...(r.city ? [r.city] : []), ...CITY_OPTIONS])].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Label>
                <Label text="Travel timing">
                  <select name="timing" defaultValue={r.timing ?? ""} className={inputClass}>
                    <option value="">Not given</option>
                    {[...new Set([...(r.timing ? [r.timing] : []), ...TIMING_OPTIONS])].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Label>
                <Label text="Budget">
                  <select name="budget" defaultValue={r.budget ?? ""} className={inputClass}>
                    <option value="">Not given</option>
                    {[...new Set([...(r.budget ? [r.budget] : []), ...BUDGET_OPTIONS])].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Label>
                <div className="sm:col-span-2">
                  <button type="submit" className={smallButton("dark")}>
                    Save details
                  </button>
                  <span className="ml-3 text-xs text-ink-subtle">Changes are logged with the old values.</span>
                </div>
              </form>
            </Disclosure>
          </Card>

          <Card
            title={`Treatment options (${options.length})`}
            action={
              options.length ? (
                <Link href={`${base}/comparison`} className={smallButton("outline", "gap-1.5")}>
                  <Printer aria-hidden="true" className="size-4" />
                  Comparison PDF
                </Link>
              ) : null
            }
          >
            {options.length === 0 ? (
              <p className="mt-0 mb-4 text-sm text-ink-subtle">
                Add the quotes you receive from hospitals. They make up the comparison PDF and the patient&apos;s private options page.
              </p>
            ) : (
              <ol className="m-0 mb-4 flex list-none flex-col gap-2 p-0">
                {options.map((o, i) => (
                  <li key={o.id} className="rounded-xl border border-line-soft">
                    <div className="flex items-start gap-3 px-3.5 py-3">
                      <span className="font-mono text-xs text-ink-subtle">{String.fromCharCode(65 + i)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="m-0 flex items-center gap-1.5 text-sm font-medium">
                          {o.hospital_name}
                          {o.recommended ? <Star aria-label="Our suggestion" className="size-3.5 fill-brand text-brand" /> : null}
                        </p>
                        <p className="m-0 text-xs text-ink-subtle">
                          {[o.city, o.doctor, formatCostRange(o.cost_min, o.cost_max, o.currency), o.valid_until ? `valid until ${formatDate(o.valid_until)}` : null]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center">
                        <form action={reorderOption.bind(null, r.reference, o.id, -1)}>
                          <button type="submit" disabled={i === 0} aria-label="Move up" className="flex size-8 items-center justify-center rounded-full text-ink-muted hover:bg-sand disabled:opacity-30">
                            <ArrowUp aria-hidden="true" className="size-4" />
                          </button>
                        </form>
                        <form action={reorderOption.bind(null, r.reference, o.id, 1)}>
                          <button type="submit" disabled={i === options.length - 1} aria-label="Move down" className="flex size-8 items-center justify-center rounded-full text-ink-muted hover:bg-sand disabled:opacity-30">
                            <ArrowDown aria-hidden="true" className="size-4" />
                          </button>
                        </form>
                        <form action={removeOption.bind(null, r.reference, o.id)}>
                          <button type="submit" aria-label={`Remove ${o.hospital_name}`} className="flex size-8 items-center justify-center rounded-full text-ink-muted hover:bg-sand">
                            <Trash2 aria-hidden="true" className="size-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                    <Disclosure summary="Edit" className="mx-3.5 mb-3">
                      <OptionForm action={saveOption.bind(null, r.reference, o.id)} treatment={treatmentSlug} option={o} />
                    </Disclosure>
                  </li>
                ))}
              </ol>
            )}
            <Disclosure summary="Add an option" open={options.length === 0}>
              <OptionForm action={saveOption.bind(null, r.reference, null)} treatment={treatmentSlug} />
            </Disclosure>
          </Card>

          <Card
            title="Hospitals"
            action={
              <Link href={`${base}/case-summary`} className={smallButton("outline", "gap-1.5")}>
                <Printer aria-hidden="true" className="size-4" />
                Case summary PDF
              </Link>
            }
          >
            <p className="mt-0 mb-4 text-sm text-ink-subtle">
              The case summary leaves out the patient&apos;s name and contact details. Send it with the reports to each hospital&apos;s
              international desk, then log it here to track replies.
            </p>
            {sends.length ? (
              <ul className="m-0 mb-4 flex list-none flex-col gap-2 p-0">
                {sends.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line-soft px-3.5 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-sm font-medium">{s.hospital_name}</p>
                      <p className="m-0 text-xs text-ink-subtle">
                        Sent {formatDateTime(s.sent_at)} by {s.sent_by}
                        {s.note ? ` · ${s.note}` : ""}
                      </p>
                    </div>
                    <form action={setHospitalSendStatus.bind(null, r.reference, s.id)} className="flex items-center gap-1.5">
                      <select name="status" defaultValue={s.status} aria-label={`Reply from ${s.hospital_name}`} className={cn(inputClass, "h-9 w-auto")}>
                        {SEND_STATUSES.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className={smallButton()}>
                        Save
                      </button>
                    </form>
                    <form action={removeHospitalSend.bind(null, r.reference, s.id)}>
                      <button type="submit" aria-label={`Remove ${s.hospital_name}`} className="flex size-8 items-center justify-center rounded-full text-ink-muted hover:bg-sand">
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : null}
            <Disclosure summary="Log a case sent to a hospital">
              <form action={recordHospitalSend.bind(null, r.reference)} className="grid gap-3 sm:grid-cols-2">
                <Label text="Hospital" className="sm:col-span-2">
                  <HospitalSelect treatment={treatmentSlug} />
                </Label>
                <Label text="Unlisted hospital name">
                  <input name="hospital_name" maxLength={160} className={inputClass} />
                </Label>
                <Label text="Note (contact, channel…)">
                  <input name="note" maxLength={500} className={inputClass} />
                </Label>
                <div className="sm:col-span-2">
                  <button type="submit" className={smallButton("dark")}>
                    Log send
                  </button>
                </div>
              </form>
            </Disclosure>
          </Card>

          <Card title={`Medical reports (${reports.length})`}>
            {reports.length === 0 ? (
              <p className="m-0 text-sm text-ink-subtle">No reports yet. The patient can add them from their private link.</p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {reports.map((f) => (
                  <li key={f.report_id} className="flex items-center gap-3 rounded-xl border border-line-soft px-3.5 py-2.5">
                    <FileText aria-hidden="true" className="size-5 shrink-0 text-brand" strokeWidth={1.75} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{f.file_name}</span>
                      <span className="text-xs text-ink-subtle">{formatBytes(f.size_bytes)}</span>
                    </span>
                    <a href={`${base}/reports/${f.report_id}`} className="flex items-center gap-1 text-sm no-underline" download>
                      <Download aria-hidden="true" className="size-4" />
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 mb-0 text-xs text-ink-subtle">Downloads are logged in the activity.</p>
          </Card>

          <Card
            title="Consent & agreements"
            action={
              agreement?.signed_at ? (
                <Link href={`${base}/agreement`} className={smallButton("outline", "gap-1.5")}>
                  <Printer aria-hidden="true" className="size-4" />
                  Signed agreement PDF
                </Link>
              ) : null
            }
          >
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              <li>
                <p className="mt-0 mb-1 flex items-center gap-1.5 text-sm font-medium">
                  <CheckCircle2 aria-hidden="true" className="size-4 text-brand" /> Data consent
                </p>
                <p className="mt-0 mb-1 text-sm text-ink-muted">{r.consent_text}</p>
                <p className="m-0 text-xs text-ink-subtle">Given {formatDateTime(r.consent_at)}</p>
              </li>
              <li className="border-t border-line-soft pt-4">
                {r.terms_accepted_at ? (
                  <>
                    <p className="mt-0 mb-1 flex items-center gap-1.5 text-sm font-medium">
                      <CheckCircle2 aria-hidden="true" className="size-4 text-brand" /> Terms of Service accepted
                    </p>
                    <p className="mt-0 mb-1 text-sm text-ink-muted">{r.terms_text}</p>
                    <p className="m-0 text-xs text-ink-subtle">
                      Accepted {formatDateTime(r.terms_accepted_at)} · version {r.terms_version}
                      {r.terms_version !== TERMS_VERSION ? ` (current is ${TERMS_VERSION} — the signed agreement covers the newer terms)` : ""}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-0 mb-1 flex items-center gap-1.5 text-sm font-medium">
                      <AlertTriangle aria-hidden="true" className="size-4 text-warn-ink" /> Terms of Service not accepted
                    </p>
                    <p className="m-0 text-sm text-ink-muted">
                      This enquiry arrived before patients accepted the Terms online. Signing the service agreement below
                      covers it — the agreement includes the Terms.
                    </p>
                  </>
                )}
              </li>
              <li className="border-t border-line-soft pt-4">
                <p className="mt-0 mb-1 flex items-center gap-1.5 text-sm font-medium">
                  {signing === "signed" ? (
                    <CheckCircle2 aria-hidden="true" className="size-4 text-brand" />
                  ) : (
                    <FileSignature aria-hidden="true" className="size-4 text-ink-subtle" />
                  )}
                  Service agreement
                  {signing === "awaiting" ? <span className="font-normal text-ink-subtle">· awaiting signature</span> : null}
                </p>
                {agreement?.signed_at ? (
                  <p className="m-0 text-sm text-ink-muted">
                    Signed by <strong className="font-medium text-ink">{agreement.signer_name}</strong>
                    {agreement.signer_relationship ? ` (${agreement.signer_relationship}, for the patient)` : ""} on{" "}
                    {formatDateTime(agreement.signed_at)} · {agreement.document.title} · version {agreement.version}
                  </p>
                ) : agreement ? (
                  <div className="flex flex-col gap-2">
                    <p className="m-0 text-sm text-ink-muted">
                      {agreement.document.title}, prepared {formatDateTime(agreement.created_at)} by {agreement.created_by}.{" "}
                      {activeLink
                        ? "The patient signs it on their private link — use the “Agreement to sign” message to send it."
                        : "Create a patient link (right) so the patient can sign it."}
                    </p>
                    <form action={cancelAgreement.bind(null, r.reference, agreement.id)}>
                      <button type="submit" className="text-[13px] text-error">
                        Withdraw agreement
                      </button>
                    </form>
                  </div>
                ) : (
                  <p className="m-0 text-sm text-ink-muted">
                    Sets out the scope, fee, refund policy and the patient&apos;s authorisation for us to deal with hospitals and
                    documents for them. Recommended for every booked case, and required before Concierge on-ground work.
                  </p>
                )}
                {!agreement?.signed_at ? (
                  <Disclosure summary={agreement ? "Replace with a new agreement" : "Prepare agreement"} open={!agreement && needsAgreement} className="mt-3">
                    <ActionForm action={prepareAgreement.bind(null, r.reference)} className="grid gap-3 sm:grid-cols-2">
                      {r.plan === "concierge" ? (
                        <>
                          <Label text="Expected arrival">
                            <input type="date" name="arrival" className={inputClass} />
                          </Label>
                          <Label text="Expected departure">
                            <input type="date" name="departure" className={inputClass} />
                          </Label>
                          <Label text="On-ground days">
                            <input name="days" inputMode="numeric" defaultValue={CONCIERGE_INCLUDED_DAYS} maxLength={3} className={inputClass} />
                          </Label>
                          <Label text="Companions">
                            <input name="companions" inputMode="numeric" defaultValue="1" maxLength={2} className={inputClass} />
                          </Label>
                        </>
                      ) : null}
                      <Label text="Agreed fee (USD)" className="sm:col-span-2">
                        <input name="fee" inputMode="numeric" defaultValue={planFee ?? ""} maxLength={7} className={inputClass} />
                      </Label>
                      <Label text="Anything else agreed (optional)" className="sm:col-span-2">
                        <textarea name="notes" rows={2} maxLength={1000} placeholder="e.g. Airport pickup for two, Hindi–Bengali translation" className={textareaClass} />
                      </Label>
                      <p className="m-0 text-xs text-ink-subtle sm:col-span-2">
                        {r.plan === "concierge"
                          ? `The fee should include any extra weeks beyond ${CONCIERGE_INCLUDED_DAYS} days ($${CONCIERGE_EXTRA_WEEK_USD} each). `
                          : ""}
                        The patient sees the full text, including the refund policy, before signing. No medical details go into it.
                      </p>
                      <div className="sm:col-span-2">
                        <button type="submit" className={smallButton("dark")}>
                          {agreement ? "Replace agreement" : "Prepare for signature"}
                        </button>
                      </div>
                    </ActionForm>
                  </Disclosure>
                ) : null}
              </li>
            </ul>
          </Card>

          <Card title="Delete request" className="border-warn-line">
            <p className="mt-0 mb-3 text-sm text-ink-muted">
              Permanently deletes the request, its reports, options, links and activity — for example when the patient asks us to
              erase their data. Only the reference is kept, in the audit log. This can&apos;t be undone.
            </p>
            <ActionForm action={eraseRequest.bind(null, r.reference)} className="grid gap-3 sm:grid-cols-2">
              <Label text={`Type ${r.reference} to confirm`}>
                <input name="confirm" autoComplete="off" className={inputClass} />
              </Label>
              <Label text="Reason (no patient details)">
                <input name="reason" maxLength={200} placeholder="Erasure request by email" className={inputClass} />
              </Label>
              <div className="sm:col-span-2">
                <button type="submit" className={smallButton("outline", "border-error text-error hover:border-error hover:text-error")}>
                  Delete permanently
                </button>
              </div>
            </ActionForm>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <Card title="Contact">
            <dl className="m-0 mb-4 flex flex-col gap-3">
              <Field label="Email">{r.email}</Field>
              <Field label="WhatsApp">{r.whatsapp}</Field>
            </dl>
            <Disclosure summary="Write a message" open>
              <MessageComposer
                templates={templates}
                whatsappDigits={waDigits}
                sendEmail={sendPatientEmail.bind(null, r.reference)}
                logWhatsApp={logWhatsApp.bind(null, r.reference)}
              />
            </Disclosure>
          </Card>

          <Card title="Status">
            <form action={changeStatus.bind(null, r.reference)} className="flex gap-2">
              <label className="flex-1">
                <span className="sr-only">Status</span>
                <select name="status" defaultValue={r.status} className={inputClass}>
                  {REQUEST_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className={smallButton("dark", "h-10")}>
                Update
              </button>
            </form>
          </Card>

          <Card title="Owner & follow-up">
            <form action={assign.bind(null, r.reference)} className="flex gap-2">
              <label className="flex-1">
                <span className="sr-only">Owner</span>
                <select name="assignee" defaultValue={r.assigned_to ?? ""} className={inputClass}>
                  <option value="">Unassigned</option>
                  {assignees.map((email) => (
                    <option key={email} value={email}>
                      {email === user.email ? `${email} (me)` : email}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className={smallButton("dark", "h-10")}>
                Assign
              </button>
            </form>
            {r.assigned_to !== user.email ? (
              <form action={assign.bind(null, r.reference)} className="mt-2">
                <input type="hidden" name="assignee" value="me" />
                <button type="submit" className="flex items-center gap-1 text-[13px] text-brand">
                  <UserRound aria-hidden="true" className="size-3.5" /> Assign to me
                </button>
              </form>
            ) : null}
            <form action={followUp.bind(null, r.reference)} className="mt-4 flex flex-col gap-2 border-t border-line-soft pt-4">
              <Label text={r.follow_up_on ? `Follow-up on ${formatDate(r.follow_up_on)}` : "Next follow-up"}>
                <input type="date" name="date" defaultValue={r.follow_up_on ?? ""} min={today} className={inputClass} />
              </Label>
              <input name="note" maxLength={300} placeholder="What to follow up on (optional)" aria-label="Follow-up note" className={inputClass} />
              <div className="flex gap-2">
                <button type="submit" className={smallButton("dark")}>
                  Set follow-up
                </button>
                {r.follow_up_on ? (
                  <button type="submit" name="clear" value="1" className={smallButton()}>
                    Mark done
                  </button>
                ) : null}
              </div>
            </form>
          </Card>

          <Card title="Patient link">
            {activeLink?.url ? (
              <div className="flex flex-col gap-2">
                <p className="m-0 rounded-xl bg-sand-2 px-3 py-2 font-mono text-xs break-all">{activeLink.url}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <CopyButton value={activeLink.url} label="Copy link" />
                  <a href={activeLink.url} target="_blank" rel="noopener noreferrer" className="text-[13px]">
                    Preview
                  </a>
                </div>
                <p className="m-0 text-xs text-ink-subtle">
                  Expires {formatDateTime(activeLink.expires_at)} ·{" "}
                  {activeLink.view_count ? `opened ${activeLink.view_count}× (last ${formatDateTime(activeLink.last_viewed_at ?? "")})` : "not opened yet"}
                </p>
                {activeLink.choice ? (
                  <p className="m-0 rounded-xl border border-brand-line bg-brand-tint px-3 py-2 text-sm">
                    <strong>Patient replied:</strong>{" "}
                    {activeLink.choice === "call" ? "Would like a call" : (optionById.get(activeLink.choice) ?? "An option that was later removed")}
                    {activeLink.choice_message ? <span className="mt-1 block whitespace-pre-wrap text-ink-muted">“{activeLink.choice_message}”</span> : null}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-0 mb-2 text-sm text-ink-subtle">
                A private page where the patient sees their options, replies with a choice and uploads more reports. No account needed.
              </p>
            )}
            <ActionForm action={newPatientLink.bind(null, r.reference)} className="mt-3 flex flex-wrap items-end gap-2">
              <Label text="Valid for">
                <select name="days" defaultValue="30" className={cn(inputClass, "h-9 w-auto")}>
                  {[7, 14, 30, 60].map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                </select>
              </Label>
              <button type="submit" className={smallButton("dark")}>
                {activeLink ? "Replace link" : "Create link"}
              </button>
            </ActionForm>
            {activeLink ? (
              <form action={revokeLinks.bind(null, r.reference)} className="mt-2">
                <button type="submit" className="text-[13px] text-error">
                  Revoke link
                </button>
              </form>
            ) : null}
          </Card>

          <Card title="Plan payment">
            {r.paid_at ? (
              <form action={payment.bind(null, r.reference)} className="flex flex-col gap-2">
                <p className="m-0 text-sm">
                  {planLabel(r.plan)} plan fee paid · marked {formatDateTime(r.paid_at)}
                  {r.payment_note ? <span className="block text-xs text-ink-subtle">{r.payment_note}</span> : null}
                </p>
                <input type="hidden" name="paid" value="0" />
                <button type="submit" className={smallButton("outline", "self-start")}>
                  Remove paid mark
                </button>
              </form>
            ) : (
              <form action={payment.bind(null, r.reference)} className="flex flex-col gap-2">
                <input type="hidden" name="paid" value="1" />
                <input name="note" maxLength={200} placeholder="Amount, method or payment reference" aria-label="Payment note" className={inputClass} />
                <button type="submit" className={smallButton("dark", "self-start")}>
                  Mark {planLabel(r.plan)} fee as paid
                </button>
              </form>
            )}
          </Card>

          <Card title="Activity">
            <form action={saveNote.bind(null, r.reference)} className="mb-4 flex flex-col gap-2">
              <label>
                <span className="sr-only">Internal note</span>
                <textarea
                  name="note"
                  rows={3}
                  required
                  maxLength={4000}
                  placeholder="Add an internal note (not visible to the patient)"
                  className={textareaClass}
                />
              </label>
              <button type="submit" className={smallButton("outline", "self-end")}>
                Add note
              </button>
            </form>
            {events.length === 0 ? (
              <p className="m-0 text-sm text-ink-subtle">No activity yet.</p>
            ) : (
              <ol className="m-0 flex list-none flex-col gap-3 p-0">
                {events.map((e) => (
                  <li key={e.id} className={cn("border-l-2 pl-3", e.actor_email === PATIENT_ACTOR ? "border-brand" : "border-line")}>
                    <p className="m-0 text-sm whitespace-pre-wrap">{eventText(e)}</p>
                    <p className="m-0 text-xs text-ink-subtle">
                      {e.actor_email === PATIENT_ACTOR ? "Patient" : e.actor_email} · {formatDateTime(e.created_at)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
