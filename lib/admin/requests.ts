import "server-only";
import { cfEnv } from "@/lib/cloudflare";

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
  report_count: number;
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
};

export type RequestReport = { report_id: string; file_name: string; mime_type: string; size_bytes: number };

export type RequestEvent = {
  id: number;
  kind: "note" | "status" | "download";
  body: string | null;
  from_status: string | null;
  to_status: string | null;
  actor_email: string;
  created_at: string;
};

export const PAGE_SIZE = 50;

const db = () => cfEnv().DB;

export async function listRequests({
  status,
  query,
  page,
}: {
  status?: RequestStatus;
  query?: string;
  page: number;
}): Promise<{ rows: RequestSummary[]; total: number }> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (status) {
    where.push("r.status = ?");
    params.push(status);
  }
  const q = query?.trim();
  if (q) {
    const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    where.push("(r.reference LIKE ? ESCAPE '\\' OR r.full_name LIKE ? ESCAPE '\\' OR r.email LIKE ? ESCAPE '\\' OR r.whatsapp LIKE ? ESCAPE '\\')");
    params.push(like, like, like, like);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows, count] = await db().batch([
    db()
      .prepare(
        `SELECT r.reference, r.created_at, r.status, r.plan, r.treatment, r.destination, r.city, r.country, r.full_name,
                (SELECT COUNT(*) FROM request_reports rr WHERE rr.reference = r.reference) AS report_count
         FROM treatment_requests r ${whereSql}
         ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
      )
      .bind(...params, PAGE_SIZE, (page - 1) * PAGE_SIZE),
    db()
      .prepare(`SELECT COUNT(*) AS total FROM treatment_requests r ${whereSql}`)
      .bind(...params),
  ]);
  return {
    rows: rows.results as RequestSummary[],
    total: ((count.results[0] as { total?: number } | undefined)?.total ?? 0) as number,
  };
}

export async function statusCounts(): Promise<Record<string, number>> {
  const { results } = await db()
    .prepare("SELECT status, COUNT(*) AS n FROM treatment_requests GROUP BY status")
    .all<{ status: string; n: number }>();
  return Object.fromEntries(results.map((r) => [r.status, r.n]));
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

export async function addNote(reference: string, body: string, actor: string): Promise<void> {
  await db()
    .prepare("INSERT INTO request_events (reference, kind, body, actor_email, created_at) VALUES (?, 'note', ?, ?, ?)")
    .bind(reference, body, actor, new Date().toISOString())
    .run();
}

/** Audit trail: who downloaded which medical report, and when. */
export async function logDownload(reference: string, fileName: string, actor: string): Promise<void> {
  await db()
    .prepare("INSERT INTO request_events (reference, kind, body, actor_email, created_at) VALUES (?, 'download', ?, ?, ?)")
    .bind(reference, fileName, actor, new Date().toISOString())
    .run();
}
