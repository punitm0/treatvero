import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/request-guard";
import { getReportStorage } from "@/lib/uploads/storage";

/**
 * Removes a report the user uploaded but then deleted before submitting.
 * The id is an unguessable UUID returned only to the uploader.
 * TODO(production): bind uploads to a short-lived session token as well.
 */
export async function DELETE(request: Request, ctx: RouteContext<"/api/uploads/[id]">) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const { id } = await ctx.params;
  await getReportStorage().remove(id);
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
