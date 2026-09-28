import { authenticateAdmin } from "@/lib/admin/auth";
import { getReport, logDownload } from "@/lib/admin/requests";
import { getReportStorage } from "@/lib/uploads/storage";

/**
 * Streams a patient's medical report from the private R2 bucket to an
 * authenticated admin, and records the download in the request's activity.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ reference: string; id: string }> }) {
  const auth = await authenticateAdmin();
  if (!auth.ok) return new Response("Not found", { status: 404 });

  const { reference, id } = await params;
  const report = await getReport(reference, id);
  const object = report ? await getReportStorage().open(reference, id) : null;
  if (!report || !object) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });

  await logDownload(reference, report.file_name, auth.user.email);

  const safeName = report.file_name.replace(/[^\w.\- ]+/g, "_");
  return new Response(object.body, {
    headers: {
      "Content-Type": report.mime_type,
      "Content-Length": String(object.size),
      "Content-Disposition": `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(report.file_name)}`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
