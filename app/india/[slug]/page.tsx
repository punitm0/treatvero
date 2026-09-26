import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getIndiaPage, publishedIndiaPages, type IndiaCityPage } from "@/data/seo-pages";
import { getCity } from "@/data/destinations";
import { getTreatmentOrThrow } from "@/data/treatments";
import { hospitals } from "@/data/hospitals";
import { indiaFaqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Eyebrow, SampleBadge } from "@/components/ui/primitives";
import { TreatmentGuide } from "@/components/treatments/treatment-guide";
import { HospitalCardCompact } from "@/components/hospitals/hospital-card";
import { IndiaStayAndJourney, IndiaVisa } from "@/components/destinations/india-sections";
import { FaqSection } from "@/components/home/faq-section";
import { CenteredCta } from "@/components/home/centered-cta";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedIndiaPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/india/[slug]">): Promise<Metadata> {
  const page = getIndiaPage((await params).slug);
  if (!page) return {};
  if (page.kind === "treatment") {
    const t = getTreatmentOrThrow(page.treatment);
    return pageMetadata({
      title: `${page.label} in India — Treatment Options`,
      description: `Explore ${page.label.toLowerCase()} options in India: general approaches, typical stays, cost factors and how TreatVero coordinates your journey. ${t.summary}`,
      path: `/india/${page.slug}`,
    });
  }
  const city = getCity(page.city);
  return pageMetadata({
    title: `Medical Treatment in ${city.name}, India`,
    description: `Explore hospital options in ${city.name} and get help coordinating appointments, medical visas, accommodation and airport pickup with TreatVero.`,
    path: `/india/${page.slug}`,
  });
}

export default async function IndiaSubPage({ params }: PageProps<"/india/[slug]">) {
  const page = getIndiaPage((await params).slug);
  if (!page) notFound();

  if (page.kind === "treatment") {
    const t = getTreatmentOrThrow(page.treatment);
    return (
      <TreatmentGuide
        treatment={t}
        context="in India"
        title={
          <>
            {page.label} in India, <em className="text-brand">coordinated for you.</em>
          </>
        }
        crumbs={[
          { name: "India", path: "/india" },
          { name: page.label, path: `/india/${page.slug}` },
        ]}
        extraFaqs={indiaFaqs.slice(0, 2)}
      />
    );
  }
  return <CityPage page={page} />;
}

function CityPage({ page }: { page: IndiaCityPage }) {
  const city = getCity(page.city);
  const cityHospitals = hospitals.filter((h) => h.city === city.slug);
  return (
    <>
      <PageHero
        crumbs={[
          { name: "India", path: "/india" },
          { name: city.name, path: `/india/${page.slug}` },
        ]}
        eyebrow={`Healthcare city · ${city.airportCode}`}
        title={
          <>
            Medical treatment in {city.name}, <em className="text-brand">with support on the ground.</em>
          </>
        }
        lede={`${city.description} TreatVero helps you obtain options from suitable hospitals here and coordinates your visa, stay and transfers.`}
        aside={
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-line bg-[#e8e4dc]">
            <Image src={city.image} alt={`${city.name}, India`} fill preload sizes="(min-width: 1100px) 560px, 100vw" className="object-cover" />
          </div>
        }
      />
      {cityHospitals.length > 0 ? (
        <section aria-labelledby="city-hospitals" className="section-y-sm bg-sand">
          <Container>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Hospital options</Eyebrow>
                <h2 id="city-hospitals" className="text-h2-sm m-0">
                  Hospitals in {city.name}
                </h2>
              </div>
              {cityHospitals.some((h) => h.isSample) ? <SampleBadge>Sample listings — not partners</SampleBadge> : null}
            </div>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4 p-0">
              {cityHospitals.map((h) => (
                <li key={h.slug} className="grid">
                  <HospitalCardCompact hospital={h} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
      <IndiaVisa />
      <IndiaStayAndJourney />
      <FaqSection faqs={indiaFaqs} eyebrow="India FAQ" title="Travelling to India for treatment" />
      <CenteredCta title={`Get treatment options in ${city.name}.`} />
    </>
  );
}
