import { NextResponse } from "next/server";
import { clientKey, getRateLimiter } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/request-guard";
import { startSession } from "@/lib/security/session";
import { verifyTurnstile } from "@/lib/security/turnstile";

/**
 * Exchanges a Turnstile token for a short-lived session cookie. Uploads and
 * enquiry submission require that session (see lib/security/session.ts).
 */
export async function POST(request: Request) {
  const noStore = { "Cache-Control": "no-store" };
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403, headers: noStore });
  }

  const ip = clientKey(request.headers);
  const limited = await getRateLimiter("session").limit(ip);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429, headers: noStore });
  }

  const body = (await request.json().catch(() => null)) as { token?: unknown } | null;
  const token = typeof body?.token === "string" ? body.token : "";
  if (!(await verifyTurnstile(token, ip))) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 403, headers: noStore });
  }
  if (!(await startSession())) {
    return NextResponse.json({ error: "Verification is unavailable right now." }, { status: 503, headers: noStore });
  }
  return new NextResponse(null, { status: 204, headers: noStore });
}
