import type { IconName } from "@/components/ui/icon";

export type FAQ = { question: string; answer: string };

export type TreatmentSlug =
  | "cardiac-care"
  | "cancer-treatment"
  | "orthopaedics"
  | "spine-surgery"
  | "ivf-fertility"
  | "eye-care"
  | "neurology-neurosurgery"
  | "organ-transplant"
  | "dental-treatment"
  | "bariatric-surgery";

export type Treatment = {
  slug: TreatmentSlug;
  name: string;
  /** Short label used in chips/footers (e.g. "Cardiac"). */
  shortName: string;
  icon: IconName;
  /** One-line card description. */
  summary: string;
  overview: string[];
  commonReasons: string[];
  approaches: { name: string; description: string }[];
  /** General guide only — confirmed by the treating hospital. */
  typicalStay: { hospital: string; inCountry: string; note?: string };
  costFactors: string[];
  questionsForDoctor: string[];
  /** Reports hospitals commonly ask for, so patients can prepare. */
  usefulReports: string[];
  faqs: FAQ[];
  seo: { title: string; description: string };
};

export type CitySlug = "delhi-ncr" | "mumbai" | "chennai" | "bengaluru" | "hyderabad" | "ahmedabad";

export type City = {
  slug: CitySlug;
  name: string;
  airportCode: string;
  airportName: string;
  description: string;
  image: string;
};

export type DestinationStatus = "available" | "coming-soon" | "planned";

export type Destination = {
  slug: string;
  name: string;
  status: DestinationStatus;
  image?: string;
  href?: string;
};

export type InternationalService = "coordinator" | "visa-letter" | "airport-pickup" | "accommodation" | "interpreters";

export type Hospital = {
  slug: string;
  name: string;
  city: CitySlug;
  /**
   * Accreditations as shown to patients. Real listings only include
   * accreditations checked against the accrediting body's own directory.
   * For sample data these are prefixed "e.g." and must never be presented as verified.
   */
  accreditations: string[];
  specialties: TreatmentSlug[];
  description: string;
  /** Photo of the hospital itself. When omitted, the city photo is shown instead. */
  image?: string;
  /** Credit shown under the photo on the hospital page, when the source requires one. */
  imageCredit?: string;
  /** The hospital's official website. */
  website?: string;
  /** Street address as given on the hospital's own website. */
  address?: string;
  /** Map position (OpenStreetMap), used for the map link and structured data. */
  geo?: { lat: number; lng: number };
  /** Road distance from the city's international airport, rounded to the km (OpenStreetMap routing). */
  airportDistanceKm?: number;
  /** Year the hospital opened, only when stated on its own website. */
  established?: number;
  /** JCI directory record: name as listed, programme and effective date (ISO). */
  jci?: { listedAs: string; program: string; effectiveDate: string };
  /** NABH directory record: accreditation number (hospitals start with "H-"). */
  nabh?: { number: string };
  /**
   * International patient services listed on the hospital's (or its
   * group's) own international patients page. Only what the page states.
   */
  international?: { url?: string; services: InternationalService[]; languages?: string[] };
  /** ISO date the listing (name, city, accreditations) was last checked against official sources. */
  verifiedOn?: string;
  /**
   * Development/sample entry. Sample hospitals are labelled in the UI,
   * excluded from the sitemap and served with noindex.
   */
  isSample: boolean;
  /**
   * Only true once a written partnership exists. The UI never implies a
   * partnership unless this is explicitly set.
   */
  isConfirmedPartner: boolean;
};

export type PlanId = "basic" | "concierge";

export type Plan = {
  id: PlanId;
  name: string;
  /** null until the final price is agreed — the UI shows `priceLabel` instead. */
  priceUSD: number | null;
  /** Shown while priceUSD is null (e.g. "$XX"). */
  pricePlaceholder: string;
  /** Previous price, shown struck through beside `priceUSD` to show a reduction. */
  compareAtUSD?: number;
  billingNote: string;
  /** Short pricing term shown under the price (e.g. what the fee covers). */
  priceNote?: string;
  description: string;
  badge?: string;
  featuresIntro?: string;
  features: string[];
  cta: string;
};
