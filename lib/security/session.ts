import "server-only";
import { cookies } from "next/headers";
import { cfEnv } from "@/lib/cloudflare";

/**
 * Short-lived visitor session issued after a Turnstile check passes.
 *
 * Uploads, upload deletion and enquiry submission all require it, and every
 * upload is tagged with the session id — so a report can only be removed or
 * attached by the browser that uploaded it. The cookie is an HMAC-signed
 * `<id>.<expiry>` value keyed by the SESSION_SECRET Worker secret; nothing
 * about the visitor is stored.
 */
export const SESSION_COOKIE = "tv_session";
const TTL_SECONDS = 2 * 60 * 60;
const DEV_SECRET = "treatvero-dev-only-session-secret";
const ID_RE = /^[0-9a-f-]{36}$/;

function secret(): string | null {
  return cfEnv().SESSION_SECRET || (process.env.NODE_ENV === "development" ? DEV_SECRET : null);
}

async function sign(value: string, key: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(value)));
  return btoa(String.fromCharCode(...mac)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * HMAC of `value` keyed by the session secret, for other signed tokens
 * (e.g. patient links). Null when no secret is configured.
 */
export async function signWithSessionSecret(value: string): Promise<string | null> {
  const key = secret();
  return key ? sign(value, key) : null;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Issues a new session cookie. Returns false when no signing secret is configured. */
export async function startSession(): Promise<boolean> {
  const key = secret();
  if (!key) {
    console.error("[session] SESSION_SECRET is not set");
    return false;
  }
  const payload = `${crypto.randomUUID()}.${Math.floor(Date.now() / 1000) + TTL_SECONDS}`;
  (await cookies()).set(SESSION_COOKIE, `${payload}.${await sign(payload, key)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    path: "/",
    maxAge: TTL_SECONDS,
  });
  return true;
}

/** Returns the session id if the request carries a valid, unexpired session cookie. */
export async function getSessionId(): Promise<string | null> {
  const key = secret();
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!key || !raw) return null;
  const [id, exp, mac] = raw.split(".");
  if (!id || !exp || !mac || !ID_RE.test(id)) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  return timingSafeEqual(mac, await sign(`${id}.${exp}`, key)) ? id : null;
}
