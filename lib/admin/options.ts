import "server-only";
import { cfEnv } from "@/lib/cloudflare";
import { eventStatement } from "@/lib/admin/requests";

/**
 * Treatment options prepared for a patient, usually one per hospital quote.
 * They feed the comparison PDF and the patient's private options page.
 */

export const OPTION_CURRENCIES = ["USD", "INR", "EUR", "GBP", "AED"] as const;
export type OptionCurrency = (typeof OPTION_CURRENCIES)[number];

export type TreatmentOption = {
  id: string;
  reference: string;
  position: number;
  hospital_slug: string | null;
  hospital_name: string;
  city: string | null;
  doctor: string | null;
  procedure_name: string | null;
  currency: string;
  cost_min: number | null;
  cost_max: number | null;
  hospital_days: string | null;
  total_days: string | null;
  inclusions: string | null;
  exclusions: string | null;
  notes: string | null;
  valid_until: string | null;
  recommended: number;
  created_at: string;
  updated_at: string;
};

export type OptionInput = Omit<TreatmentOption, "id" | "reference" | "position" | "created_at" | "updated_at">;

const db = () => cfEnv().DB;

export async function listOptions(reference: string): Promise<TreatmentOption[]> {
  const { results } = await db()
    .prepare("SELECT * FROM request_options WHERE reference = ? ORDER BY position, created_at")
    .bind(reference)
    .all<TreatmentOption>();
  return results;
}

export async function getOption(reference: string, id: string): Promise<TreatmentOption | null> {
  return db()
    .prepare("SELECT * FROM request_options WHERE reference = ? AND id = ?")
    .bind(reference, id)
    .first<TreatmentOption>();
}

const COLUMNS = [
  "hospital_slug",
  "hospital_name",
  "city",
  "doctor",
  "procedure_name",
  "currency",
  "cost_min",
  "cost_max",
  "hospital_days",
  "total_days",
  "inclusions",
  "exclusions",
  "notes",
  "valid_until",
  "recommended",
] as const satisfies readonly (keyof OptionInput)[];

export async function createOption(reference: string, input: OptionInput, actor: string): Promise<void> {
  const now = new Date().toISOString();
  const next = await db()
    .prepare("SELECT COALESCE(MAX(position), -1) + 1 AS p FROM request_options WHERE reference = ?")
    .bind(reference)
    .first<{ p: number }>();
  const statements = [
    db()
      .prepare(
        `INSERT INTO request_options (id, reference, position, ${COLUMNS.join(", ")}, created_at, updated_at)
         VALUES (?, ?, ?, ${COLUMNS.map(() => "?").join(", ")}, ?, ?)`,
      )
      .bind(crypto.randomUUID(), reference, next?.p ?? 0, ...COLUMNS.map((c) => input[c]), now, now),
    eventStatement(reference, "option", actor, `Added option: ${input.hospital_name}`),
  ];
  if (input.recommended) statements.unshift(clearRecommended(reference));
  await db().batch(statements);
}

export async function updateOption(reference: string, id: string, input: OptionInput, actor: string): Promise<void> {
  const statements = [
    db()
      .prepare(`UPDATE request_options SET ${COLUMNS.map((c) => `${c} = ?`).join(", ")}, updated_at = ? WHERE reference = ? AND id = ?`)
      .bind(...COLUMNS.map((c) => input[c]), new Date().toISOString(), reference, id),
    eventStatement(reference, "option", actor, `Updated option: ${input.hospital_name}`),
  ];
  if (input.recommended) statements.unshift(clearRecommended(reference));
  await db().batch(statements);
}

export async function deleteOption(reference: string, id: string, actor: string): Promise<void> {
  const option = await getOption(reference, id);
  if (!option) return;
  await db().batch([
    db().prepare("DELETE FROM request_options WHERE reference = ? AND id = ?").bind(reference, id),
    eventStatement(reference, "option", actor, `Removed option: ${option.hospital_name}`),
  ]);
}

/** Swaps an option with its neighbour (-1 up, +1 down). */
export async function moveOption(reference: string, id: string, direction: -1 | 1): Promise<void> {
  const options = await listOptions(reference);
  const i = options.findIndex((o) => o.id === id);
  const j = i + direction;
  if (i === -1 || j < 0 || j >= options.length) return;
  [options[i], options[j]] = [options[j], options[i]];
  await db().batch(
    options.map((o, position) =>
      db().prepare("UPDATE request_options SET position = ? WHERE reference = ? AND id = ?").bind(position, reference, o.id),
    ),
  );
}

function clearRecommended(reference: string) {
  return db().prepare("UPDATE request_options SET recommended = 0 WHERE reference = ?").bind(reference);
}
