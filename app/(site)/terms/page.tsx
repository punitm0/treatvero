import Link from "next/link";
import { CONCIERGE_EXTRA_WEEK_USD, CONCIERGE_INCLUDED_DAYS, THIRD_PARTY_COSTS_NOTE } from "@/data/pricing";
import { entityName, grievanceEmail, LEGAL_UPDATED, legalEntity, REFUND_POLICY, TERMS_VERSION } from "@/data/legal";
import { siteConfig } from "@/lib/config";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms that apply to TreatVero's medical travel coordination and patient concierge services, including fees, refunds and our responsibilities.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      path="/terms"
      updated={`${LEGAL_UPDATED} · version ${TERMS_VERSION}`}
      intro="These terms describe what TreatVero does and doesn't do, what you pay for, and what happens if plans change. You accept them when you request treatment options, and they form the agreement between you and us."
      sections={[
        {
          title: "About these terms",
          body: (
            <>
              <p>
                These terms are an agreement between you and {entityName}
                {legalEntity.address ? `, ${legalEntity.address}` : ""} (&ldquo;TreatVero&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). You
                accept them by ticking the box when you request treatment options. The version you accepted is recorded with your
                request.
              </p>
              <p>
                Before we start on-ground or booked work, your coordinator may also ask you to sign a short service agreement that
                sets out the details of your case: dates, fee and what&apos;s included. It adds to these terms and, where the two
                differ, the service agreement applies.
              </p>
            </>
          ),
        },
        {
          title: "Our service",
          body: (
            <p>
              TreatVero is an independent medical travel facilitator. We coordinate non-medical aspects of treatment abroad, such
              as obtaining treatment options, hospital communication, appointments, visa documentation, accommodation and
              on-ground support, according to the plan you choose.
            </p>
          ),
        },
        {
          title: "No medical advice",
          body: (
            <p>
              We are not a hospital or healthcare provider. We do not diagnose, prescribe or provide medical advice, and we do not
              guarantee any treatment outcome. Medical decisions are made by you with licensed healthcare professionals, who are
              responsible for your care. See our <Link href="/medical-disclaimer">Medical Disclaimer</Link>.
            </p>
          ),
        },
        {
          title: "Who can use TreatVero",
          body: (
            <p>
              You must be 18 or older to accept these terms. If you contact us for someone else (for example a parent, child or
              spouse), you confirm that they have agreed to you doing so, or that you are legally entitled to act for them, such as
              a parent or guardian of a child. We may ask the patient to confirm directly.
            </p>
          ),
        },
        {
          title: "Plans and fees",
          body: (
            <>
              <p>
                TreatVero offers two paid plans, Basic and Concierge, priced in USD and confirmed with you before work starts.
                There is no free plan. Our fees cover TreatVero&apos;s coordination only.
              </p>
              <p>
                The Concierge fee covers up to {CONCIERGE_INCLUDED_DAYS} days of on-ground support; each additional week is $
                {CONCIERGE_EXTRA_WEEK_USD}. If you upgrade from Basic to Concierge, the Basic fee you paid is credited toward
                Concierge.
              </p>
              <p>{THIRD_PARTY_COSTS_NOTE}</p>
            </>
          ),
        },
        {
          id: "refunds",
          title: "Cancellation and refunds",
          body: (
            <>
              <p>You can cancel at any time by telling your coordinator in writing (email or WhatsApp).</p>
              <ul>
                {REFUND_POLICY.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p>
                Money you pay to hospitals, hotels, airlines or other providers is refunded (or not) under their own policies. We
                will help you ask for it.
              </p>
            </>
          ),
        },
        {
          title: "Hospitals and other providers",
          body: (
            <>
              <p>
                Hospitals, doctors, hotels, airlines and transport providers are independent third parties responsible for their
                own services. Your agreements for those services are with them directly. We tell you how each option was sourced,
                and the choice of hospital and doctor is always yours.
              </p>
              <p>
                We don&apos;t currently receive commissions or referral fees from hospitals. If that changes for any hospital we
                suggest to you, we will tell you before you choose.
              </p>
            </>
          ),
        },
        {
          title: "Your responsibilities",
          body: (
            <ul>
              <li>Give us accurate and complete information, including medical history relevant to your treatment and travel.</li>
              <li>Follow the advice of your treating doctors.</li>
              <li>
                Check visa, entry and health requirements with official sources. Visa decisions are made by government authorities,
                not by us or the hospital.
              </li>
              <li>Arrange travel and medical insurance that covers treatment abroad and complications. We strongly recommend it.</li>
              <li>Pay our fees and third-party costs on time.</li>
            </ul>
          ),
        },
        {
          title: "Your authorisation",
          body: (
            <p>
              To do our job, you authorise us to share your medical reports and relevant health information with the hospitals and
              doctors reviewing your case, to communicate with them for you, and to handle copies of your passport and travel
              documents only as needed to arrange visas, accommodation, transport and admission. You can withdraw this at any time
              by telling your coordinator, although we may then be unable to continue. Our{" "}
              <Link href="/privacy">Privacy Policy</Link> explains how we protect this information.
            </p>
          ),
        },
        {
          title: "How we communicate",
          body: (
            <p>
              We contact you by email and WhatsApp about your request, using the details you give us. We don&apos;t send you
              marketing without your permission. Messages to us are not monitored around the clock, so never use them for a
              medical emergency.
            </p>
          ),
        },
        {
          title: "Emergencies",
          body: (
            <p>
              TreatVero is not an emergency service. If you need urgent medical care, contact your local emergency services or the
              nearest hospital. During Concierge support our on-ground team will help you reach the hospital and inform your
              family, but cannot give medical help.
            </p>
          ),
        },
        {
          title: "Our liability",
          body: (
            <>
              <p>
                We provide our services with reasonable care and skill. We are not responsible for the acts or omissions of
                hospitals, doctors, hotels, airlines or other independent providers, for medical outcomes, or for losses caused by
                inaccurate information you give us.
              </p>
              <p>
                As far as the law allows, our total liability to you for your case is limited to the fees you paid us for it, and we
                are not liable for indirect or consequential losses. Nothing in these terms limits liability that cannot legally be
                limited, or your statutory rights as a consumer.
              </p>
            </>
          ),
        },
        {
          title: "Ending the service",
          body: (
            <p>
              You can stop our service at any time; the refund policy above applies. We may stop providing the service if you give
              us false information, don&apos;t pay our fees, or behave abusively toward our team or providers. If we stop for any
              other reason, we refund the fees for work we haven&apos;t done.
            </p>
          ),
        },
        {
          title: "Events beyond our control",
          body: (
            <p>
              We aren&apos;t responsible for delays or failures caused by events beyond our reasonable control, such as natural
              disasters, epidemics, war, strikes, government action, border or airspace closures, or hospital closures. We&apos;ll
              help you rearrange where we can.
            </p>
          ),
        },
        {
          title: "Changes to these terms",
          body: (
            <p>
              We may update these terms; the date and version at the top show when. The version you accepted applies to your
              request unless you agree to a newer one, for example by signing a service agreement.
            </p>
          ),
        },
        {
          title: "Governing law and disputes",
          body: (
            <p>
              These terms are governed by the laws of India. If something goes wrong, please contact us first so we can try to put
              it right; we aim to resolve complaints within 30 days. If we can&apos;t, disputes will be decided by the courts in India
              with jurisdiction over our registered office. This doesn&apos;t take away any right you have to bring a claim in the
              country where you live under its consumer laws.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact and grievances",
          body: (
            <p>
              {legalEntity.grievanceOfficer
                ? `Our grievance officer is ${legalEntity.grievanceOfficer.name}, reachable at ${legalEntity.grievanceOfficer.email}. `
                : ""}
              {grievanceEmail ? (
                <>
                  For questions or complaints about these terms or our service, email{" "}
                  <a href={`mailto:${grievanceEmail}`}>{grievanceEmail}</a>. We acknowledge complaints within 48 hours.
                </>
              ) : (
                <>
                  For questions or complaints about these terms or our service, use our <Link href="/contact">contact page</Link>. We
                  acknowledge complaints within 48 hours.
                </>
              )}{" "}
              {legalEntity.address ? `${entityName}, ${legalEntity.address}.` : `${siteConfig.name}.`}
            </p>
          ),
        },
      ]}
    />
  );
}
