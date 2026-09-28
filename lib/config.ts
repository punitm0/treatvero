/**
 * Site-wide configuration. Values that differ per environment come from
 * NEXT_PUBLIC_* variables; everything else lives here so components never
 * hardcode brand strings, URLs or feature flags.
 */

function normaliseUrl(url: string | undefined): string {
  const fallback = "http://localhost:3000";
  if (!url) return fallback;
  try {
    return new URL(url).origin;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: "TreatVero",
  tagline: "Medical travel, made simple.",
  supportingLine: "Your treatment journey, coordinated.",
  description:
    "Explore medical treatment options abroad and get help coordinating hospitals, visas, accommodation, travel and on-ground support with TreatVero.",
  url: normaliseUrl(process.env.NEXT_PUBLIC_SITE_URL),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  /** Cloudflare Turnstile site key (public). Falls back to the always-pass test key in development. */
  turnstileSiteKey:
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (process.env.NODE_ENV === "development" ? "1x00000000000000000000AA" : ""),
  locale: "en",
  foundingYear: 2026,
} as const;

/**
 * Launch-state flags. The design includes sections that must stay hidden
 * until verified content exists (see the design's "Launch state" props).
 */
export const features = {
  /** Shows the "Patient stories coming soon" placeholder band. Never shows fabricated stories. */
  showPatientStoriesPlaceholder: true,
  /** Metrics band — keep false until verified figures are available. */
  showMetrics: false,
} as const;

export const ENQUIRY_PATH = "/get-treatment-options";
