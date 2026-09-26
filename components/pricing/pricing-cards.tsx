import Link from "next/link";
import { Check, Info } from "lucide-react";
import type { Plan } from "@/types";
import { formatPlanPrice, plans, THIRD_PARTY_COSTS_NOTE } from "@/data/pricing";
import { ENQUIRY_PATH } from "@/lib/config";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function PlanCard({ plan, featured = false, headingLevel: H = "h3" }: { plan: Plan; featured?: boolean; headingLevel?: "h2" | "h3" }) {
  const price = formatPlanPrice(plan);
  const pending = plan.priceUSD == null;
  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={cn(
        "flex flex-col gap-6 rounded-3xl p-[clamp(26px,3.5vw,40px)]",
        featured ? "bg-brand-deep text-white" : "border border-line bg-surface",
      )}
    >
      <div>
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <H id={`plan-${plan.id}`} className="m-0 text-[15px] font-medium">
            {plan.name}
          </H>
          {plan.badge ? (
            <span className="rounded-full border border-white/25 px-2.5 py-1 text-xs text-ondark-soft">{plan.badge}</span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-serif text-6xl leading-none tracking-[-0.03em]">
            {pending ? <span aria-label={`${plan.name} price to be confirmed`}>{price}</span> : price}
          </span>
          <span className={cn("text-[15px]", featured ? "text-ondark-2" : "text-ink-muted")}>USD · {plan.billingNote}</span>
        </div>
        {plan.priceNote ? (
          <p className={cn("mt-2 mb-0 text-sm", featured ? "text-ondark-2" : "text-ink-muted")}>{plan.priceNote}</p>
        ) : null}
        <p className={cn("mt-2.5 mb-0 text-sm", featured ? "text-ondark-2" : "text-ink-muted")}>{plan.description}</p>
      </div>
      <div className={cn("flex flex-1 flex-col gap-3 border-t pt-6", featured ? "border-white/15" : "border-line-soft")}>
        {plan.featuresIntro ? <p className="m-0 text-sm text-ondark-2">{plan.featuresIntro}</p> : null}
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-2.5 text-[15px]">
              <Check aria-hidden="true" className={cn("size-5 shrink-0", featured ? "text-ondark-accent" : "text-brand")} strokeWidth={2} />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <Link
        href={`${ENQUIRY_PATH}?plan=${plan.id}`}
        className={buttonClasses({ variant: featured ? "inverse" : "outline-ink", size: "md+", className: "w-full" })}
      >
        {plan.cta}
      </Link>
    </article>
  );
}

export function PricingCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-4">
        <PlanCard plan={plans.basic} headingLevel={headingLevel} />
        <PlanCard plan={plans.concierge} featured headingLevel={headingLevel} />
      </div>
      <p className="mt-6 mb-0 flex items-start justify-center gap-2.5 text-left text-sm text-ink-muted">
        <Info aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-ink-subtle" strokeWidth={1.75} />
        <span>{THIRD_PARTY_COSTS_NOTE}</span>
      </p>
    </>
  );
}
