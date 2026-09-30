import { isPlanId } from "@/data/pricing";
import { pageMetadata } from "@/lib/seo";
import { verifyPayment } from "@/lib/payments";
import { EnquiryForm, type PreferredListing } from "@/components/forms/enquiry-form";
import { getHospital } from "@/data/hospitals";
import { getDoctor } from "@/data/doctors";
import { getCity } from "@/data/destinations";
import { getTreatmentOrThrow } from "@/data/treatments";
import { CITY_OPTIONS, TREATMENT_OPTIONS } from "@/lib/validation/enquiry";

/** Resolves ?hospital= / ?doctor= from hospital and doctor pages into what the form shows. */
function preferredListing(hospitalSlug: unknown, doctorSlug: unknown): PreferredListing | undefined {
  const doctor = typeof doctorSlug === "string" ? getDoctor(doctorSlug) : undefined;
  const hospital = getHospital(doctor?.hospital ?? (typeof hospitalSlug === "string" ? hospitalSlug : ""));
  if (!hospital) return undefined;
  const cityName = getCity(hospital.city).name;
  const treatmentName = doctor?.specialties.length === 1 ? getTreatmentOrThrow(doctor.specialties[0]).name : undefined;
  return {
    hospital: { slug: hospital.slug, name: hospital.name },
    doctor: doctor ? { slug: doctor.slug, name: doctor.name } : undefined,
    city: CITY_OPTIONS.find((c) => c === cityName),
    treatment: TREATMENT_OPTIONS.find((t) => t === treatmentName),
  };
}

export const metadata = pageMetadata({
  title: "Get Treatment Options",
  description:
    "Tell us what treatment you need. TreatVero coordinates with suitable hospitals to help you obtain treatment options and plan your journey.",
  path: "/get-treatment-options",
});

export default async function GetTreatmentOptionsPage({ searchParams }: PageProps<"/get-treatment-options">) {
  const sp = await searchParams;
  const plan = typeof sp.plan === "string" && isPlanId(sp.plan) ? sp.plan : undefined;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : null;
  const paymentReturn = sp.payment === "success" && sessionId ? await verifyPayment(sessionId) : null;

  return (
    <div className="md:px-6 md:pt-12 md:pb-20">
      <h1 className="sr-only">Get treatment options</h1>
      {paymentReturn !== null ? (
        <p role="status" className="mx-auto mb-6 max-w-[680px] rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-muted max-md:mx-5 max-md:mt-5">
          {paymentReturn
            ? "Payment confirmed — thank you. Your coordinator will be in touch shortly."
            : "We couldn't confirm your payment yet. If you were charged, your coordinator will confirm it with you."}
        </p>
      ) : sp.payment === "cancelled" ? (
        <p role="status" className="mx-auto mb-6 max-w-[680px] rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-muted max-md:mx-5 max-md:mt-5">
          Payment was cancelled. Your request is saved — a coordinator can send you a payment link later.
        </p>
      ) : null}
      <EnquiryForm initialPlan={plan} preferred={preferredListing(sp.hospital, sp.doctor)} />
    </div>
  );
}
