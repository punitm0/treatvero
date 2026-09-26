import { ArrowRight } from "lucide-react";
import { ENQUIRY_PATH } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/ui/whatsapp-link";

/** Light, centred closing CTA (India page pattern). */
export function CenteredCta({
  title,
  text = "No obligation to proceed with any hospital. A coordinator will walk you through every option.",
}: {
  title: string;
  text?: string;
}) {
  return (
    <section aria-labelledby="closing-cta" className="py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto max-w-[880px] px-[clamp(20px,4vw,40px)] text-center">
        <h2 id="closing-cta" className="mb-5 font-serif text-[clamp(36px,5vw,64px)] leading-[1.03] font-normal tracking-[-0.028em] text-balance">
          {title}
        </h2>
        <p className="mx-auto mb-9 max-w-[560px] text-lg text-ink-muted">{text}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href={ENQUIRY_PATH} size="xl">
            Get Treatment Options
            <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
          </ButtonLink>
          <WhatsAppButton size="xl" className="px-6 whitespace-normal">
            Talk to TreatVero on WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
