import type { Hospital, InternationalService, TreatmentSlug } from "@/types";
import { getCity } from "@/data/destinations";

/**
 * Hospital listings.
 *
 * Real hospitals. None is a TreatVero partner yet (`isConfirmedPartner:
 * false`); only set it to true once a written agreement exists.
 *
 * Rules for every entry:
 * - Confirm name, locality and that it is the specific hospital (not just
 *   the group) on the hospital's website and at least one other source. `website` links to the
 *   hospital's own page on that site.
 * - Accreditations only from the accrediting bodies' directories:
 *   JCI — jointcommission.org "Find JCI Accredited Organizations";
 *   NABH — nabh.co "Find an Accredited Healthcare Organisation" (hospital
 *   accreditation numbers start with "H-"). Record both in the comment above
 *   the entry and in `jci` / `nabh` (shown on the page). A hospital's own
 *   claim isn't enough.
 * - Other facts can come from any published source that isn't the
 *   hospital's own marketing: Wikipedia, news reports, government or
 *   regulator pages, the group's corporate pages. Add each source used to
 *   `sources` (it's shown on the page). When sources disagree (bed counts
 *   often do), use the most recent reliable one or leave the field out.
 *   Directory/booking sites (Practo, Credihealth, medical-tourism agents)
 *   are for cross-checking only, never the sole source.
 * - `address`: the hospital's street address (its own site, or a directory
 *   that matches it).
 * - `geo`, `nearestStation`: OpenStreetMap (nominatim.openstreetmap.org;
 *   stations via overpass-api.de, straight-line km to one decimal).
 *   `airportDistanceKm`: road distance from the city's airport
 *   (City.airportName), from router.project-osrm.org, rounded to the km.
 * - `established`, `beds`, `history`: from `sources` (or the hospital's
 *   own site for the year). `history` is 1–3 neutral sentences in our own
 *   words: dates, founders, ownership. "First" claims only when a cited
 *   source states them.
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
    nearestStation: { name: "Millennium City Centre Gurugram", network: "Delhi Metro", km: 3.9 },
    history:
      "Opened in 2009 as the first hospital of Medanta, the network founded by cardiac surgeon Naresh Trehan, on a 43-acre campus in Sector 38, Gurugram.",
    sources: [{ title: "Wikipedia: Medanta", url: "https://en.wikipedia.org/wiki/Medanta" }],
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
    nearestStation: { name: "Jasola Apollo", network: "Delhi Metro", km: 0.3 },
    established: 1996,
    beds: 695,
    history:
      "Opened in 1996 as the Apollo group's third tertiary-care hospital, set up jointly with the Government of Delhi on a 15-acre site. In 2005 it became the first hospital in India to be accredited by JCI.",
    sources: [
      {
        title: "Wikipedia: Apollo Hospital, Indraprastha",
        url: "https://en.wikipedia.org/wiki/Apollo_Hospital,_Indraprastha",
        isAbout: true,
      },
    ],
    jci: {
      listedAs: "Indraprastha Apollo Hospitals",
      program: "Hospital Program",
      effectiveDate: "2005-06-18",
    },
    international: {
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    nearestStation: { name: "Millennium City Centre Gurugram", network: "Delhi Metro", km: 0.3 },
    beds: 330,
    history:
      "Opened in 2013 on an 11-acre campus in Sector 44, Gurugram. It also houses the head office of Fortis Healthcare, which runs hospitals across India.",
    sources: [
      {
        title: "Fortis Healthcare: Fortis Memorial Research Institute (international patients)",
        url: "https://www.fortishealthcare.com/international-patients/hospitals/fortis-memorial-research-institute-gurgaon",
      },
      { title: "Wikipedia: Fortis Healthcare", url: "https://en.wikipedia.org/wiki/Fortis_Healthcare" },
    ],
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
    nearestStation: { name: "Versova", network: "Mumbai Metro", km: 0.4 },
    established: 2009,
    beds: 750,
    history:
      "Started in 1999 as a heart-hospital project and completed by the Reliance ADA Group, the hospital opened in January 2009. It is named after Kokilaben Ambani, wife of Reliance Industries founder Dhirubhai Ambani.",
    sources: [
      {
        title: "Wikipedia: Kokilaben Dhirubhai Ambani Hospital",
        url: "https://en.wikipedia.org/wiki/Kokilaben_Dhirubhai_Ambani_Hospital",
        isAbout: true,
      },
    ],
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
    nearestStation: { name: "Grant Road", network: "Mumbai Metro", km: 0.5 },
    established: 1925,
    beds: 345,
    history:
      "Founded in 1925 as the Harkisondas Narottamdas Hospital, it was taken over by the Reliance Foundation in 2006, rebuilt, and reopened in October 2014.",
    sources: [
      {
        title: "Wikipedia: Sir H. N. Reliance Foundation Hospital",
        url: "https://en.wikipedia.org/wiki/Sir_H._N._Reliance_Foundation_Hospital",
        isAbout: true,
      },
    ],
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
    nearestStation: { name: "Thousand Lights", network: "Chennai Metro", km: 0.9 },
    history:
      "Opened in 1983 as the first hospital of the Apollo Hospitals group, founded by Dr Prathap C. Reddy. Its opening is widely described as the start of corporate hospitals in India.",
    sources: [
      { title: "Wikipedia: Apollo Hospitals", url: "https://en.wikipedia.org/wiki/Apollo_Hospitals" },
      { title: "Wikipedia: Healthcare in Chennai", url: "https://en.wikipedia.org/wiki/Healthcare_in_Chennai" },
    ],
    established: 1983,
    jci: {
      listedAs: "Apollo Hospital, Chennai",
      program: "Hospital Program",
      effectiveDate: "2006-01-29",
    },
    international: {
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    nearestStation: { name: "Shenoy Nagar", network: "Chennai Metro", km: 1.0 },
    established: 2019,
    beds: 400,
    history: "Opened in 2019 as a quaternary-care hospital on Nelson Manickam Road, Aminjikarai.",
    sources: [{ title: "MGM Healthcare: about the hospital", url: "https://mgmhealthcare.in/" }],
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
    nearestStation: { name: "Delta Electronics Bommasandra", network: "Namma Metro", km: 1.4 },
    established: 2000,
    history:
      "Commissioned in 2000 by cardiac surgeon Devi Shetty as part of Narayana Health City in Bommasandra. It has 23 cardiac operating theatres and a heart transplant programme.",
    sources: [
      {
        title: "Wikipedia: Narayana Institute of Cardiac Sciences",
        url: "https://en.wikipedia.org/wiki/Narayana_Institute_of_Cardiac_Sciences",
        isAbout: true,
      },
    ],
    jci: {
      listedAs: "Narayana Institute of Cardiac Sciences",
      program: "Hospital Program",
      effectiveDate: "2026-06-19",
    },
    nabh: { number: "H-2007-0007" },
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
    nearestStation: { name: "Jayadeva Hospital", network: "Namma Metro", km: 2.3 },
    beds: 350,
    jci: {
      listedAs: "Apollo Hospitals, Bangalore",
      program: "Hospital Program",
      effectiveDate: "2008-07-18",
    },
    international: {
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    nearestStation: { name: "Jubilee Hills Checkpost", network: "Hyderabad Metro", km: 1.5 },
    established: 1988,
    history: "Inaugurated in August 1988, the hospital is the centre of Apollo Health City, the Apollo group's campus in Jubilee Hills.",
    sources: [
      {
        title: "Apollo Hospitals: About Apollo Hospitals, Jubilee Hills",
        url: "https://www.apollohospitals.com/region/hyderabad/hospitals/jubilee-hills/about-us/",
      },
    ],
    jci: {
      listedAs: "Apollo Hospital, Hyderabad",
      program: "Hospital Program",
      effectiveDate: "2006-04-28",
    },
    international: {
      services: ["coordinator", "visa-letter", "airport-pickup", "accommodation", "interpreters"],
    },
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
    nearestStation: { name: "Raidurg", network: "Hyderabad Metro", km: 1.2 },
    established: 2018,
    history:
      "The Asian Institute of Gastroenterology began in 1994 as a day-care centre for digestive diseases, opened a 130-bed hospital in Somajiguda in 2004, and opened this multi-specialty hospital in Gachibowli in 2018.",
    sources: [{ title: "AIG Hospitals: History", url: "https://www.aighospitals.com/history" }],
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
    nearestStation: { name: "Thaltej", network: "Ahmedabad Metro", km: 2.3 },
    established: 2010,
    beds: 500,
    history:
      "Opened in 2010 as CIMS Hospital by a group of cardiologists led by Dr Keyur Parikh. Marengo Asia Healthcare later invested in the hospital, which now carries the Marengo name.",
    sources: [
      {
        title: "The Times of Udaipur: Marengo Asia Healthcare announces an investment of INR 450 crore in CIMS Hospital",
        url: "https://thetimesofudaipur.com/marengo-asia-healthcare-announces-an-investment-of-inr-450crs-in-cims-hospital-ahmedabad/",
      },
    ],
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
    nearestStation: { name: "Thaltej", network: "Ahmedabad Metro", km: 0.5 },
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
    .filter((o) => o.slug !== h.slug)
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
