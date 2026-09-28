import type { Hospital, TreatmentSlug } from "@/types";
import { getCity } from "@/data/destinations";

/**
 * Hospital listings.
 *
 * These are real hospitals listed independently — none is a TreatVero
 * partner (`isConfirmedPartner: false`). Only set `isConfirmedPartner: true`
 * once a written agreement exists.
 *
 * Rules for every entry:
 * - Accreditations must be checked against the accrediting body's own
 *   directory (JCI: jointcommission.org "Find JCI Accredited Organizations").
 *   Don't add NABH or others unless checked on the official portal.
 * - Specialties use the existing treatment slugs and must be departments the
 *   hospital lists on its own website.
 * - Descriptions are factual and neutral: no rankings, "best", "leading",
 *   outcome or volume claims.
 * - Leave `image` unset unless we have the rights to a photo; the city photo
 *   is shown instead.
 * - Set `verifiedOn` to the date the entry was checked.
 */
export const hospitals: Hospital[] = [
  /* ------------------------------- Delhi NCR ------------------------------- */
  {
    slug: "medanta-the-medicity-gurugram",
    name: "Medanta – The Medicity",
    city: "delhi-ncr",
    accreditations: ["JCI"],
    specialties: ["cardiac-care", "organ-transplant", "cancer-treatment", "neurology-neurosurgery", "orthopaedics", "spine-surgery"],
    description:
      "Multi-specialty tertiary-care hospital in Gurugram. JCI-accredited (Hospital Program) since 2013.",
    website: "https://www.medanta.org",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  {
    slug: "indraprastha-apollo-hospitals-new-delhi",
    name: "Indraprastha Apollo Hospitals",
    city: "delhi-ncr",
    accreditations: ["JCI"],
    specialties: ["cardiac-care", "organ-transplant", "cancer-treatment", "orthopaedics", "spine-surgery"],
    description:
      "Multi-specialty tertiary-care hospital at Sarita Vihar, New Delhi, part of the Apollo Hospitals group. JCI-accredited (Hospital Program) since 2005.",
    website: "https://www.apollohospitals.com",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  {
    slug: "fortis-memorial-research-institute-gurugram",
    name: "Fortis Memorial Research Institute",
    city: "delhi-ncr",
    accreditations: ["JCI"],
    specialties: ["cancer-treatment", "organ-transplant", "neurology-neurosurgery", "orthopaedics"],
    description:
      "Multi-specialty tertiary-care hospital in Gurugram, part of Fortis Healthcare. JCI-accredited (Hospital Program) since 2019.",
    website: "https://www.fortishealthcare.com",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* -------------------------------- Mumbai --------------------------------- */
  {
    slug: "kokilaben-dhirubhai-ambani-hospital-mumbai",
    name: "Kokilaben Dhirubhai Ambani Hospital",
    city: "mumbai",
    accreditations: ["JCI"],
    specialties: ["cancer-treatment", "orthopaedics", "spine-surgery", "neurology-neurosurgery", "organ-transplant"],
    description:
      "Multi-specialty tertiary-care hospital and medical research institute in Andheri West, Mumbai. JCI-accredited (Hospital Program) since 2015.",
    website: "https://www.kokilabenhospital.com",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  {
    slug: "sir-hn-reliance-foundation-hospital-mumbai",
    name: "Sir H. N. Reliance Foundation Hospital",
    city: "mumbai",
    accreditations: ["JCI"],
    specialties: ["cardiac-care", "cancer-treatment", "orthopaedics"],
    description:
      "Multi-specialty tertiary-care hospital and research centre in Girgaon, South Mumbai. JCI-accredited (Hospital Program) since 2020.",
    website: "https://www.rfhospital.org",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* -------------------------------- Chennai -------------------------------- */
  {
    slug: "apollo-hospitals-greams-road-chennai",
    name: "Apollo Hospitals, Greams Road",
    city: "chennai",
    accreditations: ["JCI"],
    specialties: ["cardiac-care", "organ-transplant", "orthopaedics", "spine-surgery", "neurology-neurosurgery"],
    description:
      "The Apollo group's flagship multi-specialty hospital in central Chennai. JCI-accredited (Hospital Program) since 2006.",
    website: "https://www.apollohospitals.com",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  {
    slug: "mgm-healthcare-chennai",
    name: "MGM Healthcare",
    city: "chennai",
    accreditations: ["JCI"],
    specialties: ["organ-transplant", "cardiac-care", "neurology-neurosurgery"],
    description: "Multi-specialty tertiary-care hospital in Aminjikarai, Chennai. JCI-accredited (Hospital Program) since 2021.",
    website: "https://www.mgmhealthcare.in",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* ------------------------------- Bengaluru ------------------------------- */
  {
    slug: "narayana-institute-of-cardiac-sciences-bengaluru",
    name: "Narayana Institute of Cardiac Sciences",
    city: "bengaluru",
    accreditations: ["JCI"],
    specialties: ["cardiac-care"],
    description:
      "Specialist cardiac hospital at Narayana Health City on Hosur Road, Bengaluru, covering adult and paediatric heart care. JCI-accredited (Hospital Program).",
    website: "https://www.narayanahealth.org",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  {
    slug: "apollo-hospitals-bannerghatta-road-bengaluru",
    name: "Apollo Hospitals, Bannerghatta Road",
    city: "bengaluru",
    accreditations: ["JCI"],
    specialties: ["cardiac-care", "orthopaedics", "neurology-neurosurgery", "cancer-treatment"],
    description:
      "Multi-specialty tertiary-care hospital in south Bengaluru, part of the Apollo Hospitals group. JCI-accredited (Hospital Program) since 2008.",
    website: "https://www.apollohospitals.com",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* ------------------------------- Hyderabad ------------------------------- */
  {
    slug: "apollo-hospitals-jubilee-hills-hyderabad",
    name: "Apollo Hospitals, Jubilee Hills",
    city: "hyderabad",
    accreditations: ["JCI"],
    specialties: ["cardiac-care", "organ-transplant", "cancer-treatment", "orthopaedics", "neurology-neurosurgery"],
    description:
      "Multi-specialty tertiary-care campus in Jubilee Hills, Hyderabad, part of the Apollo Hospitals group. JCI-accredited (Hospital Program) since 2006.",
    website: "https://www.apollohospitals.com",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  {
    slug: "aig-hospitals-hyderabad",
    name: "AIG Hospitals",
    city: "hyderabad",
    accreditations: ["JCI"],
    specialties: ["organ-transplant", "bariatric-surgery", "cancer-treatment"],
    description:
      "Tertiary-care hospital in Gachibowli, Hyderabad, with a focus on gastroenterology, liver care and digestive surgery. JCI-accredited (Hospital Program) since 2021.",
    website: "https://aighospitals.com",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* ------------------------------- Ahmedabad ------------------------------- */
  {
    slug: "marengo-cims-hospital-ahmedabad",
    name: "Marengo CIMS Hospital",
    city: "ahmedabad",
    accreditations: ["JCI"],
    specialties: ["cardiac-care", "organ-transplant", "neurology-neurosurgery", "orthopaedics"],
    description:
      "Multi-specialty tertiary-care hospital off Sola Road, Ahmedabad, operated by Marengo Asia Healthcare. JCI-accredited (Hospital Program) since 2016.",
    website: "https://www.marengoasiahospitals.com",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  {
    slug: "apex-heart-institute-ahmedabad",
    name: "Apex Heart Institute",
    city: "ahmedabad",
    accreditations: ["JCI"],
    specialties: ["cardiac-care"],
    description: "Specialist cardiac hospital in Ahmedabad. JCI-accredited (Hospital Program) since 2018.",
    website: "https://www.apexheart.in",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
];

export function getHospital(slug: string): Hospital | undefined {
  return hospitals.find((h) => h.slug === slug);
}

export function getHospitalsForTreatment(slug: TreatmentSlug, limit = 3): Hospital[] {
  return hospitals.filter((h) => h.specialties.includes(slug)).slice(0, limit);
}

/** Photo for a listing: its own licensed photo, else the city photo. */
export function hospitalImage(h: Hospital): string {
  return h.image ?? getCity(h.city).image;
}

export const hasSampleHospitals = hospitals.some((h) => h.isSample);
