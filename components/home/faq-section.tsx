import type { FAQ } from "@/types";
import { faqJsonLd } from "@/lib/seo";
import { FaqList } from "@/components/ui/faq-list";
import { JsonLd } from "@/components/ui/json-ld";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { WhatsAppButton } from "@/components/ui/whatsapp-link";

export function FaqSection({
  faqs,
  eyebrow = "FAQ",
  title = "Questions, answered.",
  intro = "Something else on your mind? A coordinator can answer on WhatsApp.",
  withJsonLd = true,
  sticky = true,
}: {
  faqs: FAQ[];
  eyebrow?: string;
  title?: string;
  intro?: string | null;
  withJsonLd?: boolean;
  sticky?: boolean;
}) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-sand">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-x-20 gap-y-10">
        <div className={sticky ? "lg:sticky lg:top-[108px]" : undefined}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="faq-title" className="text-h2 mb-5">
            {title}
          </h2>
          {intro ? (
            <>
              <p className="mb-6 text-[17px] text-ink-muted">{intro}</p>
              <WhatsAppButton size="md">Ask on WhatsApp</WhatsAppButton>
            </>
          ) : null}
        </div>
        <FaqList faqs={faqs} />
      </Container>
      {withJsonLd ? <JsonLd data={faqJsonLd(faqs)} /> : null}
    </section>
  );
}
