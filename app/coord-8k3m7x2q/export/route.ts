import { authenticateAdmin } from "@/lib/admin/auth";
import { exportRequests, preferredListingLabel, statusLabel } from "@/lib/admin/requests";
import { parseFilters, filtersToParams } from "@/lib/admin/filters";
import { audit } from "@/lib/admin/data";
import { planLabel, todayIST } from "@/components/admin/format";

/**
 * CSV of the enquiries matching the list filters. Contains contact details
 * but never the medical description; every export is recorded in the audit log.
 */
export async function GET(request: Request) {
  const auth = await authenticateAdmin();
  if (!auth.ok) return new Response("Not found", { status: 404 });

  const filters = parseFilters(new URL(request.url).searchParams, auth.user.email);
  const rows = await exportRequests(filters);
  await audit("export", `${rows.length} row(s)${filtersToParams(filters).size ? ` · ${filtersToParams(filters).toString()}` : ""}`, auth.user.email);

  const header = [
    "Reference", "Received (UTC)", "Status", "Plan", "Paid", "Payment note", "Owner", "Follow-up", "Full name", "Email", "WhatsApp",
    "Country", "Age", "Treatment", "Destination", "City", "Asked about", "Timing", "Budget", "Reports", "Terms version", "Terms accepted (UTC)", "Service agreement",
  ];
  const lines = rows.map((r) => [
    r.reference, r.created_at, statusLabel(r.status), planLabel(r.plan), r.paid_at ? "Yes" : "No", r.payment_note, r.assigned_to, r.follow_up_on,
    r.full_name, r.email, r.whatsapp, r.country, r.age, r.treatment, r.destination, r.city, preferredListingLabel(r), r.timing, r.budget, r.report_count,
    r.terms_version, r.terms_accepted_at, AGREEMENT_LABELS[r.agreement_status],
  ]);
  const csv = [header, ...lines].map((cols) => cols.map(cell).join(",")).join("\r\n");

  return new Response(`﻿${csv}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="treatvero-enquiries-${todayIST()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

const AGREEMENT_LABELS = { none: "Not sent", awaiting: "Awaiting signature", signed: "Signed" } as const;

/** Quotes a CSV cell and neutralises spreadsheet formulas (=, +, -, @, tab, CR). */
function cell(value: unknown): string {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}
