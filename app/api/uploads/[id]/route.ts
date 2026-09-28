import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/request-guard";
import { getSessionId } from "@/lib/security/session";
import { getReportStorage } from "@/lib/uploads/storage";

/**
 * Removes a report the user uploaded but then deleted before submitting.
 * Only the session that uploaded the file can remove it.
 */
export async function DELETE(request: Request, ctx: RouteContext<"/api/uploads/[id]">) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ error: "Session expired." }, { status: 401 });
  const { id } = await ctx.params;
  await getReportStorage().remove(id, sessionId);
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
