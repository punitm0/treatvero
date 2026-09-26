import { Eyebrow } from "@/components/ui/primitives";
import { PricingCards } from "@/components/pricing/pricing-cards";

export function PricingSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const H = headingLevel;
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section-y">
      <div className="mx-auto max-w-[1080px] px-[clamp(20px,4vw,40px)]">
        <div className="mx-auto mb-[clamp(40px,5vw,56px)] max-w-[640px] text-center">
          <Eyebrow>Pricing</Eyebrow>
          <H id="pricing-title" className="text-h2 mb-4">
            Clear from the first conversation.
          </H>
          <p className="m-0 text-[17px] text-ink-muted">
            Two paid plans, priced in USD and agreed before anything starts. Treatment costs are always paid separately.
          </p>
        </div>
        <PricingCards headingLevel={headingLevel === "h1" ? "h2" : "h3"} />
      </div>
    </section>
  );
}
