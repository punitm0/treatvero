import "server-only";
import { cfEnv } from "@/lib/cloudflare";
import { eventStatement, PATIENT_ACTOR } from "@/lib/admin/requests";
import type { PatientLink } from "@/lib/patient-links";
import { buildServiceAgreement, type AgreementDocument, type AgreementScope } from "@/data/legal";

/**
 * Service agreements a coordinator prepares and the patient signs on their
 * private link (/p/<token>) by typing their name — an electronic signature
 * tied to the link, the time and a snapshot of the exact text.
 *
 * Only one agreement per request is open at a time: sending a new one
 * withdraws any unsigned earlier one. Signed agreements are never changed.
 */

export type ServiceAgreement = {
  id: string;
  reference: string;
  version: string;
  plan: string;
  document: AgreementDocument;
  created_at: string;
  created_by: string;
  withdrawn_at: string | null;
  withdrawn_by: string | null;
  signed_at: string | null;
  signer_name: string | null;
  signer_relationship: string | null;
  signed_link_id: string | null;
};

export type AgreementStatus = "none" | "awaiting" | "signed";

type Row = Omit<ServiceAgreement, "document"> & { content: string };

const db = () => cfEnv().DB;

function fromRow({ content, ...row }: Row): ServiceAgreement {
  return { ...row, document: JSON.parse(content) as AgreementDocument };
}

/** A request's agreements, newest first. */
export async function listAgreements(reference: string): Promise<ServiceAgreement[]> {
  const { results } = await db()
    .prepare("SELECT * FROM service_agreements WHERE reference = ? ORDER BY created_at DESC LIMIT 20")
    .bind(reference)
    .all<Row>();
  return results.map(fromRow);
}

/** The agreement that matters now: the latest signed one, else the open one awaiting signature. */
export function currentAgreement(agreements: ServiceAgreement[]): ServiceAgreement | null {
  return agreements.find((a) => a.signed_at) ?? agreements.find((a) => !a.withdrawn_at) ?? null;
}

export function agreementStatus(a: ServiceAgreement | null): AgreementStatus {
  return !a ? "none" : a.signed_at ? "signed" : "awaiting";
}

export async function getAgreement(reference: string, id: string): Promise<ServiceAgreement | null> {
  const row = await db().prepare("SELECT * FROM service_agreements WHERE reference = ? AND id = ?").bind(reference, id).first<Row>();
  return row ? fromRow(row) : null;
}

/** Snapshots the agreement text and opens it for signature, withdrawing any unsigned earlier one. */
export async function sendAgreement(scope: AgreementScope, actor: string): Promise<void> {
  const document = buildServiceAgreement(scope);
  const now = new Date().toISOString();
  await db().batch([
    db()
      .prepare(
        "UPDATE service_agreements SET withdrawn_at = ?, withdrawn_by = ? WHERE reference = ? AND signed_at IS NULL AND withdrawn_at IS NULL",
      )
      .bind(now, actor, scope.reference),
    db()
      .prepare("INSERT INTO service_agreements (id, reference, version, plan, content, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), scope.reference, document.version, scope.plan, JSON.stringify(document), now, actor),
    eventStatement(scope.reference, "agreement", actor, `Sent ${document.title.toLowerCase()} for signature (version ${document.version})`),
  ]);
}

export async function withdrawAgreement(reference: string, id: string, actor: string): Promise<void> {
  const result = await db()
    .prepare(
      "UPDATE service_agreements SET withdrawn_at = ?, withdrawn_by = ? WHERE reference = ? AND id = ? AND signed_at IS NULL AND withdrawn_at IS NULL",
    )
    .bind(new Date().toISOString(), actor, reference, id)
    .run();
  if (result.meta.changes) await eventStatement(reference, "agreement", actor, "Withdrew the unsigned service agreement").run();
}

/** Records the patient's signature. False if the agreement is no longer open. */
export async function signAgreement(
  link: PatientLink,
  id: string,
  signer: { name: string; relationship: string | null },
): Promise<boolean> {
  const now = new Date().toISOString();
  const result = await db()
    .prepare(
      `UPDATE service_agreements SET signed_at = ?, signer_name = ?, signer_relationship = ?, signed_link_id = ?
       WHERE reference = ? AND id = ? AND signed_at IS NULL AND withdrawn_at IS NULL`,
    )
    .bind(now, signer.name, signer.relationship, link.id, link.reference, id)
    .run();
  if (!result.meta.changes) return false;
  const who = signer.relationship ? `${signer.name} (${signer.relationship}, for the patient)` : signer.name;
  await eventStatement(link.reference, "patient_sign", PATIENT_ACTOR, `Signed the service agreement as ${who}`).run();
  return true;
}
