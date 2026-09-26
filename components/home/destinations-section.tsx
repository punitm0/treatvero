import Image from "next/image";
import { ArrowRight, Bell } from "lucide-react";
import { cityNames, comingSoonDestinations, destinations } from "@/data/destinations";
import { ENQUIRY_PATH } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { Chip, Container, Eyebrow, StatusPill } from "@/components/ui/primitives";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";

export function DestinationsSection() {
  const planned = destinations.filter((d) => d.status === "planned").map((d) => d.name);
  return (
    <section id="destinations" aria-labelledby="destinations-title" className="pb-[clamp(72px,9vw,128px)]">
      <Container>
        <div className="mb-[clamp(36px,4vw,52px)] max-w-[720px]">
          <Eyebrow>Destinations</Eyebrow>
          <h2 id="destinations-title" className="text-h2 m-0">
            Where would you like to receive care?
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,500px),1fr))] gap-4">
          <IndiaCard />
          <div className="flex flex-col gap-4">
            <ul className="m-0 grid flex-1 list-none grid-cols-2 gap-4 p-0">
              {comingSoonDestinations.map((d) => (
                <li
                  key={d.slug}
                  className="relative isolate flex min-h-[180px] flex-col gap-1.5 overflow-hidden rounded-[18px] bg-[#2a3533] p-[clamp(18px,2.2vw,26px)] text-white"
                >
                  {d.image ? (
                    <Image src={d.image} alt="" fill sizes="(min-width: 1100px) 300px, 50vw" className="-z-20 object-cover" />
                  ) : null}
                  <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(15,28,26,0.15)_0%,rgba(15,28,26,0.78)_100%)]" />
                  <span className="label-mono self-start rounded-md bg-[rgba(15,28,26,0.55)] px-2 py-1 text-white backdrop-blur-[6px]">
                    Coming soon
                  </span>
                  <span className="flex-1" />
                  <h3 className="m-0 font-serif text-[clamp(24px,2.4vw,30px)] leading-[1.1] font-normal tracking-[-0.01em]">
                    {d.name}
                  </h3>
                  <WhatsAppLink
                    message={`Hi TreatVero, please let me know when treatment coordination in ${d.name} becomes available.`}
                    className="flex items-center gap-1 text-sm text-white no-underline hover:text-ondark-soft"
                  >
                    Get notified
                    <Bell aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  </WhatsAppLink>
                </li>
              ))}
            </ul>
            <p className="m-0 px-1 text-sm text-ink-subtle">
              Also planned: {planned.join(" and ")}. Coming-soon destinations are not yet available for bookings.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function IndiaCard() {
  return (
    <article className="flex flex-col overflow-hidden rounded-[22px] border border-line bg-surface">
      <div className="relative aspect-[16/8] bg-[#e8e4dc]">
        <Image src="/images/india-card.jpg" alt="Mumbai skyline, India" fill sizes="(min-width: 1100px) 600px, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col gap-4 p-[clamp(24px,3vw,36px)]">
        <div className="flex items-center justify-between gap-3">
          <h3 className="m-0 font-serif text-[40px] leading-none font-normal tracking-[-0.02em]">India</h3>
          <StatusPill>Available now</StatusPill>
        </div>
        <p className="m-0 text-base text-pretty text-ink-muted">
          Explore treatment options with hospitals across cities such as Delhi NCR, Mumbai, Chennai, Bengaluru,
          Hyderabad and Ahmedabad.
        </p>
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {cityNames.map((c) => (
            <li key={c}>
              <Chip>{c}</Chip>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-wrap gap-2.5">
          <ButtonLink href="/india" variant="dark" size="md" className="gap-2">
            Explore India
            <ArrowRight aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
          </ButtonLink>
          <ButtonLink href={ENQUIRY_PATH} variant="outline" size="md">
            Get options in India
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
