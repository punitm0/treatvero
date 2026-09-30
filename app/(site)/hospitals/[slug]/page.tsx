import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import type { FAQ, Hospital } from "@/types";
import {
  getHospital,
  getRelatedHospitals,
  hospitalImage,
  hospitalMapUrl,
  hospitalPlace,
  hospitals,
  hotelsNearUrl,
} from "@/data/hospitals";
import { getCity } from "@/data/destinations";
import { indiaCityPageHref } from "@/data/seo-pages";
import { getTreatmentOrThrow } from "@/data/treatments";
import { getDoctorsForHospital } from "@/data/doctors";
import { hospitalJsonLd, pageMetadata } from "@/lib/seo";
import { enquiryHref } from "@/lib/enquiry-link";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/ui/whatsapp-link";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/ui/json-ld";
import { HospitalCardCompact } from "@/components/hospitals/hospital-card";
import { HospitalGallery } from "@/components/hospitals/hospital-gallery";
import { SectionNav } from "@/components/hospitals/section-nav";
import { DoctorCard } from "@/components/doctors/doctor-card";
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
      answer: `Yes. ${h.name} ${listText(records)}. Accreditation is renewed periodically.`,
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

  const listedDoctors = getDoctorsForHospital(h.slug);
  if (listedDoctors.length) {
    faqs.push({
      question: `Can I ask for a specific doctor at ${h.name}?`,
      answer: `Yes. Name the doctor in your request, for example ${listText(listedDoctors.slice(0, 2).map((d) => d.name))}, and we'll ask ${h.name} for their opinion on your case. The hospital confirms the doctor's availability.`,
    });
  }

  if (h.icuBeds || h.operationTheatres) {
    faqs.push({
      question: `How many ${listText([h.icuBeds ? "ICU beds" : null, h.operationTheatres ? "operation theatres" : null].filter((x) => x !== null))} does ${h.name} have?`,
      answer: `${h.name} publishes ${listText(
        [
          h.beds ? `${h.beds.toLocaleString("en-IN")} beds` : null,
          h.icuBeds ? `${h.icuBeds.toLocaleString("en-IN")} ICU beds` : null,
          h.operationTheatres ? `${h.operationTheatres} operation theatres` : null,
        ].filter((x) => x !== null),
      )}.`,
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
  const place = hospitalPlace(h);
  const city = getCity(h.city);
  const specialties = h.specialties.slice(0, 4).map((s) => getTreatmentOrThrow(s).shortName.toLowerCase());
  return pageMetadata({
    title: `${h.name}, ${place} · ${accreditationText(h)} Accredited`,
    description: [
      `${accreditationText(h)} accredited hospital in ${place} for ${listText(specialties)} care${h.established ? `, open since ${h.established}` : ""}.`,
      h.airportDistanceKm ? `About ${h.airportDistanceKm} km from ${city.airportCode} airport.` : null,
      "Request treatment options through TreatVero.",
    ]
      .filter(Boolean)
      .join(" "),
    path: `/hospitals/${h.slug}`,
    image: h.image ? { path: h.image, alt: `${h.name}, ${place}` } : undefined,
  });
}

export default async function HospitalPage({ params }: PageProps<"/hospitals/[slug]">) {
  const h = getHospital((await params).slug);
  if (!h) notFound();
  const city = getCity(h.city);
  const place = hospitalPlace(h);
  const cityHref = indiaCityPageHref(h.city);
  const mapUrl = hospitalMapUrl(h);
  const faqs = hospitalFaqs(h);
  const related = getRelatedHospitals(h);
  const hospitalDoctors = getDoctorsForHospital(h.slug);
  const requestHref = enquiryHref({ hospital: h.slug });
  const photos = h.gallery?.length
    ? [...(h.image ? [{ src: h.image, alt: `${h.name}, ${place}`, credit: h.imageCredit }] : []), ...h.gallery]
    : [];
  const facts = [
    h.established ? { label: "Opened", value: String(h.established) } : null,
    h.beds ? { label: "Beds (published)", value: h.beds.toLocaleString("en-IN") } : null,
    h.icuBeds ? { label: "ICU beds", value: h.icuBeds.toLocaleString("en-IN") } : null,
    h.operationTheatres ? { label: "Operation theatres", value: String(h.operationTheatres) } : null,
  ].filter((f) => f !== null);
  const hasAbout = Boolean(h.history || facts.length);
  const hasFacilities = Boolean(h.facilities?.length || h.internationalServices?.length);
  const sections = [
    hasAbout ? { id: "about", label: "About" } : null,
    hasFacilities ? { id: "facilities", label: "Facilities" } : null,
    { id: "treatments", label: "Treatments" },
    hospitalDoctors.length ? { id: "doctors", label: "Doctors" } : null,
    photos.length ? { id: "gallery", label: "Photos" } : null,
    { id: "visit", label: "Location & travel" },
    faqs.length ? { id: "faq", label: "FAQ" } : null,
  ].filter((x) => x !== null);
  const sectionClass = "scroll-mt-[140px] pb-[clamp(56px,7vw,96px)]";

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
              {place}, India
            </span>
            <span className="rounded-md border border-line px-2 py-0.5 text-xs font-medium">{h.accreditations.join(" · ")}</span>
          </div>
        }
        title={h.name}
        lede={h.description}
        ctaHref={requestHref}
        ctaLabel="Request Options"
        aside={
          <figure className="m-0">
            <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-line bg-[#e8e4dc]">
              <Image
                src={hospitalImage(h)}
                alt={h.image ? `${h.name}, ${place}` : ""}
                fill
                preload
                sizes="(min-width: 1100px) 560px, 100vw"
                className="object-cover"
              />
              {photos.length > 1 ? (
                <a
                  href="#gallery"
                  className="absolute right-3 bottom-3 rounded-full bg-surface/95 px-3.5 py-2 text-sm font-medium text-ink no-underline shadow-lift hover:text-brand"
                >
                  View all {photos.length} photos
                </a>
              ) : null}
            </div>
            {h.image ? (
              h.imageCredit ? <figcaption className="mt-2 text-[13px] text-ink-subtle">{h.imageCredit}</figcaption> : null
            ) : (
              <figcaption className="mt-2 text-[13px] text-ink-subtle">{city.name}, India</figcaption>
            )}
          </figure>
        }
      />

      <SectionNav items={sections} />

      <section id="about" aria-label="Hospital details" className={sectionClass}>
        {hasAbout ? (
          <Container className="mb-[clamp(32px,4vw,48px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-x-20 gap-y-5">
            <h2 className="text-h2-sm m-0">About {h.name}</h2>
            <div>
              {h.history ? <p className="mt-0 mb-5 text-base text-pretty text-ink-muted">{h.history}</p> : null}
              {facts.length ? (
                <dl className="m-0 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
                  {facts.map((f) => (
                    <div key={f.label} className="rounded-2xl border border-line bg-surface px-4 py-3.5">
                      <dt className="text-xs text-ink-subtle">{f.label}</dt>
                      <dd className="m-0 mt-1 font-serif text-[26px] leading-none">{f.value}</dd>
                    </div>
                  ))}
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
            <h2 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">Location</h2>
            <address className="m-0 text-[15px] not-italic">{h.address ?? `${place}, India`}</address>
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
      </section>

      {hasFacilities ? (
        <section id="facilities" aria-labelledby="hospital-facilities" className={sectionClass}>
          <Container>
            <Eyebrow>Infrastructure</Eyebrow>
            <h2 id="hospital-facilities" className="text-h2-sm mt-0 mb-7">
              Facilities and services
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-4">
              {h.facilities?.length ? (
                <div className="rounded-[20px] border border-line bg-surface p-[22px]">
                  <h3 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">Technology & facilities</h3>
                  <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[15px]">
                    {h.facilities.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {h.internationalServices?.length ? (
                <div className="rounded-[20px] border border-line bg-surface p-[22px]">
                  <h3 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">For international patients</h3>
                  <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[15px]">
                    {h.internationalServices.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 mb-0 text-[13px] text-ink-subtle">
                    As listed by the hospital. TreatVero coordinates with the international desk for you.
                  </p>
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      <section id="treatments" aria-labelledby="hospital-treatments" className={sectionClass}>
        <Container>
          <Eyebrow>Specialties</Eyebrow>
          <h2 id="hospital-treatments" className="text-h2-sm mt-0 mb-7">
            Treatments at {h.name}
          </h2>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4 p-0">
            {h.specialties.map((s) => {
              const t = getTreatmentOrThrow(s);
              const note = h.specialtyNotes?.[s];
              return (
                <li key={s} className="rounded-[20px] border border-line bg-surface p-[22px]">
                  <h3 className="m-0 text-[17px] font-medium">
                    <Link href={`/treatments/${t.slug}`} className="flex items-center gap-2 text-ink no-underline hover:text-brand">
                      <Icon name={t.icon} className="size-5 shrink-0 text-brand" />
                      {t.name}
                    </Link>
                  </h3>
                  {note ? <p className="mt-2.5 mb-0 text-[15px] text-pretty text-ink-muted">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="request-panel" className="pb-[clamp(56px,7vw,96px)]">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-brand-line bg-brand-tint px-[clamp(22px,4vw,44px)] py-[clamp(24px,3.5vw,36px)]">
            <div className="max-w-[620px]">
              <h2 id="request-panel" className="mt-0 mb-2 text-[clamp(22px,2.4vw,28px)] font-medium tracking-[-0.01em]">
                Get a treatment plan and estimate from {h.name}
              </h2>
              <p className="m-0 text-[15px] text-pretty text-ink-muted">
                Share your reports once. With your consent, we send your case to the hospital&apos;s international desk and
                bring back the doctor&apos;s opinion, a treatment plan and a cost estimate.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={requestHref} size="md">
                Request Options
              </ButtonLink>
              <WhatsAppButton size="md" className="px-5" />
            </div>
          </div>
        </Container>
      </section>

      {hospitalDoctors.length > 0 ? (
        <section id="doctors" aria-labelledby="hospital-doctors" className={sectionClass}>
          <Container>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Specialists</Eyebrow>
                <h2 id="hospital-doctors" className="text-h2-sm m-0">
                  Doctors at {h.name}
                </h2>
              </div>
              <Link href="/doctors" className="text-[15px] font-medium no-underline">
                Browse all doctors
              </Link>
            </div>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4 p-0">
              {hospitalDoctors.map((d) => (
                <li key={d.slug} className="grid">
                  <DoctorCard doctor={d} showHospital={false} />
                </li>
              ))}
            </ul>
            <p className="mt-5 mb-0 text-[13px] text-ink-subtle">
              A selection of senior specialists from the hospital&apos;s published doctor profiles. We can request an opinion
              from any doctor at the hospital.
            </p>
          </Container>
        </section>
      ) : null}

      {photos.length > 0 ? (
        <section id="gallery" aria-labelledby="hospital-gallery" className={sectionClass}>
          <Container>
            <Eyebrow>Gallery</Eyebrow>
            <h2 id="hospital-gallery" className="text-h2-sm mt-0 mb-7">
              Photos of {h.name}
            </h2>
            <HospitalGallery images={photos} hospitalName={h.name} />
          </Container>
        </section>
      ) : null}

      <section id="visit" aria-labelledby="plan-visit" className={sectionClass}>
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-x-20 gap-y-5">
          <h2 id="plan-visit" className="text-h2-sm m-0">
            Planning your visit
          </h2>
          <div>
            <dl className="m-0 flex flex-col gap-5">
              {h.airportDistanceKm ? (
                <div>
                  <dt className="text-xs text-ink-subtle">Arriving by air</dt>
                  <dd className="m-0 text-[15px]">
                    {h.name} is about {h.airportDistanceKm} km by road from {city.airportName} ({city.airportCode}). Travel time
                    depends on traffic, so allow extra time at peak hours.
                  </dd>
                </div>
              ) : null}
              {h.nearestStation ? (
                <div>
                  <dt className="text-xs text-ink-subtle">Nearest station</dt>
                  <dd className="m-0 text-[15px]">{stationText(h.nearestStation)} (straight-line distance).</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs text-ink-subtle">Staying nearby</dt>
                <dd className="m-0 text-[15px]">
                  Patients and companions often stay close to the hospital for follow-up visits.{" "}
                  <a href={hotelsNearUrl(h)} target="_blank" rel="noopener noreferrer nofollow">
                    See hotels near {h.name} on Google Maps
                  </a>
                  .
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-subtle">Help from TreatVero</dt>
                <dd className="m-0 text-[15px]">
                  With <Link href="/concierge">TreatVero Concierge</Link>, we coordinate your airport pickup, a stay near {h.name}, local
                  transport and visits to the hospital.
                </dd>
              </div>
            </dl>
            {h.geo ? (
              <p className="mt-5 mb-0 text-[13px] text-ink-subtle">
                Station and road distances from OpenStreetMap data © OpenStreetMap contributors.
              </p>
            ) : null}
          </div>
        </Container>
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
