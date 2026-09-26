import { whyTreatVero } from "@/data/site";
import { Icon } from "@/components/ui/icon";
import { Container, Section, SplitHeading } from "@/components/ui/primitives";

export function WhySection() {
  return (
    <Section tone="sand" aria-labelledby="why-title">
      <Container>
        <SplitHeading id="why-title" eyebrow="Why TreatVero" title="Guidance around your care — never in place of it.">
          Your doctors make the medical decisions. We make everything around them easier to understand and easier to
          organise.
        </SplitHeading>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-10 p-0">
          {whyTreatVero.map((w) => (
            <li key={w.title} className="flex flex-col gap-2.5 border-t border-line-strong pt-6">
              <Icon name={w.icon} className="size-[26px] text-brand" />
              <h3 className="mt-1.5 mb-0 text-lg font-medium tracking-[-0.01em]">{w.title}</h3>
              <p className="m-0 text-[15px] text-pretty text-ink-muted">{w.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
