import "server-only";
import { cfEnv } from "@/lib/cloudflare";
import { eventStatement } from "@/lib/admin/requests";

/**
 * Log of anonymised case summaries sent to hospitals for review and quotes,
 * and each hospital's response.
 */

export const SEND_STATUSES = [
  { id: "awaiting", label: "Awaiting reply" },
  { id: "quoted", label: "Quote received" },
  { id: "declined", label: "Declined" },
] as const;
export type SendStatus = (typeof SEND_STATUSES)[number]["id"];

export function isSendStatus(v: unknown): v is SendStatus {
  return SEND_STATUSES.some((s) => s.id === v);
}

export type HospitalSend = {
  id: number;
  reference: string;
  hospital_slug: string | null;
  hospital_name: string;
  sent_at: string;
  sent_by: string;
  status: SendStatus;
  responded_at: string | null;
  note: string | null;
};

const db = () => cfEnv().DB;

export async function listHospitalSends(reference: string): Promise<HospitalSend[]> {
  const { results } = await db()
    .prepare("SELECT * FROM hospital_sends WHERE reference = ? ORDER BY sent_at DESC, id DESC")
    .bind(reference)
    .all<HospitalSend>();
  return results;
}

export async function logHospitalSend(
  reference: string,
  hospital: { slug: string | null; name: string },
  note: string,
  actor: string,
): Promise<void> {
  await db().batch([
    db()
      .prepare("INSERT INTO hospital_sends (reference, hospital_slug, hospital_name, sent_at, sent_by, note) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(reference, hospital.slug, hospital.name, new Date().toISOString(), actor, note || null),
    eventStatement(reference, "hospital", actor, `Case summary sent to ${hospital.name}${note ? `: ${note}` : ""}`),
  ]);
}

export async function updateHospitalSend(reference: string, id: number, status: SendStatus, actor: string): Promise<void> {
  const send = await db()
    .prepare("SELECT * FROM hospital_sends WHERE reference = ? AND id = ?")
    .bind(reference, id)
    .first<HospitalSend>();
  if (!send || send.status === status) return;
  const label = SEND_STATUSES.find((s) => s.id === status)?.label ?? status;
  await db().batch([
    db()
      .prepare("UPDATE hospital_sends SET status = ?, responded_at = ? WHERE id = ?")
      .bind(status, status === "awaiting" ? null : new Date().toISOString(), id),
    eventStatement(reference, "hospital", actor, `${send.hospital_name}: ${label}`),
  ]);
}

export async function deleteHospitalSend(reference: string, id: number, actor: string): Promise<void> {
  const send = await db()
    .prepare("SELECT hospital_name FROM hospital_sends WHERE reference = ? AND id = ?")
    .bind(reference, id)
    .first<{ hospital_name: string }>();
  if (!send) return;
  await db().batch([
    db().prepare("DELETE FROM hospital_sends WHERE id = ?").bind(id),
    eventStatement(reference, "hospital", actor, `Removed send record: ${send.hospital_name}`),
  ]);
}
