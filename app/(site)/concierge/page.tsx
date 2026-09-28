import { generalFaqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/primitives";
import { ConciergeSection } from "@/components/home/concierge-section";
import { JourneySection } from "@/components/home/journey-section";
import { PricingSection } from "@/components/home/pricing-section";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";

export const metadata = pageMetadata({
  title: "Concierge — Support Around Your Treatment",
  description:
    "TreatVero Concierge coordinates hospitals, medical visas, accommodation, airport pickup, local transport, translation, hospital accompaniment, discharge and return travel.",
  path: "/concierge",
});

const faqs = generalFaqs.filter((f) =>
  [
    "What does Concierge include?",
    "Can you coordinate accommodation?",
    "Can family travel with me?",
    "Can TreatVero help with medical visas?",
    "Are treatment costs included?",
  ].includes(f.question),
);

export default function ConciergePage() {
  return (
    <>
      <div className="bg-sand pt-[clamp(28px,4vw,48px)]">
        <Container>
          <Breadcrumbs items={[{ name: "Concierge", path: "/concierge" }]} />
        </Container>
      </div>
      <ConciergeSection headingLevel="h1" />
      <JourneySection />
      <PricingSection />
      <FaqSection faqs={faqs} />
      <FinalCta title="Let us handle the logistics." />
    </>
  );
}
