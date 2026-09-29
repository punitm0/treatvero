import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import { FIRST_CONTACT_SLA_HOURS, viewCounts } from "@/lib/admin/requests";
import { RANGES, getInsights, type Count, type RangeId } from "@/lib/admin/insights";
import { formatDate } from "@/components/admin/format";
import { Card } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const metadata = { title: "Insights" };

function Stat({ label, value, hint, href }: { label: string; value: string; hint?: string; href?: string }) {
  const body = (
    <>
      <p className="m-0 text-xs text-ink-subtle">{label}</p>
      <p className="m-0 font-serif text-[34px] leading-tight">{value}</p>
      {hint ? <p className="m-0 text-xs text-ink-subtle">{hint}</p> : null}
    </>
  );
  const cls = "flex flex-col gap-0.5 rounded-2xl border border-line bg-surface p-4 text-ink no-underline";
  return href ? (
    <Link href={href} className={cn(cls, "hover:border-line-hover hover:text-ink")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/** Horizontal bars: one hue, value labelled at the end, share of the largest bar. */
function Bars({ rows, total }: { rows: Count[]; total?: number }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  if (!rows.length) return <p className="m-0 text-sm text-ink-subtle">No data in this period.</p>;
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(0,140px)_1fr_auto] items-center gap-3 text-sm" title={`${r.label}: ${r.n}`}>
          <span className="truncate text-ink-muted">{r.label}</span>
          <span className="h-3 rounded-r-[4px] bg-brand" style={{ width: `${Math.max(1, (r.n / max) * 100)}%` }} />
          <span className="min-w-[48px] text-right font-mono text-xs">
            {r.n}
            {total ? <span className="text-ink-subtle"> · {Math.round((r.n / Math.max(total, 1)) * 100)}%</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function InsightsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const range = (RANGES.some((r) => r.id === sp.range) ? sp.range : "90") as RangeId;
  const [d, queues] = await Promise.all([getInsights(range), viewCounts()]);
  const weekMax = Math.max(1, ...d.weekly.map((w) => w.n));
  const conversion = d.total ? Math.round(((d.funnel.at(-1)?.n ?? 0) / d.total) * 100) : 0;
  const sla = d.contactedTotal ? Math.round((d.contactedWithinSla / d.contactedTotal) * 100) : null;
  const median = d.medianHoursToContact;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="m-0 font-serif text-[32px] leading-none font-normal tracking-[-0.02em]">Insights</h1>
        <nav aria-label="Period" className="flex gap-1.5">
          {RANGES.map((r) => (
            <Link
              key={r.id}
              href={`${ADMIN_PATH}/insights?range=${r.id}`}
              aria-current={r.id === range ? "page" : undefined}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[13px] no-underline",
                r.id === range ? "border-ink bg-ink text-white hover:text-white" : "border-line bg-surface text-ink-muted hover:text-ink",
              )}
            >
              {r.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Enquiries" value={String(d.total)} hint={d.byPlan.map((p) => `${p.n} ${p.label}`).join(" · ")} />
        <Stat label="Booked" value={`${conversion}%`} hint={`${d.funnel.at(-1)?.n ?? 0} of ${d.total} enquiries · ${d.paid} paid`} />
        <Stat
          label="Median time to first contact"
          value={median == null ? "—" : median < 1 ? `${Math.round(median * 60)} min` : `${median.toFixed(1)} h`}
          hint={sla == null ? "No contacts logged yet" : `${sla}% within ${FIRST_CONTACT_SLA_HOURS}h`}
        />
        <Stat
          label="Needs attention now"
          value={String(queues.due + queues.uncontacted + queues.replied)}
          hint={`${queues.due} follow-ups · ${queues.uncontacted} not contacted · ${queues.replied} replies`}
          href={`${ADMIN_PATH}?view=due`}
        />
      </div>

      <Card title="Enquiries per week (last 12 weeks)">
        <div className="flex h-[160px] items-end gap-1.5" role="img" aria-label={d.weekly.map((w) => `Week of ${formatDate(w.week)}: ${w.n}`).join("; ")}>
          {d.weekly.map((w) => (
            <div key={w.week} className="group relative flex h-full flex-1 flex-col justify-end" title={`Week of ${formatDate(w.week)}: ${w.n}`}>
              <span className="mb-1 text-center font-mono text-[11px] text-ink-subtle opacity-0 group-hover:opacity-100">{w.n}</span>
              <span className="block rounded-t-[4px] bg-brand group-hover:bg-brand-hover" style={{ height: `${w.n ? Math.max(2, (w.n / weekMax) * 100) : 0}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between border-t border-line pt-1.5 text-[11px] text-ink-subtle">
          <span>{formatDate(d.weekly[0]?.week ?? "")}</span>
          <span>Peak {Math.max(0, ...d.weekly.map((w) => w.n))} / week</span>
          <span>{formatDate(d.weekly.at(-1)?.week ?? "")}</span>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Pipeline (enquiries that reached each stage)">
          <Bars rows={d.funnel} total={d.total} />
          <p className="mt-3 mb-0 text-xs text-ink-subtle">{d.lost} marked lost in this period.</p>
        </Card>
        <Card title="Open work by owner">
          {d.workload.length ? (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-subtle">
                  <th className="pb-2 font-medium">Owner</th>
                  <th className="pb-2 text-right font-medium">Open</th>
                  <th className="pb-2 text-right font-medium">Follow-ups due</th>
                </tr>
              </thead>
              <tbody>
                {d.workload.map((w) => (
                  <tr key={w.email} className="border-t border-line-soft">
                    <td className="py-2">
                      <Link href={`${ADMIN_PATH}?owner=${encodeURIComponent(w.email)}`}>{w.email}</Link>
                    </td>
                    <td className="py-2 text-right font-mono">{w.open}</td>
                    <td className={cn("py-2 text-right font-mono", w.due ? "text-warn-ink" : "")}>{w.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="m-0 text-sm text-ink-subtle">No open requests are assigned yet.</p>
          )}
        </Card>
        <Card title="Top treatments">
          <Bars rows={d.treatments} />
        </Card>
        <Card title="Top countries">
          <Bars rows={d.countries} />
        </Card>
        <Card title="Preferred cities">
          <Bars rows={d.cities} />
        </Card>
      </div>
    </div>
  );
}
