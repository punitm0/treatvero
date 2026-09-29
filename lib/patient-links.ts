import "server-only";
import { cfEnv } from "@/lib/cloudflare";
import { signWithSessionSecret } from "@/lib/security/session";
import { absoluteUrl } from "@/lib/utils";
import { eventStatement, PATIENT_ACTOR } from "@/lib/admin/requests";

/**
 * Private patient links (/p/<token>): the patient sees the treatment options
 * prepared for them, replies with a choice and can add more reports, without
 * an account.
 *
 * The token is an HMAC of the link id keyed by SESSION_SECRET, so it can be
 * shown to coordinators again without storing it, and a copy of the database
 * alone can't produce a working link. Lookups go through a SHA-256 hash.
 * Creating a link revokes the request's earlier ones, so only one works.
 */

export const LINK_TTL_DAYS = 30;
/** Reports per upload from the patient page; keeps the body under Cloudflare's 100 MB request limit. */
export const MAX_FILES_PER_UPLOAD = 4;
const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;

export type PatientLink = {
  id: string;
  reference: string;
  created_at: string;
  created_by: string;
  expires_at: string;
  revoked_at: string | null;
  first_viewed_at: string | null;
  last_viewed_at: string | null;
  view_count: number;
  choice: string | null;
  choice_message: string | null;
  choice_at: string | null;
};

export type PatientLinkWithUrl = PatientLink & { url: string | null; active: boolean };

const db = () => cfEnv().DB;

async function sha256(value: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function tokenFor(id: string): Promise<string | null> {
  return signWithSessionSecret(`patient-link:${id}`);
}

export function isActive(link: Pick<PatientLink, "revoked_at" | "expires_at">, now = Date.now()): boolean {
  return !link.revoked_at && Date.parse(link.expires_at) > now;
}

/** Creates a new link (revoking earlier ones). Null when SESSION_SECRET isn't configured. */
export async function createPatientLink(reference: string, actor: string, days = LINK_TTL_DAYS): Promise<string | null> {
  const id = crypto.randomUUID();
  const token = await tokenFor(id);
  if (!token) return null;
  const now = new Date();
  const expires = new Date(now.getTime() + days * 86400_000);
  await db().batch([
    db()
      .prepare("UPDATE patient_links SET revoked_at = ? WHERE reference = ? AND revoked_at IS NULL")
      .bind(now.toISOString(), reference),
    db()
      .prepare("INSERT INTO patient_links (id, token_hash, reference, created_at, created_by, expires_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(id, await sha256(token), reference, now.toISOString(), actor, expires.toISOString()),
    eventStatement(reference, "link", actor, `Created patient link (expires ${expires.toISOString().slice(0, 10)})`),
  ]);
  return absoluteUrl(`/p/${token}`);
}

export async function revokePatientLinks(reference: string, actor: string): Promise<void> {
  await db().batch([
    db()
      .prepare("UPDATE patient_links SET revoked_at = ? WHERE reference = ? AND revoked_at IS NULL")
      .bind(new Date().toISOString(), reference),
    eventStatement(reference, "link", actor, "Revoked patient link"),
  ]);
}

/** A request's links, newest first, with the URL of each (null if the secret is missing). */
export async function listPatientLinks(reference: string): Promise<PatientLinkWithUrl[]> {
  const { results } = await db()
    .prepare(
      `SELECT id, reference, created_at, created_by, expires_at, revoked_at, first_viewed_at, last_viewed_at, view_count,
              choice, choice_message, choice_at
       FROM patient_links WHERE reference = ? ORDER BY created_at DESC LIMIT 20`,
    )
    .bind(reference)
    .all<PatientLink>();
  return Promise.all(
    results.map(async (l) => {
      const token = await tokenFor(l.id);
      return { ...l, url: token ? absoluteUrl(`/p/${token}`) : null, active: isActive(l) };
    }),
  );
}

/** The current working link's URL for a request, if any. */
export async function activePatientLinkUrl(reference: string): Promise<string | null> {
  return (await listPatientLinks(reference)).find((l) => l.active)?.url ?? null;
}

/** Resolves a token from a patient's URL. Null if unknown, expired or revoked. */
export async function resolvePatientLink(token: string): Promise<PatientLink | null> {
  if (!TOKEN_RE.test(token)) return null;
  const link = await db()
    .prepare(
      `SELECT id, reference, created_at, created_by, expires_at, revoked_at, first_viewed_at, last_viewed_at, view_count,
              choice, choice_message, choice_at
       FROM patient_links WHERE token_hash = ?`,
    )
    .bind(await sha256(token))
    .first<PatientLink>();
  if (!link || !isActive(link)) return null;
  // Defence in depth: the token must still match the current secret.
  if ((await tokenFor(link.id)) !== token) return null;
  return link;
}

export async function recordPatientView(link: PatientLink): Promise<void> {
  const now = new Date().toISOString();
  const statements = [
    db()
      .prepare(
        "UPDATE patient_links SET view_count = view_count + 1, last_viewed_at = ?, first_viewed_at = COALESCE(first_viewed_at, ?) WHERE id = ?",
      )
      .bind(now, now, link.id),
  ];
  if (!link.first_viewed_at) statements.push(eventStatement(link.reference, "patient_view", PATIENT_ACTOR, "Patient opened their options page"));
  await db().batch(statements);
}

export async function recordPatientReply(link: PatientLink, choice: string, message: string, summary: string): Promise<void> {
  await db().batch([
    db()
      .prepare("UPDATE patient_links SET choice = ?, choice_message = ?, choice_at = ? WHERE id = ?")
      .bind(choice, message || null, new Date().toISOString(), link.id),
    eventStatement(link.reference, "patient_reply", PATIENT_ACTOR, message ? `${summary}\n“${message}”` : summary),
  ]);
}
