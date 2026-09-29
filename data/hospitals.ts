import type { Hospital, TreatmentSlug } from "@/types";
import { getCity } from "@/data/destinations";

/**
 * Hospital listings.
 *
 * Real hospitals. None is a TreatVero partner yet (`isConfirmedPartner:
 * false`); only set it to true once a written agreement exists.
 *
 * Rules for every entry:
 * - Check the hospital's own website first: name, locality and that it is
 *   the specific hospital (not just the group). `website` links to the
 *   hospital's own page on that site.
 * - Accreditations only from the accrediting bodies' directories:
 *   JCI — jointcommission.org "Find JCI Accredited Organizations";
 *   NABH — nabh.co "Find an Accredited Healthcare Organisation" (hospital
 *   accreditation numbers start with "H-"). Record both in the comment above
 *   the entry. A hospital's own claim isn't enough.
 * - Specialties use the treatment slugs and must be departments or centres
 *   listed on the hospital's own page. Be conservative.
 * - Descriptions are factual and neutral: no rankings, "best", "leading",
 *   outcome or volume claims.
 * - `image`: a photo of the hospital itself, saved to
 *   public/images/hospitals/<slug>.jpg (max 1600px wide).
 * - Set `verifiedOn` to the date the entry was checked.
 * - `website` and `verifiedOn` are internal records only. Don't render them
 *   or any other source on public pages: patients come to hospitals through
 *   TreatVero, not directly.
 */
export const hospitals: Hospital[] = [
  /* ------------------------------- Delhi NCR ------------------------------- */
  // JCI: "Medanta - The Medicity", Gurgaon, Hospital Program, 31 Aug 2013. NABH: H-2011-0073.
  {
    slug: "medanta-the-medicity-gurugram",
    name: "Medanta – The Medicity",
    city: "delhi-ncr",
    accreditations: ["JCI", "NABH"],
    specialties: ["cardiac-care", "cancer-treatment", "neurology-neurosurgery", "orthopaedics", "organ-transplant"],
    description:
      "The founding hospital of the Medanta network: a multi-specialty tertiary-care campus in Sector 38, Gurugram, opened in 2009, with liver, lung and bone marrow transplant programmes.",
    image: "/images/hospitals/medanta-the-medicity-gurugram.jpg",
    website: "https://www.medanta.org/hospitals-near-me/gurugram-hospital",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "Indraprastha Apollo Hospitals", Sarita Vihar, New Delhi, Hospital Program, 18 Jun 2005. NABH: not found in the directory.
  {
    slug: "indraprastha-apollo-hospitals-new-delhi",
    name: "Indraprastha Apollo Hospitals",
    city: "delhi-ncr",
    accreditations: ["JCI"],
    specialties: [
      "cardiac-care",
      "cancer-treatment",
      "orthopaedics",
      "spine-surgery",
      "neurology-neurosurgery",
      "organ-transplant",
      "bariatric-surgery",
      "ivf-fertility",
      "eye-care",
    ],
    description:
      "Multi-specialty tertiary-care hospital on Delhi–Mathura Road, Sarita Vihar, New Delhi, part of the Apollo Hospitals group.",
    image: "/images/hospitals/indraprastha-apollo-hospitals-new-delhi.jpg",
    website: "https://www.apollohospitals.com/hospitals/apollo-hospitals-delhi",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "Fortis Memorial Research Institute", Gurgaon, Hospital Program, 13 Jul 2019. NABH: H-2015-0303.
  {
    slug: "fortis-memorial-research-institute-gurugram",
    name: "Fortis Memorial Research Institute",
    city: "delhi-ncr",
    accreditations: ["JCI", "NABH"],
    specialties: [
      "cardiac-care",
      "cancer-treatment",
      "orthopaedics",
      "spine-surgery",
      "neurology-neurosurgery",
      "organ-transplant",
      "bariatric-surgery",
      "eye-care",
      "dental-treatment",
    ],
    description:
      "Multi-specialty quaternary-care hospital in Sector 44, Gurugram, opposite HUDA City Centre, part of Fortis Healthcare.",
    image: "/images/hospitals/fortis-memorial-research-institute-gurugram.jpg",
    website: "https://www.fortishealthcare.com/location/fortis-memorial-research-institute-gurgaon",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* -------------------------------- Mumbai --------------------------------- */
  // JCI: "Kokilaben Dhirubhai Ambani Hospital & Medical Research Institute", Mumbai, Hospital Program, 13 Dec 2015. NABH: H-2014-0260 (Andheri West).
  {
    slug: "kokilaben-dhirubhai-ambani-hospital-mumbai",
    name: "Kokilaben Dhirubhai Ambani Hospital",
    city: "mumbai",
    accreditations: ["JCI", "NABH"],
    specialties: ["cardiac-care", "cancer-treatment", "orthopaedics", "neurology-neurosurgery", "organ-transplant", "bariatric-surgery"],
    description:
      "Multi-specialty tertiary-care hospital and medical research institute at Four Bungalows, Andheri West, Mumbai.",
    image: "/images/hospitals/kokilaben-dhirubhai-ambani-hospital-mumbai.jpg",
    website: "https://www.kokilabenhospital.com",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "Sir H N Reliance Foundation Hospital and Research Centre", Mumbai, Hospital Program, 17 Oct 2020. NABH: H-2018-0539.
  {
    slug: "sir-hn-reliance-foundation-hospital-mumbai",
    name: "Sir H. N. Reliance Foundation Hospital",
    city: "mumbai",
    accreditations: ["JCI", "NABH"],
    specialties: [
      "cardiac-care",
      "cancer-treatment",
      "orthopaedics",
      "spine-surgery",
      "neurology-neurosurgery",
      "organ-transplant",
      "eye-care",
      "dental-treatment",
    ],
    description: "Multi-specialty tertiary-care hospital and research centre on Raja Rammohan Roy Road, Girgaon, South Mumbai.",
    image: "/images/hospitals/sir-hn-reliance-foundation-hospital-mumbai.jpg",
    imageCredit: "Photo: Ajitdada Pawar, CC BY-SA 4.0, via Wikimedia Commons",
    website: "https://www.rfhospital.org",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* -------------------------------- Chennai -------------------------------- */
  // JCI: "Apollo Hospital, Chennai", Hospital Program, 29 Jan 2006. NABH: not found in the directory.
  {
    slug: "apollo-hospitals-greams-road-chennai",
    name: "Apollo Hospitals, Greams Road",
    city: "chennai",
    accreditations: ["JCI"],
    specialties: [
      "cardiac-care",
      "cancer-treatment",
      "orthopaedics",
      "spine-surgery",
      "neurology-neurosurgery",
      "organ-transplant",
      "bariatric-surgery",
    ],
    description: "The Apollo Hospitals group's flagship multi-specialty hospital, on Greams Road in central Chennai.",
    image: "/images/hospitals/apollo-hospitals-greams-road-chennai.jpg",
    website: "https://www.apollohospitals.com/hospitals/apollo-hospitals-greams-road-chennai",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "MGM Healthcare Pvt. Ltd.", Chennai, Hospital Program, 06 Mar 2021. NABH: H-2021-0768 (Aminjikarai).
  {
    slug: "mgm-healthcare-chennai",
    name: "MGM Healthcare",
    city: "chennai",
    accreditations: ["JCI", "NABH"],
    specialties: ["cardiac-care", "cancer-treatment", "orthopaedics", "neurology-neurosurgery", "organ-transplant"],
    description:
      "Multi-specialty tertiary-care hospital on Nelson Manickam Road, Aminjikarai, Chennai, with heart, lung, liver and multi-organ transplant programmes.",
    image: "/images/hospitals/mgm-healthcare-chennai.jpg",
    website: "https://mgmhealthcare.in",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* ------------------------------- Bengaluru ------------------------------- */
  // JCI: "Narayana Institute of Cardiac Sciences", Hosur Road, Bangalore, Hospital Program, 19 Jun 2026. NABH: H-2007-0007.
  {
    slug: "narayana-institute-of-cardiac-sciences-bengaluru",
    name: "Narayana Institute of Cardiac Sciences",
    city: "bengaluru",
    accreditations: ["JCI", "NABH"],
    specialties: ["cardiac-care"],
    description:
      "Specialist cardiac hospital at Narayana Health City, Bommasandra, on Hosur Road in south Bengaluru, part of Narayana Health.",
    image: "/images/hospitals/narayana-institute-of-cardiac-sciences-bengaluru.jpg",
    website: "https://www.narayanahealth.org/hospitals-clinics/bangalore/narayana-institute-cardiac-sciences-bommasandra",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "Apollo Hospitals, Bangalore", Hospital Program, 18 Jul 2008. NABH: not found in the directory.
  {
    slug: "apollo-hospitals-bannerghatta-road-bengaluru",
    name: "Apollo Hospitals, Bannerghatta Road",
    city: "bengaluru",
    accreditations: ["JCI"],
    specialties: [
      "cardiac-care",
      "cancer-treatment",
      "orthopaedics",
      "spine-surgery",
      "neurology-neurosurgery",
      "organ-transplant",
      "bariatric-surgery",
      "eye-care",
    ],
    description: "Multi-specialty tertiary-care hospital on Bannerghatta Road in south Bengaluru, part of the Apollo Hospitals group.",
    image: "/images/hospitals/apollo-hospitals-bannerghatta-road-bengaluru.jpg",
    website: "https://www.apollohospitals.com/hospitals/apollo-hospitals-bannerghatta-road",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* ------------------------------- Hyderabad ------------------------------- */
  // JCI: "Apollo Hospital, Hyderabad", Road No 72, Film Nagar, Hospital Program, 28 Apr 2006. NABH: not found in the directory.
  {
    slug: "apollo-hospitals-jubilee-hills-hyderabad",
    name: "Apollo Hospitals, Jubilee Hills",
    city: "hyderabad",
    accreditations: ["JCI"],
    specialties: [
      "cardiac-care",
      "cancer-treatment",
      "orthopaedics",
      "spine-surgery",
      "neurology-neurosurgery",
      "organ-transplant",
      "bariatric-surgery",
    ],
    description: "Multi-specialty tertiary-care campus (Apollo Health City) in Jubilee Hills, Hyderabad, part of the Apollo Hospitals group.",
    image: "/images/hospitals/apollo-hospitals-jubilee-hills-hyderabad.jpg",
    website: "https://www.apollohospitals.com/hospitals/apollo-health-city-jubilee-hills",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "AIG Hospitals (A Unit of Asian Institute of Gastroenterology, Private Limited)", Hyderabad, Hospital Program, 11 Dec 2021. NABH: H-2020-0704.
  {
    slug: "aig-hospitals-hyderabad",
    name: "AIG Hospitals",
    city: "hyderabad",
    accreditations: ["JCI", "NABH"],
    specialties: ["organ-transplant", "cancer-treatment", "cardiac-care", "neurology-neurosurgery"],
    description:
      "Multi-specialty hospital on Mindspace Road, Gachibowli, Hyderabad, founded around gastroenterology, with a liver transplant and hepatobiliary surgery programme.",
    image: "/images/hospitals/aig-hospitals-hyderabad.jpg",
    website: "https://aighospitals.com",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* ------------------------------- Ahmedabad ------------------------------- */
  // JCI: "Marengo Asia Healthcare Private Limited", Sola, Ahmedabad, Hospital Program, 24 Sep 2016. NABH: H-2013-0166 (formerly CIMS Hospital).
  {
    slug: "marengo-cims-hospital-ahmedabad",
    name: "Marengo CIMS Hospital",
    city: "ahmedabad",
    accreditations: ["JCI", "NABH"],
    specialties: [
      "cardiac-care",
      "cancer-treatment",
      "orthopaedics",
      "spine-surgery",
      "neurology-neurosurgery",
      "organ-transplant",
      "bariatric-surgery",
      "eye-care",
      "dental-treatment",
    ],
    description:
      "Multi-specialty tertiary-care hospital (formerly CIMS Hospital) off Science City Road, Sola, Ahmedabad, operated by Marengo Asia Healthcare.",
    image: "/images/hospitals/marengo-cims-hospital-ahmedabad.jpg",
    website: "https://www.marengoasiahospitals.com/hospital/marengo-cims-hospital-ahmedabad",
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "Apex Heart Institute (A Unit of TCVS Pvt. Ltd.)", Ahmedabad, Hospital Program, 27 Jan 2018. NABH: H-2014-0235.
  {
    slug: "apex-heart-institute-ahmedabad",
    name: "Apex Heart Institute",
    city: "ahmedabad",
    accreditations: ["JCI", "NABH"],
    specialties: ["cardiac-care"],
    description: "Specialist cardiac hospital at Mondeal Business Park on S G Road, Ahmedabad.",
    image: "/images/hospitals/apex-heart-institute-ahmedabad.jpg",
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

/** Photo for a listing: the hospital's own photo, else the city photo. */
export function hospitalImage(h: Hospital): string {
  return h.image ?? getCity(h.city).image;
}

export const hasSampleHospitals = hospitals.some((h) => h.isSample);
