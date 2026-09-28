import { cities } from "@/data/destinations";
import { hasSampleHospitals, hospitals } from "@/data/hospitals";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container, SampleBadge } from "@/components/ui/primitives";
import { HospitalCardCompact } from "@/components/hospitals/hospital-card";
import { HospitalsBrowser } from "@/components/hospitals/hospitals-browser";
import { ComparisonSection } from "@/components/home/comparison-section";

export const metadata = pageMetadata({
  title: "Hospital Options in India",
  description:
    "How TreatVero sources hospital options for international patients in India — by specialty, accreditation and city. Listings show accreditations, not rankings.",
  path: "/hospitals",
});

const criteria = [
  { title: "Your medical requirement", text: "Hospitals with the relevant specialty and experience for your treatment." },
  { title: "Accreditations", text: "Accreditations such as JCI or NABH are shown so you can check them yourself." },
  { title: "Your preferences", text: "Preferred city, timing, budget and any hospital or doctor you already have in mind." },
  { title: "Practical factors", text: "Availability, international patient services and travel connections." },
];

export default function HospitalsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Hospitals", path: "/hospitals" }]}
        eyebrow="Hospital options"
        title={
          <>
            Hospitals matched to your case, <em className="text-brand">not to a list.</em>
          </>
        }
        lede="Treatment options may be sourced from leading hospitals based on your medical requirements. We show accreditations, not rankings — and you always choose."
      />
      <section aria-labelledby="how-selected" className="pb-[clamp(56px,7vw,88px)]">
        <Container>
          <h2 id="how-selected" className="label-mono mb-5 font-normal text-ink-subtle">
            How options are selected
          </h2>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-10 gap-y-6 p-0">
            {criteria.map((c, i) => (
              <li key={c.title} className="border-t border-line-strong pt-5">
                <span className="font-mono text-xs text-brand">0{i + 1}</span>
                <h3 className="mt-2 mb-1.5 text-[17px] font-medium">{c.title}</h3>
                <p className="m-0 text-[15px] text-ink-muted">{c.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section aria-labelledby="listings" className="section-y-sm bg-sand">
        <Container>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <h2 id="listings" className="text-h2-sm m-0">
              Browse by city
            </h2>
            {hasSampleHospitals ? <SampleBadge>Sample listings — not partners</SampleBadge> : null}
          </div>
          {hasSampleHospitals ? (
            <p className="mt-0 mb-7 max-w-[760px] text-[15px] text-ink-muted">
              These placeholder listings show how hospital options are presented. They are not real hospitals and do
              not indicate any partnership with TreatVero. Verified profiles will replace them.
            </p>
          ) : (
            <p className="mt-0 mb-7 max-w-[760px] text-[15px] text-ink-muted">
              Independent listings of accredited hospitals. A listing does not mean a partnership with TreatVero — options
              are requested on your behalf, and we&apos;re not limited to the hospitals shown here.
            </p>
          )}
          <HospitalsBrowser
            cities={cities.map((c) => ({ slug: c.slug, name: c.name }))}
            cards={hospitals.map((h) => ({ key: h.slug, city: h.city, node: <HospitalCardCompact hospital={h} /> }))}
          />
        </Container>
      </section>
      <ComparisonSection />
    </>
  );
}
