import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Exposes local D1/R2/rate-limit bindings (Miniflare) to `next dev`.
initOpenNextCloudflareForDev();

const isDev = process.env.NODE_ENV !== "production";

const TURNSTILE = "https://challenges.cloudflare.com";

/**
 * Content Security Policy for the public site.
 *
 * Public pages are prerendered at build time and served as static assets, so
 * they can't carry a per-request nonce; 'unsafe-inline' scripts stay allowed
 * here (Next.js inlines its RSC payload). These pages render no user-supplied
 * content. The admin area (lib/admin/path.ts) and patients' private pages
 * (/p/<token>), which do, get a strict nonce-based policy from proxy.ts instead.
 */
const publicCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${TURNSTILE}${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  `frame-src ${TURNSTILE}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self' https://checkout.stripe.com",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

/** Headers for every response, public and admin. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const ADMIN = "coord-8k3m7x2q"; // keep in sync with lib/admin/path.ts

const privateHeaders = [
  { key: "Cache-Control", value: "no-store" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // treatvero.com is the canonical host. The bare "/" needs its own rule:
    // on Workers an empty :path* is left uninterpolated in the destination.
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.treatvero.com" }],
        destination: "https://treatvero.com/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.treatvero.com" }],
        destination: "https://treatvero.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Everything except the admin area and patient pages, whose CSP is set per request in proxy.ts.
      { source: `/((?!${ADMIN}(?:/|$)|p/).*)`, headers: [{ key: "Content-Security-Policy", value: publicCsp }] },
      // Never cache or index API responses or the admin area.
      { source: "/api/:path*", headers: privateHeaders },
      { source: `/${ADMIN}`, headers: privateHeaders },
      { source: `/${ADMIN}/:path*`, headers: privateHeaders },
      // Patient pages: the URL token is the credential, so never cache or index them, and never send
      // them as a referrer to other sites ("same-origin" rather than "no-referrer", which would make
      // browsers send `Origin: null` on the page's own form posts).
      { source: "/p/:path*", headers: [...privateHeaders, { key: "Referrer-Policy", value: "same-origin" }] },
    ];
  },
};

export default nextConfig;
