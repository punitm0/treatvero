import type { Plan, PlanId } from "@/types";

/**
 * Single source of truth for TreatVero plans.
 *
 * `priceUSD` publishes a price everywhere (cards, enquiry flow, FAQ, checkout)
 * at once — no component holds a price of its own. Set it to null to show the
 * placeholder instead.
 */
export const CURRENCY = "USD" as const;

/** On-ground days covered by the Concierge fee. */
export const CONCIERGE_INCLUDED_DAYS = 14;
/** Concierge fee for each additional week on the ground. */
export const CONCIERGE_EXTRA_WEEK_USD = 250;

export const plans: Record<PlanId, Plan> = {
  basic: {
    id: "basic",
    name: "Basic",
    priceUSD: 199,
    pricePlaceholder: "$XX",
    billingNote: "one-time",
    priceNote: "Credited in full if you upgrade to Concierge.",
    description: "For patients who want help finding and coordinating treatment options.",
    features: [
      "Initial case coordination",
      "Treatment requirement intake",
      "Medical report collection",
      "Suitable hospital options",
      "Treatment estimate coordination",
      "Appointment coordination",
      "Hospital communication",
      "Visa invitation coordination",
      "WhatsApp/email support",
      "Primary TreatVero coordinator",
    ],
    cta: "Choose Basic",
  },
  concierge: {
    id: "concierge",
    name: "Concierge",
    priceUSD: 1190,
    pricePlaceholder: "$XXX",
    billingNote: "one-time",
    priceNote: `Covers up to ${CONCIERGE_INCLUDED_DAYS} days on the ground, then $${CONCIERGE_EXTRA_WEEK_USD} per additional week.`,
    description: "For patients who want end-to-end support throughout their medical journey.",
    badge: "Most Complete",
    featuresIntro: "Everything in Basic, plus:",
    features: [
      "Dedicated coordinator",
      "Medical visa guidance",
      "Accommodation coordination",
      "Airport pickup coordination",
      "Local transportation coordination",
      "Hospital accompaniment",
      "Translation assistance",
      "Family/companion support",
      "Admission coordination",
      "Discharge coordination",
      "Follow-up coordination",
      "Return travel assistance",
      "Priority WhatsApp support",
      "On-ground assistance",
    ],
    cta: "Choose Concierge",
  },
};

export const planList: Plan[] = [plans.basic, plans.concierge];

export const THIRD_PARTY_COSTS_NOTE =
  "Medical treatment, visa fees, flights, hotels, transportation and other third-party expenses are paid separately.";

export function formatPlanPrice(plan: Plan): string {
  if (plan.priceUSD == null) return plan.pricePlaceholder;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: plan.priceUSD % 1 === 0 ? 0 : 2,
  }).format(plan.priceUSD);
}

export function isPlanId(value: unknown): value is PlanId {
  return value === "basic" || value === "concierge";
}

/** Rows for the Basic vs Concierge comparison. */
export const planComparison: { feature: string; basic: boolean; concierge: boolean }[] = [
  { feature: "Treatment options", basic: true, concierge: true },
  { feature: "Hospital coordination", basic: true, concierge: true },
  { feature: "Estimate coordination", basic: true, concierge: true },
  { feature: "Appointment scheduling", basic: true, concierge: true },
  { feature: "Visa invitation coordination", basic: true, concierge: true },
  { feature: "Dedicated concierge", basic: false, concierge: true },
  { feature: "Visa assistance", basic: false, concierge: true },
  { feature: "Accommodation coordination", basic: false, concierge: true },
  { feature: "Airport pickup coordination", basic: false, concierge: true },
  { feature: "Local transportation", basic: false, concierge: true },
  { feature: "Hospital accompaniment", basic: false, concierge: true },
  { feature: "Translation assistance", basic: false, concierge: true },
  { feature: "Discharge support", basic: false, concierge: true },
  { feature: "Return travel support", basic: false, concierge: true },
  { feature: "Priority support", basic: false, concierge: true },
];
