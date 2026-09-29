import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import type { FAQ, Hospital } from "@/types";
import { getHospital, getRelatedHospitals, hospitalImage, hospitalMapUrl, hospitals } from "@/data/hospitals";
import { getCity } from "@/data/destinations";
import { indiaCityPageHref } from "@/data/seo-pages";
import { getTreatmentOrThrow } from "@/data/treatments";
import { hospitalJsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/ui/json-ld";
import { HospitalCardCompact } from "@/components/hospitals/hospital-card";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";

export const dynamicParams = false;

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** "A, B and C" */
function listText(items: string[]) {
  return items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items.at(-1)}` : (items[0] ?? "");
}

function stationText(s: NonNullable<Hospital["nearestStation"]>) {
  return `${s.name} (${s.network}), about ${s.km} km away`;
}

function accreditationText(h: Hospital) {
  return h.accreditations.join(" & ");
}

function hospitalFaqs(h: Hospital): FAQ[] {
  const city = getCity(h.city);
  const treatmentNames = h.specialties.map((s) => getTreatmentOrThrow(s).name.toLowerCase());
  const faqs: FAQ[] = [];

  if (h.jci || h.nabh) {
    const records = [
      h.jci
        ? `appears in the Joint Commission International (JCI) directory as “${h.jci.listedAs}” (${h.jci.program}, effective ${formatDate(h.jci.effectiveDate)})`
        : null,
      h.nabh ? `holds NABH accreditation number ${h.nabh.number}` : null,
    ].filter((r) => r !== null);
    faqs.push({
      question: `Is ${h.name} ${accreditationText(h)} accredited?`,
      answer: `Yes. ${h.name} ${listText(records)}.Accreditation is renewed periodically.`,
    });
  }

  if (h.address || h.airportDistanceKm) {
    faqs.push({
      question: `Where is ${h.name}, and how far is it from the airport?`,
      answer: [
        h.address ? `${h.name} is at ${h.address}.` : null,
        h.airportDistanceKm
          ? `It is about ${h.airportDistanceKm} km by road from ${city.airportName} (${city.airportCode}); travel time depends on traffic.`
          : null,
        h.nearestStation ? `The nearest station is ${stationText(h.nearestStation)}.` : null,
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  if (h.established || h.history) {
    faqs.push({
      question: `When did ${h.name} open?`,
      answer: h.history ?? `${h.name} opened in ${h.established}.`,
    });
  }

  faqs.push({
    question: `Which treatments can I request at ${h.name} through TreatVero?`,
    answer: `You can request options for ${listText(treatmentNames)} at ${h.name}. Options are requested for your specific case, and the hospital confirms whether and how it can treat you after reviewing your reports.`,
  });

  faqs.push({
    question: `How do I get a treatment plan and cost estimate from ${h.name}?`,
    answer: `Share your requirement and medical reports through TreatVero. With your consent, we request a treatment plan and estimate from suitable hospitals in ${city.name}, which can include ${h.name}. TreatVero doesn't publish prices: estimates come from the hospital for your case.`,
  });

  if (!h.isConfirmedPartner) {
    faqs.push({
      question: `Is TreatVero part of ${h.name}?`,
      answer: `No. TreatVero is a medical travel facilitator, not a hospital, and has no agreement with ${h.name}. We request options from the hospital on your behalf.`,
    });
  }

  return faqs;
}

export function generateStaticParams() {
  return hospitals.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: PageProps<"/hospitals/[slug]">): Promise<Metadata> {
  const h = getHospital((await params).slug);
  if (!h) return {};
  const city = getCity(h.city);
  const specialties = h.specialties.slice(0, 4).map((s) => getTreatmentOrThrow(s).shortName.toLowerCase());
  return pageMetadata({
    title: `${h.name}, ${city.name} · ${accreditationText(h)} Accredited`,
    description: [
      `${accreditationText(h)} accredited hospital in ${city.name} for ${listText(specialties)} care${h.established ? `, open since ${h.established}` : ""}.`,
      h.airportDistanceKm ? `About ${h.airportDistanceKm} km from ${city.airportCode} airport.` : null,
      "Request treatment options through TreatVero.",
    ]
      .filter(Boolean)
      .join(" "),
    path: `/hospitals/${h.slug}`,
    image: h.image ? { path: h.image, alt: `${h.name}, ${city.name}` } : undefined,
  });
}

export default async function HospitalPage({ params }: PageProps<"/hospitals/[slug]">) {
  const h = getHospital((await params).slug);
  if (!h) notFound();
  const city = getCity(h.city);
  const cityHref = indiaCityPageHref(h.city);
  const mapUrl = hospitalMapUrl(h);
  const faqs = hospitalFaqs(h);
  const related = getRelatedHospitals(h);
  return (
    <>
      <JsonLd data={hospitalJsonLd(h)} />
      <PageHero
        crumbs={[
          { name: "Hospitals", path: "/hospitals" },
          { name: h.name, path: `/hospitals/${h.slug}` },
        ]}
        eyebrow={
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-ink-muted">
              <MapPin aria-hidden="true" className="size-4" strokeWidth={1.75} />
              {city.name}, India
            </span>
          </div>
        }
        title={h.name}
        lede={h.description}
        aside={
          <figure className="m-0">
            <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-line bg-[#e8e4dc]">
              <Image
                src={hospitalImage(h)}
                alt={h.image ? `${h.name}, ${city.name}` : ""}
                fill
                preload
                sizes="(min-width: 1100px) 560px, 100vw"
                className="object-cover"
              />
            </div>
            {h.image ? (
              h.imageCredit ? <figcaption className="mt-2 text-[13px] text-ink-subtle">{h.imageCredit}</figcaption> : null
            ) : (
              <figcaption className="mt-2 text-[13px] text-ink-subtle">{city.name}, India</figcaption>
            )}
          </figure>
        }
      />
      <section aria-label="Hospital details" className="pb-[clamp(56px,7vw,96px)]">
        {h.history || h.established || h.beds ? (
          <Container className="mb-[clamp(32px,4vw,48px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-x-20 gap-y-5">
            <h2 className="text-h2-sm m-0">About {h.name}</h2>
            <div>
              {h.history ? <p className="mt-0 mb-4 text-base text-pretty text-ink-muted">{h.history}</p> : null}
              {h.established || h.beds ? (
                <dl className="m-0 flex flex-wrap gap-x-10 gap-y-3">
                  {h.established ? (
                    <div>
                      <dt className="text-xs text-ink-subtle">Opened</dt>
                      <dd className="m-0 text-[15px]">{h.established}</dd>
                    </div>
                  ) : null}
                  {h.beds ? (
                    <div>
                      <dt className="text-xs text-ink-subtle">Beds (published)</dt>
                      <dd className="m-0 text-[15px]">{h.beds.toLocaleString("en-IN")}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
            </div>
          </Container>
        ) : null}
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          <div className="rounded-[20px] border border-line bg-surface p-[22px]">
            <h2 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">Accreditations</h2>
            <p className="m-0 text-[15px]">{h.accreditations.join(" · ")}</p>
            {h.jci || h.nabh ? (
              <dl className="mt-3 mb-0 flex flex-col gap-2.5 text-[15px]">
                {h.jci ? (
                  <div>
                    <dt className="text-xs text-ink-subtle">JCI directory</dt>
                    <dd className="m-0">
                      “{h.jci.listedAs}”, {h.jci.program}, effective {formatDate(h.jci.effectiveDate)}
                    </dd>
                  </div>
                ) : null}
                {h.nabh ? (
                  <div>
                    <dt className="text-xs text-ink-subtle">NABH accreditation no.</dt>
                    <dd className="m-0">{h.nabh.number}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </div>
          <div className="rounded-[20px] border border-line bg-surface p-[22px]">
            <h2 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">Specialties</h2>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {h.specialties.map((s) => {
                const t = getTreatmentOrThrow(s);
                return (
                  <li key={s}>
                    <Link href={`/treatments/${t.slug}`} className="flex items-center gap-2 text-[15px] text-ink no-underline hover:text-brand">
                      <Icon name={t.icon} className="size-5 text-brand" />
                      {t.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-[20px] border border-line bg-surface p-[22px]">
            <h2 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">Location</h2>
            <address className="m-0 text-[15px] not-italic">{h.address ?? `${city.name}, India`}</address>
            <dl className="mt-3 mb-0 flex flex-col gap-2.5 text-[15px]">
              {h.airportDistanceKm ? (
                <div>
                  <dt className="text-xs text-ink-subtle">From the airport</dt>
                  <dd className="m-0">
                    About {h.airportDistanceKm} km by road from {city.airportName} ({city.airportCode})
                  </dd>
                </div>
              ) : null}
              {h.nearestStation ? (
                <div>
                  <dt className="text-xs text-ink-subtle">Nearest station</dt>
                  <dd className="m-0">{stationText(h.nearestStation)}</dd>
                </div>
              ) : null}
            </dl>
            {h.isConfirmedPartner ? (
              <p className="mt-3 mb-0 text-[15px] text-ink-muted">TreatVero has a confirmed working agreement with this hospital.</p>
            ) : null}
            {mapUrl ? (
              <p className="mt-3 mb-0 text-[15px]">
                <a href={mapUrl} target="_blank" rel="noopener noreferrer nofollow">
                  View on map
                </a>
              </p>
            ) : null}
          </div>
        </Container>
        {h.geo ? (
          <Container className="mt-5">
            <p className="m-0 text-[13px] text-ink-subtle">
              Location, station and road distances from OpenStreetMap data © OpenStreetMap contributors.
            </p>
          </Container>
        ) : null}
      </section>

      {faqs.length > 0 ? <FaqSection faqs={faqs} eyebrow="Hospital FAQ" title={`${h.name}: common questions`} /> : null}

      {related.length > 0 ? (
        <section aria-labelledby="related-hospitals" className="section-y-sm">
          <Container>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Hospital options</Eyebrow>
                <h2 id="related-hospitals" className="text-h2-sm m-0">
                  {related.every((r) => r.city === h.city) ? `More hospitals in ${city.name}` : "Other hospitals to compare"}
                </h2>
              </div>
              {cityHref ? (
                <Link href={cityHref} className="text-[15px] font-medium no-underline">
                  Medical treatment in {city.name}
                </Link>
              ) : null}
            </div>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4 p-0">
              {related.map((r) => (
                <li key={r.slug} className="grid">
                  <HospitalCardCompact hospital={r} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <FinalCta title={`Request options from ${h.name} and similar hospitals.`} />
    </>
  );
}
