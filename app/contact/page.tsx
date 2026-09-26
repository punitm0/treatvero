import Link from "next/link";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { siteConfig, ENQUIRY_PATH } from "@/lib/config";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/primitives";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Talk to a TreatVero coordinator on WhatsApp, or send your treatment requirement through our secure enquiry form.",
  path: "/contact",
});

const cardClass =
  "flex flex-col gap-3 rounded-[20px] border border-line bg-surface p-[clamp(22px,2.6vw,30px)] text-ink no-underline transition-colors hover:border-brand-line hover:text-ink";

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title={
          <>
            Talk to a person, <em className="text-brand">not a call centre.</em>
          </>
        }
        lede="The quickest way to reach us is WhatsApp. For treatment options, the enquiry form lets you share reports privately."
        actions={false}
      />
      <section aria-label="Ways to contact us" className="pb-[clamp(72px,9vw,128px)]">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          <WhatsAppLink className={cardClass}>
            <MessageCircle aria-hidden="true" className="size-7 text-brand" strokeWidth={1.75} />
            <span className="text-lg font-medium">Chat on WhatsApp</span>
            <span className="text-[15px] text-ink-muted">
              General questions, plans and next steps. Please don&apos;t send medical reports until a coordinator asks.
            </span>
          </WhatsAppLink>
          <Link href={ENQUIRY_PATH} className={cardClass}>
            <ArrowRight aria-hidden="true" className="size-7 text-brand" strokeWidth={1.75} />
            <span className="text-lg font-medium">Get treatment options</span>
            <span className="text-[15px] text-ink-muted">Share your requirement and reports through our enquiry form.</span>
          </Link>
          {siteConfig.contactEmail ? (
            <a href={`mailto:${siteConfig.contactEmail}`} className={cardClass}>
              <Mail aria-hidden="true" className="size-7 text-brand" strokeWidth={1.75} />
              <span className="text-lg font-medium">Email</span>
              <span className="text-[15px] text-ink-muted">{siteConfig.contactEmail}</span>
            </a>
          ) : null}
        </Container>
        <Container>
          <p className="mt-8 mb-0 max-w-[760px] text-[13px] text-ink-subtle">
            TreatVero can&apos;t help with medical emergencies. If you need urgent care, contact your local emergency
            services or nearest hospital.
          </p>
        </Container>
      </section>
    </>
  );
}
