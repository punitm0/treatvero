import { CONCIERGE_EXTRA_WEEK_USD, CONCIERGE_INCLUDED_DAYS, THIRD_PARTY_COSTS_NOTE } from "@/data/pricing";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms that apply to TreatVero's medical travel coordination and patient concierge services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      path="/terms"
      updated="September 2026"
      intro="These draft terms describe what TreatVero does and doesn't do. They will be finalised with legal counsel before launch."
      sections={[
        {
          title: "Our service",
          body: (
            <p>
              TreatVero is an independent medical travel facilitator. We coordinate non-medical aspects of treatment
              abroad, such as obtaining treatment options, hospital communication, appointments, visa documentation,
              accommodation and on-ground support, according to the plan you choose.
            </p>
          ),
        },
        {
          title: "No medical advice",
          body: (
            <p>
              We are not a hospital or healthcare provider. We do not diagnose, prescribe or provide medical advice, and
              we do not guarantee any treatment outcome. Medical decisions are made by you with licensed healthcare
              professionals.
            </p>
          ),
        },
        {
          title: "Plans and fees",
          body: (
            <>
              <p>
                TreatVero offers two paid plans, Basic and Concierge, priced in USD and confirmed with you before work
                starts. There is no free plan.
              </p>
              <p>
                The Concierge fee covers up to {CONCIERGE_INCLUDED_DAYS} days of on-ground support; each additional
                week is ${CONCIERGE_EXTRA_WEEK_USD}. If you upgrade from Basic to Concierge, the Basic fee you paid is
                credited toward Concierge.
              </p>
              <p>{THIRD_PARTY_COSTS_NOTE}</p>
            </>
          ),
        },
        {
          title: "Third-party providers",
          body: (
            <p>
              Hospitals, doctors, hotels, airlines and transport providers are independent third parties responsible for
              their own services. Your agreements for those services are with them directly.
            </p>
          ),
        },
        {
          title: "Your responsibilities",
          body: (
            <p>
              Please provide accurate information, follow the advice of your treating doctors and check visa and travel
              requirements with official sources. Visa decisions are made by government authorities.
            </p>
          ),
        },
      ]}
    />
  );
}
