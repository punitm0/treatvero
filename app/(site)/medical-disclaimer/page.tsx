import { LEGAL_UPDATED } from "@/data/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata = pageMetadata({
  title: "Medical Disclaimer",
  description:
    "TreatVero is an independent medical travel facilitator. We are not a hospital, do not diagnose or prescribe, and do not guarantee treatment outcomes.",
  path: "/medical-disclaimer",
});

export default function MedicalDisclaimerPage() {
  return (
    <LegalPage
      title="Medical Disclaimer"
      path="/medical-disclaimer"
      updated={LEGAL_UPDATED}
      intro="Your health journey deserves clarity. Here is exactly what TreatVero does — and what it doesn't — in plain language."
      sections={[
        {
          title: "We are an independent facilitator",
          body: <p>TreatVero is an independent medical travel facilitator and patient concierge. We are not a hospital or medical provider.</p>,
        },
        {
          title: "We don't diagnose or prescribe",
          body: (
            <p>
              TreatVero does not diagnose patients, prescribe treatment or provide medical advice. Medical recommendations
              come from licensed healthcare professionals.
            </p>
          ),
        },
        {
          title: "Information on this website is general",
          body: (
            <p>
              Treatment guides, typical stays and other content on this website are general information to help you
              prepare for conversations with your doctors. They are not a substitute for professional medical advice.
            </p>
          ),
        },
        {
          title: "You choose your provider",
          body: <p>Patients choose their own hospital and doctor. We don&apos;t rank doctors, and we are clear about how each option was sourced.</p>,
        },
        {
          title: "No outcome guarantees",
          body: <p>TreatVero does not guarantee treatment outcomes — and no one should promise you one.</p>,
        },
        {
          title: "Emergencies",
          body: <p>If you need urgent medical care, contact your local emergency services or nearest hospital. Do not delay care to travel.</p>,
        },
      ]}
    />
  );
}
