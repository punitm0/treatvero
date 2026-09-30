import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Doctor } from "@/types";
import { doctorInitials } from "@/data/doctors";
import { getHospital, hospitalPlace } from "@/data/hospitals";
import { enquiryHref } from "@/lib/enquiry-link";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button";

/** Doctor photo, or their initials on a tinted tile when there is no photo. */
export function DoctorAvatar({ doctor: d, size, className }: { doctor: Doctor; size: number; className?: string }) {
  return (
    <span
      className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-brand-tint text-brand", className)}
      style={{ width: size, height: size }}
    >
      {d.photo ? (
        <Image src={d.photo} alt={`${d.name}`} fill sizes={`${size}px`} className="object-cover object-top" />
      ) : (
        <span aria-hidden="true" className="font-serif" style={{ fontSize: Math.round(size * 0.36) }}>
          {doctorInitials(d)}
        </span>
      )}
    </span>
  );
}

/** Doctor card for listings, hospital and treatment pages. */
export function DoctorCard({
  doctor: d,
  showHospital = true,
  headingLevel = "h3",
}: {
  doctor: Doctor;
  showHospital?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  const h = getHospital(d.hospital)!;
  return (
    <article className="group flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-[22px] transition-[border-color,box-shadow] duration-200 hover:border-brand-line hover:shadow-lift">
      <div className="flex items-start gap-4">
        <DoctorAvatar doctor={d} size={72} />
        <div className="min-w-0">
          <H className="m-0 text-[17px] font-medium">
            <Link href={`/doctors/${d.slug}`} className="text-ink no-underline hover:text-brand">
              {d.name}
            </Link>
          </H>
          <p className="mt-1 mb-0 text-sm text-pretty text-ink-muted">{d.designation}</p>
        </div>
      </div>
      <dl className="m-0 flex flex-col gap-2 text-sm">
        {d.qualifications.length ? (
          <div>
            <dt className="sr-only">Qualifications</dt>
            <dd className="m-0 line-clamp-2 text-ink-muted">{d.qualifications.join(", ")}</dd>
          </div>
        ) : null}
        {d.experience ? (
          <div className="flex gap-1.5">
            <dt className="text-ink-subtle">Experience:</dt>
            <dd className="m-0">{d.experience}</dd>
          </div>
        ) : null}
        {showHospital ? (
          <div>
            <dt className="sr-only">Hospital</dt>
            <dd className="m-0 flex items-start gap-1 text-ink-muted">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              <span>
                <Link href={`/hospitals/${h.slug}`} className="text-ink-muted hover:text-brand">
                  {h.name}
                </Link>
                , {hospitalPlace(h)}
              </span>
            </dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4">
        <Link href={`/doctors/${d.slug}`} className="text-sm font-medium no-underline">
          View profile
        </Link>
        <Link
          href={enquiryHref({ hospital: d.hospital, doctor: d.slug })}
          className={buttonClasses({ variant: "outline", size: "sm", className: "h-11 px-4" })}
        >
          Request Opinion
        </Link>
      </div>
    </article>
  );
}
