"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock, MessageCircle } from "lucide-react";
import type { z } from "zod";
import type { PlanId } from "@/types";
import { formatPlanPrice, planList, THIRD_PARTY_COSTS_NOTE } from "@/data/pricing";
import {
  BUDGET_OPTIONS,
  CITY_OPTIONS,
  DESTINATION_OPTIONS,
  ENQUIRY_STEPS,
  TIMING_OPTIONS,
  TREATMENT_OPTIONS,
  enquirySchema,
  type EnquiryInput,
} from "@/lib/validation/enquiry";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { submitTreatmentRequest } from "@/app/get-treatment-options/actions";
import { LogoMark } from "@/components/ui/logo";
import { buttonClasses } from "@/components/ui/button";
import { ChoiceChip, ChoiceGroup, FieldError, Label, inputClass } from "@/components/forms/fields";
import { ReportUpload, type UploadItem } from "@/components/forms/report-upload";

type FormInput = z.input<typeof enquirySchema>;

const comingSoon = ["Turkey", "Thailand", "UAE", "Singapore"];
const CONSENT_LABEL =
  "I consent to TreatVero processing my information and sharing relevant medical information with healthcare providers when necessary to obtain treatment options.";

export function EnquiryForm({ initialPlan }: { initialPlan?: PlanId }) {
  const [step, setStep] = useState(0);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState<{ reference: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const reduceMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    control,
    formState: { errors },
  } = useForm<FormInput, unknown, EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    // Validate on "Continue", then re-validate as the user types. (Blur-based
    // validation shifted the layout under the pointer when clicking Continue.)
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      country: "",
      age: "",
      description: "",
      destination: "India",
      city: "No preference",
      timing: "",
      budget: "",
      uploadIds: [],
      fullName: "",
      email: "",
      phoneCode: "",
      phoneNumber: "",
      plan: initialPlan,
      website: "",
    },
  });

  const selectedPlan = useWatch({ control, name: "plan" });
  const uploading = uploads.some((u) => u.status === "uploading");

  // Move focus to the new step's heading so screen readers announce it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [step, done, reduceMotion]);

  async function next() {
    setServerError("");
    const fields = ENQUIRY_STEPS[step].fields as unknown as FieldPath<FormInput>[];
    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) return;
    if (step < ENQUIRY_STEPS.length - 1) setStep((s) => s + 1);
  }

  const onSubmit = handleSubmit((values) => {
    setServerError("");
    startTransition(async () => {
      // Only successfully stored reports are attached (opaque ids, no file data).
      const uploadIds = uploads.flatMap((u) => (u.status === "done" && u.id ? [u.id] : []));
      const result = await submitTreatmentRequest({ ...values, uploadIds });
      if (!result.ok) {
        setServerError(result.error);
        if (result.fieldErrors) {
          for (const [field, msgs] of Object.entries(result.fieldErrors)) {
            if (msgs?.[0]) setError(field as FieldPath<FormInput>, { message: msgs[0] });
          }
          const firstBad = ENQUIRY_STEPS.findIndex((s) =>
            (s.fields as readonly string[]).some((f) => result.fieldErrors?.[f]?.length),
          );
          if (firstBad >= 0) setStep(firstBad);
        }
        return;
      }
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      setDone({ reference: result.reference });
    });
  });

  const isLast = step === ENQUIRY_STEPS.length - 1;
  const nextLabel = isLast ? "Request My Treatment Options" : step === 2 && uploads.length === 0 ? "Skip for now" : "Continue";

  const err = (name: keyof FormInput) => errors[name]?.message as string | undefined;
  const aria = (name: keyof FormInput) =>
    errors[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};

  return (
    <div
      ref={cardRef}
      className="mx-auto flex w-full max-w-[680px] scroll-mt-[84px] flex-col bg-surface max-md:min-h-[calc(100dvh-68px)] md:rounded-[20px] md:border md:border-line md:shadow-form"
    >
      {/* Header + progress */}
      <div className="shrink-0 px-5 pt-4 pb-4 md:px-8 md:pt-[22px] md:pb-[18px]">
        <div className="mb-[18px] flex items-center gap-2.5">
          <LogoMark className="size-[18px]" dotClassName="top-[3px] right-[3px] size-1.5 bg-white" />
          <span className="text-sm font-medium">Get Treatment Options</span>
        </div>
        {!done ? (
          <ol aria-label="Progress" className="m-0 grid list-none grid-cols-5 gap-1.5 p-0">
            {ENQUIRY_STEPS.map((s, i) => (
              <li key={s.key} aria-current={i === step ? "step" : undefined} className="flex min-w-0 flex-col gap-2">
                <span aria-hidden="true" className={cn("h-[3px] rounded-[3px]", i <= step ? "bg-brand" : "bg-progress")} />
                <span className={cn("truncate text-xs font-medium", i === step ? "text-ink" : "text-ink-subtle")}>
                  <span className="max-sm:hidden">
                    {i + 1}. {s.label}
                  </span>
                  <span className="sm:hidden">{i === step ? `${i + 1}. ${s.label}` : i + 1}</span>
                  {i < step ? <span className="sr-only"> (completed)</span> : null}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      {done ? (
        <SuccessState reference={done.reference} headingRef={headingRef} />
      ) : (
        <form onSubmit={isLast ? onSubmit : (e) => (e.preventDefault(), void next())} noValidate className="flex flex-1 flex-col">
          {/* Honeypot: hidden from people and assistive tech */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" {...register("website")} />
            </label>
          </div>

          <div className="flex-1 px-5 pt-2 pb-7 md:px-8 md:pt-3 md:pb-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex flex-col gap-6"
              >
                {step === 0 && (
                  <>
                    <StepIntro
                      headingRef={headingRef}
                      title="What treatment are you looking for?"
                      text="A few details help hospitals prepare useful estimates. It takes about two minutes."
                    />
                    <ChoiceGroup legend="Treatment" error={err("treatment")} errorId="treatment-error">
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
                        {TREATMENT_OPTIONS.map((t) => (
                          <ChoiceChip key={t} shape="tile" value={t} label={t} {...register("treatment")} />
                        ))}
                      </div>
                    </ChoiceGroup>
                    <div>
                      <Label htmlFor="description" hint="in your own words">
                        Medical condition
                      </Label>
                      <textarea
                        id="description"
                        rows={3}
                        placeholder="e.g. My doctor has recommended knee replacement surgery and I'd like to understand my options."
                        className={cn(inputClass, "resize-y py-3 leading-normal")}
                        {...aria("description")}
                        {...register("description")}
                      />
                      <FieldError id="description-error" message={err("description")} />
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
                      <div>
                        <Label htmlFor="age">Patient age</Label>
                        <input id="age" inputMode="numeric" placeholder="e.g. 54" className={cn(inputClass, "h-12")} {...aria("age")} {...register("age")} />
                        <FieldError id="age-error" message={err("age")} />
                      </div>
                      <div>
                        <Label htmlFor="country">Country of residence</Label>
                        <input
                          id="country"
                          autoComplete="country-name"
                          placeholder="e.g. Kenya"
                          className={cn(inputClass, "h-12")}
                          {...aria("country")}
                          {...register("country")}
                        />
                        <FieldError id="country-error" message={err("country")} />
                      </div>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <StepIntro
                      headingRef={headingRef}
                      title="Where and when?"
                      text="Not sure yet? That's fine — we can talk through cities and timing with you."
                    />
                    <ChoiceGroup legend="Preferred destination" error={err("destination")} errorId="destination-error">
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
                        {DESTINATION_OPTIONS.map((d) => (
                          <ChoiceChip
                            key={d}
                            shape="card"
                            value={d}
                            label={d}
                            sublabel={<span className={d === "India" ? "text-brand" : "text-ink-subtle"}>{d === "India" ? "Available now" : "We'll talk it through"}</span>}
                            {...register("destination")}
                          />
                        ))}
                        {comingSoon.map((d) => (
                          <ChoiceChip
                            key={d}
                            shape="card"
                            name="destination-disabled"
                            value={d}
                            disabled
                            label={d}
                            sublabel={<span className="text-ink-subtle">Coming soon</span>}
                          />
                        ))}
                      </div>
                    </ChoiceGroup>
                    <ChoiceGroup legend="Preferred city" hint="optional" errorId="city-error" error={err("city")}>
                      <div className="flex flex-wrap gap-2">
                        {CITY_OPTIONS.map((c) => (
                          <ChoiceChip key={c} value={c} label={c} {...register("city")} />
                        ))}
                      </div>
                    </ChoiceGroup>
                    <ChoiceGroup legend="Expected travel date" hint="optional" errorId="timing-error" error={err("timing")}>
                      <div className="flex flex-wrap gap-2">
                        {TIMING_OPTIONS.map((c) => (
                          <ChoiceChip key={c} value={c} label={c} {...register("timing")} />
                        ))}
                      </div>
                    </ChoiceGroup>
                    <ChoiceGroup legend="Approximate treatment budget" hint="optional, USD" errorId="budget-error" error={err("budget")}>
                      <div className="flex flex-wrap gap-2">
                        {BUDGET_OPTIONS.map((c) => (
                          <ChoiceChip key={c} value={c} label={c} {...register("budget")} />
                        ))}
                      </div>
                    </ChoiceGroup>
                  </>
                )}

                {step === 2 && (
                  <>
                    <StepIntro
                      headingRef={headingRef}
                      title="Medical reports"
                      text="Medical reports help hospitals provide more useful treatment estimates. You can continue without uploading medical reports."
                    />
                    <ReportUpload items={uploads} onChange={setUploads} />
                  </>
                )}

                {step === 3 && (
                  <>
                    <StepIntro
                      headingRef={headingRef}
                      title="How can we reach you?"
                      text="A patient coordinator will contact you — usually on WhatsApp — to go through your options."
                    />
                    <div>
                      <Label htmlFor="fullName">Full name</Label>
                      <input
                        id="fullName"
                        autoComplete="name"
                        placeholder="As on your passport"
                        className={cn(inputClass, "h-12")}
                        {...aria("fullName")}
                        {...register("fullName")}
                      />
                      <FieldError id="fullName-error" message={err("fullName")} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className={cn(inputClass, "h-12")}
                        {...aria("email")}
                        {...register("email")}
                      />
                      <FieldError id="email-error" message={err("email")} />
                    </div>
                    <fieldset className="m-0 border-0 p-0">
                      <legend className="mb-2 p-0 text-sm font-medium">
                        WhatsApp number <span className="font-normal text-ink-subtle">— with international country code</span>
                      </legend>
                      <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-2">
                        <input
                          aria-label="Country code"
                          inputMode="tel"
                          autoComplete="tel-country-code"
                          placeholder="+254"
                          className={cn(inputClass, "h-12")}
                          {...aria("phoneCode")}
                          {...register("phoneCode")}
                        />
                        <input
                          aria-label="WhatsApp number"
                          inputMode="tel"
                          autoComplete="tel-national"
                          placeholder="Phone number"
                          className={cn(inputClass, "h-12")}
                          {...aria("phoneNumber")}
                          {...register("phoneNumber")}
                        />
                      </div>
                      <FieldError id="phoneCode-error" message={err("phoneCode")} />
                      <FieldError id="phoneNumber-error" message={err("phoneNumber")} />
                    </fieldset>
                    <div>
                      <label className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-line-faint bg-sand-2 px-4 py-3.5 text-sm leading-normal">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          {...aria("consent")}
                          {...register("consent")}
                        />
                        <span
                          aria-hidden="true"
                          className="mt-px flex size-[22px] shrink-0 items-center justify-center rounded-md border-[1.5px] border-line-hover bg-surface text-transparent peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
                        >
                          <Check className="size-4" strokeWidth={2.5} />
                        </span>
                        <span>{CONSENT_LABEL}</span>
                      </label>
                      <FieldError id="consent-error" message={err("consent")} />
                    </div>
                    <p className="m-0 text-[13px] text-ink-subtle">
                      See our{" "}
                      <Link href="/privacy" target="_blank">
                        privacy policy
                      </Link>{" "}
                      for how we handle your information.
                    </p>
                  </>
                )}

                {step === 4 && (
                  <>
                    <StepIntro
                      headingRef={headingRef}
                      title="Choose your plan"
                      text="Both plans are one-time fees in USD for TreatVero's coordination. A coordinator confirms everything with you before any work starts."
                    />
                    <ChoiceGroup legend="Plan" error={err("plan")} errorId="plan-error">
                      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
                        {planList.map((p) => {
                          const on = selectedPlan === p.id;
                          return (
                            <label key={p.id} className="relative block cursor-pointer">
                              <input type="radio" value={p.id} className="peer sr-only" {...register("plan")} />
                              <span
                                className={cn(
                                  "flex h-full flex-col gap-3 rounded-2xl border p-5 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand",
                                  on ? "border-brand bg-brand-tint" : "border-line-alt bg-surface hover:border-line-hover",
                                )}
                              >
                                <span className="flex items-center justify-between gap-2">
                                  <span className="text-[15px] font-medium">{p.name}</span>
                                  {p.badge ? (
                                    <span className="rounded-full bg-brand-deep px-2.5 py-0.5 text-[11px] text-white">{p.badge}</span>
                                  ) : null}
                                </span>
                                <span className="flex items-baseline gap-2">
                                  <span className="font-serif text-[40px] leading-none tracking-[-0.03em]">{formatPlanPrice(p)}</span>
                                  <span className="text-sm text-ink-muted">USD · {p.billingNote}</span>
                                </span>
                                <span className="text-sm text-ink-muted">{p.description}</span>
                                <span className="mt-auto flex items-center gap-2 text-sm font-medium text-brand">
                                  <span
                                    aria-hidden="true"
                                    className={cn(
                                      "flex size-5 items-center justify-center rounded-full border-[1.5px]",
                                      on ? "border-brand bg-brand text-white" : "border-line-hover",
                                    )}
                                  >
                                    {on ? <Check className="size-3" strokeWidth={3} /> : null}
                                  </span>
                                  {on ? "Selected" : p.cta}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </ChoiceGroup>
                    <p className="m-0 text-[13px] text-ink-subtle">
                      {THIRD_PARTY_COSTS_NOTE}{" "}
                      <Link href="/pricing#compare" target="_blank">
                        Compare plans
                      </Link>
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {serverError ? (
              <p role="alert" className="mt-6 mb-0 rounded-xl border border-[#e8cfc3] bg-[#fbf1ec] px-4 py-3 text-sm text-error">
                {serverError}
              </p>
            ) : null}
          </div>

          {/* Action footer — sticky on mobile */}
          <div className="sticky bottom-0 flex shrink-0 items-center gap-3 border-t border-line-soft bg-surface px-5 py-3 md:static md:rounded-b-[20px] md:px-8 md:py-4">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className={buttonClasses({ variant: "outline", size: "md", className: "gap-1.5 px-[18px]" })}>
                <ArrowLeft aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
                Back
              </button>
            ) : (
              <p className="m-0 flex items-center gap-1.5 text-[13px] text-ink-subtle">
                <Lock aria-hidden="true" className="size-4" strokeWidth={1.75} />
                No obligation to proceed
              </p>
            )}
            <div className="flex-1" />
            <button
              type="submit"
              disabled={pending || (step === 2 && uploading)}
              className={buttonClasses({ size: "md", className: "gap-2 px-[22px] max-sm:whitespace-normal max-sm:text-left max-sm:leading-tight" })}
            >
              {pending ? <Loader2 aria-hidden="true" className="size-[18px] animate-spin" /> : null}
              {pending ? "Sending…" : step === 2 && uploading ? "Uploading…" : nextLabel}
              {!pending ? <ArrowRight aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.75} /> : null}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function StepIntro({
  title,
  text,
  headingRef,
}: {
  title: string;
  text: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="mb-2 font-serif text-[30px] leading-[1.1] font-normal tracking-[-0.02em] outline-none">
        {title}
      </h2>
      <p className="m-0 text-[15px] leading-[1.55] text-ink-muted">{text}</p>
    </div>
  );
}

function SuccessState({ reference, headingRef }: { reference: string; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const steps = [
    "Your coordinator reviews your request and may ask for further reports.",
    "With your consent, suitable hospitals review your case and prepare estimates.",
    "We share the options in one clear format and talk them through with you.",
  ];
  return (
    <div className="flex flex-col gap-6 px-5 pt-2 pb-8 md:px-8" role="status">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-tint text-brand">
        <Check aria-hidden="true" className="size-7" strokeWidth={2} />
      </span>
      <div>
        <h2 ref={headingRef} tabIndex={-1} className="mb-2.5 font-serif text-[32px] leading-[1.1] font-normal tracking-[-0.02em] outline-none">
          Your request has been received.
        </h2>
        <p className="m-0 text-base leading-[1.55] text-ink-muted">A TreatVero patient coordinator will contact you shortly.</p>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3.5">
        <span className="text-[13px] text-ink-subtle">Your reference</span>
        <span className="font-mono text-sm font-medium">{reference}</span>
      </div>
      <div className="flex flex-col gap-3.5">
        <h3 className="label-mono m-0 font-normal text-ink-subtle">What happens next</h3>
        <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-3 text-[15px] leading-normal">
              <span className="w-5 shrink-0 pt-0.5 font-mono text-[13px] text-brand">0{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <a
          href={whatsappUrl(`Hi TreatVero, I've just requested treatment options (ref ${reference}). I'd like to continue here.`)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses({ size: "md+", className: "flex-[1_1_220px]" })}
        >
          <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.75} />
          Continue on WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <Link href="/" className={buttonClasses({ variant: "outline", size: "md+", className: "px-[22px]" })}>
          Back to site
        </Link>
      </div>
    </div>
  );
}
