import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How TreatVero collects, uses, shares and protects your personal and medical information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      updated="September 2026"
      intro="Medical information is sensitive. This policy explains what we collect, why, who we share it with and the choices you have. It is a working draft and will be finalised with legal counsel before launch."
      sections={[
        {
          title: "Information we collect",
          body: (
            <ul>
              <li>Contact details: your name, email address and WhatsApp number.</li>
              <li>Treatment information: country of residence, age, the treatment you&apos;re seeking and the description you provide.</li>
              <li>Medical reports you choose to upload.</li>
              <li>Preferences such as destination, city, timing and budget.</li>
              <li>Basic technical data needed to run and secure the website.</li>
            </ul>
          ),
        },
        {
          title: "How we use your information",
          body: (
            <p>
              To respond to your enquiry, obtain treatment options from healthcare providers, coordinate your journey,
              provide the plan you choose and meet legal obligations. We do not sell your information and do not use
              your medical information for advertising.
            </p>
          ),
        },
        {
          title: "Sharing with healthcare providers",
          body: (
            <p>
              With your consent, we share relevant medical information with hospitals and doctors when necessary to
              obtain treatment options. We share only what&apos;s needed for them to review your case. Service providers
              who help us operate (for example secure storage or messaging) process data on our instructions.
            </p>
          ),
        },
        {
          title: "Security and retention",
          body: (
            <p>
              Medical reports are stored privately and are never publicly accessible. Access is limited to the people
              coordinating your case. We keep information only as long as needed for the purposes above or as required
              by law, and you can ask us to delete it at any time.
            </p>
          ),
        },
        {
          title: "Your rights",
          body: (
            <p>
              Depending on where you live, you may have rights to access, correct, delete or restrict the use of your
              information, and to withdraw consent. Contact us to make a request.
            </p>
          ),
        },
        {
          id: "cookies",
          title: "Cookies",
          body: (
            <p>
              This website uses only cookies and similar storage that are strictly necessary for it to work. We do not
              currently use advertising or analytics cookies. If that changes, we&apos;ll update this policy and ask for
              your consent where required.
            </p>
          ),
        },
      ]}
    />
  );
}
