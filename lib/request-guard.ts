import "server-only";

/**
 * Rejects cross-site requests to state-changing API routes. Server Actions
 * get equivalent protection from Next.js; route handlers need it explicitly.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
