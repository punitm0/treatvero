"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { ENQUIRY_PATH } from "@/lib/config";
import { buttonClasses } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";

/**
 * Desktop: floating WhatsApp pill (bottom-right).
 * Mobile: sticky "Get Treatment Options" bar with a WhatsApp shortcut.
 * Both are hidden on the enquiry page, which has its own action footer.
 */
export function FloatingActions() {
  const pathname = usePathname();
  if (pathname.startsWith(ENQUIRY_PATH)) return null;

  return (
    <aside aria-label="Quick actions">
      <WhatsAppLink className="group fixed right-6 bottom-6 z-50 hidden h-[52px] items-center gap-2.5 rounded-full border border-line bg-surface pr-5 pl-4 text-[15px] font-medium text-ink no-underline shadow-float transition-[border-color,translate,scale] duration-200 hover:-translate-y-0.5 hover:border-brand hover:text-ink active:scale-[0.97] motion-safe:animate-rise motion-safe:[animation-delay:800ms] md:flex">
        <span className="flex size-[30px] items-center justify-center rounded-full bg-brand text-white">
          <MessageCircle aria-hidden="true" className="size-[17px] transition-transform duration-300 group-hover:-rotate-12" strokeWidth={2} />
        </span>
        WhatsApp
      </WhatsAppLink>

      <div aria-hidden="true" className="h-[84px] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2.5 border-t border-line bg-white/95 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] backdrop-blur-md motion-safe:animate-bar-up motion-safe:[animation-delay:300ms] md:hidden">
        <Link href={ENQUIRY_PATH} className={buttonClasses({ size: "md+", className: "flex-1 text-base" })}>
          Get Treatment Options
        </Link>
        <WhatsAppLink
          aria-label="Chat on WhatsApp"
          className="flex size-[52px] shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-brand transition-[scale] hover:text-brand active:scale-95"
        >
          <MessageCircle aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
        </WhatsAppLink>
      </div>
    </aside>
  );
}
