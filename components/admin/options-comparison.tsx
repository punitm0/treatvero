import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";
import type { TreatmentOption } from "@/lib/admin/options";
import { getHospital, hospitalImage } from "@/data/hospitals";
import { formatCostRange, formatDate } from "@/components/admin/format";
import { cn } from "@/lib/utils";

/**
 * Side-by-side treatment options. Shared by the printable comparison (saved
 * as PDF from the admin) and the patient's private options page, so both
 * always show the same thing.
 */
export function OptionsComparison({ options, className }: { options: TreatmentOption[]; className?: string }) {
  const cols = options.length >= 3 ? "md:grid-cols-3 print:grid-cols-3" : options.length === 2 ? "md:grid-cols-2 print:grid-cols-2" : "";
  return (
    <ol className={cn("m-0 grid list-none gap-4 p-0 print:gap-3", cols, className)}>
      {options.map((o, i) => (
        <li key={o.id} className="print:break-inside-avoid">
          <OptionCard option={o} index={i} />
        </li>
      ))}
    </ol>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="flex flex-col gap-0.5 border-t border-line-soft py-2.5 print:py-1.5">
      <dt className="text-xs text-ink-subtle">{label}</dt>
      <dd className="m-0 text-sm leading-snug whitespace-pre-line">{children}</dd>
    </div>
  );
}

function OptionCard({ option: o, index }: { option: TreatmentOption; index: number }) {
  const hospital = o.hospital_slug ? getHospital(o.hospital_slug) : undefined;
  const cost = formatCostRange(o.cost_min, o.cost_max, o.currency);
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border bg-surface",
        o.recommended ? "border-brand ring-1 ring-brand" : "border-line",
      )}
    >
      {hospital ? (
        <div className="relative aspect-[16/7] bg-sand print:aspect-[16/6]">
          <Image src={hospitalImage(hospital)} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" loading="eager" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-4 print:p-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-mono text-xs text-ink-subtle">Option {String.fromCharCode(65 + index)}</span>
          {o.recommended ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-white">
              <Star aria-hidden="true" className="size-3" /> Our suggestion
            </span>
          ) : null}
        </div>
        <h3 className="m-0 text-[17px] leading-tight font-semibold">{o.hospital_name}</h3>
        {o.city ? <p className="mt-0.5 mb-0 text-sm text-ink-muted">{o.city}</p> : null}
        {hospital?.accreditations.length ? (
          <p className="mt-1.5 mb-0 flex flex-wrap items-center gap-1.5 text-xs text-brand">
            <BadgeCheck aria-hidden="true" className="size-3.5" />
            {hospital.accreditations.join(" · ")} accredited
          </p>
        ) : null}

        <div className="my-3 rounded-xl bg-brand-tint px-3 py-2.5 print:my-2">
          <p className="m-0 text-xs text-ink-subtle">Estimated treatment cost</p>
          <p className="m-0 text-lg font-semibold text-brand-deep">{cost ?? "To be confirmed"}</p>
        </div>

        <dl className="m-0 flex flex-col">
          <Row label="Procedure">{o.procedure_name}</Row>
          <Row label="Doctor">{o.doctor}</Row>
          <Row label="Hospital stay">{o.hospital_days}</Row>
          <Row label="Time in India">{o.total_days}</Row>
          <Row label="Included">{o.inclusions}</Row>
          <Row label="Not included">{o.exclusions}</Row>
          <Row label="Notes">{o.notes}</Row>
          <Row label="Estimate valid until">{o.valid_until ? formatDate(o.valid_until) : null}</Row>
        </dl>
      </div>
    </article>
  );
}

/** Disclaimer printed under every comparison. */
export function ComparisonNotes({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5 text-xs leading-relaxed text-ink-subtle", className)}>
      <p className="m-0">
        Costs are estimates provided by each hospital from the information and reports shared so far. The final cost is confirmed by
        the hospital after an in-person assessment and can change with your condition, the treatment plan, length of stay, room
        category, implants and medicines.
      </p>
      <p className="m-0">
        Estimates don&apos;t include flights, visas, accommodation outside the hospital or TreatVero&apos;s plan fee unless stated.
        This document is general information to help you compare options — it is not medical advice. Treatment decisions are made
        between you and your treating doctor.
      </p>
    </div>
  );
}
