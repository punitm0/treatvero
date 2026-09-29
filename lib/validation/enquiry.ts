import { z } from "zod";
import { treatments } from "@/data/treatments";
import { cityNames } from "@/data/destinations";

/**
 * Shared by the client form (React Hook Form resolver) and the server
 * action, so validation rules can never drift apart.
 */

export const TREATMENT_OPTIONS = [...treatments.map((t) => t.name), "Not sure yet / Other"] as const;
export const DESTINATION_OPTIONS = ["India", "Other / Not sure"] as const;
export const CITY_OPTIONS = ["No preference", ...cityNames] as const;
export const TIMING_OPTIONS = ["As soon as possible", "Within 1 month", "1–3 months", "3+ months", "Not sure yet"] as const;
export const BUDGET_OPTIONS = [
  "Under $5,000",
  "$5,000–15,000",
  "$15,000–30,000",
  "$30,000–50,000",
  "$50,000+",
  "Prefer not to say",
] as const;

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal("")]).optional();

export const stepTreatmentSchema = z.object({
  country: z.string().trim().min(2, "Please tell us where you live.").max(80),
  age: z
    .string()
    .trim()
    .min(1, "Please enter the patient's age.")
    .regex(/^\d{1,3}$/, "Please enter age in years.")
    .refine((v) => Number(v) <= 120, "Please enter a valid age."),
  treatment: z.enum(TREATMENT_OPTIONS, { error: 'Please choose a treatment, or "Not sure yet / Other".' }),
  description: z
    .string()
    .trim()
    .min(10, "A sentence or two helps hospitals understand your situation.")
    .max(2000, "Please keep this under 2,000 characters."),
});

export const stepPreferencesSchema = z.object({
  destination: z.enum(DESTINATION_OPTIONS),
  city: optionalEnum(CITY_OPTIONS),
  timing: optionalEnum(TIMING_OPTIONS),
  budget: optionalEnum(BUDGET_OPTIONS),
});

export const stepReportsSchema = z.object({
  uploadIds: z.array(z.uuid()).max(10),
});

export const stepContactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.email("Please enter a valid email address.").max(200),
  phoneCode: z
    .string()
    .trim()
    .regex(/^\+?\d{1,4}$/, "Enter a country code, e.g. +254."),
  phoneNumber: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 6 && v.replace(/\D/g, "").length <= 15, "Please enter your WhatsApp number.")
    .refine((v) => /^[\d\s()-]+$/.test(v), "Use digits only."),
  consent: z.literal(true, { error: "Your consent is needed so hospitals can review your case." }),
});

export const stepPlanSchema = z.object({
  plan: z.enum(["basic", "concierge"], { error: "Please choose a plan." }),
  terms: z.literal(true, { error: "Please accept the Terms of Service to continue." }),
});

export const enquirySchema = stepTreatmentSchema
  .extend(stepPreferencesSchema.shape)
  .extend(stepReportsSchema.shape)
  .extend(stepContactSchema.shape)
  .extend(stepPlanSchema.shape)
  .extend({
    /** Honeypot — real users never see or fill this. */
    website: z.string().max(0).optional(),
  });

export type EnquiryInput = z.infer<typeof enquirySchema>;
/** Form values before validation (consent and terms start unchecked, plan unset). */
export type EnquiryFormValues = Omit<EnquiryInput, "consent" | "terms" | "plan"> & {
  consent: boolean;
  terms: boolean;
  plan: EnquiryInput["plan"] | undefined;
};

export const ENQUIRY_STEPS = [
  { key: "treatment", label: "Treatment", fields: Object.keys(stepTreatmentSchema.shape) },
  { key: "preferences", label: "Preferences", fields: Object.keys(stepPreferencesSchema.shape) },
  { key: "reports", label: "Reports", fields: Object.keys(stepReportsSchema.shape) },
  { key: "contact", label: "Contact", fields: Object.keys(stepContactSchema.shape) },
  { key: "plan", label: "Plan", fields: Object.keys(stepPlanSchema.shape) },
] as const;
