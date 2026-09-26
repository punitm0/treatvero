import type { MetadataRoute } from "next";
import { treatments } from "@/data/treatments";
import { hospitals } from "@/data/hospitals";
import { publishedIndiaPages, publishedSourceCountryPages } from "@/data/seo-pages";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/india", priority: 0.9 },
    { path: "/treatments", priority: 0.9 },
    { path: "/get-treatment-options", priority: 0.9 },
    { path: "/pricing", priority: 0.8 },
    { path: "/concierge", priority: 0.8 },
    { path: "/how-it-works", priority: 0.7 },
    { path: "/hospitals", priority: 0.7 },
    { path: "/about", priority: 0.5 },
    { path: "/contact", priority: 0.5 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/medical-disclaimer", priority: 0.3 },
  ];

  return [
    ...staticPaths.map(({ path, priority }) => ({ url: absoluteUrl(path), changeFrequency: "monthly" as const, priority })),
    ...treatments.map((t) => ({ url: absoluteUrl(`/treatments/${t.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...publishedIndiaPages.map((p) => ({ url: absoluteUrl(`/india/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...publishedSourceCountryPages.map((p) => ({ url: absoluteUrl(`/from/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    // Sample hospital listings are excluded (they are noindex).
    ...hospitals
      .filter((h) => !h.isSample)
      .map((h) => ({ url: absoluteUrl(`/hospitals/${h.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
