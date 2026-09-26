import { HOW_IT_WORKS_HIGHLIGHT, howItWorksSteps } from "@/data/site";
import { ENQUIRY_PATH } from "@/lib/config";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section } from "@/components/ui/primitives";

export function HowItWorksSteps({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-6 gap-y-8 p-0">
      {howItWorksSteps.map((s, i) => {
        const hi = i === HOW_IT_WORKS_HIGHLIGHT;
        return (
          <li key={s.title} className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-sm",
                  hi ? "border-brand bg-brand text-white" : "border-line-strong bg-surface text-ink",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className={cn("h-px flex-1 bg-line", i === howItWorksSteps.length - 1 && "opacity-0")} />
            </div>
            <H className="mt-1.5 mb-0 font-serif text-2xl leading-[1.15] font-normal tracking-[-0.01em]">
              <span className="sr-only">Step {i + 1}: </span>
              {s.title}
            </H>
            <p className="m-0 text-[15px] leading-[1.55] text-pretty text-ink-muted">{s.text}</p>
            <span className="self-start rounded-full bg-brand-tint px-2.5 py-1 text-xs text-brand">{s.tag}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function HowItWorks() {
  return (
    <Section id="how" tone="white" aria-labelledby="how-title">
      <Container>
        <div className="mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <Eyebrow>How TreatVero works</Eyebrow>
            <h2 id="how-title" className="text-h2 m-0">
              Five steps. One coordinator. You stay in control.
            </h2>
          </div>
          <ButtonLink href={ENQUIRY_PATH} variant="outline" size="md">
            Start step one
          </ButtonLink>
        </div>
        <HowItWorksSteps />
      </Container>
    </Section>
  );
}
