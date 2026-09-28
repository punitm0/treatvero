import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Hospital } from "@/types";
import { getCity } from "@/data/destinations";
import { getTreatmentOrThrow } from "@/data/treatments";
import { hospitalImage } from "@/data/hospitals";
import { ENQUIRY_PATH } from "@/lib/config";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button";
import { SampleBadge } from "@/components/ui/primitives";

function specialtyLine(h: Hospital) {
  return h.specialties.map((s) => getTreatmentOrThrow(s).shortName).join(" · ");
}

function Accreditations({ h }: { h: Hospital }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-ink-subtle">Accreditations:</span>
      <span className="rounded-md border border-line px-2 py-0.5 text-xs font-medium">{h.accreditations.join(" · ")}</span>
    </div>
  );
}

/** Large card with photo — homepage/treatment pages. */
export function HospitalCard({ hospital: h, headingLevel = "h3" }: { hospital: Hospital; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface">
      <div className="relative aspect-video bg-[#e8e4dc]">
        <Image src={hospitalImage(h)} alt="" fill sizes="(min-width: 1100px) 400px, (min-width: 700px) 50vw, 100vw" className="object-cover" />
        {h.isSample ? <SampleBadge className="absolute top-3.5 left-3.5">Sample listing</SampleBadge> : null}
      </div>
      <div className="flex flex-1 flex-col gap-3.5 p-[22px]">
        <div>
          <H className="m-0 text-lg font-medium tracking-[-0.01em]">
            <Link href={`/hospitals/${h.slug}`} className="text-ink no-underline hover:text-brand">
              {h.name}
            </Link>
          </H>
          <p className="mt-1 mb-0 flex items-center gap-1 text-sm text-ink-muted">
            <MapPin aria-hidden="true" className="size-4" strokeWidth={1.75} />
            {getCity(h.city).name}
          </p>
        </div>
        <Accreditations h={h} />
        <p className="m-0 text-sm text-ink-muted">{specialtyLine(h)}</p>
        <div className="flex-1" />
        <div className="flex items-center justify-between gap-3 border-t border-line-soft pt-4">
          <span className="text-xs text-ink-subtle">{h.isConfirmedPartner ? "TreatVero partner" : "Independent listing"}</span>
          <Link href={ENQUIRY_PATH} className={buttonClasses({ variant: "outline", size: "sm", className: "h-11 px-4" })}>
            Request Options
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Compact card with thumbnail — India page / hospital listing. */
export function HospitalCardCompact({ hospital: h, className }: { hospital: Hospital; className?: string }) {
  return (
    <article className={cn("flex flex-col gap-3.5 rounded-[20px] border border-line bg-surface p-[22px]", className)}>
      <div className="flex items-center gap-3.5">
        <span className="relative block size-14 shrink-0 overflow-hidden rounded-[14px] bg-[#e8e4dc]">
          <Image src={hospitalImage(h)} alt="" fill sizes="56px" className="object-cover" />
        </span>
        <div className="min-w-0">
          <h3 className="m-0 text-[17px] font-medium">
            <Link href={`/hospitals/${h.slug}`} className="text-ink no-underline hover:text-brand">
              {h.name}
            </Link>
          </h3>
          <p className="m-0 flex items-center gap-1 text-sm text-ink-muted">
            <MapPin aria-hidden="true" className="size-4" strokeWidth={1.75} />
            {getCity(h.city).name}
          </p>
        </div>
      </div>
      <Accreditations h={h} />
      <p className="m-0 text-sm text-ink-muted">{specialtyLine(h)}</p>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-soft pt-3.5">
        {h.isSample ? <SampleBadge>Sample listing</SampleBadge> : <span />}
        <Link href={ENQUIRY_PATH} className={buttonClasses({ variant: "outline", size: "sm", className: "h-11 px-4" })}>
          Request Options
        </Link>
      </div>
    </article>
  );
}
