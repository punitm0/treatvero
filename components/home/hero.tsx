import Image from "next/image";
import { ArrowRight, Check, Headset, MessageCircle } from "lucide-react";
import { ENQUIRY_PATH } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { LiveDot } from "@/components/ui/primitives";
import { WhatsAppButton } from "@/components/ui/whatsapp-link";

const trustIndicators = ["Independent patient support", "Transparent pricing", "Dedicated coordination"];

export function Hero() {
  return (
    <section className="pt-[clamp(40px,6vw,88px)] pb-[clamp(64px,8vw,112px)]">
      <div className="container-site grid grid-cols-1 items-center gap-[clamp(48px,6vw,88px)] min-[67.5rem]:grid-cols-2">
        <div>
          <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pr-3.5 pl-2.5 text-[13px] text-ink-muted">
            <LiveDot pulse className="shadow-[0_0_0_3px_rgba(47,163,107,0.15)]" />
            Now coordinating treatment in India
          </p>
          <h1 className="text-display mb-6">
            Medical treatment abroad. <em className="text-brand">We make the journey simple.</em>
          </h1>
          <p className="text-lede mb-9 max-w-[540px] text-ink-muted">
            Explore treatment options in India and get help coordinating hospitals, appointments, medical visas,
            accommodation, airport pickup and on-ground support.
          </p>
          <div className="mb-7 flex flex-wrap gap-3">
            <ButtonLink href={ENQUIRY_PATH} size="lg">
              Get Treatment Options
              <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </ButtonLink>
            <WhatsAppButton size="lg" className="px-6" />
          </div>
          <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-sm text-ink-muted">
            {trustIndicators.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check aria-hidden="true" className="size-[18px] text-brand" strokeWidth={2} />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative pb-[120px] md:pb-0">
          <div className="relative aspect-[4/4.4] overflow-hidden rounded-3xl border border-line bg-[#e8e4dc] md:aspect-[16/10] min-[67.5rem]:aspect-[4/4.4]">
            <Image
              src="/images/hero.jpg"
              alt="A calm, modern hospital reception area"
              fill
              preload
              sizes="(min-width: 1080px) 580px, 100vw"
              className="object-cover"
            />
          </div>
          <JourneyCard />
        </div>
      </div>
    </section>
  );
}

function JourneyCard() {
  return (
    <figure
      aria-label="Illustration of a coordinated patient journey"
      className="absolute bottom-0 left-3 m-0 w-[min(360px,calc(100%-24px))] rounded-[18px] border border-line bg-surface p-5 shadow-card motion-safe:animate-rise motion-safe:[animation-delay:250ms] md:left-6 min-[67.5rem]:-left-8"
    >
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <span className="label-mono text-ink-subtle">Your journey</span>
        <span className="flex items-center gap-1 text-[13px] text-ink-muted">
          Home
          <ArrowRight aria-label="to" className="size-3.5" strokeWidth={1.75} />
          Delhi NCR
        </span>
      </div>
      <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
        <li className="flex items-center gap-3 motion-safe:animate-rise motion-safe:[animation-delay:450ms]">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-white">
            <Check aria-hidden="true" className="size-4" strokeWidth={2.25} />
          </span>
          <div className="leading-[1.35]">
            <div className="text-sm font-medium">Treatment options</div>
            <div className="text-[13px] text-ink-subtle">Hospital estimates to compare</div>
          </div>
        </li>
        <li className="flex items-center gap-3 motion-safe:animate-rise motion-safe:[animation-delay:570ms]">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-brand-line bg-brand-tint">
            <span className="relative block size-2 rounded-full bg-brand after:absolute after:inset-0 after:rounded-full after:bg-inherit motion-safe:after:animate-ping-soft" />
          </span>
          <div className="leading-[1.35]">
            <div className="text-sm font-medium">Medical visa</div>
            <div className="text-[13px] text-ink-subtle">Invitation letter in progress</div>
          </div>
        </li>
        <li className="flex items-center gap-3 motion-safe:animate-rise motion-safe:[animation-delay:690ms]">
          <span className="block size-7 shrink-0 rounded-full border border-dashed border-line-dash" />
          <div className="leading-[1.35]">
            <div className="text-sm font-medium">Arrival</div>
            <div className="text-[13px] text-ink-subtle">Airport pickup &amp; stay arranged</div>
          </div>
        </li>
      </ol>
      <div className="mt-[18px] flex items-center gap-3 border-t border-line-soft pt-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
          <Headset aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </span>
        <div className="flex-1 leading-[1.35]">
          <div className="text-sm font-medium">Your care coordinator</div>
          <div className="text-[13px] text-ink-subtle">One contact, start to finish</div>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full border border-line text-brand">
          <MessageCircle aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
        </span>
      </div>
    </figure>
  );
}
