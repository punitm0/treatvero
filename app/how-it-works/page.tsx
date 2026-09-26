import { generalFaqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/primitives";
import { HowItWorksSteps } from "@/components/home/how-it-works";
import { JourneySection } from "@/components/home/journey-section";
import { ComparisonSection } from "@/components/home/comparison-section";
import { TrustSection } from "@/components/home/trust-section";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";

export const metadata = pageMetadata({
  title: "How It Works",
  description:
    "Five steps from your first message to getting home: tell us what you need, receive treatment options, choose your provider, plan your journey and get support throughout your stay.",
  path: "/how-it-works",
});

const faqs = generalFaqs.filter((f) =>
  ["How does TreatVero work?", "How are hospitals selected?", "Can I choose my own doctor?", "Is my medical information secure?"].includes(f.question),
);

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "How It Works", path: "/how-it-works" }]}
        eyebrow="How TreatVero works"
        title={
          <>
            Five steps. One coordinator. <em className="text-brand">You stay in control.</em>
          </>
        }
        lede="We coordinate the non-medical parts of treatment abroad — so you can compare options clearly and make decisions with your doctors."
      />
      <section aria-label="The five steps" className="section-y border-y border-line bg-surface">
        <Container>
          <HowItWorksSteps headingLevel="h2" />
        </Container>
      </section>
      <ComparisonSection />
      <JourneySection />
      <TrustSection />
      <FaqSection faqs={faqs} />
      <FinalCta />
    </>
  );
}
