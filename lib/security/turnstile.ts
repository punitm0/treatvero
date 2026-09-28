import "server-only";
import { cfEnv } from "@/lib/cloudflare";

/**
 * Cloudflare Turnstile verification (bot protection for the enquiry form).
 * The widget's secret is a Worker secret: `npx wrangler secret put TURNSTILE_SECRET`.
 * In `next dev` Cloudflare's always-pass test secret is used when none is set.
 */
const DEV_TEST_SECRET = "1x0000000000000000000000000000000AA";
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string, remoteIp: string): Promise<boolean> {
  const secret = cfEnv().TURNSTILE_SECRET || (process.env.NODE_ENV === "development" ? DEV_TEST_SECRET : "");
  if (!secret || !token || token.length > 2048) return false;
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(remoteIp !== "unknown" ? { remoteip: remoteIp } : {}),
        idempotency_key: crypto.randomUUID(),
      }),
    });
    const result = (await res.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    console.error("[turnstile] siteverify request failed");
    return false;
  }
}
