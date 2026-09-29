import Link from "next/link";
import { Check, CircleHelp, Info } from "lucide-react";
import type { FAQ, Treatment } from "@/types";
import type { Crumb } from "@/lib/seo";
import { internationalPatientJourney } from "@/data/treatments";
import { getHospitalsForTreatment } from "@/data/hospitals";
import { getCity } from "@/data/destinations";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Eyebrow, Section } from "@/components/ui/primitives";
import { HospitalCard } from "@/components/hospitals/hospital-card";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";

export function TreatmentGuide({
  treatment: t,
  crumbs,
  title,
  lede,
  extraFaqs = [],
  context,
}: {
  treatment: Treatment;
  crumbs: Crumb[];
  title?: React.ReactNode;
  lede?: string;
  extraFaqs?: FAQ[];
  /** Optional destination framing, e.g. "in India". */
  context?: string;
}) {
  const allHospitalOptions = getHospitalsForTreatment(t.slug);
  const hospitalOptions = allHospitalOptions.slice(0, 3);
  const moreHospitalOptions = allHospitalOptions.slice(3);
  const faqs = [...t.faqs, ...extraFaqs];

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={
          <span className="mb-6 flex size-[52px] items-center justify-center rounded-[14px] bg-brand-tint text-brand">
            <Icon name={t.icon} className="size-7" />
          </span>
        }
        title={title ?? t.name}
        lede={lede ?? t.overview[0]}
        aside={
          <aside aria-label="At a glance" className="rounded-[20px] border border-line bg-surface p-[clamp(22px,2.6vw,30px)]">
            <p className="label-mono mb-4 text-ink-subtle">At a glance</p>
            <dl className="m-0 flex flex-col">
              <div className="border-t border-line-soft py-3.5">
                <dt className="text-xs text-ink-subtle">Typical hospital stay</dt>
                <dd className="m-0 text-[15px]">{t.typicalStay.hospital}</dd>
              </div>
              <div className="border-t border-line-soft py-3.5">
                <dt className="text-xs text-ink-subtle">Typical time {context ?? "in the country"}</dt>
                <dd className="m-0 text-[15px]">{t.typicalStay.inCountry}</dd>
              </div>
              <div className="border-t border-line-soft py-3.5">
                <dt className="text-xs text-ink-subtle">Estimate</dt>
                <dd className="m-0 text-[15px]">Requested from hospitals for your case</dd>
              </div>
            </dl>
            <p className="mt-2 mb-0 flex items-start gap-2 text-[13px] text-ink-subtle">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              General guide only. {t.typicalStay.note ?? "Your treating hospital confirms timings in its plan."}
            </p>
          </aside>
        }
      />

      {/* Overview + reasons */}
      <Section tone="white" aria-labelledby="overview">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-x-20 gap-y-10">
          <div>
            <Eyebrow>Overview</Eyebrow>
            <h2 id="overview" className="text-h2-sm mb-5">
              Understanding {t.name.toLowerCase()} {context ?? "abroad"}
            </h2>
            {t.overview.map((p) => (
              <p key={p} className="mt-0 mb-4 text-base text-pretty text-ink-muted">
                {p}
              </p>
            ))}
          </div>
          <div>
            <h3 className="mt-0 mb-4 text-lg font-medium">Common reasons patients seek this treatment</h3>
            <ul className="m-0 list-none p-0">
              {t.commonReasons.map((r) => (
                <li key={r} className="flex gap-3 border-t border-line py-3.5 text-[15px]">
                  <Check aria-hidden="true" className="size-5 shrink-0 text-brand" strokeWidth={2} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Approaches */}
      <Section aria-labelledby="approaches">
        <Container>
          <div className="mb-[clamp(36px,4vw,52px)] max-w-[720px]">
            <Eyebrow>General treatment approaches</Eyebrow>
            <h2 id="approaches" className="text-h2-sm mb-4">
              How specialists commonly approach it
            </h2>
            <p className="m-0 text-base text-ink-muted">
              A general overview — not a recommendation. Which approach suits you is decided by your treating doctors.
            </p>
          </div>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3 p-0">
            {t.approaches.map((a, i) => (
              <li key={a.name} className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-surface p-[22px]">
                <span className="font-mono text-xs text-brand">0{i + 1}</span>
                <h3 className="m-0 text-[17px] leading-[1.3] font-medium">{a.name}</h3>
                <p className="m-0 text-sm text-pretty text-ink-muted">{a.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Journey + cost factors */}
      <Section tone="sand" aria-label="Journey and cost">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-20 gap-y-14">
          <div>
            <Eyebrow>Typical international-patient journey</Eyebrow>
            <h2 className="text-h3-lg mb-6">From first message to follow-up</h2>
            <ol className="m-0 list-none p-0">
              {internationalPatientJourney.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3 border-t border-line-strong py-4">
                  <span className="pt-0.5 font-mono text-[13px] text-brand">0{i + 1}</span>
                  <div>
                    <h3 className="m-0 text-base font-medium">{s.title}</h3>
                    <p className="m-0 text-sm text-ink-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <Eyebrow>Factors affecting cost</Eyebrow>
              <h2 className="text-h3-lg mb-4">Why estimates differ</h2>
              <p className="mb-5 text-base text-ink-muted">
                TreatVero doesn&apos;t publish prices. Hospitals prepare estimates for your specific case, and these
                factors usually explain the differences:
              </p>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {t.costFactors.map((f) => (
                  <li key={f} className="flex gap-3 text-[15px]">
                    <span aria-hidden="true" className="mt-2.5 block size-1.5 shrink-0 rounded-full bg-brand" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[18px] border border-line bg-surface p-[22px]">
              <h3 className="mt-0 mb-3 text-base font-medium">Reports hospitals commonly ask for</h3>
              <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-ink-muted">
                {t.usefulReports.map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <Check aria-hidden="true" className="size-4 shrink-0 translate-y-0.5 text-brand" strokeWidth={2} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Questions */}
      <Section aria-labelledby="questions">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-x-20 gap-y-10">
          <div>
            <Eyebrow>Questions to ask a doctor</Eyebrow>
            <h2 id="questions" className="text-h2-sm mb-5">
              Better questions, clearer decisions.
            </h2>
            <p className="m-0 text-base text-pretty text-ink-muted">
              Bring these to your consultations. Your coordinator can help arrange follow-up calls with the treating
              team if anything is unclear.
            </p>
          </div>
          <ul className="m-0 list-none p-0">
            {t.questionsForDoctor.map((q) => (
              <li key={q} className="flex gap-4 border-t border-line py-[18px] text-base">
                <CircleHelp aria-hidden="true" className="size-[22px] shrink-0 text-brand" strokeWidth={1.75} />
                {q}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Hospital options */}
      {hospitalOptions.length > 0 ? (
        <Section tone="white" aria-labelledby="hospital-options">
          <Container>
            <div className="mb-[clamp(36px,4vw,52px)] flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[640px]">
                <Eyebrow>Hospital options</Eyebrow>
                <h2 id="hospital-options" className="text-h2-sm m-0">
                  Hospitals with relevant specialties
                </h2>
              </div>
              <Link href="/hospitals" className="text-[15px] font-medium no-underline">
                View all hospital options
              </Link>
            </div>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4 p-0">
              {hospitalOptions.map((h) => (
                <li key={h.slug} className="grid">
                  <HospitalCard hospital={h} />
                </li>
              ))}
            </ul>
            {moreHospitalOptions.length > 0 ? (
              <div className="mt-8">
                <h3 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">Also listed for {t.name.toLowerCase()}</h3>
                <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-x-6 gap-y-2.5 p-0">
                  {moreHospitalOptions.map((h) => (
                    <li key={h.slug} className="text-[15px]">
                      <Link href={`/hospitals/${h.slug}`} className="text-ink no-underline hover:text-brand">
                        {h.name}
                      </Link>
                      <span className="text-ink-subtle">, {getCity(h.city).name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Container>
        </Section>
      ) : null}

      <FaqSection faqs={faqs} title={`${t.name}: common questions`} />
      <FinalCta
        title={`Explore ${t.name.toLowerCase()} options ${context ?? "abroad"}.`}
        text="Share your requirement and reports. With your consent, we'll help you obtain options from suitable hospitals — and plan everything around your care."
      />
    </>
  );
}
