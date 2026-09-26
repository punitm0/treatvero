import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Cloudflare bindings (D1, R2, rate limiters, vars/secrets) declared in
 * wrangler.jsonc. Only call from request-time code (route handlers, server
 * actions, dynamic pages). In `next dev` these are local Miniflare
 * emulations, so no Cloudflare account is needed to develop.
 */
export function cfEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}
