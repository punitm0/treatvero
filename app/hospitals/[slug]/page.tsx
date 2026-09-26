import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getHospital, hospitals } from "@/data/hospitals";
import { getCity } from "@/data/destinations";
import { getTreatmentOrThrow } from "@/data/treatments";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container, SampleBadge } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { FinalCta } from "@/components/home/final-cta";

export const dynamicParams = false;

export function generateStaticParams() {
  return hospitals.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: PageProps<"/hospitals/[slug]">): Promise<Metadata> {
  const h = getHospital((await params).slug);
  if (!h) return {};
  return pageMetadata({
    title: `${h.name}, ${getCity(h.city).name}`,
    description: `Hospital option in ${getCity(h.city).name}. Request treatment options through TreatVero.`,
    path: `/hospitals/${h.slug}`,
    // Sample listings must never be indexed.
    noindex: h.isSample,
  });
}

export default async function HospitalPage({ params }: PageProps<"/hospitals/[slug]">) {
  const h = getHospital((await params).slug);
  if (!h) notFound();
  const city = getCity(h.city);
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Hospitals", path: "/hospitals" },
          { name: h.name, path: `/hospitals/${h.slug}` },
        ]}
        eyebrow={
          <div className="mb-5 flex flex-wrap items-center gap-3">
            {h.isSample ? <SampleBadge>Sample listing — not a real hospital</SampleBadge> : null}
            <span className="flex items-center gap-1 text-sm text-ink-muted">
              <MapPin aria-hidden="true" className="size-4" strokeWidth={1.75} />
              {city.name}, India
            </span>
          </div>
        }
        title={h.name}
        lede={h.description}
        aside={
          <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-line bg-[#e8e4dc]">
            <Image src={h.image} alt="" fill preload sizes="(min-width: 1100px) 560px, 100vw" className="object-cover" />
          </div>
        }
      />
      <section aria-label="Hospital details" className="pb-[clamp(56px,7vw,96px)]">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          <div className="rounded-[20px] border border-line bg-surface p-[22px]">
            <h2 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">Accreditations</h2>
            <p className="m-0 text-[15px]">{h.accreditations.join(" · ")}</p>
            {h.isSample ? (
              <p className="mt-3 mb-0 text-[13px] text-ink-subtle">Illustrative only. Verified accreditations are shown on real listings.</p>
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
            <h2 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">Relationship</h2>
            <p className="m-0 text-[15px] text-ink-muted">
              {h.isConfirmedPartner
                ? "TreatVero has a confirmed working agreement with this hospital."
                : "Independent listing. TreatVero does not have a partnership with this hospital; options are requested on your behalf."}
            </p>
          </div>
        </Container>
      </section>
      <FinalCta title="Request options for your case." />
    </>
  );
}
