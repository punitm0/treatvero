import Link from "next/link";
import { AlertTriangle, CalendarClock, Download, MessageSquareReply, Paperclip, Search } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import {
  OPEN_STATUSES,
  PAGE_SIZE,
  REQUEST_STATUSES,
  VIEWS,
  knownAdmins,
  missedFirstContact,
  listRequests,
  statusCounts,
  viewCounts,
  type RequestFilters,
} from "@/lib/admin/requests";
import { parseFilters, filtersToParams } from "@/lib/admin/filters";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate, formatDateTime, planLabel, todayIST } from "@/components/admin/format";
import { inputClass } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { TREATMENT_OPTIONS } from "@/lib/validation/enquiry";
import { cn } from "@/lib/utils";

export const metadata = { title: "Enquiries" };

function href(filters: RequestFilters, page = 1) {
  const sp = filtersToParams(filters);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${ADMIN_PATH}?${qs}` : ADMIN_PATH;
}

const chip = (on: boolean) =>
  cn(
    "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] no-underline",
    on ? "border-ink bg-ink text-white hover:text-white" : "border-line bg-surface text-ink-muted hover:border-line-hover hover:text-ink",
  );

export default async function AdminRequestsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireAdmin();
  const sp = await searchParams;
  const filters = parseFilters(sp, user.email);
  const page = Math.max(1, Math.min(1000, Number(sp.page) || 1));
  const deleted = typeof sp.deleted === "string" && /^TV-[A-Z2-9]{8}$/.test(sp.deleted) ? sp.deleted : null;

  const [{ rows, total }, counts, views, admins] = await Promise.all([
    listRequests({ ...filters, page }),
    statusCounts(),
    viewCounts(),
    knownAdmins(),
  ]);
  const all = Object.values(counts).reduce((a, b) => a + b, 0);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const today = todayIST();
  const tabs = [{ id: undefined, label: "All", n: all }, ...REQUEST_STATUSES.map((s) => ({ id: s.id, label: s.label, n: counts[s.id] ?? 0 }))];
  const hasExtraFilters = Boolean(filters.treatment || filters.plan || filters.from || filters.to || filters.assignee);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="m-0 font-serif text-[32px] leading-none font-normal tracking-[-0.02em]">Enquiries</h1>
        <form action={ADMIN_PATH} method="get" role="search" className="flex w-full max-w-[360px] items-center gap-2">
          {[...filtersToParams({ ...filters, query: undefined })].map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <label className="relative flex-1">
            <span className="sr-only">Search by reference, name, email or phone</span>
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" />
            <input
              name="q"
              defaultValue={filters.query}
              placeholder="Reference, name, email, phone"
              className="h-10 w-full rounded-full border border-line-strong bg-surface pr-3 pl-9 text-sm outline-none focus:border-brand"
            />
          </label>
        </form>
      </div>

      {deleted ? (
        <p role="status" className="m-0 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm">
          {deleted} and all its data were permanently deleted.
        </p>
      ) : null}

      <nav aria-label="Work queues" className="flex flex-wrap gap-1.5">
        {VIEWS.map((v) => (
          <Link key={v.id} href={href({ ...filters, status: undefined, view: filters.view === v.id ? undefined : v.id })} aria-current={filters.view === v.id ? "page" : undefined} className={chip(filters.view === v.id)}>
            {v.id === "due" ? <CalendarClock aria-hidden="true" className="size-3.5" /> : v.id === "uncontacted" ? <AlertTriangle aria-hidden="true" className="size-3.5" /> : <MessageSquareReply aria-hidden="true" className="size-3.5" />}
            {v.label}
            <span className={cn("font-mono text-xs", views[v.id] && filters.view !== v.id ? "font-semibold text-warn-ink" : "opacity-70")}>{views[v.id]}</span>
          </Link>
        ))}
        <Link href={href({ ...filters, assignee: filters.assignee === user.email ? undefined : user.email })} className={chip(filters.assignee === user.email)}>
          Mine
        </Link>
      </nav>

      <nav aria-label="Filter by status" className="flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const on = t.id === filters.status;
          return (
            <Link key={t.label} href={href({ ...filters, status: t.id })} aria-current={on ? "page" : undefined} className={chip(on)}>
              {t.label}
              <span className={cn("font-mono text-xs", on ? "text-white/70" : "text-ink-subtle")}>{t.n}</span>
            </Link>
          );
        })}
      </nav>

      <details open={hasExtraFilters} className="rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium select-none">Filters{hasExtraFilters ? " (active)" : ""}</summary>
        <form action={ADMIN_PATH} method="get" className="grid gap-3 border-t border-line-soft p-4 sm:grid-cols-3 lg:grid-cols-6">
          {filters.status ? <input type="hidden" name="status" value={filters.status} /> : null}
          {filters.view ? <input type="hidden" name="view" value={filters.view} /> : null}
          {filters.query ? <input type="hidden" name="q" value={filters.query} /> : null}
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-xs text-ink-subtle">Treatment</span>
            <select name="treatment" defaultValue={filters.treatment ?? ""} className={inputClass}>
              <option value="">Any</option>
              {TREATMENT_OPTIONS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-ink-subtle">Plan</span>
            <select name="plan" defaultValue={filters.plan ?? ""} className={inputClass}>
              <option value="">Any</option>
              <option value="basic">Basic</option>
              <option value="concierge">Concierge</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-ink-subtle">Owner</span>
            <select name="owner" defaultValue={filters.assignee ?? ""} className={inputClass}>
              <option value="">Anyone</option>
              <option value="none">Unassigned</option>
              {[...new Set([user.email, ...admins])].map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-ink-subtle">Received from</span>
            <input type="date" name="from" defaultValue={filters.from} max={today} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-ink-subtle">Received to</span>
            <input type="date" name="to" defaultValue={filters.to} max={today} className={inputClass} />
          </label>
          <div className="flex items-center gap-3 sm:col-span-3 lg:col-span-6">
            <button type="submit" className={buttonClasses({ variant: "dark", size: "sm", className: "h-9" })}>
              Apply
            </button>
            {hasExtraFilters ? (
              <Link href={href({ status: filters.status, view: filters.view, query: filters.query })} className="text-sm">
                Clear filters
              </Link>
            ) : null}
          </div>
        </form>
      </details>

      <div className="flex items-center justify-between text-sm text-ink-subtle">
        <span>
          {total} {total === 1 ? "enquiry" : "enquiries"}
        </span>
        <a href={`${ADMIN_PATH}/export?${filtersToParams(filters).toString()}`} className="flex items-center gap-1 text-sm no-underline">
          <Download aria-hidden="true" className="size-4" />
          Export CSV
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {rows.length === 0 ? (
          <p className="m-0 px-5 py-12 text-center text-sm text-ink-subtle">
            {all === 0 ? "No enquiries yet." : "No enquiries match these filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-ink-subtle">
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Treatment</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const late = missedFirstContact(r);
                  const due = r.follow_up_on && r.follow_up_on <= today && (OPEN_STATUSES as string[]).includes(r.status);
                  return (
                    <tr key={r.reference} className="border-b border-line-soft last:border-0 hover:bg-sand-3">
                      <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                        {formatDateTime(r.created_at)}
                        {late ? (
                          <span className="mt-0.5 flex items-center gap-1 text-xs text-warn-ink">
                            <AlertTriangle aria-hidden="true" className="size-3" /> Not contacted
                          </span>
                        ) : null}
                      </td>
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
                      <td className="px-4 py-3">
                        {planLabel(r.plan)}
                        {r.paid_at ? <span className="block text-xs text-brand">Paid</span> : null}
                        {r.agreement_status === "signed" ? (
                          <span className="block text-xs text-brand">Agreement signed</span>
                        ) : r.agreement_status === "awaiting" ? (
                          <span className="block text-xs text-ink-subtle">Awaiting signature</span>
                        ) : null}
                      </td>
                      <td className="max-w-[180px] truncate px-4 py-3 text-ink-muted">
                        {r.assigned_to ? r.assigned_to.split("@")[0] : <span className="text-ink-subtle">—</span>}
                        {r.follow_up_on && (OPEN_STATUSES as string[]).includes(r.status) ? (
                          <span className={cn("block text-xs", due ? "font-medium text-warn-ink" : "text-ink-subtle")}>
                            Follow up {r.follow_up_on === today ? "today" : formatDate(r.follow_up_on)}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 ? (
        <nav aria-label="Pagination" className="flex items-center justify-between text-sm">
          {page > 1 ? <Link href={href(filters, page - 1)}>← Newer</Link> : <span />}
          <span className="text-ink-subtle">
            Page {page} of {pages}
          </span>
          {page < pages ? <Link href={href(filters, page + 1)}>Older →</Link> : <span />}
        </nav>
      ) : null}
    </div>
  );
}
