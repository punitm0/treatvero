import type { Hospital, TreatmentSlug } from "@/types";
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
 * - Other facts can come from the hospital's own site or any other
 *   published source: Wikipedia, news reports, government or regulator
 *   pages, the group's corporate pages. Add each source other than
 *   `website` to `sources`. When sources disagree (bed counts often do),
 *   use the most recent reliable one or leave the field out. Only exact
 *   figures: skip "600+"-style numbers. Directory/booking sites (Practo,
 *   Credihealth, medical-tourism agents) are for cross-checking only, never
 *   the sole source.
 * - `place`: locality and city as people search for the hospital
 *   ("Andheri West, Mumbai"); just the city when the name already carries
 *   the locality ("Apollo Hospitals, Greams Road" → "Chennai").
 * - `address`: the hospital's street address (its own site, or a directory
 *   that matches it).
 * - `googleMapsCid`: the hospital's own Google Maps listing — the second hex
 *   number in its place URL's `!1s0x…:0x…` part, as a decimal string. Check
 *   the listing's name and position match the hospital. The map link falls
 *   back to a name-and-address search when it's missing.
 * - `geo`, `nearestStation`: OpenStreetMap (nominatim.openstreetmap.org;
 *   stations via overpass-api.de, straight-line km to one decimal).
 *   `airportDistanceKm`: road distance from the city's airport
 *   (City.airportName), from router.project-osrm.org, rounded to the km.
 * - `established`, `beds`, `history`: from the hospital's site or
 *   `sources`. `history` is 1–3 neutral sentences in our own
 *   words: dates, founders, ownership. "First" claims only when a cited
 *   source states them.
 * - Specialties use the treatment slugs and must be departments or centres
 *   listed on the hospital's own page. Be conservative.
 * - `specialtyNotes`: one neutral sentence per specialty naming what this
 *   hospital offers in it (centres, programmes, procedures), in our own
 *   words, from the hospital's page for this specific hospital or a source
 *   about it. Skip group-wide template lists that read the same for every
 *   branch (Apollo's are), and skip a specialty rather than pad it. No
 *   volumes, success rates, "first" or "best" claims.
 * - Descriptions are factual and neutral: no rankings, "best", "leading",
 *   outcome or volume claims.
 * - `icuBeds`, `operationTheatres`: exact figures from the hospital's own
 *   page for that hospital (skip "140+"-style numbers, as for `beds`).
 * - `facilities`: short neutral lines on equipment, units and programmes the
 *   hospital's page names for that hospital; skip group-wide technology
 *   lists. `internationalServices`: what its international desk offers.
 * - `gallery`: extra photos in public/images/hospitals/<slug>/, with `source`
 *   (internal) and `credit` when the licence needs one.
 * - `image`: a photo of the hospital itself, saved to
 *   public/images/hospitals/<slug>.jpg (max 1600px wide).
 * - Set `verifiedOn` to the date the entry was checked.
 * - `website`, `sources` and `verifiedOn` are internal
 *   records only. Don't render them on public pages or link to the hospital:
 *   patients come to hospitals through TreatVero, not directly. (Wikipedia-
 *   style `isAbout` sources may still go in the JSON-LD `sameAs`.)
 */
export const hospitals: Hospital[] = [
  /* ------------------------------- Delhi NCR ------------------------------- */
  // JCI: "Medanta - The Medicity", Gurgaon, Hospital Program, 31 Aug 2013. NABH: H-2011-0073.
  {
    slug: "medanta-the-medicity-gurugram",
    name: "Medanta – The Medicity",
    city: "delhi-ncr",
    place: "Gurugram",
    accreditations: ["JCI", "NABH"],
    specialties: ["cardiac-care", "cancer-treatment", "neurology-neurosurgery", "orthopaedics", "organ-transplant"],
    specialtyNotes: {
      "cardiac-care": "Interventional, clinical and preventive cardiology, cardiac surgery and paediatric cardiology, with a heart transplant programme.",
      "cancer-treatment": "Medical and radiation oncology, with dedicated services for breast, gastrointestinal, and head and neck cancers.",
      "neurology-neurosurgery": "Neurology, neurosurgery and paediatric neurology within its neurosciences department.",
      "organ-transplant": "Liver, kidney, heart and lung transplant, and bone marrow transplant for adults and children.",
    },
    description:
      "The founding hospital of the Medanta network: a multi-specialty tertiary-care campus in Sector 38, Gurugram, opened in 2009, with liver, lung and bone marrow transplant programmes.",
    image: "/images/hospitals/medanta-the-medicity-gurugram.jpg",
    website: "https://www.medanta.org/hospitals-near-me/gurugram-hospital",
    address: "CH Baktawar Singh Road, Sector 38, Gurugram, Haryana 122001",
    geo: { lat: 28.43895, lng: 77.04027 },
    googleMapsCid: "15864689655105936556",
    airportDistanceKm: 19,
    nearestStation: { name: "Millennium City Centre Gurugram", network: "Delhi Metro", km: 3.9 },
    history:
      "Opened in 2009 as the first hospital of Medanta, the network founded by cardiac surgeon Naresh Trehan, on a 43-acre campus in Sector 38, Gurugram.",
    sources: [{ title: "Wikipedia: Medanta", url: "https://en.wikipedia.org/wiki/Medanta" }],
    established: 2009,
    // Operational beds from the hospital page (Wikipedia gives 1,250 at opening in 2009).
    beds: 1440,
    jci: {
      listedAs: "Medanta - The Medicity",
      program: "Hospital Program",
      effectiveDate: "2013-08-31",
    },
    nabh: { number: "H-2011-0073" },
    // ICU beds and operation theatres from the hospital's page (structured data on its doctor profiles).
    icuBeds: 316,
    operationTheatres: 40,
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "Indraprastha Apollo Hospitals", Sarita Vihar, New Delhi, Hospital Program, 18 Jun 2005. NABH: not found in the directory.
  {
    slug: "indraprastha-apollo-hospitals-new-delhi",
    name: "Indraprastha Apollo Hospitals",
    city: "delhi-ncr",
    place: "Sarita Vihar, New Delhi",
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
    specialtyNotes: {
      "cancer-treatment": "Radiotherapy includes a Varian Edge radiosurgery system, added in February 2026.",
    },
    description:
      "Multi-specialty tertiary-care hospital on Delhi–Mathura Road, Sarita Vihar, New Delhi, part of the Apollo Hospitals group.",
    image: "/images/hospitals/indraprastha-apollo-hospitals-new-delhi.jpg",
    website: "https://www.apollohospitals.com/hospitals/apollo-hospitals-delhi",
    address: "Delhi–Mathura Road, Sarita Vihar, New Delhi, Delhi 110076",
    geo: { lat: 28.54111, lng: 77.28333 },
    googleMapsCid: "4305576296709909879",
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
    internationalServices: [
      "International Patient Services team for medical visas, travel arrangements and accommodation",
      "Language interpretation",
    ],
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "Fortis Memorial Research Institute", Gurgaon, Hospital Program, 13 Jul 2019. NABH: H-2015-0303.
  {
    slug: "fortis-memorial-research-institute-gurugram",
    name: "Fortis Memorial Research Institute",
    city: "delhi-ncr",
    place: "Gurugram",
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
    specialtyNotes: {
      "cardiac-care": "Interventional cardiology, electrophysiology, and cardiothoracic and vascular surgery, with a heart transplant programme.",
      "cancer-treatment": "Medical, surgical and radiation oncology and haemato-oncology, with gynaecologic, breast, gastrointestinal, and head and neck cancer surgery.",
      orthopaedics: "Joint replacement, including robotic and computer-navigated joint reconstruction, plus sports medicine and paediatric orthopaedics.",
      "spine-surgery": "Spine surgery through both its neurosurgery and orthopaedics departments.",
      "neurology-neurosurgery": "Neurology, neurosurgery and neurointerventional radiology.",
      "organ-transplant": "Kidney, liver, lung and heart transplant, and bone marrow transplant through its haematology department.",
      "bariatric-surgery": "Metabolic and bariatric surgery within its gastrointestinal and minimal access surgery department.",
      "dental-treatment": "Oral and maxillofacial surgery, orthodontics and periodontics.",
    },
    description: "Multi-specialty quaternary-care hospital in Sector 44, Gurugram, opposite HUDA City Centre, part of Fortis Healthcare.",
    image: "/images/hospitals/fortis-memorial-research-institute-gurugram.jpg",
    website: "https://www.fortishealthcare.com/location/fortis-memorial-research-institute-gurgaon",
    address: "Sector 44, opposite HUDA City Centre, Gurugram, Haryana 122002",
    geo: { lat: 28.45712, lng: 77.07277 },
    googleMapsCid: "1832866585662167508",
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
    icuBeds: 107,
    operationTheatres: 15,
    facilities: [
      "Gamma Knife radiosurgery",
      "Digital PET-CT",
      "SSI Mantra 3 robotic surgical system",
      "Adult and paediatric bone marrow transplant programme",
      "25-bed emergency ward with 24×7 critical care",
    ],
    internationalServices: [
      "International patient team for treatment coordination and appointments",
      "Help with medical documentation for the visit",
    ],
    gallery: [
      {
        src: "/images/hospitals/fortis-memorial-research-institute-gurugram/campus.jpg",
        alt: "Fortis Memorial Research Institute campus, Sector 44, Gurugram",
        source: "https://www.fortishealthcare.com/location/fortis-memorial-research-institute-gurgaon",
      },
    ],
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: not listed. NABH: H-2007-0009, listed as "International Hospital Limited - (Earlier Certificate issued in the Name of Fortis Hospital)", B-22, Sector 62, Noida.
  {
    slug: "fortis-hospital-noida",
    name: "Fortis Hospital, Noida",
    city: "delhi-ncr",
    place: "Sector 62, Noida",
    accreditations: ["NABH"],
    specialties: [
      "cardiac-care",
      "cancer-treatment",
      "orthopaedics",
      "spine-surgery",
      "neurology-neurosurgery",
      "organ-transplant",
      "bariatric-surgery",
    ],
    specialtyNotes: {
      "cardiac-care": "Interventional and non-invasive cardiology, adult and paediatric cardiothoracic surgery, vascular surgery and a heart transplant programme.",
      "cancer-treatment": "Medical, surgical and radiation oncology, with haemato-oncology and bone marrow transplant.",
      orthopaedics: "Joint replacement, including robotic and computer-navigated joint reconstruction, and sports medicine.",
      "spine-surgery": "Spine surgery within its neuro and spine surgery department.",
      "neurology-neurosurgery": "Neurology and neurosurgery, with dedicated neuro and neurosurgery intensive care.",
      "organ-transplant": "Liver, kidney and heart transplant, with a dedicated liver transplant and digestive diseases institute.",
      "bariatric-surgery": "Bariatric surgery within its general and minimal access surgery department.",
    },
    description: "Multi-specialty tertiary-care hospital on a 6-acre campus in Sector 62, Noida, part of Fortis Healthcare, open since 2004.",
    image: "/images/hospitals/fortis-hospital-noida.jpg",
    imageCredit: "Photo: Ali Rizvi, CC BY-SA 3.0, via Wikimedia Commons",
    website: "https://www.fortishealthcare.com/location/fortis-hospital-noida",
    address: "B-22, Rasoolpur Nawada, D Block, Sector 62, Noida, Uttar Pradesh 201301",
    geo: { lat: 28.61876, lng: 77.37261 },
    airportDistanceKm: 38,
    nearestStation: { name: "Noida Sector 62", network: "Delhi Metro", km: 0.2 },
    established: 2004,
    history:
      "Opened in 2004 as the second hospital of Fortis Healthcare, on a 6-acre campus in Sector 62, Noida. It runs a dedicated liver transplant and digestive diseases institute.",
    sources: [
      {
        title: "Fortis Healthcare: Fortis Hospital, Noida (international patients)",
        url: "https://www.fortishealthcare.com/international-patients/hospitals/fortis-hospital-noida",
      },
      { title: "Wikimedia Commons: Fortis Hospital Noida photo", url: "https://commons.wikimedia.org/wiki/File:Fortis_Hospital_Noida_-_panoramio.jpg" },
    ],
    nabh: { number: "H-2007-0009" },
    operationTheatres: 18,
    facilities: [
      "18 modular operation theatres",
      "Cardiac catheterisation labs for minimally invasive and complex procedures",
      "Liver transplant and digestive diseases institute with its own operation theatre, ICU and HDU",
      "Specialised ICUs for medical, surgical, neurology, neurosurgery, joint replacement and transplant patients",
      "Neonatal (NICU) and paediatric (PICU) intensive care",
      "25 dedicated emergency beds",
    ],
    internationalServices: ["International patient section for treatment coordination and appointments"],
    gallery: [
      {
        src: "/images/hospitals/fortis-hospital-noida/facade.jpg",
        alt: "Fortis Hospital, Noida, with its new tower",
        source: "https://www.fortishealthcare.com/location/fortis-hospital-noida",
      },
    ],
    isConfirmedPartner: false,
    verifiedOn: "2026-09-30",
  },

  /* -------------------------------- Mumbai --------------------------------- */
  // JCI: "Kokilaben Dhirubhai Ambani Hospital & Medical Research Institute", Mumbai, Hospital Program, 13 Dec 2015. NABH: H-2014-0260 (Andheri West).
  {
    slug: "kokilaben-dhirubhai-ambani-hospital-mumbai",
    name: "Kokilaben Dhirubhai Ambani Hospital",
    city: "mumbai",
    place: "Andheri West, Mumbai",
    accreditations: ["JCI", "NABH"],
    specialties: ["cardiac-care", "cancer-treatment", "orthopaedics", "neurology-neurosurgery", "organ-transplant", "bariatric-surgery"],
    specialtyNotes: {
      "cardiac-care": "A cardiac sciences centre and a separate children's heart centre.",
      "cancer-treatment": "A cancer centre with Radixact radiotherapy and robotic surgery.",
      orthopaedics: "A bone and joint centre, including minimally invasive foot and ankle surgery, and a sports medicine centre.",
      "neurology-neurosurgery": "A neurosciences centre; its operating suite includes a three-room intra-operative MRI (IMRIS).",
      "organ-transplant": "A transplant centre with a liver transplant programme.",
      "bariatric-surgery": "A diabetes and bariatric surgery centre.",
    },
    description: "Multi-specialty tertiary-care hospital and medical research institute at Four Bungalows, Andheri West, Mumbai.",
    image: "/images/hospitals/kokilaben-dhirubhai-ambani-hospital-mumbai.jpg",
    website: "https://www.kokilabenhospital.com",
    address: "Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai, Maharashtra 400053",
    geo: { lat: 19.13126, lng: 72.82467 },
    googleMapsCid: "4062463546458844196",
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
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "Sir H N Reliance Foundation Hospital and Research Centre", Mumbai, Hospital Program, 17 Oct 2020. NABH: H-2018-0539.
  {
    slug: "sir-hn-reliance-foundation-hospital-mumbai",
    name: "Sir H. N. Reliance Foundation Hospital",
    city: "mumbai",
    place: "Girgaon, Mumbai",
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
    specialtyNotes: {
      "cardiac-care": "Heart and vascular care, including a valve clinic, TAVR and heart transplant.",
      "cancer-treatment": "Haemato-oncology and bone marrow transplant for adults and children.",
      orthopaedics: "Bone, joint and spine care within one department.",
      "spine-surgery": "Both orthopaedic spine surgery and neuro spine surgery.",
      "organ-transplant": "Heart, lung, liver and kidney transplant, including paediatric organ transplant.",
      "dental-treatment": "Dental and oral care.",
    },
    description: "Multi-specialty tertiary-care hospital and research centre on Raja Rammohan Roy Road, Girgaon, South Mumbai.",
    image: "/images/hospitals/sir-hn-reliance-foundation-hospital-mumbai.jpg",
    imageCredit: "Photo: Ajitdada Pawar, CC BY-SA 4.0, via Wikimedia Commons",
    website: "https://www.rfhospital.org",
    address: "Raja Rammohan Roy Road, Prarthana Samaj, Girgaon, Mumbai, Maharashtra 400004",
    geo: { lat: 18.95877, lng: 72.82021 },
    googleMapsCid: "11414850953447392538",
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
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* -------------------------------- Chennai -------------------------------- */
  // JCI: "Apollo Hospital, Chennai", Hospital Program, 29 Jan 2006. NABH: not found in the directory.
  {
    slug: "apollo-hospitals-greams-road-chennai",
    name: "Apollo Hospitals, Greams Road",
    city: "chennai",
    place: "Chennai",
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
    googleMapsCid: "3318338258758298927",
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
    internationalServices: [
      "International Patient Services team for medical visas, travel arrangements and accommodation",
      "Language interpretation",
    ],
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "MGM Healthcare Pvt. Ltd.", Chennai, Hospital Program, 06 Mar 2021. NABH: H-2021-0768 (Aminjikarai).
  {
    slug: "mgm-healthcare-chennai",
    name: "MGM Healthcare",
    city: "chennai",
    place: "Aminjikarai, Chennai",
    accreditations: ["JCI", "NABH"],
    specialties: ["cardiac-care", "cancer-treatment", "orthopaedics", "neurology-neurosurgery", "organ-transplant"],
    specialtyNotes: {
      "cardiac-care": "Cardiac care with a heart and lung transplant programme.",
      orthopaedics: "Orthopaedics including total knee replacement, alongside a level 1 trauma centre.",
      "organ-transplant": "Heart and lung, liver, and multi-visceral abdominal organ transplant, with an institute for liver diseases and HPB surgery.",
    },
    description:
      "Multi-specialty tertiary-care hospital on Nelson Manickam Road, Aminjikarai, Chennai, with heart, lung, liver and multi-organ transplant programmes.",
    image: "/images/hospitals/mgm-healthcare-chennai.jpg",
    website: "https://mgmhealthcare.in",
    address: "Nelson Manickam Road, Aminjikarai, Chennai, Tamil Nadu 600029",
    geo: { lat: 13.07095, lng: 80.22173 },
    googleMapsCid: "10666141597593509124",
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
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* ------------------------------- Bengaluru ------------------------------- */
  // JCI: "Narayana Institute of Cardiac Sciences", Hosur Road, Bangalore, Hospital Program, 19 Jun 2026. NABH: H-2007-0007.
  {
    slug: "narayana-institute-of-cardiac-sciences-bengaluru",
    name: "Narayana Institute of Cardiac Sciences",
    city: "bengaluru",
    place: "Bommasandra, Bengaluru",
    accreditations: ["JCI", "NABH"],
    specialties: ["cardiac-care"],
    specialtyNotes: {
      "cardiac-care": "Heart surgery and heart transplant for newborns, children and adults, with robot-assisted cardiac surgery, catheterisation labs including a hybrid lab, and peripheral vascular and endovascular intervention.",
    },
    description:
      "Specialist cardiac hospital at Narayana Health City, Bommasandra, on Hosur Road in south Bengaluru, part of Narayana Health.",
    image: "/images/hospitals/narayana-institute-of-cardiac-sciences-bengaluru.jpg",
    website: "https://www.narayanahealth.org/hospitals-clinics/bangalore/narayana-institute-cardiac-sciences-bommasandra",
    address: "258/A, Bommasandra Industrial Area, Hosur Road, Anekal Taluk, Bengaluru, Karnataka 560099",
    geo: { lat: 12.80802, lng: 77.69478 },
    googleMapsCid: "15096177953380905248",
    airportDistanceKm: 58,
    nearestStation: { name: "Delta Electronics Bommasandra", network: "Namma Metro", km: 1.4 },
    established: 2000,
    history:
      "Commissioned in 2000 by cardiac surgeon Devi Shetty as part of Narayana Health City in Bommasandra. It focuses on cardiac surgery and heart transplantation for newborns, children and adults.",
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
    operationTheatres: 19,
    facilities: [
      "19 cardiac operation theatres, including 2 robotic operation theatres",
      "8 cath labs, including a hybrid cath lab for combined surgical and interventional procedures",
      "da Vinci robot for robot-assisted cardiac surgery",
    ],
    gallery: [
      {
        src: "/images/hospitals/narayana-institute-of-cardiac-sciences-bengaluru/campus.jpg",
        alt: "Narayana Institute of Cardiac Sciences at Narayana Health City, Bommasandra",
        source: "https://www.narayanahealth.org/hospitals-clinics/bangalore/narayana-institute-cardiac-sciences-bommasandra",
      },
    ],
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "Apollo Hospitals, Bangalore", Hospital Program, 18 Jul 2008. NABH: not found in the directory.
  {
    slug: "apollo-hospitals-bannerghatta-road-bengaluru",
    name: "Apollo Hospitals, Bannerghatta Road",
    city: "bengaluru",
    place: "Bengaluru",
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
    googleMapsCid: "9479001938627533447",
    airportDistanceKm: 45,
    nearestStation: { name: "Jayadeva Hospital", network: "Namma Metro", km: 2.3 },
    beds: 350,
    jci: {
      listedAs: "Apollo Hospitals, Bangalore",
      program: "Hospital Program",
      effectiveDate: "2008-07-18",
    },
    internationalServices: [
      "International Patient Services team for medical visas, travel arrangements and accommodation",
      "Language interpretation",
    ],
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* ------------------------------- Hyderabad ------------------------------- */
  // JCI: "Apollo Hospital, Hyderabad", Road No 72, Film Nagar, Hospital Program, 28 Apr 2006. NABH: not found in the directory.
  {
    slug: "apollo-hospitals-jubilee-hills-hyderabad",
    name: "Apollo Hospitals, Jubilee Hills",
    city: "hyderabad",
    place: "Hyderabad",
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
    googleMapsCid: "16967188152330343871",
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
    internationalServices: [
      "International Patient Services team for medical visas, travel arrangements and accommodation",
      "Language interpretation",
    ],
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "AIG Hospitals (A Unit of Asian Institute of Gastroenterology, Private Limited)", Hyderabad, Hospital Program, 11 Dec 2021. NABH: H-2020-0704.
  {
    slug: "aig-hospitals-hyderabad",
    name: "AIG Hospitals",
    city: "hyderabad",
    place: "Gachibowli, Hyderabad",
    accreditations: ["JCI", "NABH"],
    specialties: ["organ-transplant", "cancer-treatment", "cardiac-care", "neurology-neurosurgery"],
    description:
      "Multi-specialty hospital on Mindspace Road, Gachibowli, Hyderabad, founded around gastroenterology, with a liver transplant and hepatobiliary surgery programme.",
    image: "/images/hospitals/aig-hospitals-hyderabad.jpg",
    website: "https://aighospitals.com",
    address: "1-66/AIG/2 to 5, Mindspace Road, Gachibowli, Hyderabad, Telangana 500032",
    geo: { lat: 17.44318, lng: 78.36601 },
    googleMapsCid: "10049650800569619927",
    airportDistanceKm: 31,
    nearestStation: { name: "Raidurg", network: "Hyderabad Metro", km: 1.2 },
    established: 2018,
    beds: 800,
    history:
      "The Asian Institute of Gastroenterology began in 1994 as a day-care centre for digestive diseases, opened a 130-bed hospital in Somajiguda in 2004, and opened this multi-specialty hospital in Gachibowli in 2018.",
    sources: [
      { title: "AIG Hospitals: History", url: "https://www.aighospitals.com/history" },
      { title: "AIG Hospitals: About us", url: "https://www.aighospitals.com/about-us" },
    ],
    jci: {
      listedAs: "AIG Hospitals (A Unit of Asian Institute of Gastroenterology, Private Limited)",
      program: "Hospital Program",
      effectiveDate: "2021-12-11",
    },
    nabh: { number: "H-2020-0704" },
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },

  /* ------------------------------- Ahmedabad ------------------------------- */
  // JCI: "Marengo Asia Healthcare Private Limited", Sola, Ahmedabad, Hospital Program, 24 Sep 2016. NABH: H-2013-0166 (formerly CIMS Hospital).
  {
    slug: "marengo-cims-hospital-ahmedabad",
    name: "Marengo CIMS Hospital",
    city: "ahmedabad",
    place: "Sola, Ahmedabad",
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
    specialtyNotes: {
      "cardiac-care": "An institute of cardiac sciences with a heart transplant programme.",
      "cancer-treatment": "An institute of cancer care, with bone marrow transplant.",
      orthopaedics: "An institute of orthopaedics and joint replacement.",
      "neurology-neurosurgery": "An institute of neurosciences.",
      "organ-transplant": "Heart, lung, liver and kidney transplant, with a dedicated institute of HPB surgery and liver transplant.",
    },
    description:
      "Multi-specialty tertiary-care hospital (formerly CIMS Hospital) off Science City Road, Sola, Ahmedabad, operated by Marengo Asia Healthcare.",
    image: "/images/hospitals/marengo-cims-hospital-ahmedabad.jpg",
    website: "https://www.marengoasiahospitals.com/hospital/marengo-cims-hospital-ahmedabad",
    address: "Off Science City Road, Sola, Ahmedabad, Gujarat 380060",
    geo: { lat: 23.07003, lng: 72.5174 },
    googleMapsCid: "2872890841050413549",
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
    isConfirmedPartner: false,
    verifiedOn: "2026-09-28",
  },
  // JCI: "Apex Heart Institute (A Unit of TCVS Pvt. Ltd.)", Ahmedabad, Hospital Program, 27 Jan 2018. NABH: H-2014-0235.
  {
    slug: "apex-heart-institute-ahmedabad",
    name: "Apex Heart Institute",
    city: "ahmedabad",
    place: "S G Road, Ahmedabad",
    accreditations: ["JCI", "NABH"],
    specialties: ["cardiac-care"],
    specialtyNotes: {
      "cardiac-care": "Complex coronary and peripheral interventions, structural heart procedures (device closure of ASD, VSD and PDA, left atrial appendage occlusion, TAVI), electrophysiology and robotic angioplasty.",
    },
    description: "Specialist cardiac hospital at Mondeal Business Park on S G Road, Ahmedabad.",
    image: "/images/hospitals/apex-heart-institute-ahmedabad.jpg",
    website: "https://www.apexheart.in",
    address: "Block G-K, Mondeal Business Park, near Gurudwara, S G Road, Ahmedabad, Gujarat 380059",
    geo: { lat: 23.04574, lng: 72.51393 },
    googleMapsCid: "398998976772885426",
    airportDistanceKm: 18,
    nearestStation: { name: "Thaltej", network: "Ahmedabad Metro", km: 0.5 },
    established: 2012,
    history:
      "Interventional cardiologist Tejas Patel, who chairs the hospital, joined the TCVS practice in Ahmedabad in 2006; it was renamed Apex Heart Institute in 2012. In December 2018 its team performed a telerobotic coronary intervention with the operating doctor about 32 km from the patient, reported as the first in humans.",
    sources: [{ title: "Wikipedia: Tejas Patel", url: "https://en.wikipedia.org/wiki/Tejas_Patel" }],
    jci: {
      listedAs: "Apex Heart Institute (A Unit of TCVS Pvt. Ltd.)",
      program: "Hospital Program",
      effectiveDate: "2018-01-27",
    },
    nabh: { number: "H-2014-0235" },
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


/**
 * Google Maps link for the hospital: its own listing when we have the CID,
 * else a name-and-address search, else a pin at its coordinates.
 */
export function hospitalMapUrl(h: Hospital): string | undefined {
  if (h.googleMapsCid) return `https://maps.google.com/?cid=${h.googleMapsCid}`;
  const query = h.address ? `${h.name}, ${h.address}` : h.geo ? `${h.geo.lat},${h.geo.lng}` : undefined;
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : undefined;
}

/** Google Maps search for hotels around the hospital (live results, nothing stored). */
export function hotelsNearUrl(h: Hospital): string {
  const where = h.address ? `${h.name}, ${h.address}` : `${h.name}, ${getCity(h.city).name}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`hotels near ${where}`)}`;
}

/** Where the hospital is, for titles and headings: its `place`, else the city. */
export function hospitalPlace(h: Hospital): string {
  return h.place ?? getCity(h.city).name;
}

/** Photo for a listing: the hospital's own photo, else the city photo. */
export function hospitalImage(h: Hospital): string {
  return h.image ?? getCity(h.city).image;
}
