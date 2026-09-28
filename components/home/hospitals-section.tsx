import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hasSampleHospitals, hospitals } from "@/data/hospitals";
import { HospitalCard } from "@/components/hospitals/hospital-card";
import { Container, SplitHeading } from "@/components/ui/primitives";

export function HospitalsSection() {
  // First listing from each of the first three cities, so the home page shows a spread.
  const featured = hospitals.filter((h, i) => hospitals.findIndex((x) => x.city === h.city) === i).slice(0, 3);
  return (
    <section id="hospitals" aria-labelledby="hospitals-title" className="pt-[clamp(72px,9vw,128px)] pb-[clamp(40px,5vw,64px)]">
      <Container>
        <SplitHeading
          id="hospitals-title"
          eyebrow="Hospital options"
          title="Hospitals matched to your case, not to a list."
          className="mb-[clamp(36px,4vw,52px)]"
        >
          Treatment options may be sourced from leading hospitals based on your medical requirements. Every option shows
          its accreditations and what the estimate includes.
        </SplitHeading>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4 p-0">
          {featured.map((h) => (
            <li key={h.slug} className="grid">
              <HospitalCard hospital={h} />
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {hasSampleHospitals ? (
            <p className="m-0 max-w-[640px] text-[13px] text-ink-subtle">
              Listings shown are sample placeholders while verified hospital profiles are prepared. They do not indicate
              a partnership with TreatVero.
            </p>
          ) : (
            <p className="m-0 max-w-[640px] text-[13px] text-ink-subtle">
              Independent listings. A listing does not indicate a partnership with TreatVero.
            </p>
          )}
          <Link href="/hospitals" className="inline-flex items-center gap-1.5 text-[15px] font-medium no-underline">
            Browse hospital options
            <ArrowRight aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
