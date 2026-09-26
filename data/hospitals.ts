import type { CitySlug, Hospital, TreatmentSlug } from "@/types";

/**
 * DEVELOPMENT SAMPLE DATA.
 *
 * These entries are placeholders that demonstrate the listing layout. They
 * are not real hospitals, carry no verified accreditations and are not
 * TreatVero partners. Replace with verified listings before launch and set
 * `isSample: false`. Only set `isConfirmedPartner: true` once a written
 * agreement exists.
 */

const images = ["/images/hospital-1.jpg", "/images/hospital-2.jpg", "/images/hospital-3.jpg", "/images/hero.jpg"];

const seed: { city: CitySlug; specialties: TreatmentSlug[]; accreditations: string[] }[] = [
  { city: "delhi-ncr", specialties: ["cardiac-care", "cancer-treatment", "organ-transplant"], accreditations: ["e.g. JCI", "NABH"] },
  { city: "delhi-ncr", specialties: ["orthopaedics", "spine-surgery", "neurology-neurosurgery"], accreditations: ["e.g. NABH"] },
  { city: "mumbai", specialties: ["cancer-treatment", "ivf-fertility", "bariatric-surgery"], accreditations: ["e.g. JCI", "NABH"] },
  { city: "mumbai", specialties: ["cardiac-care", "eye-care", "dental-treatment"], accreditations: ["e.g. NABH"] },
  { city: "chennai", specialties: ["orthopaedics", "spine-surgery", "neurology-neurosurgery"], accreditations: ["e.g. JCI", "NABH"] },
  { city: "chennai", specialties: ["organ-transplant", "cardiac-care", "eye-care"], accreditations: ["e.g. NABH"] },
  { city: "bengaluru", specialties: ["cardiac-care", "eye-care", "dental-treatment"], accreditations: ["e.g. NABH"] },
  { city: "bengaluru", specialties: ["cancer-treatment", "orthopaedics", "ivf-fertility"], accreditations: ["e.g. JCI", "NABH"] },
  { city: "hyderabad", specialties: ["organ-transplant", "neurology-neurosurgery", "orthopaedics"], accreditations: ["e.g. JCI", "NABH"] },
  { city: "hyderabad", specialties: ["bariatric-surgery", "cardiac-care", "spine-surgery"], accreditations: ["e.g. NABH"] },
  { city: "ahmedabad", specialties: ["cardiac-care", "orthopaedics", "ivf-fertility"], accreditations: ["e.g. NABH"] },
  { city: "ahmedabad", specialties: ["cancer-treatment", "dental-treatment", "eye-care"], accreditations: ["e.g. NABH"] },
];

export const hospitals: Hospital[] = seed.map((s, i) => {
  const letter = String.fromCharCode(65 + i);
  return {
    slug: `sample-hospital-${letter.toLowerCase()}`,
    name: `Sample Hospital ${letter}`,
    city: s.city,
    accreditations: s.accreditations,
    specialties: s.specialties,
    description:
      "Placeholder listing used to demonstrate how hospital options are presented. Real listings will describe the hospital's specialties, facilities for international patients and verified accreditations.",
    image: images[i % images.length],
    isSample: true,
    isConfirmedPartner: false,
  };
});

export function getHospital(slug: string): Hospital | undefined {
  return hospitals.find((h) => h.slug === slug);
}

export function getHospitalsForTreatment(slug: TreatmentSlug, limit = 3): Hospital[] {
  return hospitals.filter((h) => h.specialties.includes(slug)).slice(0, limit);
}

export const hasSampleHospitals = hospitals.some((h) => h.isSample);
