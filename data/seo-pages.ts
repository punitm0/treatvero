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
  {
    slug: "bangladesh",
    country: "Bangladesh",
    demonym: "Bangladeshi",
    published: true,
    verifiedOn: "2026-09-29",
    intro:
      "Bangladeshi citizens can apply online for India's e-Medical visa or for a regular medical visa through the Indian Visa Application Centres (IVAC) in Bangladesh, and Dhaka has direct flights to Delhi, Mumbai, Chennai and Hyderabad. TreatVero shares your reports with suitable hospitals, coordinates the hospital's visa invitation letter and helps plan your flights, stay and airport pickup in India.",
    metaDescription:
      "Medical treatment in India from Bangladesh: e-Medical and IVAC medical visas, attendant visas for family, direct flights from Dhaka, documents and payments.",
    facts: [
      { label: "Time difference", value: "India is 30 minutes behind Bangladesh" },
      { label: "Main airport", value: "Dhaka (DAC)" },
      { label: "Visa route", value: "e-Medical visa online, or medical visa via IVAC" },
      { label: "Indian mission", value: "High Commission of India, Dhaka" },
      { label: "Direct flights", value: "Delhi, Mumbai, Chennai, Hyderabad" },
    ],
    visa: {
      eMedical: "available",
      summary:
        "Bangladesh is on India's e-Visa list, so patients can apply online for an e-Medical visa, with e-Medical Attendant visas for up to two companions. You can also apply for a regular medical (M1) visa through an IVAC in Bangladesh, with medical attendant (M2) visas for family members.",
      points: [
        "e-Medical visa: apply online at least 4 days before you arrive (up to 120 days ahead), uploading your passport bio page and the Indian hospital's letter with your tentative admission date. Your passport needs at least six months' validity.",
        "IVAC route: fill in the online form, then submit it at an IVAC with your passport and old passports, NID or birth certificate, proof of residence, proof of funds, proof of profession, your local doctor's reports and the Indian hospital's appointment letter.",
        "IVAC centres in Dhaka, Chittagong, Rajshahi, Sylhet and Khulna are currently offering limited appointment slots, prioritising urgent medical and emergency visas.",
        "Attendant visas are for the patient's closest family members, and a minor patient must be accompanied by a parent or guardian as attendant.",
        "Organ transplant cases, such as kidney or liver, also need clearance from Bangladesh's Law Ministry and Ministry of Foreign Affairs.",
      ],
      missions: [
        { name: "High Commission of India, Dhaka", url: "https://hcidhaka.gov.in/" },
        { name: "Assistant High Commission of India, Chittagong", url: "https://ahcichittagong.gov.in/" },
        { name: "Assistant High Commission of India, Rajshahi", url: "https://www.ahcirajshahi.gov.in/" },
      ],
    },
    travel: {
      summary:
        "Most patients fly from Hazrat Shahjalal International Airport in Dhaka, which has direct departures to Delhi, Mumbai, Chennai and Hyderabad as well as Kolkata. Some patients travel overland instead, through land checkposts on the Bangladesh–India border.",
      airports: [{ name: "Hazrat Shahjalal International Airport, Dhaka", code: "DAC" }],
      routes: [
        {
          to: "delhi-ncr",
          kind: "direct",
          note: "Air India and IndiGo fly direct from Dhaka to Indira Gandhi International Airport.",
        },
        {
          to: "mumbai",
          kind: "direct",
          note: "Air India and IndiGo fly direct from Dhaka to Chhatrapati Shivaji Maharaj International Airport.",
        },
        {
          to: "chennai",
          kind: "direct",
          note: "US-Bangla Airlines and IndiGo fly direct from Dhaka to Chennai International Airport.",
        },
        {
          to: "hyderabad",
          kind: "direct",
          note: "IndiGo flies direct from Dhaka to Rajiv Gandhi International Airport.",
        },
        {
          to: "bengaluru",
          kind: "one-stop",
          note: "No direct flight from Dhaka; connect through an Indian hub such as Kolkata, Chennai or Mumbai.",
        },
        {
          to: "ahmedabad",
          kind: "one-stop",
          note: "No direct flight from Dhaka; connect through Mumbai or Delhi.",
        },
      ],
    },
    notes: [
      {
        title: "Documents to prepare",
        text: "Your passport needs at least six months' validity and two blank pages. Bring your local doctor's reports, scans and test results, in English or with an English translation, and the Indian hospital's letter used for your visa, which TreatVero coordinates.",
      },
      {
        title: "Taking money for treatment",
        text: "Under Bangladesh Bank's foreign exchange guidelines (GFET, chapter 12), your bank can release foreign exchange for treatment abroad based on a medical specialist's recommendation and the foreign hospital's cost estimate. Larger amounts need Bangladesh Bank's approval, which your bank requests, so apply early.",
      },
      {
        title: "Your visa names your hospital",
        text: "IVAC advises that medical visa holders attend only the hospital the visa was issued for. Changing hospital in India needs permission from the FRRO, so confirm your hospital choice before you apply.",
      },
      {
        title: "Entering by air or land",
        text: "e-Visa holders must enter India through designated airports or checkposts, including Delhi, Mumbai, Chennai, Hyderabad and Kolkata airports and the Haridaspur (Petrapole), Gede, Ghojadanga, Agartala and Dawki land checkposts. Regular visas carry endorsed ports, and IVAC accepts requests to add up to two more.",
      },
      {
        title: "Yellow fever certificate",
        text: "Bangladesh is not on India's list of yellow fever endemic countries. You need a yellow fever vaccination certificate only if you have been in an endemic country within six days before arriving in India.",
      },
    ],
    faqs: [
      {
        question: "Do Bangladeshi citizens need a visa for medical treatment in India?",
        answer:
          "Yes. Bangladesh is on India's e-Visa list, so you can apply online for an e-Medical visa, or you can apply for a regular medical (M1) visa through an Indian Visa Application Centre (IVAC) in Bangladesh. Both need a letter from the Indian hospital, which TreatVero coordinates once a hospital has reviewed your reports.",
      },
      {
        question: "Can a family member travel with me?",
        answer:
          "Yes. Up to two companions can get e-Medical Attendant visas against one e-Medical visa. Through IVAC, the patient's closest family members can apply for medical attendant (M2) visas, and a minor patient must be accompanied by a parent or guardian.",
      },
      {
        question: "Are there direct flights from Dhaka to India?",
        answer:
          "Yes. Dhaka airport's departure board lists direct flights to Delhi and Mumbai (Air India and IndiGo), Chennai (US-Bangla Airlines and IndiGo) and Hyderabad (IndiGo). Bengaluru and Ahmedabad need one stop, usually through another Indian city.",
      },
      {
        question: "What documents should I bring?",
        answer:
          "Bring your passport with at least six months' validity, your visa, your medical reports and scans (with English translations where needed) and the hospital letter used for your visa. For an IVAC application you also need your NID or birth certificate, proof of residence, proof of funds and proof of profession.",
      },
      {
        question: "How do I take money to India for treatment?",
        answer:
          "Apply to your bank in Bangladesh, which can release foreign exchange for treatment abroad under Bangladesh Bank's rules on the basis of your specialist's recommendation and the hospital's cost estimate. Larger amounts need Bangladesh Bank's approval, so keep the hospital's written estimate ready early.",
      },
      {
        question: "Is there a visa fee for Bangladeshi citizens?",
        answer:
          "For visas applied for through IVAC, the Government of India charges Bangladeshi citizens no visa fee; IVAC charges only a processing fee. The High Commission warns that nobody can sell guaranteed appointment slots, so book only through IVAC's own website.",
      },
    ],
    sources: [
      { title: "Indian e-Visa: eligible countries and e-Medical visa rules", url: "https://indianvisaonline.gov.in/evisa/" },
      { title: "High Commission of India, Dhaka", url: "https://hcidhaka.gov.in/" },
      {
        title: "High Commission of India, Dhaka: visa documents by category",
        url: "https://hcidhaka.gov.in/pdf/Visa_Category_Wise_Documents_Required_13082026.pdf",
      },
      { title: "Indian Visa Application Centre (IVAC) Bangladesh: advisories and fees", url: "https://www.ivacbd.com/" },
      {
        title: "IVAC: application for endorsement of additional ports",
        url: "https://hcidhaka.gov.in/pdf/Endorsement_of_additional_port_application_form.pdf",
      },
      { title: "Hazrat Shahjalal International Airport: departure flights", url: "https://www.hsia.gov.bd/flight-info/departure-flights" },
      {
        title: "Bangladesh Bank: Guidelines for Foreign Exchange Transactions 2018, chapter 12 (Travel)",
        url: "https://www.bb.org.bd/aboutus/regulationguideline/foreignexchange/feguidevol1/12.pdf",
      },
      { title: "Ministry of Health and Family Welfare: yellow fever vaccination", url: "https://www.ihpoe.mohfw.gov.in/vaccination.php" },
    ],
  },
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
