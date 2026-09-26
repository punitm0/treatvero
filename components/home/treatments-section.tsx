import { treatments } from "@/data/treatments";
import { Container, Section, SplitHeading } from "@/components/ui/primitives";
import { TreatmentGrid } from "@/components/treatments/treatment-card";

export function TreatmentsSection() {
  return (
    <Section id="treatments" aria-labelledby="treatments-title">
      <Container>
        <SplitHeading
          id="treatments-title"
          eyebrow="Treatments"
          title="Specialist care, across the conditions that matter most."
          className="mb-[clamp(40px,5vw,56px)]"
        >
          Each specialty has a dedicated guide covering typical procedures, what hospitals need from you, and how
          estimates are prepared.
        </SplitHeading>
        <TreatmentGrid items={treatments} />
      </Container>
    </Section>
  );
}
