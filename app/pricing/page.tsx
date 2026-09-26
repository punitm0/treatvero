import { pricingFaqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { PricingSection } from "@/components/home/pricing-section";
import { PricingComparison } from "@/components/pricing/pricing-comparison";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";

export const metadata = pageMetadata({
  title: "Pricing — Basic & Concierge Plans",
  description:
    "Two paid TreatVero plans in USD: Basic for help finding and coordinating treatment options, and Concierge for end-to-end support. Treatment and third-party costs are paid separately.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <Container className="pt-[clamp(28px,4vw,48px)]">
        <Breadcrumbs items={[{ name: "Pricing", path: "/pricing" }]} />
      </Container>
      <PricingSection headingLevel="h1" />
      <section id="compare" aria-labelledby="compare-plans" className="pb-[clamp(72px,9vw,128px)]">
        <div className="mx-auto max-w-[880px] px-[clamp(20px,4vw,40px)]">
          <div className="mb-8 text-center">
            <Eyebrow>Compare plans</Eyebrow>
            <h2 id="compare-plans" className="text-h2-sm m-0">
              Basic or Concierge, side by side.
            </h2>
          </div>
          <PricingComparison />
        </div>
      </section>
      <FaqSection faqs={pricingFaqs} title="Pricing questions" />
      <FinalCta />
    </>
  );
}
