/**
 * Unlisted path of the admin area. Obscurity is only an extra layer — access
 * is enforced by Cloudflare Access plus JWT verification (lib/admin/auth.ts).
 * Keep it out of robots.txt, the sitemap and any public page.
 *
 * To change it: rename app/coord-8k3m7x2q, then update this constant, the
 * matcher in proxy.ts, the header rules in next.config.ts and the Access
 * application's path in Cloudflare.
 */
export const ADMIN_PATH = "/coord-8k3m7x2q";
