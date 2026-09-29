import "server-only";
import { cfEnv } from "@/lib/cloudflare";
import { FIRST_CONTACT_SLA_HOURS, PATIENT_ACTOR } from "@/lib/admin/requests";
import { addDays, istDayStartUtc, todayIST } from "@/components/admin/format";

/** Numbers for the admin Insights page. Computed on demand from D1. */

export const RANGES = [
  { id: "30", label: "Last 30 days", days: 30 },
  { id: "90", label: "Last 90 days", days: 90 },
  { id: "365", label: "Last 12 months", days: 365 },
] as const;
export type RangeId = (typeof RANGES)[number]["id"];

export type Count = { label: string; n: number };

export type Insights = {
  total: number;
  byPlan: Count[];
  paid: number;
  funnel: Count[];
  lost: number;
  contactedWithinSla: number;
  contactedTotal: number;
  medianHoursToContact: number | null;
  weekly: { week: string; n: number }[];
  treatments: Count[];
  countries: Count[];
  cities: Count[];
  workload: { email: string; open: number; due: number }[];
};

const FUNNEL = [
  { id: "new", label: "Received" },
  { id: "contacted", label: "Contacted" },
  { id: "options_sent", label: "Options sent" },
  { id: "booked", label: "Booked" },
] as const;

const db = () => cfEnv().DB;

function top(values: (string | null)[], limit = 6): Count[] {
  const counts = new Map<string, number>();
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .map(([label, n]) => ({ label, n }))
    .sort((a, b) => b.n - a.n || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Monday (IST) of the week containing an ISO instant, as YYYY-MM-DD. */
function weekOf(iso: string): string {
  const day = todayIST(new Date(iso));
  const dow = (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7;
  return addDays(day, -dow);
}

export async function getInsights(range: RangeId): Promise<Insights> {
  const days = RANGES.find((r) => r.id === range)?.days ?? 30;
  const since = istDayStartUtc(addDays(todayIST(), -(days - 1)));
  const weeksStart = weekOf(new Date(Date.now() - 11 * 7 * 86400_000).toISOString());

  const [reqs, events, weekly, workload] = await db().batch([
    db()
      .prepare("SELECT reference, created_at, status, plan, treatment, country, city, paid_at FROM treatment_requests WHERE created_at >= ?")
      .bind(since),
    db()
      .prepare(
        `SELECT e.reference, e.kind, e.to_status, e.created_at FROM request_events e
         JOIN treatment_requests r ON r.reference = e.reference
         WHERE r.created_at >= ? AND e.actor_email <> ? AND e.kind IN ('status', 'message')
         ORDER BY e.created_at`,
      )
      .bind(since, PATIENT_ACTOR),
    db().prepare("SELECT created_at FROM treatment_requests WHERE created_at >= ?").bind(istDayStartUtc(weeksStart)),
    db()
      .prepare(
        `SELECT assigned_to AS email,
                SUM(CASE WHEN status IN ('new','contacted','options_sent','booked') THEN 1 ELSE 0 END) AS open,
                SUM(CASE WHEN status IN ('new','contacted','options_sent','booked') AND follow_up_on <= ? THEN 1 ELSE 0 END) AS due
         FROM treatment_requests WHERE assigned_to IS NOT NULL GROUP BY assigned_to ORDER BY open DESC`,
      )
      .bind(todayIST()),
  ]);

  type Req = { reference: string; created_at: string; status: string; plan: string; treatment: string; country: string; city: string | null; paid_at: string | null };
  type Ev = { reference: string; kind: string; to_status: string | null; created_at: string };
  const rows = reqs.results as Req[];
  const evs = events.results as Ev[];

  const reached = new Map<string, Set<string>>();
  const firstContact = new Map<string, string>();
  for (const r of rows) reached.set(r.reference, new Set([r.status]));
  for (const e of evs) {
    if (e.to_status) reached.get(e.reference)?.add(e.to_status);
    if (!firstContact.has(e.reference)) firstContact.set(e.reference, e.created_at);
  }
  const order: string[] = FUNNEL.map((f) => f.id);
  const stageOf = (r: Req) => Math.max(...[...(reached.get(r.reference) ?? [])].map((s) => order.indexOf(s)));

  const hours: number[] = [];
  for (const r of rows) {
    const at = firstContact.get(r.reference);
    if (at) hours.push((Date.parse(at) - Date.parse(r.created_at)) / 3600_000);
  }

  const weekCounts = new Map<string, number>();
  for (let i = 0; i < 12; i++) weekCounts.set(addDays(weeksStart, i * 7), 0);
  for (const { created_at } of weekly.results as { created_at: string }[]) {
    const w = weekOf(created_at);
    if (weekCounts.has(w)) weekCounts.set(w, (weekCounts.get(w) ?? 0) + 1);
  }

  return {
    total: rows.length,
    byPlan: [
      { label: "Basic", n: rows.filter((r) => r.plan === "basic").length },
      { label: "Concierge", n: rows.filter((r) => r.plan === "concierge").length },
    ],
    paid: rows.filter((r) => r.paid_at).length,
    funnel: FUNNEL.map((f, i) => ({ label: f.label, n: rows.filter((r) => stageOf(r) >= i).length })),
    lost: rows.filter((r) => r.status === "lost").length,
    contactedTotal: hours.length,
    contactedWithinSla: hours.filter((h) => h <= FIRST_CONTACT_SLA_HOURS).length,
    medianHoursToContact: median(hours),
    weekly: [...weekCounts.entries()].map(([week, n]) => ({ week, n })),
    treatments: top(rows.map((r) => r.treatment)),
    countries: top(rows.map((r) => r.country)),
    cities: top(rows.map((r) => (r.city && r.city !== "No preference" ? r.city : "No preference"))),
    workload: (workload.results as { email: string; open: number; due: number }[]).filter((w) => w.open > 0),
  };
}
