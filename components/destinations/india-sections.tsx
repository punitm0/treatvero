import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Info, PlaneLanding } from "lucide-react";
import {
  cities,
  indiaConciergeHighlights,
  indiaFacts,
  indiaStays,
  indiaTrip,
  indiaVisaSteps,
  whyIndia,
} from "@/data/destinations";
import { treatments } from "@/data/treatments";
import { hospitals } from "@/data/hospitals";
import { indiaCityPageHref } from "@/data/seo-pages";
import { formatPlanPrice, plans } from "@/data/pricing";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { Container, Eyebrow, SampleBadge } from "@/components/ui/primitives";
import { WhatsAppButton } from "@/components/ui/whatsapp-link";
import { HospitalCardCompact } from "@/components/hospitals/hospital-card";
import { HospitalsBrowser } from "@/components/hospitals/hospitals-browser";

export function IndiaFacts() {
  return (
    <ul className="m-0 mt-[clamp(36px,5vw,56px)] grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] border-t border-line p-0">
      {indiaFacts.map((f) => (
        <li key={f.title} className="flex items-start gap-3 pt-5 pr-5">
          <Icon name={f.icon} className="size-[22px] shrink-0 text-brand" />
          <div className="leading-[1.4]">
            <div className="text-[15px] font-medium">{f.title}</div>
            <div className="text-sm text-ink-muted">{f.text}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function WhyIndia() {
  return (
    <section aria-labelledby="why-india" className="section-y-sm border-y border-line bg-surface">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-x-20 gap-y-10">
        <div>
          <Eyebrow>Why patients choose India</Eyebrow>
          <h2 id="why-india" className="text-h2-sm mb-5">
            Depth of specialist care, with clarity on cost before you travel.
          </h2>
          <p className="m-0 text-base text-pretty text-ink-muted">
            Every patient&apos;s situation is different. These are the reasons international patients commonly consider
            India — your options will depend on your condition and the hospitals&apos; assessments.
          </p>
        </div>
        <ol className="m-0 list-none p-0">
          {whyIndia.map((w, i) => (
            <li key={w.title} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3 border-t border-line py-5">
              <span className="pt-[3px] font-mono text-[13px] text-brand">0{i + 1}</span>
              <div>
                <h3 className="mt-0 mb-1 text-[17px] font-medium">{w.title}</h3>
                <p className="m-0 text-[15px] text-pretty text-ink-muted">{w.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function IndiaSpecialties() {
  return (
    <section id="treatments" aria-labelledby="india-specialties" className="section-y-sm">
      <Container>
        <Eyebrow>Major treatment specialties</Eyebrow>
        <h2 id="india-specialties" className="text-h2-sm mb-8 max-w-[720px]">
          Treatment guides for India
        </h2>
        <ul className="m-0 mb-[clamp(56px,7vw,88px)] flex list-none flex-wrap gap-2 p-0">
          {treatments.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/treatments/${t.slug}`}
                className="flex min-h-[46px] items-center gap-2 rounded-full border border-line bg-surface pr-4 pl-3 text-[15px] text-ink no-underline transition-colors hover:border-brand hover:text-ink"
              >
                <Icon name={t.icon} className="size-5 text-brand" />
                {t.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Typical stays</Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(28px,3.4vw,42px)] leading-[1.08] font-normal tracking-[-0.02em]">
              What to expect, before you ask.
            </h2>
          </div>
          <SampleBadge>General guide · confirmed by each hospital</SampleBadge>
        </div>
        <ul className="m-0 list-none overflow-hidden rounded-[20px] border border-line bg-surface p-0">
          {treatments.slice(0, 7).map((t, i) => (
            <li key={t.slug} className={cn(i > 0 && "border-t border-line-soft")}>
              <Link
                href={`/treatments/${t.slug}`}
                className="flex flex-wrap items-center gap-x-6 gap-y-3 px-[clamp(18px,2.4vw,28px)] py-[18px] text-ink no-underline transition-colors hover:bg-canvas hover:text-ink"
              >
                <span className="min-w-0 flex-[2_1_200px] text-base font-medium">{t.name}</span>
                <span className="flex-[2_1_220px]">
                  <span className="block text-xs text-ink-subtle">Hospital stay</span>
                  <span className="block text-[15px]">{t.typicalStay.hospital}</span>
                </span>
                <span className="flex-[1_1_130px]">
                  <span className="block text-xs text-ink-subtle">Estimate</span>
                  <span className="block text-[15px]">Requested from hospitals</span>
                </span>
                <ArrowRight aria-hidden="true" className="size-5 text-brand" strokeWidth={1.75} />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 mb-0 max-w-[760px] text-[13px] text-ink-subtle">
          Costs and stays vary by hospital, surgeon, room category, your medical condition and recovery. TreatVero does
          not publish treatment prices — personalised estimates come directly from hospitals.
        </p>
      </Container>
    </section>
  );
}

export function IndiaHospitals() {
  return (
    <section id="hospitals" aria-labelledby="india-hospitals" className="section-y-sm bg-sand">
      <Container>
        <div className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-5">
          <div>
            <Eyebrow>Hospitals in India</Eyebrow>
            <h2 id="india-hospitals" className="text-h2-sm m-0">
              Browse by city
            </h2>
          </div>
          <p className="m-0 text-base text-pretty text-ink-muted">
            Treatment options may be sourced from leading hospitals based on your medical requirements. Listings show
            accreditations held — not rankings.
          </p>
        </div>
        <HospitalsBrowser
          cities={cities.map((c) => ({ slug: c.slug, name: c.name }))}
          initialAllLimit={6}
          cards={hospitals.map((h) => ({ key: h.slug, city: h.city, node: <HospitalCardCompact hospital={h} /> }))}
        />
      </Container>
    </section>
  );
}

export function IndiaCities({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const H = headingLevel;
  return (
    <section aria-labelledby="india-cities" className="section-y-sm">
      <Container>
        <Eyebrow>Major healthcare cities</Eyebrow>
        <H id="india-cities" className="text-h2-sm mb-[clamp(32px,4vw,48px)] max-w-[720px]">
          Six cities, each well connected internationally.
        </H>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 p-0">
          {cities.map((c) => {
            const href = indiaCityPageHref(c.slug);
            const body = (
              <>
                <div className="relative aspect-[16/8] bg-[#e8e4dc]">
                  <Image src={c.image} alt="" fill sizes="(min-width: 1100px) 400px, (min-width: 700px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-col gap-2 px-[22px] pt-5 pb-[22px]">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="m-0 font-serif text-[28px] leading-[1.1] font-normal tracking-[-0.01em]">{c.name}</h3>
                    <span className="flex items-center gap-1 font-mono text-xs text-ink-muted">
                      <PlaneLanding aria-hidden="true" className="size-4" strokeWidth={1.75} />
                      <span className="sr-only">Airport code </span>
                      {c.airportCode}
                    </span>
                  </div>
                  <p className="m-0 text-[15px] text-pretty text-ink-muted">{c.description}</p>
                </div>
              </>
            );
            return (
              <li key={c.slug} className="grid">
                {href ? (
                  <Link
                    href={href}
                    className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface text-ink no-underline transition-colors hover:border-brand-line hover:text-ink"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export function IndiaVisa() {
  return (
    <section aria-labelledby="india-visa" className="section-y-sm border-y border-line bg-surface">
      <Container>
        <div className="mb-[clamp(36px,4.5vw,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-5">
          <div>
            <Eyebrow>Medical visa overview</Eyebrow>
            <h2 id="india-visa" className="text-h2-sm m-0">
              The paperwork, step by step.
            </h2>
          </div>
          <p className="m-0 text-base text-pretty text-ink-muted">
            Most international patients travel to India on a Medical visa, and companions on a Medical Attendant visa.
            Eligibility and process depend on your nationality.
          </p>
        </div>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-3 p-0">
          {indiaVisaSteps.map((v, i) => (
            <li key={v.title} className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-canvas p-[22px]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-brand">0{i + 1}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-[3px] text-[11px]",
                    v.who === "You" ? "bg-surface text-ink-muted" : "bg-brand-tint text-brand",
                  )}
                >
                  {v.who}
                </span>
              </div>
              <h3 className="m-0 text-[17px] leading-[1.3] font-medium">{v.title}</h3>
              <p className="m-0 text-sm text-pretty text-ink-muted">{v.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 mb-0 flex max-w-[820px] items-start gap-2.5 text-[13px] text-ink-subtle">
          <Info aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.75} />
          <span>
            Visa decisions are made by the Government of India. TreatVero helps with documentation and the hospital
            invitation letter, but cannot guarantee approval. Always check current requirements on the official Indian
            visa portal.
          </span>
        </p>
      </Container>
    </section>
  );
}

export function IndiaStayAndJourney() {
  return (
    <section aria-label="Accommodation and typical patient journey" className="section-y-sm">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-start gap-x-20 gap-y-14">
        <div>
          <Eyebrow>Accommodation</Eyebrow>
          <h2 className="text-h3-lg mb-4">Somewhere comfortable to recover, close to your hospital.</h2>
          <p className="mb-6 text-base text-ink-muted">
            We suggest options that fit your length of stay, mobility and companions. You pay the provider directly.
          </p>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {indiaStays.map((s) => (
              <li key={s.title} className="flex items-start gap-3.5 rounded-[14px] border border-line bg-surface px-[18px] py-4">
                <Icon name={s.icon} className="size-[22px] shrink-0 text-brand" />
                <div className="leading-[1.45]">
                  <div className="text-[15px] font-medium">{s.title}</div>
                  <div className="text-sm text-ink-muted">{s.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Eyebrow>Typical patient journey</Eyebrow>
          <h2 className="text-h3-lg mb-6">What a typical trip looks like</h2>
          <ol className="m-0 list-none p-0">
            {indiaTrip.map((t) => (
              <li key={t.title} className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 border-t border-line py-4 max-sm:grid-cols-[92px_minmax(0,1fr)]">
                <span className="pt-[3px] font-mono text-xs text-brand">{t.when}</span>
                <div>
                  <h3 className="m-0 text-base font-medium">{t.title}</h3>
                  <p className="m-0 text-sm text-ink-muted">{t.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-3 mb-0 text-[13px] text-ink-subtle">Timelines vary by treatment and are confirmed in each hospital&apos;s plan.</p>
        </div>
      </Container>
    </section>
  );
}

export function IndiaConciergeStrip() {
  return (
    <section aria-labelledby="india-concierge" className="pb-[clamp(72px,9vw,120px)]">
      <Container>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-x-16 gap-y-8 rounded-[28px] bg-brand-deep p-[clamp(28px,5vw,64px)] text-white">
          <div>
            <p className="eyebrow mb-4 text-ondark-accent">Concierge support in India</p>
            <h2 id="india-concierge" className="mb-4 font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.06] font-normal tracking-[-0.022em] text-balance">
              A coordinator on the ground, from arrivals to departures.
            </h2>
            <p className="mb-7 text-base text-ondark-muted">
              Concierge plan · {formatPlanPrice(plans.concierge)} USD · treatment, hotels and flights paid separately.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/concierge"
                className="inline-flex h-[52px] items-center rounded-full bg-white px-6 text-[15px] font-medium text-brand-deep no-underline hover:bg-inverse-hover hover:text-brand-deep"
              >
                Explore Concierge
              </Link>
              <WhatsAppButton variant="ghost-inverse" size="md+">
                Talk to a coordinator
              </WhatsAppButton>
            </div>
          </div>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-px overflow-hidden rounded-2xl bg-white/12 p-0">
            {indiaConciergeHighlights.map((c) => (
              <li key={c.label} className="flex flex-col gap-2.5 bg-brand-deep p-[18px]">
                <Icon name={c.icon} className="size-[22px] text-ondark-accent" />
                <span className="text-sm leading-[1.35]">{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
