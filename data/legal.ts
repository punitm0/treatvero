import { CONCIERGE_EXTRA_WEEK_USD, CONCIERGE_INCLUDED_DAYS, plans, THIRD_PARTY_COSTS_NOTE } from "@/data/pricing";
import { siteConfig } from "@/lib/config";

/**
 * Single source of truth for the patient-facing legal wording: the Terms
 * version patients accept at enquiry, the consent and acceptance labels, and
 * the service agreement coordinators send for signature.
 *
 * Bump TERMS_VERSION whenever /terms, /privacy or /medical-disclaimer change
 * in substance. Each request stores the version and the exact label the
 * patient accepted, so the dashboard can tell who accepted older terms.
 */

export const TERMS_VERSION = "2026-09-29";
export const LEGAL_UPDATED = "29 September 2026";

/**
 * The business behind TreatVero. Fill these in before launch: consumer rules
 * in India (and most other countries) require the trading entity, its address
 * and a grievance contact to be published. Unset values fall back to the
 * contact email.
 */
export const legalEntity = {
  /** Registered name, e.g. "TreatVero Health Services Private Limited". */
  name: null as string | null,
  /** Registered office address. */
  address: null as string | null,
  /** Grievance officer (Consumer Protection (E-Commerce) Rules 2020, DPDP Act 2023). */
  grievanceOfficer: null as { name: string; email: string } | null,
};

export const entityName = legalEntity.name ?? siteConfig.name;
export const grievanceEmail = legalEntity.grievanceOfficer?.email ?? siteConfig.contactEmail;

/** Data consent on the Contact step — processing and sharing health data. */
export const CONSENT_TEXT =
  "I consent to TreatVero processing my information and sharing relevant medical information with healthcare providers when necessary to obtain treatment options.";

/** Contract acceptance on the Plan step, before payment. Kept separate from the data consent. */
export const TERMS_ACCEPTANCE_TEXT =
  "I agree to the Terms of Service, including the refund policy, and I understand that TreatVero is a coordinator, not a healthcare provider, and does not give medical advice.";

/* ------------------------------------------------------------------ */
/* Refund policy — shared by /terms and the service agreement          */
/* ------------------------------------------------------------------ */

const usd = (n: number | null) => (n == null ? "the plan fee" : `$${n.toLocaleString("en-US")}`);
const basicFee = usd(plans.basic.priceUSD);
const conciergeBalance =
  plans.basic.priceUSD != null && plans.concierge.priceUSD != null
    ? usd(plans.concierge.priceUSD - plans.basic.priceUSD)
    : "the Concierge fee less the Basic fee";

export const REFUND_POLICY: string[] = [
  "Full refund of your plan fee if you cancel before your coordinator sends your case to any hospital.",
  "Full refund if none of the hospitals we approach is able to offer you a treatment option.",
  `Once your case has been sent to hospitals, the Basic fee (${basicFee}) is non-refundable, because that work has been done.`,
  `Concierge: if you cancel, or your medical visa is refused, before on-ground support begins, we refund the Concierge balance above the Basic fee (${conciergeBalance}). Once you have arrived and on-ground support has started, the Concierge fee is non-refundable.`,
  `Additional on-ground weeks ($${CONCIERGE_EXTRA_WEEK_USD} each) are charged in advance; any full week you don't use is refunded.`,
  "Approved refunds are paid to the original payment method within 14 days. Nothing in this policy limits rights you have under the consumer law that applies to you.",
];

/* ------------------------------------------------------------------ */
/* Service agreement                                                  */
/* ------------------------------------------------------------------ */

export const SERVICE_AGREEMENT_VERSION = "2026-09-29";

export type AgreementScope = {
  plan: "basic" | "concierge";
  patientName: string;
  reference: string;
  treatment: string;
  destination: string;
  /** YYYY-MM-DD, Concierge only. */
  arrival: string | null;
  departure: string | null;
  onGroundDays: number | null;
  companions: number | null;
  /** Fee agreed for this case, in USD (plan fee plus any agreed extra weeks). */
  feeUSD: number | null;
  /** Anything specific agreed with the patient, in plain words. */
  notes: string | null;
};

export type AgreementSection = { heading: string; paragraphs: string[] };
export type AgreementDocument = { title: string; version: string; sections: AgreementSection[] };

const longDate = (d: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));

/**
 * Builds the service agreement text for one patient. The result is stored as
 * a snapshot when a coordinator sends it, so later edits to this template
 * never change what a patient already signed.
 */
export function buildServiceAgreement(s: AgreementScope): AgreementDocument {
  const plan = plans[s.plan];
  const concierge = s.plan === "concierge";

  // Concierge lists only its extras ("Everything in Basic, plus"), so include Basic's too.
  const services = concierge ? [...plans.basic.features, ...plan.features] : plan.features;
  const scope: string[] = [
    `Plan: ${plan.name}. Case reference ${s.reference}. Treatment enquiry: ${s.treatment}, in ${s.destination}.`,
    `${entityName} will provide these coordination services: ${services.join("; ")}.`,
  ];
  if (concierge) {
    const days = s.onGroundDays ?? CONCIERGE_INCLUDED_DAYS;
    scope.push(
      `On-ground support: up to ${days} days${s.arrival ? `, from your expected arrival on ${longDate(s.arrival)}` : ""}${
        s.departure ? ` to your expected departure on ${longDate(s.departure)}` : ""
      }. The first ${CONCIERGE_INCLUDED_DAYS} days are included in the Concierge fee; each additional week is $${CONCIERGE_EXTRA_WEEK_USD}.`,
    );
    if (s.companions != null) {
      scope.push(`Travelling companions we will support: ${s.companions === 0 ? "none" : s.companions}.`);
    }
  }
  if (s.notes) scope.push(`Also agreed: ${s.notes}`);

  const fee = s.feeUSD ?? plan.priceUSD;
  return {
    title: `${plan.name} service agreement`,
    version: SERVICE_AGREEMENT_VERSION,
    sections: [
      {
        heading: "Parties",
        paragraphs: [
          `This agreement is between ${entityName}${legalEntity.address ? ` (${legalEntity.address})` : ""} ("TreatVero", "we") and ${s.patientName} ("you"), the patient or the person acting for the patient. It adds to our Terms of Service, which also apply.`,
        ],
      },
      { heading: "What we will do", paragraphs: scope },
      {
        heading: "Fees",
        paragraphs: [
          `Our fee for this case is ${fee == null ? "as confirmed by your coordinator in writing" : `$${fee.toLocaleString("en-US")} (USD)`}. It covers ${siteConfig.name}'s coordination only.`,
          `${THIRD_PARTY_COSTS_NOTE} You pay hospitals, doctors, hotels, airlines and other providers directly, under their own terms.`,
          "We don't currently receive commissions or referral fees from hospitals. If that changes for any hospital we suggest to you, we will tell you before you choose.",
        ],
      },
      { heading: "Cancellation and refunds", paragraphs: REFUND_POLICY },
      {
        heading: "Your authorisation",
        paragraphs: [
          "You authorise us to share your medical reports and relevant health information with the hospitals and doctors reviewing your case, and to communicate with them for you about appointments, estimates, admission and discharge.",
          concierge
            ? "You authorise us to handle copies of your passport and travel documents, and those of your companions, only as needed to arrange visa invitations, accommodation, transport and hospital admission."
            : "You authorise us to handle copies of your passport only as needed to request a visa invitation letter from the hospital.",
          "You can withdraw this authorisation at any time by telling your coordinator in writing. We may then be unable to continue the service.",
        ],
      },
      {
        heading: "Medical care and emergencies",
        paragraphs: [
          "We are not a hospital or healthcare provider. We do not diagnose, prescribe or give medical advice, and we don't guarantee any treatment outcome. Every medical decision is yours, made with your licensed doctors, who are responsible for your care.",
          concierge
            ? "In a medical emergency, contact the hospital or local emergency services first. Our on-ground team will help you reach them and inform your family, but cannot give medical help."
            : "In a medical emergency, contact your local emergency services or nearest hospital. Do not delay care to travel.",
        ],
      },
      {
        heading: "Your responsibilities",
        paragraphs: [
          "Give us accurate and complete information, including your full medical history as it affects your treatment and travel.",
          "Follow the advice of your treating doctors, and check visa, travel-insurance and health requirements with official sources. Visa decisions are made by governments, not by us or the hospital.",
          "We strongly recommend travel and medical insurance that covers treatment abroad and complications.",
        ],
      },
      {
        heading: "Our liability",
        paragraphs: [
          "We will provide our services with reasonable care and skill. We are not responsible for the acts or omissions of hospitals, doctors, hotels, airlines or other independent providers, or for delays and events beyond our reasonable control.",
          "As far as the law allows, our total liability to you is limited to the fees you paid us for this case. Nothing in this agreement limits liability that cannot legally be limited.",
        ],
      },
      {
        heading: "Signing",
        paragraphs: [
          "By typing your name and confirming below, you agree to this agreement electronically. If you sign for the patient (for example as a parent, guardian or family member), you confirm that you are authorised to do so.",
        ],
      },
    ],
  };
}
