import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Treatment } from "@/types";
import { Icon } from "@/components/ui/icon";

export function TreatmentCard({ treatment, headingLevel = "h3" }: { treatment: Treatment; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Link
      href={`/treatments/${treatment.slug}`}
      className="group flex min-h-[196px] flex-col gap-2.5 rounded-2xl border border-line bg-surface p-[22px] text-ink no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-line hover:text-ink hover:shadow-lift"
    >
      <span className="mb-1.5 flex size-[42px] items-center justify-center rounded-xl bg-brand-tint text-brand">
        <Icon name={treatment.icon} className="size-[22px]" />
      </span>
      <H className="m-0 text-[17px] leading-[1.3] font-medium">{treatment.name}</H>
      <p className="m-0 text-sm leading-normal text-ink-muted">{treatment.summary}</p>
      <span className="flex-1" />
      <span className="flex items-center gap-1.5 text-sm font-medium text-brand">
        Explore options
        <ArrowRight aria-hidden="true" className="size-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
      </span>
    </Link>
  );
}

export function TreatmentGrid({ items, headingLevel }: { items: Treatment[]; headingLevel?: "h2" | "h3" }) {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,216px),1fr))] gap-3 p-0">
      {items.map((t) => (
        <li key={t.slug} className="grid">
          <TreatmentCard treatment={t} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
