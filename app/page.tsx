import { generalFaqs } from "@/data/faqs";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { TreatmentsSection } from "@/components/home/treatments-section";
import { DestinationsSection } from "@/components/home/destinations-section";
import { WhySection } from "@/components/home/why-section";
import { HospitalsSection } from "@/components/home/hospitals-section";
import { ComparisonSection } from "@/components/home/comparison-section";
import { ConciergeSection } from "@/components/home/concierge-section";
import { PricingSection } from "@/components/home/pricing-section";
import { JourneySection } from "@/components/home/journey-section";
import { TrustSection } from "@/components/home/trust-section";
import { PatientStories } from "@/components/home/patient-stories";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";

// Title, description, canonical and OpenGraph come from the root layout defaults.
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <TreatmentsSection />
      <DestinationsSection />
      <WhySection />
      <HospitalsSection />
      <ComparisonSection />
      <ConciergeSection />
      <PricingSection />
      <JourneySection />
      <TrustSection />
      <PatientStories />
      <FaqSection faqs={generalFaqs} />
      <FinalCta />
    </>
  );
}
