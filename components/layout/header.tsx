import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { mainNav } from "@/data/site";
import { ENQUIRY_PATH } from "@/lib/config";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { LiveDot } from "@/components/ui/primitives";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-[14px] backdrop-saturate-[1.3]">
      <div className="container-site flex h-[68px] items-center gap-7">
        <Logo />
        <nav aria-label="Main" className="hidden desk:block">
          <NavLinks items={mainNav} />
        </nav>
        <div className="flex-1" />
        <div className="hidden items-center gap-2 desk:flex">
          <WhatsAppLink className="flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-medium text-ink no-underline transition-colors hover:bg-hover hover:text-ink">
            <LiveDot className="size-[7px]" />
            <span className="hidden xl:inline">Chat on WhatsApp</span>
            <span className="xl:hidden">WhatsApp</span>
          </WhatsAppLink>
          <ButtonLink href={ENQUIRY_PATH} size="sm">
            Get Treatment Options
          </ButtonLink>
        </div>
        <div className="flex items-center gap-1.5 desk:hidden">
          <WhatsAppLink
            aria-label="Chat on WhatsApp"
            className="flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink hover:text-ink"
          >
            <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.75} />
          </WhatsAppLink>
          <MobileMenu items={mainNav} ctaHref={ENQUIRY_PATH} />
        </div>
      </div>
    </header>
  );
}

export function SkipLink() {
  return (
    <Link
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to content
    </Link>
  );
}
