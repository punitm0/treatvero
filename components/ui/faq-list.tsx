import { Minus, Plus } from "lucide-react";
import type { FAQ } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Accordion built on native <details> — keyboard and screen-reader
 * accessible with no client JavaScript. First item open, as in the design.
 */
export function FaqList({ faqs, className, openFirst = true }: { faqs: FAQ[]; className?: string; openFirst?: boolean }) {
  return (
    <div className={cn("flex flex-col", className)}>
      {faqs.map((faq, i) => (
        <details key={faq.question} open={openFirst && i === 0} className="group border-t border-line-alt">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-5 py-5 text-left text-[17px] font-medium text-ink">
            <span>{faq.question}</span>
            <Plus aria-hidden="true" strokeWidth={1.75} className="faq-plus size-[22px] shrink-0 text-brand" />
            <Minus aria-hidden="true" strokeWidth={1.75} className="faq-minus size-[22px] shrink-0 text-brand" />
          </summary>
          <p className="m-0 pr-10 pb-[22px] text-base leading-[1.6] text-pretty text-ink-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
