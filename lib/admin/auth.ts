import "server-only";
import { headers } from "next/headers";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { cfEnv } from "@/lib/cloudflare";

/**
 * Admin authentication via Cloudflare Access.
 *
 * Access sits in front of the admin path (lib/admin/path.ts) on treatvero.com and decides who may sign
 * in (Zero Trust → Access → Applications). Every request it lets through
 * carries a signed JWT in `Cf-Access-Jwt-Assertion`; we verify its signature,
 * issuer and audience here so the admin stays closed even if the Access
 * application is misconfigured or the Worker is reached another way (e.g. a
 * workers.dev URL).
 *
 * Configure CF_ACCESS_TEAM_DOMAIN and CF_ACCESS_AUD in wrangler.jsonc. Until
 * both are set, everyone is denied. In `next dev` a local dev user is used.
 */
export type AdminUser = { email: string };

export type AdminAuthResult = { ok: true; user: AdminUser } | { ok: false; reason: "not-configured" | "unauthorized" };

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function jwks(teamDomain: string) {
  let set = jwksCache.get(teamDomain);
  if (!set) {
    set = createRemoteJWKSet(new URL(`https://${teamDomain}/cdn-cgi/access/certs`));
    jwksCache.set(teamDomain, set);
  }
  return set;
}

export async function authenticateAdmin(): Promise<AdminAuthResult> {
  // Reading request headers first also keeps every admin page dynamic (never prerendered).
  const token = (await headers()).get("cf-access-jwt-assertion");
  if (process.env.NODE_ENV === "development") return { ok: true, user: { email: "dev@localhost" } };

  const env = cfEnv();
  const teamDomain = String(env.CF_ACCESS_TEAM_DOMAIN || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  const audience = String(env.CF_ACCESS_AUD || "");
  if (!teamDomain || !audience) return { ok: false, reason: "not-configured" };

  if (!token) return { ok: false, reason: "unauthorized" };

  try {
    const { payload } = await jwtVerify(token, jwks(teamDomain), {
      issuer: `https://${teamDomain}`,
      audience,
      algorithms: ["RS256"],
    });
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : "";
    if (!email) return { ok: false, reason: "unauthorized" };
    return { ok: true, user: { email } };
  } catch {
    return { ok: false, reason: "unauthorized" };
  }
}

/** For server actions and route handlers: throws if the caller isn't an admin. */
export async function requireAdmin(): Promise<AdminUser> {
  const result = await authenticateAdmin();
  if (!result.ok) throw new Error("Unauthorized");
  return result.user;
}
