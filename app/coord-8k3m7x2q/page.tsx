import Link from "next/link";
import { Paperclip, Search } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import { PAGE_SIZE, REQUEST_STATUSES, isRequestStatus, listRequests, statusCounts } from "@/lib/admin/requests";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime, planLabel } from "@/components/admin/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Enquiries" };

function href(params: { status?: string; q?: string; page?: number }) {
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `${ADMIN_PATH}?${qs}` : ADMIN_PATH;
}

export default async function AdminRequestsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = isRequestStatus(sp.status) ? sp.status : undefined;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 100) : "";
  const page = Math.max(1, Math.min(1000, Number(sp.page) || 1));

  const [{ rows, total }, counts] = await Promise.all([listRequests({ status, query: q, page }), statusCounts()]);
  const all = Object.values(counts).reduce((a, b) => a + b, 0);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const tabs = [{ id: undefined, label: "All", n: all }, ...REQUEST_STATUSES.map((s) => ({ id: s.id, label: s.label, n: counts[s.id] ?? 0 }))];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="m-0 font-serif text-[32px] leading-none font-normal tracking-[-0.02em]">Enquiries</h1>
        <form action={ADMIN_PATH} method="get" role="search" className="flex w-full max-w-[360px] items-center gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <label className="relative flex-1">
            <span className="sr-only">Search by reference, name, email or phone</span>
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Reference, name, email, phone"
              className="h-10 w-full rounded-full border border-line-strong bg-surface pr-3 pl-9 text-sm outline-none focus:border-brand"
            />
          </label>
        </form>
      </div>

      <nav aria-label="Filter by status" className="flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const on = t.id === status;
          return (
            <Link
              key={t.label}
              href={href({ status: t.id, q })}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] no-underline",
                on ? "border-ink bg-ink text-white hover:text-white" : "border-line bg-surface text-ink-muted hover:border-line-hover hover:text-ink",
              )}
            >
              {t.label}
              <span className={cn("font-mono text-xs", on ? "text-white/70" : "text-ink-subtle")}>{t.n}</span>
            </Link>
          );
        })}
      </nav>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {rows.length === 0 ? (
          <p className="m-0 px-5 py-12 text-center text-sm text-ink-subtle">
            {q || status ? "No enquiries match these filters." : "No enquiries yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-ink-subtle">
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Treatment</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.reference} className="border-b border-line-soft last:border-0 hover:bg-sand-3">
                    <td className="px-4 py-3 whitespace-nowrap text-ink-muted">{formatDateTime(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <Link href={`${ADMIN_PATH}/requests/${r.reference}`} className="font-mono text-[13px] font-medium">
                        {r.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block font-medium">{r.full_name}</span>
                      <span className="text-xs text-ink-subtle">{r.country}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block">{r.treatment}</span>
                      <span className="flex items-center gap-2 text-xs text-ink-subtle">
                        {r.city && r.city !== "No preference" ? `${r.destination} · ${r.city}` : r.destination}
                        {r.report_count > 0 ? (
                          <span className="inline-flex items-center gap-0.5" title={`${r.report_count} report(s)`}>
                            <Paperclip aria-hidden="true" className="size-3" />
                            {r.report_count}
                            <span className="sr-only"> reports</span>
                          </span>
                        ) : null}
                      </span>
                    </td>
                    <td className="px-4 py-3">{planLabel(r.plan)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 ? (
        <nav aria-label="Pagination" className="flex items-center justify-between text-sm">
          {page > 1 ? <Link href={href({ status, q, page: page - 1 })}>← Newer</Link> : <span />}
          <span className="text-ink-subtle">
            Page {page} of {pages}
          </span>
          {page < pages ? <Link href={href({ status, q, page: page + 1 })}>Older →</Link> : <span />}
        </nav>
      ) : null}
    </div>
  );
}
