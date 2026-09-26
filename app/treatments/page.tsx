import { treatments } from "@/data/treatments";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/primitives";
import { TreatmentGrid } from "@/components/treatments/treatment-card";
import { HowItWorks } from "@/components/home/how-it-works";
import { FinalCta } from "@/components/home/final-cta";

export const metadata = pageMetadata({
  title: "Treatments — Specialist Care Abroad",
  description:
    "Explore treatment guides for cardiac care, cancer, orthopaedics, spine, IVF, eye care, neurology, transplants, dental and bariatric surgery — and get options from suitable hospitals.",
  path: "/treatments",
});

export default function TreatmentsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Treatments", path: "/treatments" }]}
        eyebrow="Treatments"
        title={
          <>
            Specialist care, <em className="text-brand">across the conditions that matter most.</em>
          </>
        }
        lede="Each guide explains common reasons patients travel, general treatment approaches, typical stays and the questions worth asking — so you can have better conversations with your doctors."
      />
      <section aria-label="All treatments" className="pb-[clamp(72px,9vw,128px)]">
        <Container>
          <TreatmentGrid items={treatments} headingLevel="h2" />
          <p className="mt-6 mb-0 max-w-[760px] text-[13px] text-ink-subtle">
            These guides are general information, not medical advice. Diagnosis and treatment recommendations come from
            licensed healthcare professionals.
          </p>
        </Container>
      </section>
      <HowItWorks />
      <FinalCta />
    </>
  );
}
