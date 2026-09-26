import Image from "next/image";
import { conciergeGroups } from "@/data/site";
import { Icon } from "@/components/ui/icon";
import { Container, Eyebrow, Section } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function ConciergeGroups({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
      {conciergeGroups.map((g) => (
        <section key={g.title} aria-label={g.title} className="rounded-[20px] border border-line bg-surface p-[clamp(22px,2.6vw,30px)]">
          <div className="mb-2 flex items-baseline justify-between">
            <H className="m-0 font-serif text-2xl font-normal tracking-[-0.01em]">{g.title}</H>
            <span className="font-mono text-[11px] text-ink-subtle">{String(g.items.length).padStart(2, "0")}</span>
          </div>
          <ul className="m-0 list-none p-0">
            {g.items.map((item, i) => (
              <li key={item.title} className={cn("flex gap-3.5 py-3.5", i > 0 && "border-t border-line-soft")}>
                <Icon name={item.icon} className="size-[22px] shrink-0 text-brand" />
                <div className="leading-[1.4]">
                  <div className="text-[15px] font-medium">{item.title}</div>
                  <div className="mt-0.5 text-sm text-ink-muted">{item.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function ConciergeSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const H = headingLevel;
  return (
    <Section id="concierge" tone="sand" aria-labelledby="concierge-title">
      <Container>
        <div className="mb-[clamp(40px,5vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-x-16 gap-y-8">
          <div>
            <Eyebrow>TreatVero Concierge</Eyebrow>
            <H
              id="concierge-title"
              className="mb-5 font-serif text-[clamp(36px,4.8vw,62px)] leading-[1.04] font-normal tracking-[-0.025em] text-balance"
            >
              Your treatment is only part of the journey.
            </H>
            <p className="m-0 max-w-[520px] text-[17px] text-pretty text-ink-muted">
              Concierge takes care of the logistics around your care — so you and your family can focus on treatment
              and recovery.
            </p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] border border-[#e0dcd3] bg-[#e8e4dc]">
            <Image src="/images/concierge.jpg" alt="A quiet, prepared hospital room" fill sizes="(min-width: 1100px) 560px, 100vw" className="object-cover" />
          </div>
        </div>
        <ConciergeGroups headingLevel={headingLevel === "h1" ? "h2" : "h3"} />
      </Container>
    </Section>
  );
}
