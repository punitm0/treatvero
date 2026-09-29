import type { CitySlug, FAQ, TreatmentSlug } from "@/types";

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
 * "Patients from X" pages. Each page is a practical guide for one country:
 * medical visa, flights to India, documents, money and country-specific FAQs,
 * every fact backed by an official source listed in `sources`.
 *
 * A page is only generated when `published: true` AND `isSubstantial()` holds
 * (intro, visa, travel, at least 3 notes, 4 FAQs and 2 sources). Anything less
 * 404s, so thin or half-written pages never ship.
 */
export type SourceCountryPage = {
  slug: string;
  /** As used in a sentence: "Bangladesh", "the UAE". */
  country: string;
  demonym: string;
  published: boolean;
  /** YYYY-MM-DD the facts on the page were last checked against `sources`. */
  verifiedOn?: string;
  /** 2–3 sentences under the H1, specific to this country. */
  intro?: string;
  /** Meta description, 140–160 characters, specific to this country. */
  metaDescription?: string;
  /** "At a glance" strip, e.g. time difference, main airport, visa route. 3–5 items. */
  facts: { label: string; value: string }[];
  visa?: {
    /** e-Medical visa status for this nationality on indianvisaonline.gov.in. */
    eMedical: "available" | "not-available" | "suspended";
    /** 1–3 sentences: which visa, where to apply, companions. */
    summary: string;
    /** 2–5 short, country-specific points (attendant visa, where to submit, processing notes). */
    points: string[];
    /** Indian mission(s) handling visas for this country. */
    missions: { name: string; url: string }[];
  };
  travel?: {
    /** 1–3 sentences on how people usually fly to India from this country. */
    summary: string;
    /** Main international departure airports in the country. */
    airports: { name: string; code: string }[];
    /** How each Indian city is reached. Only cities with a verified route pattern. */
    routes: { to: CitySlug; kind: "direct" | "one-stop"; note: string }[];
  };
  /** Other practical cards: documents, money, language, time zone. 3–6 items, 1–3 sentences each. */
  notes: { title: string; text: string }[];
  /** 4–6 country-specific questions, answered from the sources. */
  faqs: FAQ[];
  /** Official sources for the facts on this page (shown on the page). */
  sources: { title: string; url: string }[];
};

const emptyCountry = { published: false, facts: [], notes: [], faqs: [], sources: [] };

export const sourceCountryPages: SourceCountryPage[] = [
  { slug: "nigeria", country: "Nigeria", demonym: "Nigerian", ...emptyCountry },
  { slug: "kenya", country: "Kenya", demonym: "Kenyan", ...emptyCountry },
  { slug: "bangladesh", country: "Bangladesh", demonym: "Bangladeshi", ...emptyCountry },
  { slug: "uae", country: "the UAE", demonym: "UAE", ...emptyCountry },
];

/** True when a page has enough verified, country-specific content to publish. */
export function isSubstantial(p: SourceCountryPage): boolean {
  return Boolean(
    p.verifiedOn &&
      p.intro &&
      p.visa &&
      p.visa.missions.length > 0 &&
      p.travel &&
      p.travel.routes.length > 0 &&
      p.facts.length >= 3 &&
      p.notes.length >= 3 &&
      p.faqs.length >= 4 &&
      p.sources.length >= 2,
  );
}

export const publishedSourceCountryPages = sourceCountryPages.filter((p) => p.published && isSubstantial(p));

export function getSourceCountryPage(slug: string) {
  return publishedSourceCountryPages.find((p) => p.slug === slug);
}
