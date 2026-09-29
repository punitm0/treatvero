import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Info, PlaneTakeoff } from "lucide-react";
import { notFound } from "next/navigation";
import {
  getSourceCountryPage,
  indiaCityPageHref,
  publishedIndiaPages,
  publishedSourceCountryPages,
  type IndiaTreatmentPage,
  type SourceCountryPage,
} from "@/data/seo-pages";
import { getCity, indiaVisaSteps } from "@/data/destinations";
import { treatments } from "@/data/treatments";
import { generalFaqs } from "@/data/faqs";
import { siteConfig } from "@/lib/config";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, cn } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/ui/json-ld";
import { HowItWorks } from "@/components/home/how-it-works";
import { PricingSection } from "@/components/home/pricing-section";
import { FaqSection } from "@/components/home/faq-section";
import { CenteredCta } from "@/components/home/centered-cta";

/**
 * "Patients from <country>" guides. Only entries in data/seo-pages.ts that are
 * published AND substantial (see isSubstantial) are generated; the rest 404
 * so no thin pages ship.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedSourceCountryPages.map((p) => ({ country: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/from/[country]">): Promise<Metadata> {
  const page = getSourceCountryPage((await params).country);
  if (!page) return {};
  return pageMetadata({
    title: `Treatment in India from ${page.country}: Visa & Travel Guide`,
    description:
      page.metaDescription ??
      `A guide for ${page.demonym} patients travelling to India for treatment: medical visa, flights, documents, payments and how TreatVero coordinates your trip.`,
    path: `/from/${page.slug}`,
  });
}

const visaStatus = {
  available: { label: "e-Medical visa available", tone: "bg-brand-tint text-brand" },
  "not-available": { label: "e-Visa not available · apply via the mission", tone: "bg-warn-bg text-warn-ink" },
  suspended: { label: "e-Visa currently suspended", tone: "bg-warn-bg text-warn-ink" },
} as const;

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function FromCountryPage({ params }: PageProps<"/from/[country]">) {
  const page = getSourceCountryPage((await params).country);
  if (!page) notFound();
  const path = `/from/${page.slug}`;
  const faqs = [...page.faqs, ...generalFaqs.slice(0, 2)];

  return (
    <>
      <PageHero
        crumbs={[
          { name: "India", path: "/india" },
          { name: `Patients from ${page.country}`, path },
        ]}
        eyebrow={`Guide for patients from ${page.country}`}
        title={
          <>
            Medical treatment in India <em className="text-brand">from {page.country}.</em>
          </>
        }
        lede={page.intro}
        aside={<AtAGlance page={page} />}
      />
      <CountryVisa page={page} />
      <CountryTravel page={page} />
      <CountryNotes page={page} />
      <TreatmentLinks page={page} />
      <HowItWorks />
      <PricingSection />
      <FaqSection
        faqs={faqs}
        eyebrow={`FAQ · ${page.country}`}
        title={`Questions from ${page.demonym} patients`}
      />
      <CountrySources page={page} />
      <CenteredCta title={`Planning treatment in India from ${page.country}?`} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${absoluteUrl(path)}#webpage`,
          url: absoluteUrl(path),
          name: `Medical treatment in India from ${page.country}`,
          description: page.metaDescription ?? page.intro,
          inLanguage: "en",
          ...(page.verifiedOn ? { dateModified: page.verifiedOn } : {}),
          about: { "@type": "Country", name: page.country.replace(/^the /, "") },
          isPartOf: { "@id": `${siteConfig.url}/#website` },
          publisher: { "@id": `${siteConfig.url}/#organization` },
        }}
      />
    </>
  );
}

function AtAGlance({ page }: { page: SourceCountryPage }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-[clamp(22px,3vw,32px)]">
      <p className="label-mono m-0 mb-4 text-ink-subtle">At a glance</p>
      <dl className="m-0 grid gap-0">
        {page.facts.map((f, i) => (
          <div key={f.label} className={cn("grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-3", i > 0 && "border-t border-line-soft")}>
            <dt className="text-sm text-ink-muted">{f.label}</dt>
            <dd className="m-0 text-[15px] font-medium">{f.value}</dd>
          </div>
        ))}
      </dl>
      {page.verifiedOn ? (
        <p className="mt-4 mb-0 text-[13px] text-ink-subtle">
          Checked against official sources on <time dateTime={page.verifiedOn}>{formatDate(page.verifiedOn)}</time>.
        </p>
      ) : null}
    </div>
  );
}

function CountryVisa({ page }: { page: SourceCountryPage }) {
  const visa = page.visa!;
  const status = visaStatus[visa.eMedical];
  return (
    <section aria-labelledby="country-visa" className="section-y-sm border-y border-line bg-surface">
      <Container>
        <div className="mb-[clamp(32px,4vw,48px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-16 gap-y-8">
          <div>
            <Eyebrow>Medical visa</Eyebrow>
            <h2 id="country-visa" className="text-h2-sm mb-5">
              India medical visa for {page.demonym} patients
            </h2>
            <span className={cn("inline-flex rounded-full px-3 py-1.5 text-[13px] font-medium", status.tone)}>{status.label}</span>
          </div>
          <div>
            <p className="mt-0 mb-5 text-base text-pretty text-ink-muted">{visa.summary}</p>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {visa.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[15px] text-pretty">
                  <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-brand" />
                  {p}
                </li>
              ))}
            </ul>
            {visa.missions.length ? (
              <p className="mt-5 mb-0 text-sm text-ink-muted">
                Visas for {page.country} are handled by{" "}
                {visa.missions.map((m, i) => (
                  <span key={m.url}>
                    {i > 0 ? (i === visa.missions.length - 1 ? " and " : ", ") : null}
                    <a href={m.url} rel="noopener" target="_blank" className="text-brand">
                      {m.name}
                    </a>
                  </span>
                ))}
                .
              </p>
            ) : null}
          </div>
        </div>
        <h3 className="mt-0 mb-4 text-[17px] font-medium">How the visa fits into your plan</h3>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-3 p-0">
          {indiaVisaSteps.map((v, i) => (
            <li key={v.title} className="flex flex-col gap-2 rounded-[18px] border border-line bg-canvas p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-brand">0{i + 1}</span>
                <span className={cn("rounded-full px-2 py-[3px] text-[11px]", v.who === "You" ? "bg-surface text-ink-muted" : "bg-brand-tint text-brand")}>
                  {v.who}
                </span>
              </div>
              <h4 className="m-0 text-base leading-[1.3] font-medium">{v.title}</h4>
              <p className="m-0 text-sm text-pretty text-ink-muted">{v.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 mb-0 flex max-w-[820px] items-start gap-2.5 text-[13px] text-ink-subtle">
          <Info aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.75} />
          <span>
            Visa decisions are made by the Government of India and rules change. Always check current requirements on
            the official Indian visa portal and your nearest Indian mission before you apply.
          </span>
        </p>
      </Container>
    </section>
  );
}

function CountryTravel({ page }: { page: SourceCountryPage }) {
  const travel = page.travel!;
  return (
    <section aria-labelledby="country-travel" className="section-y-sm">
      <Container>
        <div className="mb-[clamp(28px,4vw,44px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-5">
          <div>
            <Eyebrow>Getting there</Eyebrow>
            <h2 id="country-travel" className="text-h2-sm m-0">
              Flights from {page.country} to India
            </h2>
          </div>
          <div>
            <p className="mt-0 mb-3 text-base text-pretty text-ink-muted">{travel.summary}</p>
            {travel.airports.length ? (
              <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
                <PlaneTakeoff aria-hidden="true" className="size-4 text-brand" strokeWidth={1.75} />
                Departing from{" "}
                {travel.airports.map((a, i) => (
                  <span key={a.code}>
                    {a.name} ({a.code}){i < travel.airports.length - 1 ? "," : ""}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        </div>
        <ul className="m-0 list-none overflow-hidden rounded-[20px] border border-line bg-surface p-0">
          {travel.routes.map((r, i) => {
            const city = getCity(r.to);
            const href = indiaCityPageHref(r.to);
            return (
              <li key={r.to} className={cn("flex flex-wrap items-center gap-x-6 gap-y-2 px-[clamp(18px,2.4vw,28px)] py-[18px]", i > 0 && "border-t border-line-soft")}>
                <span className="min-w-0 flex-[1_1_180px]">
                  {href ? (
                    <Link href={href} className="text-base font-medium text-ink hover:text-brand">
                      {city.name}
                    </Link>
                  ) : (
                    <span className="text-base font-medium">{city.name}</span>
                  )}
                  <span className="block font-mono text-xs text-ink-subtle">{city.airportCode}</span>
                </span>
                <span className="flex-[0_0_auto] rounded-full border border-line px-3 py-[5px] text-[13px] text-ink-muted">
                  {r.kind === "direct" ? "Direct" : "One stop"}
                </span>
                <span className="min-w-0 flex-[3_1_280px] text-[15px] text-pretty text-ink-muted">{r.note}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 mb-0 max-w-[760px] text-[13px] text-ink-subtle">
          Schedules change by season. We suggest the city based on the hospitals suited to your treatment, then help
          you plan flights around admission dates.
        </p>
      </Container>
    </section>
  );
}

function CountryNotes({ page }: { page: SourceCountryPage }) {
  return (
    <section aria-labelledby="country-notes" className="section-y-sm bg-sand">
      <Container>
        <Eyebrow>Before you travel</Eyebrow>
        <h2 id="country-notes" className="text-h2-sm mb-[clamp(28px,4vw,44px)] max-w-[760px]">
          Practical notes for travelling from {page.country}
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {page.notes.map((n) => (
            <div key={n.title} className="rounded-[20px] border border-line bg-surface p-[22px]">
              <h3 className="mt-0 mb-2 text-lg font-medium">{n.title}</h3>
              <p className="m-0 text-[15px] text-pretty text-ink-muted">{n.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function TreatmentLinks({ page }: { page: SourceCountryPage }) {
  const indiaGuides = publishedIndiaPages.filter((p): p is IndiaTreatmentPage => p.kind === "treatment");
  return (
    <section aria-labelledby="country-treatments" className="section-y-sm">
      <Container>
        <Eyebrow>Treatment guides</Eyebrow>
        <h2 id="country-treatments" className="text-h2-sm mb-4 max-w-[760px]">
          Treatments you can explore in India
        </h2>
        <p className="mt-0 mb-7 max-w-[680px] text-base text-pretty text-ink-muted">
          Each guide explains the general approaches, typical hospital stay and what to prepare before sharing your
          reports. Options for {page.demonym} patients come from the hospitals&apos; own assessments.
        </p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
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
        {indiaGuides.length ? (
          <p className="mt-6 mb-0 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px]">
            <span className="text-ink-muted">In India:</span>
            {indiaGuides.map((g) => (
              <Link key={g.slug} href={`/india/${g.slug}`} className="inline-flex items-center gap-1 text-brand">
                {g.label}
                <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </Link>
            ))}
          </p>
        ) : null}
      </Container>
    </section>
  );
}

function CountrySources({ page }: { page: SourceCountryPage }) {
  const others = publishedSourceCountryPages.filter((p) => p.slug !== page.slug);
  return (
    <section aria-labelledby="country-sources" className="pt-[clamp(56px,7vw,96px)]">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-16 gap-y-10">
        <div>
          <h2 id="country-sources" className="mt-0 mb-4 text-[20px] font-medium">
            Sources
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
            {page.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="noopener" target="_blank" className="inline-flex items-start gap-1.5 text-ink-muted hover:text-brand">
                  <ExternalLink aria-hidden="true" className="mt-[3px] size-3.5 shrink-0" strokeWidth={1.75} />
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 mb-0 text-[13px] text-ink-subtle">
            TreatVero is a medical travel facilitator, not a hospital or a visa agent. This guide is general travel
            information, not medical or immigration advice.
          </p>
        </div>
        {others.length ? (
          <nav aria-labelledby="other-countries">
            <h2 id="other-countries" className="mt-0 mb-4 text-[20px] font-medium">
              Guides for other countries
            </h2>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/from/${o.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm text-ink no-underline hover:border-brand hover:text-ink">
                    Patients from {o.country}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </Container>
    </section>
  );
}
