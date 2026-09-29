import type { MetadataRoute } from "next";
import { treatments } from "@/data/treatments";
import { hospitals } from "@/data/hospitals";
import { publishedIndiaPages, publishedSourceCountryPages } from "@/data/seo-pages";
import { absoluteUrl } from "@/lib/utils";

// Each section is served as its own sitemap at /sitemaps/sitemap/<id>.xml
// (app/sitemaps/sitemap.ts) and listed in the index at /sitemap.xml
// (app/sitemap.xml/route.ts).
export const sitemapIds = ["pages", "treatments", "india", "from", "hospitals"] as const;
export type SitemapId = (typeof sitemapIds)[number];

export function sitemapUrl(id: SitemapId): string {
  return absoluteUrl(`/sitemaps/sitemap/${id}.xml`);
}

/** Top-level pages, shared by the XML sitemap and the HTML /sitemap page. */
export const mainPages: { path: string; label: string; priority: number }[] = [
  { path: "/", label: "Home", priority: 1 },
  { path: "/india", label: "Treatment in India", priority: 0.9 },
  { path: "/treatments", label: "Treatments", priority: 0.9 },
  { path: "/get-treatment-options", label: "Get treatment options", priority: 0.9 },
  { path: "/pricing", label: "Pricing", priority: 0.8 },
  { path: "/concierge", label: "Concierge", priority: 0.8 },
  { path: "/how-it-works", label: "How it works", priority: 0.7 },
  { path: "/hospitals", label: "Hospitals", priority: 0.7 },
  { path: "/about", label: "About", priority: 0.5 },
  { path: "/contact", label: "Contact", priority: 0.5 },
  { path: "/privacy", label: "Privacy Policy", priority: 0.2 },
  { path: "/terms", label: "Terms of Service", priority: 0.2 },
  { path: "/medical-disclaimer", label: "Medical Disclaimer", priority: 0.3 },
  { path: "/sitemap", label: "Sitemap", priority: 0.2 },
];

export const sitemapSections: Record<SitemapId, () => MetadataRoute.Sitemap> = {
  pages: () =>
    mainPages.map(({ path, priority }) => ({ url: absoluteUrl(path), changeFrequency: "monthly", priority })),
  treatments: () =>
    treatments.map((t) => ({ url: absoluteUrl(`/treatments/${t.slug}`), changeFrequency: "monthly", priority: 0.8 })),
  india: () =>
    publishedIndiaPages.map((p) => ({ url: absoluteUrl(`/india/${p.slug}`), changeFrequency: "monthly", priority: 0.7 })),
  from: () =>
    publishedSourceCountryPages.map((p) => ({ url: absoluteUrl(`/from/${p.slug}`), changeFrequency: "monthly", priority: 0.6 })),
  hospitals: () =>
    hospitals.map((h) => ({
      url: absoluteUrl(`/hospitals/${h.slug}`),
      ...(h.verifiedOn ? { lastModified: h.verifiedOn } : {}),
      changeFrequency: "monthly",
      priority: 0.6,
    })),
};
