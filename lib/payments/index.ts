import "server-only";
import { plans } from "@/data/pricing";
import { CURRENCY } from "@/data/pricing";
import type { PlanId } from "@/types";
import { absoluteUrl } from "@/lib/utils";
import { cfEnv } from "@/lib/cloudflare";

/**
 * Payment abstraction.
 *
 * Default provider is "manual": no payment is taken on the website; a
 * coordinator confirms the plan and sends a secure payment link. This keeps
 * the site fully functional without credentials.
 *
 * A Stripe Checkout provider activates when the PAYMENTS_PROVIDER var is
 * "stripe" (wrangler.jsonc) and the STRIPE_SECRET_KEY secret is set
 * (`npx wrangler secret put STRIPE_SECRET_KEY`), and only once the plan has a
 * real price.
 * Card details are always entered on the provider's hosted page — this
 * application never sees or stores card data.
 *
 * TODO(production, stripe): add a webhook route that verifies the Stripe
 * signature and marks the request paid; don't rely on the redirect alone.
 */

export type PaymentStatus = "not_required" | "pending" | "paid" | "failed" | "unknown";

export type CheckoutResult =
  | { mode: "manual"; status: "pending" }
  | { mode: "redirect"; url: string; sessionId: string };

export interface PaymentProvider {
  createCheckoutSession(args: { plan: PlanId; reference: string; email: string }): Promise<CheckoutResult>;
  getPaymentStatus(sessionId: string): Promise<PaymentStatus>;
}

class ManualProvider implements PaymentProvider {
  async createCheckoutSession(): Promise<CheckoutResult> {
    return { mode: "manual", status: "pending" };
  }
  async getPaymentStatus(): Promise<PaymentStatus> {
    return "pending";
  }
}

type StripeCheckoutSession = { id: string; url: string; status: string; payment_status: string };

class StripeProvider implements PaymentProvider {
  constructor(private readonly secretKey: string) {}

  private async stripe(pathname: string, init?: { method?: string; body?: URLSearchParams }): Promise<StripeCheckoutSession> {
    const res = await fetch(`https://api.stripe.com/v1/${pathname}`, {
      method: init?.method ?? "GET",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: init?.body,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Stripe request failed (${res.status})`);
    return (await res.json()) as StripeCheckoutSession;
  }

  async createCheckoutSession({ plan, reference, email }: { plan: PlanId; reference: string; email: string }): Promise<CheckoutResult> {
    const p = plans[plan];
    // No agreed price yet → fall back to manual; never invent an amount.
    if (p.priceUSD == null) return { mode: "manual", status: "pending" };

    const body = new URLSearchParams({
      mode: "payment",
      customer_email: email,
      client_reference_id: reference,
      success_url: absoluteUrl(`/get-treatment-options?payment=success&session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: absoluteUrl("/get-treatment-options?payment=cancelled"),
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": CURRENCY.toLowerCase(),
      "line_items[0][price_data][unit_amount]": String(Math.round(p.priceUSD * 100)),
      "line_items[0][price_data][product_data][name]": `TreatVero ${p.name} plan`,
      "metadata[reference]": reference,
      "metadata[plan]": plan,
    });
    const session = await this.stripe("checkout/sessions", { method: "POST", body });
    return { mode: "redirect", url: session.url, sessionId: session.id };
  }

  async getPaymentStatus(sessionId: string): Promise<PaymentStatus> {
    if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return "unknown";
    const session = await this.stripe(`checkout/sessions/${sessionId}`);
    if (session.payment_status === "paid") return "paid";
    if (session.status === "expired") return "failed";
    return "pending";
  }
}

function getProvider(): PaymentProvider {
  const env = cfEnv() as CloudflareEnv & { STRIPE_SECRET_KEY?: string };
  const provider: string = env.PAYMENTS_PROVIDER;
  if (provider === "stripe" && env.STRIPE_SECRET_KEY) return new StripeProvider(env.STRIPE_SECRET_KEY);
  return new ManualProvider();
}

export function createCheckoutSession(args: { plan: PlanId; reference: string; email: string }) {
  return getProvider().createCheckoutSession(args);
}

export function getPaymentStatus(sessionId: string) {
  return getProvider().getPaymentStatus(sessionId);
}

/** True only when the provider confirms the session is paid. */
export async function verifyPayment(sessionId: string): Promise<boolean> {
  try {
    return (await getPaymentStatus(sessionId)) === "paid";
  } catch {
    return false;
  }
}
