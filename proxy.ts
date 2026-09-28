import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs only for the unlisted admin area (lib/admin/path.ts) and patients'
 * private pages (/p/<token>). Sets a strict, nonce-based Content Security
 * Policy (both render patient-supplied text, so no inline scripts are allowed
 * without the per-request nonce). For the admin it also turns away requests
 * that didn't come through Cloudflare Access. The Access token itself is
 * verified in lib/admin/auth.ts — this is only an early, cheap rejection.
 */
export function proxy(request: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";
  const isPatientPage = request.nextUrl.pathname.startsWith("/p/");

  if (!isDev && !isPatientPage && !request.headers.get("cf-access-jwt-assertion")) {
    // Look like a missing page rather than advertising that something is here.
    return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const nonce = btoa(crypto.randomUUID());
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Must be literals (statically analysed) — keep in sync with ADMIN_PATH.
  matcher: ["/coord-8k3m7x2q", "/coord-8k3m7x2q/:path*", "/p/:path*"],
};
