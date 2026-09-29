import Link from "next/link";
import { entityName, grievanceEmail, LEGAL_UPDATED, legalEntity } from "@/data/legal";
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
      updated={LEGAL_UPDATED}
      intro="Medical information is sensitive. This policy explains what we collect, why, who we share it with and the choices you have."
      sections={[
        {
          title: "Who is responsible",
          body: (
            <p>
              {entityName}
              {legalEntity.address ? `, ${legalEntity.address},` : ""} decides how your information is used and is responsible for
              it (the &ldquo;data fiduciary&rdquo; under India&apos;s Digital Personal Data Protection Act 2023, and the
              &ldquo;controller&rdquo; under the GDPR where it applies).
            </p>
          ),
        },
        {
          title: "Information we collect",
          body: (
            <ul>
              <li>Contact details: your name, email address and WhatsApp number.</li>
              <li>Treatment information: country of residence, age, the treatment you&apos;re seeking and the description you provide.</li>
              <li>Medical reports you choose to upload.</li>
              <li>
                For booked cases: passport and travel details needed for visa invitations and bookings, and your signature on the
                service agreement.
              </li>
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
          title: "Why we're allowed to use it",
          body: (
            <p>
              We rely on your consent, which you give when you submit your request, to process your health information and share
              it with healthcare providers. We use your contact and booking details to provide the service you ask for under our{" "}
              <Link href="/terms">Terms of Service</Link>, and keep some records (such as payments and signed agreements) because
              the law requires it. You can withdraw consent at any time; this doesn&apos;t affect what we did before, but we may
              then be unable to continue coordinating your case.
            </p>
          ),
        },
        {
          title: "Sharing with healthcare providers",
          body: (
            <p>
              With your consent, we share relevant medical information with hospitals and doctors when necessary to
              obtain treatment options. We share only what&apos;s needed for them to review your case. Service providers
              who help us operate process data on our instructions only: Cloudflare (hosting and secure storage), Resend (email),
              Stripe (card payments, when used) and WhatsApp (messages you choose to send us there).
            </p>
          ),
        },
        {
          title: "International transfers",
          body: (
            <p>
              Your information is shared with hospitals in the destination country you choose (currently India), and our service
              providers may process it in other countries. We only share what is needed, use providers with appropriate
              safeguards, and never transfer data to a country the Government of India has restricted.
            </p>
          ),
        },
        {
          title: "Children",
          body: (
            <p>
              If the patient is under 18, a parent or legal guardian must submit the request and give consent for them. We use a
              child&apos;s information only to coordinate their care.
            </p>
          ),
        },
        {
          title: "Security and retention",
          body: (
            <p>
              Medical reports are stored privately and are never publicly accessible. Access is limited to the people
              coordinating your case, and every download is logged. We keep information only as long as needed for the purposes
              above or as required by law: medical reports on closed cases are deleted after a set period, while payment records
              and signed agreements are kept as long as tax and contract law require. You can ask us to delete your information at
              any time.
            </p>
          ),
        },
        {
          title: "Your rights",
          body: (
            <p>
              Depending on where you live, you may have rights to access, correct, delete or restrict the use of your
              information, to withdraw consent, and to nominate someone to act for you. To make a request or a complaint, email{" "}
              {grievanceEmail ? <a href={`mailto:${grievanceEmail}`}>{grievanceEmail}</a> : <Link href="/contact">us</Link>}
              {legalEntity.grievanceOfficer ? ` (grievance officer: ${legalEntity.grievanceOfficer.name})` : ""}. We respond
              within 30 days. If you&apos;re not satisfied, you can complain to the Data Protection Board of India or your local data
              protection authority.
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
