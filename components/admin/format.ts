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
