import type { Metadata } from "next";
import type { Doctor, FAQ, Hospital } from "@/types";
import { getCity } from "@/data/destinations";
import { getTreatmentOrThrow } from "@/data/treatments";
import { hospitalImage } from "@/data/hospitals";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/utils";

export type Crumb = { name: string; path: string };

/**
 * Per-page metadata with canonical, OpenGraph and Twitter tags. The OG image
 * is inherited from app/opengraph-image.tsx unless a route overrides it.
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  image,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  /** Share image for this page (site path + alt), replacing the default OG image. */
  image?: { path: string; alt: string };
}): Metadata {
  const images = image ? [{ url: image.path, alt: image.alt }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: path,
      locale: "en_US",
      ...(images ? { images } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(images ? { images } : {}) },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

/** TreatVero is an Organization — deliberately not a Hospital/MedicalOrganization. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    slogan: siteConfig.tagline,
    description:
      "TreatVero is an independent medical travel facilitator and patient concierge. It is not a hospital and does not provide medical advice, diagnosis or treatment.",
    logo: absoluteUrl("/icon.svg"),
    ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqJsonLd(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

const accreditors = {
  JCI: { name: "Joint Commission International", url: "https://www.jointcommission.org" },
  NABH: { name: "National Accreditation Board for Hospitals & Healthcare Providers", url: "https://nabh.co" },
};

/**
 * Describes a listed hospital (not TreatVero). Only fields verified for the
 * listing are included; the page is the entity's @id.
 */
export function hospitalJsonLd(h: Hospital) {
  const city = getCity(h.city);
  const credentials = [
    h.jci ? { body: accreditors.JCI, name: `JCI accreditation (${h.jci.program})` } : null,
    h.nabh ? { body: accreditors.NABH, name: `NABH accreditation ${h.nabh.number}` } : null,
  ].filter((c) => c !== null);
  const sameAs = (h.sources ?? []).filter((s) => s.isAbout).map((s) => s.url);
  return {
    "@context": "https://schema.org",
    "@type": "Hospital",
    "@id": `${absoluteUrl(`/hospitals/${h.slug}`)}#hospital`,
    name: h.name,
    description: h.description,
    image: absoluteUrl(hospitalImage(h)),
    ...(sameAs.length ? { sameAs } : {}),
    address: {
      "@type": "PostalAddress",
      ...(h.address ? { streetAddress: h.address } : {}),
      addressLocality: city.name,
      addressCountry: "IN",
    },
    ...(h.geo ? { geo: { "@type": "GeoCoordinates", latitude: h.geo.lat, longitude: h.geo.lng } } : {}),
    ...(h.established ? { foundingDate: String(h.established) } : {}),
    availableService: h.specialties.map((s) => ({ "@type": "MedicalTherapy", name: getTreatmentOrThrow(s).name })),
    ...(credentials.length
      ? {
          hasCredential: credentials.map((c) => ({
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "accreditation",
            name: c.name,
            recognizedBy: { "@type": "Organization", name: c.body.name, url: c.body.url },
          })),
        }
      : {}),
  };
}

/**
 * Describes a listed doctor as a Person working at the listed hospital.
 * Only fields published on the doctor's hospital profile are included.
 */
export function doctorJsonLd(d: Doctor) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absoluteUrl(`/doctors/${d.slug}`)}#person`,
    name: d.name,
    jobTitle: d.designation,
    ...(d.photo ? { image: absoluteUrl(d.photo) } : {}),
    ...(d.about ? { description: d.about } : {}),
    worksFor: { "@id": `${absoluteUrl(`/hospitals/${d.hospital}`)}#hospital` },
    ...(d.expertise?.length ? { knowsAbout: d.expertise } : {}),
    ...(d.languages?.length ? { knowsLanguage: d.languages } : {}),
    ...(d.qualifications.length
      ? {
          hasCredential: d.qualifications.map((q) => ({
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "degree",
            name: q,
          })),
        }
      : {}),
  };
}
