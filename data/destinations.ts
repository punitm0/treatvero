import type { City, CitySlug, Destination } from "@/types";
import type { IconName } from "@/components/ui/icon";

export const cities: City[] = [
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    airportCode: "DEL",
    description:
      "The capital region, including Gurugram and Noida, with a large concentration of multi-specialty hospitals.",
    image: "/images/city-delhi.jpg",
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    airportCode: "BOM",
    description: "India's financial capital, home to long-established tertiary-care hospitals.",
    image: "/images/city-mumbai.jpg",
  },
  {
    slug: "chennai",
    name: "Chennai",
    airportCode: "MAA",
    description: "A long-standing centre for international patients in South India.",
    image: "/images/city-chennai.jpg",
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    airportCode: "BLR",
    description: "A technology hub with a growing base of specialty and tertiary-care hospitals.",
    image: "/images/city-bengaluru.jpg",
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    airportCode: "HYD",
    description: "Multi-specialty hospitals and a modern international airport.",
    image: "/images/city-hyderabad.jpg",
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    airportCode: "AMD",
    description: "Gujarat's largest city, with specialty hospitals and good connectivity.",
    image: "/images/city-ahmedabad.jpg",
  },
];

export const cityNames = cities.map((c) => c.name);

export function getCity(slug: CitySlug): City {
  const city = cities.find((c) => c.slug === slug);
  if (!city) throw new Error(`Unknown city: ${slug}`);
  return city;
}

export const destinations: Destination[] = [
  { slug: "india", name: "India", status: "available", image: "/images/india-card.jpg", href: "/india" },
  { slug: "turkey", name: "Turkey", status: "coming-soon", image: "/images/dest-turkey.jpg" },
  { slug: "thailand", name: "Thailand", status: "coming-soon", image: "/images/dest-thailand.jpg" },
  { slug: "uae", name: "UAE", status: "coming-soon", image: "/images/dest-uae.jpg" },
  { slug: "singapore", name: "Singapore", status: "coming-soon", image: "/images/dest-singapore.jpg" },
  { slug: "south-korea", name: "South Korea", status: "planned" },
  { slug: "malaysia", name: "Malaysia", status: "planned" },
];

export const comingSoonDestinations = destinations.filter((d) => d.status === "coming-soon");

/* ---------------------------- India page content --------------------------- */

export const indiaFacts: { icon: IconName; title: string; text: string }[] = [
  { icon: "building", title: "6 major cities", text: "Delhi NCR to Ahmedabad" },
  { icon: "badge-check", title: "Accredited hospitals", text: "Accreditations shown on every option" },
  { icon: "id-card", title: "Dedicated medical visa", text: "e-Medical visa for eligible nationalities" },
  { icon: "languages", title: "English widely used", text: "Language assistance available" },
];

export const whyIndia: { title: string; text: string }[] = [
  {
    title: "Broad specialist coverage",
    text: "Cardiac, oncology, transplant, orthopaedic, neuro and fertility care are available across several cities.",
  },
  {
    title: "Internationally accredited hospitals",
    text: "Many hospitals hold JCI and/or NABH accreditation. We show the accreditations each option holds so you can check for yourself.",
  },
  {
    title: "Cost clarity before you travel",
    text: "Treatment in India often costs less than in many countries. You'll see written estimates from hospitals before you commit to anything.",
  },
  {
    title: "English widely used",
    text: "Consultations, reports and discharge documents are commonly in English.",
  },
  {
    title: "A dedicated medical visa",
    text: "Medical and Medical Attendant visas exist specifically for patients and their companions.",
  },
];

export const indiaVisaSteps: { title: string; text: string; who: "You" | "TreatVero" | "You + TreatVero" }[] = [
  {
    title: "Choose your hospital",
    text: "After reviewing your options, confirm the hospital and treatment dates.",
    who: "You",
  },
  {
    title: "Invitation letter",
    text: "The hospital issues a visa invitation letter. We coordinate it for you.",
    who: "TreatVero",
  },
  {
    title: "Apply for your visa",
    text: "Apply online for an e-Medical visa if eligible, or through an Indian mission. We help prepare documents.",
    who: "You + TreatVero",
  },
  {
    title: "Companion visas",
    text: "Family members apply for Medical Attendant visas linked to yours.",
    who: "You + TreatVero",
  },
  {
    title: "Travel & arrive",
    text: "We explain any registration requirements that apply to your stay and arrange your airport pickup.",
    who: "TreatVero",
  },
];

export const indiaStays: { icon: IconName; title: string; text: string }[] = [
  { icon: "building", title: "Serviced apartments", text: "Kitchen and space for longer recovery with family." },
  { icon: "hotel", title: "Hotels near your hospital", text: "Convenient for shorter stays and pre- or post-op visits." },
  { icon: "house", title: "Guest houses", text: "A simpler, cost-conscious option for extended stays." },
];

export const indiaTrip: { when: string; title: string; text: string }[] = [
  { when: "Before", title: "Estimates & decision", text: "Options reviewed remotely; hospital chosen." },
  { when: "Weeks before", title: "Visa & travel", text: "Invitation letter, visa, flights, accommodation." },
  { when: "Day 1", title: "Arrival", text: "Airport pickup, transfer to your stay." },
  { when: "Days 2–3", title: "Consultation & tests", text: "Your doctor confirms the treatment plan." },
  { when: "Treatment", title: "Hospital stay", text: "Admission, procedure, in-hospital recovery." },
  { when: "After", title: "Recovery & fit to fly", text: "Follow-up visit, discharge papers, return travel." },
];

export const indiaConciergeHighlights: { icon: IconName; label: string }[] = [
  { icon: "taxi", label: "Airport pickup" },
  { icon: "hotel", label: "Accommodation" },
  { icon: "car", label: "Local transport" },
  { icon: "headset", label: "Dedicated coordinator" },
  { icon: "handshake", label: "Hospital accompaniment" },
  { icon: "languages", label: "Language assistance" },
  { icon: "users", label: "Companion support" },
  { icon: "plane-takeoff", label: "Return travel" },
];
