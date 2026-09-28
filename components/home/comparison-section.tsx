import { ArrowRight } from "lucide-react";
import { ENQUIRY_PATH } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, SampleBadge } from "@/components/ui/primitives";
import { ComparisonTable } from "@/components/home/comparison-table";

export function ComparisonSection() {
  return (
    <section aria-labelledby="compare-title" className="pt-[clamp(40px,5vw,64px)] pb-[clamp(72px,9vw,128px)]">
      <Container>
        <div className="rounded-[28px] border border-line bg-surface p-[clamp(24px,4.5vw,56px)]">
          <div className="mb-[clamp(28px,3.5vw,44px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-x-14 gap-y-5">
            <div>
              <Eyebrow>Compare your options</Eyebrow>
              <h2 id="compare-title" className="text-h3-lg m-0">
                Every estimate, in the same clear format.
              </h2>
            </div>
            <p className="m-0 text-base text-pretty text-ink-muted">
              Hospitals reply in different ways. We lay their responses side by side so you can compare like with like,
              ask questions, and decide for yourself. We don&apos;t rank doctors.
            </p>
          </div>
          <ComparisonTable />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex max-w-[600px] items-start gap-3">
              <SampleBadge className="shrink-0">Illustrative</SampleBadge>
              <p className="m-0 text-[13px] text-ink-subtle">
                Illustrative example — the hospitals are unnamed and the figures are not quotes or price guidance. Real
                options are prepared for each patient from hospital responses; estimates are indicative until confirmed by
                the hospital.
              </p>
            </div>
            <ButtonLink href={ENQUIRY_PATH} size="md+" className="gap-2">
              Get My Treatment Options
              <ArrowRight aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
