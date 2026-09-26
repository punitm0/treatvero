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
 * enquiry is submitted. Add an R2 lifecycle rule that deletes `pending/`
 * objects after ~7 days so abandoned uploads don't linger (see README).
 */
export type StoredReport = {
  id: string;
  fileName: string;
  mimeType: AllowedMime;
  size: number;
  createdAt: string;
};

export interface ReportStorage {
  save(file: { bytes: Uint8Array; fileName: string; mimeType: AllowedMime }): Promise<StoredReport>;
  get(id: string): Promise<StoredReport | null>;
  remove(id: string): Promise<void>;
  /** Moves pending uploads under the submitted request so cleanup never touches them. */
  attach(ids: string[], reference: string): Promise<void>;
}

const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const key = (id: string) => `pending/${id}`;

class R2ReportStorage implements ReportStorage {
  constructor(private readonly bucket: R2Bucket) {}

  async save({ bytes, fileName, mimeType }: { bytes: Uint8Array; fileName: string; mimeType: AllowedMime }) {
    const meta: StoredReport = {
      id: crypto.randomUUID(),
      fileName,
      mimeType,
      size: bytes.byteLength,
      createdAt: new Date().toISOString(),
    };
    await this.bucket.put(key(meta.id), bytes, {
      httpMetadata: { contentType: mimeType, contentDisposition: "attachment" },
      customMetadata: { fileName, createdAt: meta.createdAt },
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
    };
  }

  async remove(id: string) {
    if (!ID_RE.test(id)) return;
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
}

export function getReportStorage(): ReportStorage {
  return new R2ReportStorage(cfEnv().REPORTS);
}
