import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import type { Crumb } from "@/lib/seo";
import { ENQUIRY_PATH } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { WhatsAppButton } from "@/components/ui/whatsapp-link";

/** Inner-page hero following the India page pattern: breadcrumbs, serif H1, lede, CTAs. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lede,
  actions = true,
  aside,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions?: boolean;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="pt-[clamp(28px,4vw,48px)] pb-[clamp(56px,7vw,96px)]">
      <Container>
        <Breadcrumbs items={crumbs} className="mb-[clamp(28px,4vw,48px)]" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-[clamp(40px,6vw,80px)]">
          <div>
            {typeof eyebrow === "string" ? <Eyebrow>{eyebrow}</Eyebrow> : eyebrow}
            <h1 className="text-display-sm mb-6">{title}</h1>
            {lede ? <p className="text-lede mb-8 max-w-[560px] text-ink-muted">{lede}</p> : null}
            {actions ? (
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={ENQUIRY_PATH} size="lg">
                  Get Treatment Options
                  <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </ButtonLink>
                <WhatsAppButton size="lg" className="px-6" />
              </div>
            ) : null}
          </div>
          {aside ?? null}
        </div>
        {children}
      </Container>
    </section>
  );
}
