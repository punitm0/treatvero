"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { enquirySchema } from "@/lib/validation/enquiry";
import { clientKey, getRateLimiter } from "@/lib/rate-limit";
import { saveTreatmentRequest } from "@/lib/requests";
import { createCheckoutSession } from "@/lib/payments";
import { getReportStorage } from "@/lib/uploads/storage";

export type SubmitResult =
  | { ok: true; reference: string; checkoutUrl: string | null }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Server-side validation is authoritative; the client schema only improves UX.
 * Nothing from the request body is logged.
 */
export async function submitTreatmentRequest(raw: unknown): Promise<SubmitResult> {
  const h = await headers();
  const limited = await getRateLimiter("enquiry").limit(clientKey(h));
  if (!limited.success) {
    return { ok: false, error: "You've sent several requests in a short time. Please wait a few minutes, or reach us on WhatsApp." };
  }

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Some details need checking. Please review the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }
  const input = parsed.data;

  // Honeypot filled → silently accept without storing anything.
  if (input.website) return { ok: true, reference: "TV-RECEIVED", checkoutUrl: null };

  // Only attach report ids that actually exist in private storage.
  const storage = getReportStorage();
  const existing = await Promise.all(input.uploadIds.map((id) => storage.get(id)));
  const reports = existing.filter((r): r is NonNullable<typeof r> => r !== null);

  let reference: string;
  try {
    ({ reference } = await saveTreatmentRequest(input, reports));
  } catch {
    console.error("[enquiry] failed to save a treatment request"); // intentionally no payload
    return { ok: false, error: "We couldn't send your request just now. Please try again, or contact us on WhatsApp." };
  }

  // The request is saved from here on: later failures must not make the
  // patient resubmit (which would create a duplicate).
  try {
    await storage.attach(
      reports.map((r) => r.id),
      reference,
    );
  } catch {
    console.error(`[enquiry] reports for ${reference} still in pending/ — move manually`);
  }

  try {
    const checkout = await createCheckoutSession({ plan: input.plan, reference, email: input.email });
    return { ok: true, reference, checkoutUrl: checkout.mode === "redirect" ? checkout.url : null };
  } catch {
    console.error("[enquiry] checkout session could not be created");
    return { ok: true, reference, checkoutUrl: null };
  }
}
