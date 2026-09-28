import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { SiteChrome } from "@/components/layout/site-chrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="section-y">
        <Container className="max-w-[760px]">
          <Eyebrow>Page not found</Eyebrow>
          <h1 className="text-h2 mb-5">We couldn&apos;t find that page.</h1>
          <p className="mb-8 text-[17px] text-ink-muted">It may have moved, or the link may be out of date.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/" size="lg">
              Back to home
            </ButtonLink>
            <ButtonLink href="/treatments" variant="outline" size="lg">
              Browse treatments
              <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
