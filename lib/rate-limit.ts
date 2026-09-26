import "server-only";
import { cfEnv } from "@/lib/cloudflare";

/**
 * Rate limiting via Cloudflare Workers Rate Limiting bindings (configured in
 * wrangler.jsonc: enquiries 5/min, uploads 20/min per client). Counters are
 * per Cloudflare location — suitable for abuse protection, not exact quotas.
 * For stronger protection, add a WAF rate-limiting rule or Turnstile.
 */
export interface RateLimiter {
  limit(key: string): Promise<{ success: boolean }>;
}

const bindings = {
  enquiry: "ENQUIRY_RATE_LIMITER",
  upload: "UPLOAD_RATE_LIMITER",
} as const;

export function getRateLimiter(name: keyof typeof bindings): RateLimiter {
  const binding = cfEnv()[bindings[name]];
  return { limit: (key: string) => binding.limit({ key: `${name}:${key}` }) };
}

/** Client identifier for rate limiting. Never stored with request data. */
export function clientKey(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
