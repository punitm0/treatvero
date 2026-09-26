import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSourceCountryPage, publishedSourceCountryPages } from "@/data/seo-pages";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/primitives";
import { HowItWorks } from "@/components/home/how-it-works";
import { PricingSection } from "@/components/home/pricing-section";
import { FinalCta } from "@/components/home/final-cta";

/**
 * "Patients from <country>" pages. Only entries in data/seo-pages.ts that are
 * published AND have verified country-specific notes are generated; the rest
 * return 404 so no thin pages ship.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedSourceCountryPages.map((p) => ({ country: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/from/[country]">): Promise<Metadata> {
  const page = getSourceCountryPage((await params).country);
  if (!page) return {};
  return pageMetadata({
    title: `Medical Treatment in India for Patients from ${page.country}`,
    description: `How TreatVero helps patients from ${page.country} explore treatment options in India and coordinate visas, travel and on-ground support.`,
    path: `/from/${page.slug}`,
  });
}

export default async function FromCountryPage({ params }: PageProps<"/from/[country]">) {
  const page = getSourceCountryPage((await params).country);
  if (!page) notFound();
  return (
    <>
      <PageHero
        crumbs={[{ name: `Patients from ${page.country}`, path: `/from/${page.slug}` }]}
        eyebrow={`For patients from ${page.country}`}
        title={
          <>
            Treatment in India, <em className="text-brand">planned from {page.country}.</em>
          </>
        }
        lede="Explore treatment options and get help with hospitals, medical visas, travel and support on the ground."
      />
      <section aria-label="Country notes" className="pb-[clamp(56px,7vw,96px)]">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {page.notes.map((n) => (
            <div key={n.title} className="rounded-[20px] border border-line bg-surface p-[22px]">
              <h2 className="mt-0 mb-2 text-lg font-medium">{n.title}</h2>
              <p className="m-0 text-[15px] text-ink-muted">{n.text}</p>
            </div>
          ))}
        </Container>
      </section>
      <HowItWorks />
      <PricingSection />
      <FinalCta />
    </>
  );
}
