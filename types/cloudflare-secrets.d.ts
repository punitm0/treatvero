// Worker secrets aren't in wrangler.jsonc, so `wrangler types` can't see them.
// Set with `npx wrangler secret put <NAME>`; locally, see .dev.vars.example.
interface CloudflareEnv {
  TURNSTILE_SECRET?: string;
  SESSION_SECRET?: string;
}
