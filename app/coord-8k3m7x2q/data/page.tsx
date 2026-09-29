import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import { AUDIT_LABELS, RETENTION_STATUSES, listAudit, retentionCandidates } from "@/lib/admin/data";
import { statusLabel } from "@/lib/admin/requests";
import { formatDateTime } from "@/components/admin/format";
import { Card } from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/action-form";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RETENTION_MONTHS } from "./options";
import { runPurge } from "./actions";

export const metadata = { title: "Data & privacy" };

export default async function DataPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const months = RETENTION_MONTHS.find((m) => String(m) === sp.months) ?? 12;
  const [candidates, log] = await Promise.all([retentionCandidates(months), listAudit()]);
  const reportTotal = candidates.reduce((a, c) => a + c.report_count, 0);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="m-0 font-serif text-[32px] leading-none font-normal tracking-[-0.02em]">Data &amp; privacy</h1>

      <Card title="Report retention">
        <p className="mt-0 mb-3 text-sm text-ink-muted">
          Deletes the medical reports of {RETENTION_STATUSES.map(statusLabel).join(" or ").toLowerCase()} requests with no activity
          for the chosen period. The request record and its activity stay; each deletion is logged on the request and below.
          To erase a whole request (e.g. a patient&apos;s deletion request), use “Delete request” on its page.
        </p>
        <nav aria-label="Retention period" className="mb-4 flex gap-1.5">
          {RETENTION_MONTHS.map((m) => (
            <Link
              key={m}
              href={`${ADMIN_PATH}/data?months=${m}`}
              aria-current={m === months ? "page" : undefined}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[13px] no-underline",
                m === months ? "border-ink bg-ink text-white hover:text-white" : "border-line bg-surface text-ink-muted hover:text-ink",
              )}
            >
              {m} months
            </Link>
          ))}
        </nav>
        {candidates.length ? (
          <>
            <p className="mt-0 mb-2 text-sm">
              {reportTotal} report(s) across {candidates.length} request(s) would be deleted:
            </p>
            <ul className="mt-0 mb-4 flex max-h-[240px] list-none flex-col gap-1 overflow-y-auto rounded-xl border border-line-soft p-3 text-sm">
              {candidates.map((c) => (
                <li key={c.reference} className="flex justify-between gap-3">
                  <Link href={`${ADMIN_PATH}/requests/${c.reference}`} className="font-mono text-[13px]">
                    {c.reference}
                  </Link>
                  <span className="text-ink-subtle">
                    {statusLabel(c.status)} · {c.report_count} report(s) · last activity {formatDateTime(c.last_activity)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="m-0 text-sm text-ink-subtle">No reports are due for deletion under this period.</p>
        )}
        {/* Always mounted so the result message stays visible after the list empties. */}
        <ActionForm action={runPurge} className="flex flex-wrap items-center gap-3">
          {candidates.length ? (
            <>
              <input type="hidden" name="months" value={months} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="confirm" className="size-4 accent-brand" />
                I understand these reports are deleted permanently
              </label>
              <button type="submit" className={buttonClasses({ variant: "dark", size: "sm", className: "h-9" })}>
                Delete {reportTotal} report(s)
              </button>
            </>
          ) : null}
        </ActionForm>
      </Card>

      <Card title="Audit log">
        {log.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-xs text-ink-subtle">
                  <th className="pb-2 font-medium">When</th>
                  <th className="pb-2 font-medium">Action</th>
                  <th className="pb-2 font-medium">Detail</th>
                  <th className="pb-2 font-medium">By</th>
                </tr>
              </thead>
              <tbody>
                {log.map((e) => (
                  <tr key={e.id} className="border-t border-line-soft align-top">
                    <td className="py-2 pr-3 whitespace-nowrap text-ink-muted">{formatDateTime(e.created_at)}</td>
                    <td className="py-2 pr-3">{AUDIT_LABELS[e.action] ?? e.action}</td>
                    <td className="py-2 pr-3 break-all text-ink-muted">{e.detail}</td>
                    <td className="py-2 text-ink-muted">{e.actor_email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="m-0 text-sm text-ink-subtle">No exports, deletions or purges yet.</p>
        )}
      </Card>
    </div>
  );
}
