import "server-only";
import { cfEnv } from "@/lib/cloudflare";
import type { StoredReport } from "@/lib/uploads/storage";
import type { EnquiryInput } from "@/lib/validation/enquiry";
import { CONSENT_TEXT, TERMS_ACCEPTANCE_TEXT, TERMS_VERSION } from "@/data/legal";

/**
 * Persistence for treatment requests in Cloudflare D1 (binding `DB`,
 * schema in migrations/). Implement `TreatmentRequestStore` against another
 * backend (HubSpot, Airtable, a CRM API) if the coordination team needs one;
 * D1 can remain the system of record.
 *
 * Medical details must never be logged by any adapter.
 */
export interface TreatmentRequestStore {
  save(record: TreatmentRequestRecord): Promise<void>;
}

export type TreatmentRequestRecord = {
  reference: string;
  createdAt: string;
  input: EnquiryInput;
  whatsapp: string;
  reports: StoredReport[];
};

class D1RequestStore implements TreatmentRequestStore {
  constructor(private readonly db: D1Database) {}

  async save({ reference, createdAt, input, whatsapp, reports }: TreatmentRequestRecord) {
    const insertRequest = this.db
      .prepare(
        `INSERT INTO treatment_requests
          (reference, created_at, status, plan, country, age, treatment, description,
           destination, city, timing, budget, full_name, email, whatsapp, consent_text, consent_at,
           terms_version, terms_text, terms_accepted_at, preferred_hospital, preferred_doctor)
         VALUES (?1, ?2, 'new', ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?2, ?16, ?17, ?2, ?18, ?19)`,
      )
      .bind(
        reference,
        createdAt,
        input.plan,
        input.country,
        Number(input.age),
        input.treatment,
        input.description,
        input.destination,
        input.city || null,
        input.timing || null,
        input.budget || null,
        input.fullName,
        input.email,
        whatsapp,
        CONSENT_TEXT,
        TERMS_VERSION,
        TERMS_ACCEPTANCE_TEXT,
        input.preferredHospital || null,
        input.preferredDoctor || null,
      );
    const insertReports = reports.map((r) =>
      this.db
        .prepare(
          "INSERT INTO request_reports (report_id, reference, file_name, mime_type, size_bytes) VALUES (?, ?, ?, ?, ?)",
        )
        .bind(r.id, reference, r.fileName, r.mimeType, r.size),
    );
    // batch() runs as a single transaction.
    await this.db.batch([insertRequest, ...insertReports]);
  }
}

/** Human-friendly, non-sequential reference (no personal data encoded). */
export function createReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return `TV-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")}`;
}

export async function saveTreatmentRequest(input: EnquiryInput, reports: StoredReport[]): Promise<{ reference: string }> {
  const reference = createReference();
  const code = input.phoneCode.startsWith("+") ? input.phoneCode : `+${input.phoneCode}`;
  await new D1RequestStore(cfEnv().DB).save({
    reference,
    createdAt: new Date().toISOString(),
    input,
    whatsapp: `${code} ${input.phoneNumber}`.trim(),
    reports,
  });
  return { reference };
}
