import "server-only";
import { cfEnv } from "@/lib/cloudflare";
import { istDayStartUtc, addDays, todayIST } from "@/components/admin/format";
import { getHospital } from "@/data/hospitals";
import { getDoctor } from "@/data/doctors";

/**
 * Read/write access to treatment requests for the admin area. Callers must
 * have passed `authenticateAdmin()` / `requireAdmin()` first.
 */

export const REQUEST_STATUSES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "options_sent", label: "Options sent" },
  { id: "booked", label: "Booked" },
  { id: "closed", label: "Closed" },
  { id: "lost", label: "Lost" },
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number]["id"];

/** Statuses that still need work (follow-ups on closed/lost requests are ignored). */
export const OPEN_STATUSES: RequestStatus[] = ["new", "contacted", "options_sent", "booked"];

/** A new enquiry not contacted within this many hours is flagged. */
export const FIRST_CONTACT_SLA_HOURS = 24;

/** True for a new enquiry received more than FIRST_CONTACT_SLA_HOURS ago. */
export function missedFirstContact(r: { status: string; created_at: string }): boolean {
  return r.status === "new" && Date.parse(r.created_at) < Date.now() - FIRST_CONTACT_SLA_HOURS * 3600_000;
}

export function isRequestStatus(v: unknown): v is RequestStatus {
  return REQUEST_STATUSES.some((s) => s.id === v);
}

export function statusLabel(id: string): string {
  return REQUEST_STATUSES.find((s) => s.id === id)?.label ?? id;
}

export type RequestSummary = {
  reference: string;
  created_at: string;
  status: string;
  plan: string;
  treatment: string;
  destination: string;
  city: string | null;
  country: string;
  full_name: string;
  assigned_to: string | null;
  follow_up_on: string | null;
  paid_at: string | null;
  report_count: number;
  terms_version: string | null;
  agreement_status: "none" | "awaiting" | "signed";
};

export type RequestDetail = {
  reference: string;
  created_at: string;
  status: string;
  plan: string;
  country: string;
  age: number;
  treatment: string;
  description: string;
  destination: string;
  city: string | null;
  timing: string | null;
  budget: string | null;
  full_name: string;
  email: string;
  whatsapp: string;
  consent_text: string;
  consent_at: string;
  /** NULL for requests received before the Terms checkbox. */
  terms_version: string | null;
  terms_text: string | null;
  terms_accepted_at: string | null;
  assigned_to: string | null;
  follow_up_on: string | null;
  paid_at: string | null;
  payment_note: string | null;
  /** Listing slugs the patient asked about (NULL before migration 0005 or when none). */
  preferred_hospital: string | null;
  preferred_doctor: string | null;
};

/** "Dr. X at Hospital Y" for the listing a patient asked about, or null. */
export function preferredListingLabel(r: Pick<RequestDetail, "preferred_hospital" | "preferred_doctor">): string | null {
  const doctor = r.preferred_doctor ? getDoctor(r.preferred_doctor) : undefined;
  const hospital = r.preferred_hospital ? getHospital(r.preferred_hospital) : undefined;
  const doctorName = doctor?.name ?? r.preferred_doctor;
  const hospitalName = hospital?.name ?? r.preferred_hospital;
  if (doctorName && hospitalName) return `${doctorName} at ${hospitalName}`;
  return doctorName || hospitalName || null;
}

export type RequestReport = { report_id: string; file_name: string; mime_type: string; size_bytes: number };

export type EventKind =
  | "note"
  | "status"
  | "download"
  | "edit"
  | "assign"
  | "follow_up"
  | "payment"
  | "option"
  | "link"
  | "message"
  | "hospital"
  | "patient_view"
  | "patient_reply"
  | "patient_upload"
  | "patient_sign"
  | "agreement"
  | "purge";

export type RequestEvent = {
  id: number;
  kind: EventKind;
  body: string | null;
  from_status: string | null;
  to_status: string | null;
  actor_email: string;
  created_at: string;
};

/** Actor recorded for things the patient did through their private link. */
export const PATIENT_ACTOR = "patient";

export const PAGE_SIZE = 50;

export const VIEWS = [
  { id: "due", label: "Follow-ups due" },
  { id: "uncontacted", label: `New > ${FIRST_CONTACT_SLA_HOURS}h` },
  { id: "replied", label: "Patient replied" },
  { id: "unsigned", label: "Agreement unsigned" },
] as const;
export type View = (typeof VIEWS)[number]["id"];
export function isView(v: unknown): v is View {
  return VIEWS.some((x) => x.id === v);
}

export type RequestFilters = {
  status?: RequestStatus;
  query?: string;
  treatment?: string;
  plan?: "basic" | "concierge";
  /** YYYY-MM-DD, IST, inclusive. */
  from?: string;
  to?: string;
  /** An email, "none" for unassigned. */
  assignee?: string;
  view?: View;
};

const db = () => cfEnv().DB;

export async function recordEvent(
  reference: string,
  kind: EventKind,
  actor: string,
  body: string | null = null,
): Promise<void> {
  await eventStatement(reference, kind, actor, body).run();
}

export function eventStatement(reference: string, kind: EventKind, actor: string, body: string | null = null) {
  return db()
    .prepare("INSERT INTO request_events (reference, kind, body, actor_email, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(reference, kind, body, actor, new Date().toISOString());
}

function buildWhere(f: RequestFilters): { sql: string; params: unknown[] } {
  const where: string[] = [];
  const params: unknown[] = [];
  if (f.status) {
    where.push("r.status = ?");
    params.push(f.status);
  }
  const q = f.query?.trim();
  if (q) {
    const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    where.push("(r.reference LIKE ? ESCAPE '\\' OR r.full_name LIKE ? ESCAPE '\\' OR r.email LIKE ? ESCAPE '\\' OR r.whatsapp LIKE ? ESCAPE '\\')");
    params.push(like, like, like, like);
  }
  if (f.treatment) {
    where.push("r.treatment = ?");
    params.push(f.treatment);
  }
  if (f.plan) {
    where.push("r.plan = ?");
    params.push(f.plan);
  }
  if (f.from) {
    where.push("r.created_at >= ?");
    params.push(istDayStartUtc(f.from));
  }
  if (f.to) {
    where.push("r.created_at < ?");
    params.push(istDayStartUtc(addDays(f.to, 1)));
  }
  if (f.assignee === "none") {
    where.push("r.assigned_to IS NULL");
  } else if (f.assignee) {
    where.push("r.assigned_to = ?");
    params.push(f.assignee);
  }
  if (f.view === "due") {
    where.push(`r.follow_up_on IS NOT NULL AND r.follow_up_on <= ? AND r.status IN (${OPEN_STATUSES.map(() => "?").join(",")})`);
    params.push(todayIST(), ...OPEN_STATUSES);
  } else if (f.view === "uncontacted") {
    where.push("r.status = 'new' AND r.created_at < ?");
    params.push(new Date(Date.now() - FIRST_CONTACT_SLA_HOURS * 3600_000).toISOString());
  } else if (f.view === "replied") {
    // Patient replied after the last time a coordinator did anything on the request.
    where.push(`EXISTS (SELECT 1 FROM request_events pe WHERE pe.reference = r.reference AND pe.kind IN ('patient_reply', 'patient_upload', 'patient_sign')
      AND pe.created_at > COALESCE((SELECT MAX(ae.created_at) FROM request_events ae WHERE ae.reference = r.reference
        AND ae.actor_email <> '${PATIENT_ACTOR}' AND ae.kind <> 'download'), ''))`);
  } else if (f.view === "unsigned") {
    // Sent for signature and still open, on a request that is still being worked.
    where.push(`EXISTS (SELECT 1 FROM service_agreements sa WHERE sa.reference = r.reference AND sa.signed_at IS NULL AND sa.withdrawn_at IS NULL)
      AND NOT EXISTS (SELECT 1 FROM service_agreements ss WHERE ss.reference = r.reference AND ss.signed_at IS NOT NULL)
      AND r.status IN (${OPEN_STATUSES.map(() => "?").join(",")})`);
    params.push(...OPEN_STATUSES);
  }
  return { sql: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

const SUMMARY_COLUMNS = `r.reference, r.created_at, r.status, r.plan, r.treatment, r.destination, r.city, r.country, r.full_name,
  r.assigned_to, r.follow_up_on, r.paid_at, r.terms_version,
  (SELECT COUNT(*) FROM request_reports rr WHERE rr.reference = r.reference) AS report_count,
  CASE
    WHEN EXISTS (SELECT 1 FROM service_agreements sa WHERE sa.reference = r.reference AND sa.signed_at IS NOT NULL) THEN 'signed'
    WHEN EXISTS (SELECT 1 FROM service_agreements sa WHERE sa.reference = r.reference AND sa.withdrawn_at IS NULL) THEN 'awaiting'
    ELSE 'none'
  END AS agreement_status`;

export async function listRequests(
  filters: RequestFilters & { page: number },
): Promise<{ rows: RequestSummary[]; total: number }> {
  const { sql, params } = buildWhere(filters);
  const [rows, count] = await db().batch([
    db()
      .prepare(`SELECT ${SUMMARY_COLUMNS} FROM treatment_requests r ${sql} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`)
      .bind(...params, PAGE_SIZE, (filters.page - 1) * PAGE_SIZE),
    db()
      .prepare(`SELECT COUNT(*) AS total FROM treatment_requests r ${sql}`)
      .bind(...params),
  ]);
  return {
    rows: rows.results as RequestSummary[],
    total: ((count.results[0] as { total?: number } | undefined)?.total ?? 0) as number,
  };
}

export type ExportRow = RequestSummary & {
  age: number;
  email: string;
  whatsapp: string;
  timing: string | null;
  budget: string | null;
  payment_note: string | null;
  terms_accepted_at: string | null;
  preferred_hospital: string | null;
  preferred_doctor: string | null;
};

/** Every matching request (no paging) for CSV export. Excludes the medical description. */
export async function exportRequests(filters: RequestFilters): Promise<ExportRow[]> {
  const { sql, params } = buildWhere(filters);
  const { results } = await db()
    .prepare(
      `SELECT ${SUMMARY_COLUMNS}, r.age, r.email, r.whatsapp, r.timing, r.budget, r.payment_note, r.terms_accepted_at,
              r.preferred_hospital, r.preferred_doctor
       FROM treatment_requests r ${sql} ORDER BY r.created_at DESC LIMIT 10000`,
    )
    .bind(...params)
    .all<ExportRow>();
  return results;
}

export async function statusCounts(): Promise<Record<string, number>> {
  const { results } = await db()
    .prepare("SELECT status, COUNT(*) AS n FROM treatment_requests GROUP BY status")
    .all<{ status: string; n: number }>();
  return Object.fromEntries(results.map((r) => [r.status, r.n]));
}

export async function viewCounts(): Promise<Record<View, number>> {
  const entries = await Promise.all(
    VIEWS.map(async (v) => {
      const { sql, params } = buildWhere({ view: v.id });
      const row = await db()
        .prepare(`SELECT COUNT(*) AS n FROM treatment_requests r ${sql}`)
        .bind(...params)
        .first<{ n: number }>();
      return [v.id, row?.n ?? 0] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<View, number>;
}

/** Everyone who has worked in the admin, for the assignee picker. */
export async function knownAdmins(): Promise<string[]> {
  const { results } = await db()
    .prepare(
      `SELECT actor_email AS email FROM request_events WHERE actor_email <> ? AND actor_email LIKE '%@%'
       UNION SELECT assigned_to FROM treatment_requests WHERE assigned_to IS NOT NULL ORDER BY 1`,
    )
    .bind(PATIENT_ACTOR)
    .all<{ email: string }>();
  return results.map((r) => r.email);
}

export async function getRequest(
  reference: string,
): Promise<{ request: RequestDetail; reports: RequestReport[]; events: RequestEvent[] } | null> {
  const [req, reports, events] = await db().batch([
    db().prepare("SELECT * FROM treatment_requests WHERE reference = ?").bind(reference),
    db()
      .prepare("SELECT report_id, file_name, mime_type, size_bytes FROM request_reports WHERE reference = ? ORDER BY rowid")
      .bind(reference),
    db()
      .prepare(
        "SELECT id, kind, body, from_status, to_status, actor_email, created_at FROM request_events WHERE reference = ? ORDER BY created_at DESC, id DESC",
      )
      .bind(reference),
  ]);
  const request = req.results[0] as RequestDetail | undefined;
  if (!request) return null;
  return { request, reports: reports.results as RequestReport[], events: events.results as RequestEvent[] };
}

export async function getRequestDetail(reference: string): Promise<RequestDetail | null> {
  return db().prepare("SELECT * FROM treatment_requests WHERE reference = ?").bind(reference).first<RequestDetail>();
}

export async function listReports(reference: string): Promise<RequestReport[]> {
  const { results } = await db()
    .prepare("SELECT report_id, file_name, mime_type, size_bytes FROM request_reports WHERE reference = ? ORDER BY rowid")
    .bind(reference)
    .all<RequestReport>();
  return results;
}

export async function getReport(reference: string, reportId: string): Promise<RequestReport | null> {
  return db()
    .prepare("SELECT report_id, file_name, mime_type, size_bytes FROM request_reports WHERE reference = ? AND report_id = ?")
    .bind(reference, reportId)
    .first<RequestReport>();
}

/** Changes status and records who did it. Returns false if the request doesn't exist or is unchanged. */
export async function updateStatus(reference: string, to: RequestStatus, actor: string): Promise<boolean> {
  const current = await db()
    .prepare("SELECT status FROM treatment_requests WHERE reference = ?")
    .bind(reference)
    .first<{ status: string }>();
  if (!current || current.status === to) return false;
  const now = new Date().toISOString();
  await db().batch([
    db().prepare("UPDATE treatment_requests SET status = ? WHERE reference = ?").bind(to, reference),
    db()
      .prepare(
        "INSERT INTO request_events (reference, kind, from_status, to_status, actor_email, created_at) VALUES (?, 'status', ?, ?, ?, ?)",
      )
      .bind(reference, current.status, to, actor, now),
  ]);
  return true;
}

/** Moves a request forward to `to` only if it is currently at an earlier stage. */
export async function advanceStatus(reference: string, to: RequestStatus, actor: string): Promise<void> {
  const order: string[] = ["new", "contacted", "options_sent", "booked"];
  const current = await db()
    .prepare("SELECT status FROM treatment_requests WHERE reference = ?")
    .bind(reference)
    .first<{ status: string }>();
  if (!current) return;
  const from = order.indexOf(current.status);
  if (from !== -1 && from < order.indexOf(to)) await updateStatus(reference, to, actor);
}

export async function addNote(reference: string, body: string, actor: string): Promise<void> {
  await recordEvent(reference, "note", actor, body);
}

/** Audit trail: who downloaded which medical report, and when. */
export async function logDownload(reference: string, fileName: string, actor: string): Promise<void> {
  await recordEvent(reference, "download", actor, fileName);
}

export async function assignRequest(reference: string, assignee: string | null, actor: string): Promise<void> {
  const current = await getRequestDetail(reference);
  if (!current || current.assigned_to === assignee) return;
  await db().batch([
    db().prepare("UPDATE treatment_requests SET assigned_to = ? WHERE reference = ?").bind(assignee, reference),
    eventStatement(reference, "assign", actor, assignee ? `Assigned to ${assignee}` : "Unassigned"),
  ]);
}

export async function setFollowUp(reference: string, date: string | null, note: string, actor: string): Promise<void> {
  const current = await getRequestDetail(reference);
  if (!current) return;
  const body = date ? `Follow-up set for ${date}${note ? `: ${note}` : ""}` : "Follow-up cleared";
  await db().batch([
    db().prepare("UPDATE treatment_requests SET follow_up_on = ? WHERE reference = ?").bind(date, reference),
    eventStatement(reference, "follow_up", actor, body),
  ]);
}

export async function setPayment(reference: string, paid: boolean, note: string, actor: string): Promise<void> {
  const current = await getRequestDetail(reference);
  if (!current) return;
  const now = new Date().toISOString();
  await db().batch([
    db()
      .prepare("UPDATE treatment_requests SET paid_at = ?, payment_note = ? WHERE reference = ?")
      .bind(paid ? now : null, paid ? note || null : null, reference),
    eventStatement(reference, "payment", actor, paid ? `Plan fee marked as paid${note ? ` (${note})` : ""}` : "Payment mark removed"),
  ]);
}

/** Fields a coordinator may correct. Consent, plan and reference never change. */
export const EDITABLE_FIELDS = [
  { id: "full_name", label: "Full name" },
  { id: "email", label: "Email" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "country", label: "Country of residence" },
  { id: "age", label: "Patient age" },
  { id: "treatment", label: "Treatment" },
  { id: "destination", label: "Destination" },
  { id: "city", label: "City" },
  { id: "timing", label: "Travel timing" },
  { id: "budget", label: "Budget" },
] as const;
export type EditableField = (typeof EDITABLE_FIELDS)[number]["id"];
export type RequestEdits = Partial<Record<EditableField, string | number | null>>;

/** Applies edits and logs which fields changed (old → new). Returns the number of changed fields. */
export async function editRequest(reference: string, edits: RequestEdits, actor: string): Promise<number> {
  const current = await getRequestDetail(reference);
  if (!current) return 0;
  const changed = EDITABLE_FIELDS.filter((f) => f.id in edits && (edits[f.id] ?? null) !== (current[f.id] ?? null));
  if (!changed.length) return 0;
  const set = changed.map((f) => `${f.id} = ?`).join(", ");
  const summary = changed
    .map((f) => `${f.label}: ${current[f.id] ?? "—"} → ${edits[f.id] ?? "—"}`)
    .join("\n");
  await db().batch([
    db()
      .prepare(`UPDATE treatment_requests SET ${set} WHERE reference = ?`)
      .bind(...changed.map((f) => edits[f.id] ?? null), reference),
    eventStatement(reference, "edit", actor, `Edited details\n${summary}`),
  ]);
  return changed.length;
}
