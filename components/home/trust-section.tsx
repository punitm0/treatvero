import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trustPoints } from "@/data/site";
import { Icon } from "@/components/ui/icon";
import { Container, Eyebrow } from "@/components/ui/primitives";

export function TrustPoints() {
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {trustPoints.map((t) => (
        <li key={t.lead} className="flex gap-4 border-t border-line py-[18px]">
          <Icon name={t.icon} className="size-[22px] shrink-0 text-brand" />
          <p className="m-0 text-base leading-normal text-ink-muted">
            <strong className="font-medium text-ink">{t.lead}</strong> {t.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function TrustSection() {
  return (
    <section id="trust" aria-labelledby="trust-title" className="section-y">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-x-20 gap-y-12">
        <div>
          <Eyebrow>Our role</Eyebrow>
          <h2 id="trust-title" className="text-h2 mb-5">
            Your health journey deserves clarity.
          </h2>
          <p className="mb-5 text-[17px] text-pretty text-ink-muted">
            You should always know who does what. Here&apos;s ours, in plain language — so your doctors can focus on
            your care, and you can focus on getting well.
          </p>
          <Link href="/medical-disclaimer" className="inline-flex items-center gap-1.5 text-[15px] font-medium no-underline">
            Read our medical disclaimer
            <ArrowRight aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
          </Link>
        </div>
        <TrustPoints />
      </Container>
    </section>
  );
}
