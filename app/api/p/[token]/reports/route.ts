import { clientKey, getRateLimiter } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/request-guard";
import { MAX_FILES_PER_UPLOAD, resolvePatientLink } from "@/lib/patient-links";
import { getReportStorage } from "@/lib/uploads/storage";
import { MAX_UPLOAD_BYTES, precheckFile, safeFileName, sniffMime } from "@/lib/uploads/validate";
import { cfEnv } from "@/lib/cloudflare";
import { eventStatement, PATIENT_ACTOR } from "@/lib/admin/requests";
import { notifyPatientActivity } from "@/lib/notifications/patient-activity";

/**
 * Additional reports from a patient's private page (plain form POST). The
 * link token authorises the upload; files go straight under the request in
 * private R2 storage. Redirects back to the page with the outcome.
 */
export async function POST(request: Request, ctx: RouteContext<"/api/p/[token]/reports">) {
  const { token } = await ctx.params;
  const back = (q: string) =>
    new Response(null, { status: 303, headers: { Location: `/p/${token}?${q}#reports`, "Cache-Control": "no-store" } });

  if (!isSameOrigin(request)) return new Response("Forbidden", { status: 403 });
  const limited = await getRateLimiter("upload").limit(clientKey(request.headers));
  if (!limited.success) return back("upload=busy");
  const link = await resolvePatientLink(token);
  if (!link) return new Response("This link has expired.", { status: 404, headers: { "Cache-Control": "no-store" } });

  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_FILES_PER_UPLOAD * MAX_UPLOAD_BYTES + 256 * 1024) return back("upload=toolarge");

  let files: File[];
  try {
    files = (await request.formData()).getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  } catch {
    return back("upload=invalid");
  }
  if (!files.length) return back("upload=empty");
  if (files.length > MAX_FILES_PER_UPLOAD) return back("upload=toomany");

  const storage = getReportStorage();
  const db = cfEnv().DB;
  let saved = 0;
  for (const file of files) {
    if (precheckFile(file)) continue;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const mimeType = sniffMime(bytes);
    if (!mimeType) continue;
    try {
      const stored = await storage.saveToRequest(link.reference, { bytes, fileName: safeFileName(file.name), mimeType });
      await db.batch([
        db
          .prepare("INSERT INTO request_reports (report_id, reference, file_name, mime_type, size_bytes) VALUES (?, ?, ?, ?, ?)")
          .bind(stored.id, link.reference, stored.fileName, stored.mimeType, stored.size),
        eventStatement(link.reference, "patient_upload", PATIENT_ACTOR, `Patient uploaded ${stored.fileName}`),
      ]);
      saved++;
    } catch {
      console.error("[patient-upload] failed to store a report"); // no file details logged
    }
  }
  if (saved) notifyPatientActivity(link.reference, `uploaded ${saved} report(s)`, `patient-upload/${link.id}/${Date.now()}`);
  return back(saved === files.length ? `upload=ok&n=${saved}` : `upload=partial&n=${saved}`);
}
