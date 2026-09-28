import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Eyebrow, Section } from "@/components/ui/primitives";
import { WhySection } from "@/components/home/why-section";
import { TrustPoints } from "@/components/home/trust-section";
import { FinalCta } from "@/components/home/final-cta";

export const metadata = pageMetadata({
  title: "About TreatVero",
  description:
    "TreatVero is an independent medical travel facilitator and patient concierge. We coordinate the journey around your care — never the medical decisions.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About TreatVero"
        title={
          <>
            Medical travel, <em className="text-brand">made simple.</em>
          </>
        }
        lede="TreatVero helps international patients find treatment options abroad and coordinates the non-medical parts of their journey — hospitals, appointments, visas, accommodation, transfers and on-ground support."
      />
      <Section tone="white" aria-labelledby="what-we-do">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-x-20 gap-y-12">
          <div>
            <Eyebrow>Our role</Eyebrow>
            <h2 id="what-we-do" className="text-h2-sm mb-5">
              Your health journey deserves clarity.
            </h2>
            <p className="mt-0 mb-4 text-[17px] text-pretty text-ink-muted">
              Travelling for treatment means dealing with unfamiliar hospitals, paperwork and logistics at a time when
              you&apos;d rather focus on getting well. We exist to make that part calmer and more transparent.
            </p>
            <p className="m-0 text-[17px] text-pretty text-ink-muted">
              We&apos;re a paid, independent service. You pay us for coordination — never for a medical outcome — and
              treatment is paid directly to the hospital you choose. We&apos;re starting with India, with more
              destinations planned.
            </p>
          </div>
          <TrustPoints />
        </Container>
      </Section>
      <WhySection />
      <FinalCta />
    </>
  );
}
