import Image from "next/image";
import { indiaFaqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { StatusPill } from "@/components/ui/primitives";
import {
  IndiaCities,
  IndiaConciergeStrip,
  IndiaFacts,
  IndiaHospitals,
  IndiaSpecialties,
  IndiaStayAndJourney,
  IndiaVisa,
  WhyIndia,
} from "@/components/destinations/india-sections";
import { PricingSection } from "@/components/home/pricing-section";
import { FaqSection } from "@/components/home/faq-section";
import { CenteredCta } from "@/components/home/centered-cta";

export const metadata = pageMetadata({
  title: "Medical Treatment in India — Coordinated Start to Finish",
  description:
    "Explore treatment options in India across Delhi NCR, Mumbai, Chennai, Bengaluru, Hyderabad and Ahmedabad, with help coordinating hospitals, medical visas, accommodation and on-ground support.",
  path: "/india",
});

export default function IndiaPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "India", path: "/india" }]}
        eyebrow={<StatusPill className="mb-6">Available now</StatusPill>}
        title={
          <>
            Medical treatment in India, <em className="text-brand">coordinated from start to finish.</em>
          </>
        }
        lede="Options from hospitals across six major cities — plus help with your medical visa, stay, transfers and everything on the ground."
        aside={
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-line bg-[#e8e4dc]">
            <Image
              src="/images/india-hero.jpg"
              alt="A city skyline in India"
              fill
              preload
              sizes="(min-width: 1100px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        }
      >
        <IndiaFacts />
      </PageHero>
      <WhyIndia />
      <IndiaSpecialties />
      <IndiaHospitals />
      <IndiaCities />
      <IndiaVisa />
      <IndiaStayAndJourney />
      <IndiaConciergeStrip />
      <PricingSection />
      <FaqSection faqs={indiaFaqs} eyebrow="India FAQ" title="Travelling to India for treatment" />
      <CenteredCta title="Get treatment options in India." />
    </>
  );
}
