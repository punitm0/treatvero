import { isPlanId } from "@/data/pricing";
import { pageMetadata } from "@/lib/seo";
import { verifyPayment } from "@/lib/payments";
import { EnquiryForm } from "@/components/forms/enquiry-form";

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
      <EnquiryForm initialPlan={plan} />
    </div>
  );
}
