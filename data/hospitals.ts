import type { Hospital, InternationalService, TreatmentSlug } from "@/types";
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
 *   the entry and in `jci` / `nabh` (shown on the page). A hospital's own
 *   claim isn't enough.
 * - `address`: the street address from the hospital's own website.
 * - `geo`: the hospital's position on OpenStreetMap (nominatim.openstreetmap.org).
 *   `airportDistanceKm`: road distance from the city's airport (City.airportName),
 *   from router.project-osrm.org, rounded to the km.
 * - `established`: only when the hospital's own website states the year.
 * - `international`: only services the hospital's (or its group's)
 *   international patients page states; `languages` only when it names them.
 *   Omit the field if there is no such page.
 * - Specialties use the treatment slugs and must be departments or centres
 *   listed on the hospital's own page. Be conservative.
 * - Descriptions are factual and neutral: no rankings, "best", "leading",
 *   outcome or volume claims.
 * - `image`: a photo of the hospital itself, saved to
 *   public/images/hospitals/<slug>.jpg (max 1600px wide).
 * - Set `verifiedOn` to the date the entry was checked.
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
    address: "CH Baktawar Singh Road, Sector 38, Gurugram, Haryana 122001",
    geo: { lat: 28.43895, lng: 77.04027 },
    airportDistanceKm: 19,
    established: 2009,
    jci: {
      listedAs: "Medanta - The Medicity",
      program: "Hospital Program",
      effectiveDate: "2013-08-31",
    },
    nabh: { number: "H-2011-0073" },
    international: {
      url: "https://www.medanta.org/international-patient",
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
      languages: ["Russian", "Arabic", "Bengali", "Burmese", "Persian"],
    },
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
    address: "Delhi–Mathura Road, Sarita Vihar, New Delhi, Delhi 110076",
    geo: { lat: 28.54111, lng: 77.28333 },
    airportDistanceKm: 24,
    jci: {
      listedAs: "Indraprastha Apollo Hospitals",
      program: "Hospital Program",
      effectiveDate: "2005-06-18",
    },
    international: {
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    description: "Multi-specialty quaternary-care hospital in Sector 44, Gurugram, opposite HUDA City Centre, part of Fortis Healthcare.",
    image: "/images/hospitals/fortis-memorial-research-institute-gurugram.jpg",
    website: "https://www.fortishealthcare.com/location/fortis-memorial-research-institute-gurgaon",
    address: "Sector 44, opposite HUDA City Centre, Gurugram, Haryana 122002",
    geo: { lat: 28.45712, lng: 77.07277 },
    airportDistanceKm: 17,
    established: 2013,
    jci: {
      listedAs: "Fortis Memorial Research Institute",
      program: "Hospital Program",
      effectiveDate: "2019-07-13",
    },
    nabh: { number: "H-2015-0303" },
    international: {
      url: "https://www.fortishealthcare.com/international-patients/hospitals/fortis-memorial-research-institute-gurgaon",
      services: ["coordinator"],
    },
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
    description: "Multi-specialty tertiary-care hospital and medical research institute at Four Bungalows, Andheri West, Mumbai.",
    image: "/images/hospitals/kokilaben-dhirubhai-ambani-hospital-mumbai.jpg",
    website: "https://www.kokilabenhospital.com",
    address: "Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai, Maharashtra 400053",
    geo: { lat: 19.13126, lng: 72.82467 },
    airportDistanceKm: 10,
    jci: {
      listedAs: "Kokilaben Dhirubhai Ambani Hospital & Medical Research Institute",
      program: "Hospital Program",
      effectiveDate: "2015-12-13",
    },
    nabh: { number: "H-2014-0260" },
    international: {
      url: "https://www.kokilabenhospital.com/patients/internationalpatients/what_to_expect.html",
      services: ["visa-letter", "airport-pickup"],
    },
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
    address: "Raja Rammohan Roy Road, Prarthana Samaj, Girgaon, Mumbai, Maharashtra 400004",
    geo: { lat: 18.95877, lng: 72.82021 },
    airportDistanceKm: 18,
    jci: {
      listedAs: "Sir H N Reliance Foundation Hospital and Research Centre",
      program: "Hospital Program",
      effectiveDate: "2020-10-17",
    },
    nabh: { number: "H-2018-0539" },
    international: {
      url: "https://www.rfhospital.org/patients-visitors/international-patient",
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    address: "21 Greams Lane, off Greams Road, Thousand Lights, Chennai, Tamil Nadu 600006",
    geo: { lat: 13.06322, lng: 80.25158 },
    airportDistanceKm: 15,
    established: 1983,
    jci: {
      listedAs: "Apollo Hospital, Chennai",
      program: "Hospital Program",
      effectiveDate: "2006-01-29",
    },
    international: {
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    address: "Nelson Manickam Road, Aminjikarai, Chennai, Tamil Nadu 600029",
    geo: { lat: 13.07095, lng: 80.22173 },
    airportDistanceKm: 13,
    jci: {
      listedAs: "MGM Healthcare Pvt. Ltd.",
      program: "Hospital Program",
      effectiveDate: "2021-03-06",
    },
    nabh: { number: "H-2021-0768" },
    international: {
      url: "https://mgmhealthcare.in/international-patients/",
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    address: "258/A, Bommasandra Industrial Area, Hosur Road, Anekal Taluk, Bengaluru, Karnataka 560099",
    geo: { lat: 12.80802, lng: 77.69478 },
    airportDistanceKm: 58,
    jci: {
      listedAs: "Narayana Institute of Cardiac Sciences",
      program: "Hospital Program",
      effectiveDate: "2026-06-19",
    },
    nabh: { number: "H-2007-0007" },
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
    address: "154/11 Bannerghatta Road, Bengaluru, Karnataka 560076",
    geo: { lat: 12.8963, lng: 77.59829 },
    airportDistanceKm: 45,
    jci: {
      listedAs: "Apollo Hospitals, Bangalore",
      program: "Hospital Program",
      effectiveDate: "2008-07-18",
    },
    international: {
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    description:
      "Multi-specialty tertiary-care campus (Apollo Health City) in Jubilee Hills, Hyderabad, part of the Apollo Hospitals group.",
    image: "/images/hospitals/apollo-hospitals-jubilee-hills-hyderabad.jpg",
    website: "https://www.apollohospitals.com/hospitals/apollo-health-city-jubilee-hills",
    address: "Road No. 72, opposite Bharatiya Vidya Bhavan School, Film Nagar, Jubilee Hills, Hyderabad, Telangana 500033",
    geo: { lat: 17.41494, lng: 78.41318 },
    airportDistanceKm: 35,
    jci: {
      listedAs: "Apollo Hospital, Hyderabad",
      program: "Hospital Program",
      effectiveDate: "2006-04-28",
    },
    international: {
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    address: "1-66/AIG/2 to 5, Mindspace Road, Gachibowli, Hyderabad, Telangana 500032",
    geo: { lat: 17.44318, lng: 78.36601 },
    airportDistanceKm: 31,
    jci: {
      listedAs: "AIG Hospitals (A Unit of Asian Institute of Gastroenterology, Private Limited)",
      program: "Hospital Program",
      effectiveDate: "2021-12-11",
    },
    nabh: { number: "H-2020-0704" },
    international: {
      url: "https://www.aighospitals.com/international-patients",
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    address: "Off Science City Road, Sola, Ahmedabad, Gujarat 380060",
    geo: { lat: 23.07003, lng: 72.5174 },
    airportDistanceKm: 19,
    jci: {
      listedAs: "Marengo Asia Healthcare Private Limited",
      program: "Hospital Program",
      effectiveDate: "2016-09-24",
    },
    nabh: { number: "H-2013-0166" },
    international: {
      url: "https://www.marengoasiahospitals.com/internationalpatients",
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    address: "Block G-K, Mondeal Business Park, near Gurudwara, S G Road, Ahmedabad, Gujarat 380059",
    geo: { lat: 23.04574, lng: 72.51393 },
    airportDistanceKm: 18,
    established: 2012,
    jci: {
      listedAs: "Apex Heart Institute (A Unit of TCVS Pvt. Ltd.)",
      program: "Hospital Program",
      effectiveDate: "2018-01-27",
    },
    nabh: { number: "H-2014-0235" },
    international: {
      url: "https://www.apexheart.in/international_patients.html",
      services: ["coordinator", "airport-pickup", "accommodation", "interpreters"],
    },
    isSample: false,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
];

export function getHospital(slug: string): Hospital | undefined {
  return hospitals.find((h) => h.slug === slug);
}

export function getHospitalsForTreatment(slug: TreatmentSlug, limit?: number): Hospital[] {
  return hospitals.filter((h) => h.specialties.includes(slug)).slice(0, limit);
}

/** Other listings in the same city first, then hospitals sharing the most specialties. */
export function getRelatedHospitals(h: Hospital, limit = 3): Hospital[] {
  const shared = (o: Hospital) => o.specialties.filter((s) => h.specialties.includes(s)).length;
  return hospitals
    .filter((o) => o.slug !== h.slug && o.isSample === h.isSample)
    .sort((a, b) => Number(b.city === h.city) - Number(a.city === h.city) || shared(b) - shared(a))
    .slice(0, limit);
}

export const internationalServiceLabels: Record<InternationalService, string> = {
  coordinator: "International patient coordinators",
  "visa-letter": "Medical visa assistance",
  "airport-pickup": "Airport pickup",
  accommodation: "Help with accommodation",
  interpreters: "Interpreters",
};

/** OpenStreetMap link for the hospital's position, when known. */
export function hospitalMapUrl(h: Hospital): string | undefined {
  return h.geo ? `https://www.openstreetmap.org/?mlat=${h.geo.lat}&mlon=${h.geo.lng}#map=17/${h.geo.lat}/${h.geo.lng}` : undefined;
}

/** Photo for a listing: the hospital's own photo, else the city photo. */
export function hospitalImage(h: Hospital): string {
  return h.image ?? getCity(h.city).image;
}

export const hasSampleHospitals = hospitals.some((h) => h.isSample);
