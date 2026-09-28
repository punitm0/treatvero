import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, Mail, MessageCircle } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import { REQUEST_STATUSES, getRequest, statusLabel, type RequestEvent } from "@/lib/admin/requests";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime, planLabel } from "@/components/admin/format";
import { buttonClasses } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import { changeStatus, saveNote } from "./actions";

export const metadata = { title: "Enquiry" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-ink-subtle">{label}</dt>
      <dd className="m-0 text-[15px]">{children || <span className="text-ink-subtle">—</span>}</dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">{title}</h2>
      {children}
    </section>
  );
}

function eventText(e: RequestEvent) {
  if (e.kind === "status") return `Status: ${statusLabel(e.from_status ?? "")} → ${statusLabel(e.to_status ?? "")}`;
  if (e.kind === "download") return `Downloaded ${e.body}`;
  return null;
}

export default async function AdminRequestPage({ params }: { params: Promise<{ reference: string }> }) {
  await requireAdmin();
  const { reference } = await params;
  const data = await getRequest(reference);
  if (!data) notFound();
  const { request: r, reports, events } = data;
  const waDigits = r.whatsapp.replace(/\D/g, "");

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
        </div>
        <p className="m-0 text-sm text-ink-subtle">
          <span className="font-mono">{r.reference}</span> · received {formatDateTime(r.created_at)} · {planLabel(r.plan)} plan
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-5">
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
          </Card>

          <Card title={`Medical reports (${reports.length})`}>
            {reports.length === 0 ? (
              <p className="m-0 text-sm text-ink-subtle">No reports were uploaded.</p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {reports.map((f) => (
                  <li key={f.report_id} className="flex items-center gap-3 rounded-xl border border-line-soft px-3.5 py-2.5">
                    <FileText aria-hidden="true" className="size-5 shrink-0 text-brand" strokeWidth={1.75} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{f.file_name}</span>
                      <span className="text-xs text-ink-subtle">{formatBytes(f.size_bytes)}</span>
                    </span>
                    <a
                      href={`${ADMIN_PATH}/requests/${r.reference}/reports/${f.report_id}`}
                      className="flex items-center gap-1 text-sm no-underline"
                      download
                    >
                      <Download aria-hidden="true" className="size-4" />
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 mb-0 text-xs text-ink-subtle">Downloads are logged in the activity below.</p>
          </Card>

          <Card title="Consent">
            <p className="mt-0 mb-2 text-sm text-ink-muted">{r.consent_text}</p>
            <p className="m-0 text-xs text-ink-subtle">Given {formatDateTime(r.consent_at)}</p>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Contact">
            <dl className="m-0 flex flex-col gap-3">
              <Field label="Email">{r.email}</Field>
              <Field label="WhatsApp">{r.whatsapp}</Field>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {waDigits ? (
                <a
                  href={`https://wa.me/${waDigits}?text=${encodeURIComponent(`Hi ${r.full_name}, this is TreatVero about your request ${r.reference}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses({ size: "sm", className: "gap-1.5" })}
                >
                  <MessageCircle aria-hidden="true" className="size-4" />
                  WhatsApp
                </a>
              ) : null}
              <a
                href={`mailto:${r.email}?subject=${encodeURIComponent(`Your TreatVero request ${r.reference}`)}`}
                className={buttonClasses({ variant: "outline", size: "sm", className: "gap-1.5" })}
              >
                <Mail aria-hidden="true" className="size-4" />
                Email
              </a>
            </div>
          </Card>

          <Card title="Status">
            <form action={changeStatus.bind(null, r.reference)} className="flex gap-2">
              <label className="flex-1">
                <span className="sr-only">Status</span>
                <select
                  name="status"
                  defaultValue={r.status}
                  className="h-10 w-full rounded-full border border-line-strong bg-surface px-3 text-sm outline-none focus:border-brand"
                >
                  {REQUEST_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className={buttonClasses({ variant: "dark", size: "sm" })}>
                Update
              </button>
            </form>
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
                  className="w-full resize-y rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
                />
              </label>
              <button type="submit" className={buttonClasses({ variant: "outline", size: "sm", className: "self-end" })}>
                Add note
              </button>
            </form>
            {events.length === 0 ? (
              <p className="m-0 text-sm text-ink-subtle">No activity yet.</p>
            ) : (
              <ol className="m-0 flex list-none flex-col gap-3 p-0">
                {events.map((e) => (
                  <li key={e.id} className="border-l-2 border-line pl-3">
                    <p className="m-0 text-sm whitespace-pre-wrap">{eventText(e) ?? e.body}</p>
                    <p className="m-0 text-xs text-ink-subtle">
                      {e.actor_email} · {formatDateTime(e.created_at)}
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
