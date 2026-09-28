import type { CitySlug, TreatmentSlug } from "@/types";

/**
 * Registry for programmatic SEO routes. Pages are only generated when
 * `published: true` AND they have substantive content — this avoids thin,
 * mass-generated pages. Unpublished entries 404 until content is written.
 */

export type IndiaTreatmentPage = {
  kind: "treatment";
  slug: string;
  treatment: TreatmentSlug;
  /** Procedure-level framing for the page H1/title. */
  label: string;
  published: boolean;
};

export type IndiaCityPage = {
  kind: "city";
  slug: string;
  city: CitySlug;
  published: boolean;
};

export type IndiaPage = IndiaTreatmentPage | IndiaCityPage;

export const indiaPages: IndiaPage[] = [
  { kind: "treatment", slug: "cardiac-surgery", treatment: "cardiac-care", label: "Cardiac surgery", published: true },
  { kind: "treatment", slug: "knee-replacement", treatment: "orthopaedics", label: "Knee replacement", published: true },
  { kind: "treatment", slug: "cancer-treatment", treatment: "cancer-treatment", label: "Cancer treatment", published: true },
  { kind: "treatment", slug: "ivf", treatment: "ivf-fertility", label: "IVF", published: true },
  { kind: "city", slug: "delhi", city: "delhi-ncr", published: true },
  { kind: "city", slug: "mumbai", city: "mumbai", published: true },
  { kind: "city", slug: "chennai", city: "chennai", published: true },
  { kind: "city", slug: "bengaluru", city: "bengaluru", published: true },
  { kind: "city", slug: "hyderabad", city: "hyderabad", published: true },
  { kind: "city", slug: "ahmedabad", city: "ahmedabad", published: true },
];

export const publishedIndiaPages = indiaPages.filter((p) => p.published);

export function getIndiaPage(slug: string): IndiaPage | undefined {
  return publishedIndiaPages.find((p) => p.slug === slug);
}

export function indiaCityPageHref(city: CitySlug): string | null {
  const p = publishedIndiaPages.find((x) => x.kind === "city" && x.city === city);
  return p ? `/india/${p.slug}` : null;
}

/**
 * "Patients from X" pages. These need verified, country-specific content
 * (flight routes, visa eligibility, payment options). Until that exists they
 * stay unpublished rather than shipping generic copy.
 */
export type SourceCountryPage = {
  slug: string;
  country: string;
  demonym: string;
  published: boolean;
  /** Verified, country-specific notes — required before publishing. */
  notes: { title: string; text: string }[];
};

export const sourceCountryPages: SourceCountryPage[] = [
  { slug: "nigeria", country: "Nigeria", demonym: "Nigerian", published: false, notes: [] },
  { slug: "kenya", country: "Kenya", demonym: "Kenyan", published: false, notes: [] },
  { slug: "bangladesh", country: "Bangladesh", demonym: "Bangladeshi", published: false, notes: [] },
  { slug: "uae", country: "the UAE", demonym: "UAE", published: false, notes: [] },
];

export const publishedSourceCountryPages = sourceCountryPages.filter((p) => p.published && p.notes.length > 0);

export function getSourceCountryPage(slug: string) {
  return publishedSourceCountryPages.find((p) => p.slug === slug);
}
