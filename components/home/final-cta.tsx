import { ArrowRight } from "lucide-react";
import { ENQUIRY_PATH } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { WhatsAppButton } from "@/components/ui/whatsapp-link";

/** Dark rounded CTA panel with concentric rings (homepage and inner pages). */
export function FinalCta({
  title = "Considering medical treatment abroad?",
  text = "Tell us what you need and we'll help you understand your options and plan the journey.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="py-[clamp(56px,7vw,96px)]">
      <Container>
        <div className="relative overflow-hidden rounded-[32px] bg-brand-deep px-[clamp(24px,6vw,88px)] py-[clamp(40px,7vw,104px)] text-white">
          <span aria-hidden="true" className="absolute -top-40 -right-40 block size-[520px] rounded-full border border-white/8" />
          <span aria-hidden="true" className="absolute -top-[60px] -right-[60px] block size-80 rounded-full border border-white/8" />
          <div className="relative max-w-[760px]">
            <h2 id="cta-title" className="mb-6 font-serif text-[clamp(38px,5.4vw,72px)] leading-[1.02] font-normal tracking-[-0.028em] text-balance">
              {title}
            </h2>
            <p className="text-lede mb-10 max-w-[560px] text-ondark-muted">{text}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={ENQUIRY_PATH} variant="inverse" size="xl">
                Get Treatment Options
                <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </ButtonLink>
              <WhatsAppButton variant="ghost-inverse" size="xl" className="px-6 whitespace-normal">
                Talk to TreatVero on WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
