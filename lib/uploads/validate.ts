/**
 * Upload rules shared by client (early feedback) and server (enforcement).
 * The server never trusts the browser-supplied MIME type: it checks the
 * file's magic bytes.
 */

/**
 * Per-file limit (the design's 20 MB). Files stream through the Worker to R2;
 * Cloudflare's request-body limit is 100 MB on Free/Pro plans.
 */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
export const MAX_UPLOAD_FILES = 10;

export const ALLOWED_UPLOADS = {
  "application/pdf": { ext: ["pdf"], label: "PDF" },
  "image/jpeg": { ext: ["jpg", "jpeg"], label: "JPG" },
  "image/png": { ext: ["png"], label: "PNG" },
} as const;

export type AllowedMime = keyof typeof ALLOWED_UPLOADS;

export const ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

export function extensionOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

/** Quick client-side check by extension/size (server re-validates). */
export function precheckFile(file: { name: string; size: number }): string | null {
  const ext = extensionOf(file.name);
  const ok = Object.values(ALLOWED_UPLOADS).some((v) => (v.ext as readonly string[]).includes(ext));
  if (!ok) return "Only PDF, JPG, JPEG or PNG files can be uploaded.";
  if (file.size === 0) return "This file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) return `Files must be ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB or smaller.`;
  return null;
}

/** Detects the real type from the first bytes of the file. */
export function sniffMime(bytes: Uint8Array): AllowedMime | null {
  const starts = (sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (starts([0x25, 0x50, 0x44, 0x46, 0x2d])) return "application/pdf"; // %PDF-
  if (starts([0xff, 0xd8, 0xff])) return "image/jpeg";
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  return null;
}

/** Strips paths/control characters; keeps a short, display-safe name. */
export function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  const cleaned = base.replace(/[\u0000-\u001f\u007f<>:"|?*]/g, "").trim();
  return (cleaned || "file").slice(0, 120);
}
