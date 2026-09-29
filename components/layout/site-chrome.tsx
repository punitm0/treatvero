import type { ReactNode } from "react";
import { Header, SkipLink } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { RevealOnScroll } from "@/components/layout/reveal-on-scroll";

/** Header, main landmark, footer and floating actions shared by public pages (and the 404 page). */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <FloatingActions />
      <RevealOnScroll />
    </>
  );
}
