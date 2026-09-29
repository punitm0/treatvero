import "server-only";
import { cfEnv } from "@/lib/cloudflare";
import type { AllowedMime } from "@/lib/uploads/validate";

/**
 * Private storage for medical reports, backed by the `REPORTS` R2 bucket.
 *
 * Objects are only reachable through this Worker — the bucket must never have
 * a public r2.dev or custom domain. Callers only ever see an opaque id.
 * R2 encrypts all objects at rest.
 *
 * Uploads land in `pending/` and move to `requests/<reference>/` when the
 * enquiry is submitted. Each pending upload is tagged with the uploader's
 * session id (lib/security/session.ts) and can only be removed or attached
 * by that session. Add an R2 lifecycle rule that deletes `pending/`
 * objects after ~7 days so abandoned uploads don't linger (see README).
 */
export type StoredReport = {
  id: string;
  fileName: string;
  mimeType: AllowedMime;
  size: number;
  createdAt: string;
  /** Session that uploaded the file; empty for legacy objects. */
  sessionId: string;
};

export interface ReportStorage {
  save(file: { bytes: Uint8Array; fileName: string; mimeType: AllowedMime; sessionId: string }): Promise<StoredReport>;
  get(id: string): Promise<StoredReport | null>;
  /** Deletes a pending upload, only if it belongs to `sessionId`. */
  remove(id: string, sessionId: string): Promise<void>;
  /** Moves pending uploads under the submitted request so cleanup never touches them. */
  attach(ids: string[], reference: string): Promise<void>;
  /** Reads a report attached to a request (admin downloads). */
  open(reference: string, id: string): Promise<R2ObjectBody | null>;
  /** Stores a report straight under a submitted request (patient link uploads). */
  saveToRequest(reference: string, file: { bytes: Uint8Array; fileName: string; mimeType: AllowedMime }): Promise<StoredReport>;
  /** Permanently deletes the given reports of a request (retention, erasure requests). */
  removeFromRequest(reference: string, ids: string[]): Promise<void>;
}

const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const key = (id: string) => `pending/${id}`;

class R2ReportStorage implements ReportStorage {
  constructor(private readonly bucket: R2Bucket) {}

  async save({ bytes, fileName, mimeType, sessionId }: { bytes: Uint8Array; fileName: string; mimeType: AllowedMime; sessionId: string }) {
    const meta: StoredReport = {
      id: crypto.randomUUID(),
      fileName,
      mimeType,
      size: bytes.byteLength,
      createdAt: new Date().toISOString(),
      sessionId,
    };
    await this.bucket.put(key(meta.id), bytes, {
      httpMetadata: { contentType: mimeType, contentDisposition: "attachment" },
      customMetadata: { fileName, createdAt: meta.createdAt, sessionId },
    });
    return meta;
  }

  async get(id: string) {
    if (!ID_RE.test(id)) return null;
    const obj = await this.bucket.head(key(id));
    if (!obj) return null;
    return {
      id,
      fileName: obj.customMetadata?.fileName ?? "report",
      mimeType: (obj.httpMetadata?.contentType ?? "application/pdf") as AllowedMime,
      size: obj.size,
      createdAt: obj.customMetadata?.createdAt ?? obj.uploaded.toISOString(),
      sessionId: obj.customMetadata?.sessionId ?? "",
    };
  }

  async remove(id: string, sessionId: string) {
    const existing = await this.get(id);
    if (!existing || existing.sessionId !== sessionId) return;
    await this.bucket.delete(key(id));
  }

  async attach(ids: string[], reference: string) {
    for (const id of ids.filter((i) => ID_RE.test(i))) {
      const obj = await this.bucket.get(key(id));
      if (!obj) continue;
      // Buffered (≤ MAX_UPLOAD_BYTES): R2 needs a known length for put().
      await this.bucket.put(`requests/${reference}/${id}`, await obj.arrayBuffer(), {
        httpMetadata: obj.httpMetadata,
        customMetadata: { ...obj.customMetadata, reference },
      });
      await this.bucket.delete(key(id));
    }
  }

  async open(reference: string, id: string) {
    if (!ID_RE.test(id)) return null;
    // Falls back to pending/ in case moving the file failed at submission time.
    return (await this.bucket.get(`requests/${reference}/${id}`)) ?? (await this.bucket.get(key(id)));
  }

  async saveToRequest(reference: string, { bytes, fileName, mimeType }: { bytes: Uint8Array; fileName: string; mimeType: AllowedMime }) {
    const meta: StoredReport = {
      id: crypto.randomUUID(),
      fileName,
      mimeType,
      size: bytes.byteLength,
      createdAt: new Date().toISOString(),
      sessionId: "",
    };
    await this.bucket.put(`requests/${reference}/${meta.id}`, bytes, {
      httpMetadata: { contentType: mimeType, contentDisposition: "attachment" },
      customMetadata: { fileName, createdAt: meta.createdAt, reference },
    });
    return meta;
  }

  async removeFromRequest(reference: string, ids: string[]) {
    const valid = ids.filter((i) => ID_RE.test(i));
    // Also clears copies left in pending/ if moving them failed at submission.
    const keys = valid.flatMap((id) => [`requests/${reference}/${id}`, key(id)]);
    for (let i = 0; i < keys.length; i += 1000) await this.bucket.delete(keys.slice(i, i + 1000));
  }
}

export function getReportStorage(): ReportStorage {
  return new R2ReportStorage(cfEnv().REPORTS);
}
