import "server-only";
import { cfEnv } from "@/lib/cloudflare";
import { getReportStorage } from "@/lib/uploads/storage";
import { eventStatement } from "@/lib/admin/requests";

/**
 * Data housekeeping: permanent deletion of a request (erasure requests),
 * retention purges of medical reports, and the admin audit log.
 */

export type AuditEntry = { id: number; action: string; detail: string | null; actor_email: string; created_at: string };

export const AUDIT_LABELS: Record<string, string> = {
  export: "CSV export",
  delete_request: "Request deleted",
  purge_reports: "Reports purged (retention)",
};

const db = () => cfEnv().DB;

/** Audit entries hold references and counts only — never patient details. */
export async function audit(action: keyof typeof AUDIT_LABELS, detail: string | null, actor: string): Promise<void> {
  await db()
    .prepare("INSERT INTO admin_audit (action, detail, actor_email, created_at) VALUES (?, ?, ?, ?)")
    .bind(action, detail, actor, new Date().toISOString())
    .run();
}

export async function listAudit(limit = 100): Promise<AuditEntry[]> {
  const { results } = await db()
    .prepare("SELECT * FROM admin_audit ORDER BY created_at DESC, id DESC LIMIT ?")
    .bind(limit)
    .all<AuditEntry>();
  return results;
}

/**
 * Permanently deletes a request, its reports (R2 objects and rows), options,
 * links, hospital log and activity. Only the reference is kept, in the audit log.
 */
export async function deleteRequest(reference: string, reason: string, actor: string): Promise<boolean> {
  const exists = await db().prepare("SELECT 1 AS x FROM treatment_requests WHERE reference = ?").bind(reference).first();
  if (!exists) return false;
  const { results } = await db()
    .prepare("SELECT report_id FROM request_reports WHERE reference = ?")
    .bind(reference)
    .all<{ report_id: string }>();
  await getReportStorage().removeFromRequest(
    reference,
    results.map((r) => r.report_id),
  );
  const del = (table: string) => db().prepare(`DELETE FROM ${table} WHERE reference = ?`).bind(reference);
  await db().batch([
    del("request_events"),
    del("request_options"),
    del("patient_links"),
    del("hospital_sends"),
    del("request_reports"),
    del("treatment_requests"),
  ]);
  await audit("delete_request", `${reference} · ${results.length} report(s)${reason ? ` · ${reason}` : ""}`, actor);
  return true;
}

export const RETENTION_STATUSES = ["closed", "lost"] as const;

export type RetentionCandidate = { reference: string; status: string; last_activity: string; report_count: number };

/**
 * Closed or lost requests that still hold reports and have had no activity
 * for `months` months.
 */
export async function retentionCandidates(months: number): Promise<RetentionCandidate[]> {
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months);
  const { results } = await db()
    .prepare(
      `SELECT * FROM (
         SELECT r.reference, r.status,
                MAX(r.created_at, COALESCE((SELECT MAX(e.created_at) FROM request_events e WHERE e.reference = r.reference), '')) AS last_activity,
                (SELECT COUNT(*) FROM request_reports rr WHERE rr.reference = r.reference) AS report_count
         FROM treatment_requests r
         WHERE r.status IN (${RETENTION_STATUSES.map(() => "?").join(",")})
       ) WHERE report_count > 0 AND last_activity < ?
       ORDER BY last_activity LIMIT 500`,
    )
    .bind(...RETENTION_STATUSES, cutoff.toISOString())
    .all<RetentionCandidate>();
  return results;
}

/** Deletes the reports of every retention candidate. Returns requests and reports affected. */
export async function purgeReports(months: number, actor: string): Promise<{ requests: number; reports: number }> {
  const candidates = await retentionCandidates(months);
  let reports = 0;
  for (const c of candidates) {
    const { results } = await db()
      .prepare("SELECT report_id FROM request_reports WHERE reference = ?")
      .bind(c.reference)
      .all<{ report_id: string }>();
    await getReportStorage().removeFromRequest(
      c.reference,
      results.map((r) => r.report_id),
    );
    await db().batch([
      db().prepare("DELETE FROM request_reports WHERE reference = ?").bind(c.reference),
      eventStatement(c.reference, "purge", actor, `${results.length} report(s) deleted under the ${months}-month retention rule`),
    ]);
    reports += results.length;
  }
  if (candidates.length) await audit("purge_reports", `${candidates.length} request(s) · ${reports} report(s) · older than ${months} months`, actor);
  return { requests: candidates.length, reports };
}
