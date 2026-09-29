const dateTime = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

/** Admin timestamps are shown in IST, where the coordination team works. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : `${dateTime.format(d)} IST`;
}

export function planLabel(plan: string): string {
  return plan === "concierge" ? "Concierge" : plan === "basic" ? "Basic" : plan;
}

const istDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" });

/** Today's date in IST as YYYY-MM-DD (follow-ups and date filters use IST days). */
export function todayIST(now: Date = new Date()): string {
  return istDate.format(now);
}

/** Adds whole days to a YYYY-MM-DD date. */
export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** UTC instant at which an IST calendar day starts (IST is UTC+5:30, no DST). */
export function istDayStartUtc(date: string): string {
  return new Date(Date.parse(`${date}T00:00:00+05:30`)).toISOString();
}

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isDate(v: unknown): v is string {
  return typeof v === "string" && DATE_RE.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
}

const dateOnly = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Formats a YYYY-MM-DD date, e.g. "4 Oct 2026". */
export function formatDate(date: string): string {
  return isDate(date) ? dateOnly.format(new Date(`${date}T00:00:00Z`)) : date;
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-US")}`;
  }
}

/** "$8,000 – $10,500", "From $8,000", or null when no amount is set. */
export function formatCostRange(min: number | null, max: number | null, currency: string): string | null {
  if (min != null && max != null && max !== min) return `${formatMoney(min, currency)} – ${formatMoney(max, currency)}`;
  if (min != null) return formatMoney(min, currency);
  if (max != null) return `Up to ${formatMoney(max, currency)}`;
  return null;
}
