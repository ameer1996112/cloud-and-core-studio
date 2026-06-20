// Pure, runtime-agnostic mapping from a Stripe event to the database action it
// should trigger. Imported by the Deno webhook function AND unit-tested in Node,
// so the business-critical routing logic is verifiable without the edge runtime.

export interface ActivateAction {
  kind: "activate";
  rpc: "activate_membership_for_payment";
  args: {
    p_member_id: string;
    p_plan_id: string;
    p_checkout_session_id: string;
    p_amount_minor: number;
    p_stripe_customer_id: string | null;
    p_stripe_subscription_id: string | null;
    p_payment_intent_id: string | null;
  };
}

export interface CancelAction {
  kind: "cancel";
  rpc: "mark_subscription_cancelled";
  args: { p_subscription_id: string };
}

export interface FreezeAction {
  kind: "freeze";
  subscriptionId: string;
}

export interface NoopAction {
  kind: "noop";
  reason: string;
}

export interface ErrorAction {
  kind: "error";
  message: string;
  status: number;
}

export type WebhookAction =
  | ActivateAction
  | CancelAction
  | FreezeAction
  | NoopAction
  | ErrorAction;

// Minimal shapes we read off Stripe objects (kept loose to avoid SDK coupling).
interface StripeEventLike {
  type: string;
  data: { object: Record<string, unknown> };
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

/**
 * Decide what the webhook should do for a verified Stripe event.
 * For invoice.payment_succeeded, the caller must supply the subscription's
 * metadata (member_id/plan_id) since it lives on the subscription, not the invoice.
 */
export function mapStripeEvent(
  event: StripeEventLike,
  subscriptionMeta?: { member_id?: string; plan_id?: string },
): WebhookAction {
  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object;
      const paymentStatus = str(s.payment_status);
      const status = str(s.status);
      if (paymentStatus !== "paid" && status !== "complete") {
        return { kind: "noop", reason: "session_not_paid" };
      }
      const metadata = (s.metadata as Record<string, string> | undefined) ?? {};
      const memberId = metadata.member_id ?? str(s.client_reference_id);
      const planId = metadata.plan_id ?? null;
      if (!memberId || !planId) {
        return { kind: "error", message: "missing_metadata", status: 400 };
      }
      return {
        kind: "activate",
        rpc: "activate_membership_for_payment",
        args: {
          p_member_id: memberId,
          p_plan_id: planId,
          p_checkout_session_id: str(s.id) ?? "",
          p_amount_minor: typeof s.amount_total === "number" ? s.amount_total : 0,
          p_stripe_customer_id: str(s.customer),
          p_stripe_subscription_id: str(s.subscription),
          p_payment_intent_id: str(s.payment_intent),
        },
      };
    }

    case "invoice.payment_succeeded": {
      const inv = event.data.object;
      const subscriptionId = str(inv.subscription);
      if (!subscriptionId) return { kind: "noop", reason: "no_subscription" };
      // First invoice is already handled by checkout.session.completed.
      if (str(inv.billing_reason) === "subscription_create") {
        return { kind: "noop", reason: "initial_invoice" };
      }
      const memberId = subscriptionMeta?.member_id ?? null;
      const planId = subscriptionMeta?.plan_id ?? null;
      if (!memberId || !planId) return { kind: "noop", reason: "missing_subscription_meta" };
      return {
        kind: "activate",
        rpc: "activate_membership_for_payment",
        args: {
          p_member_id: memberId,
          p_plan_id: planId,
          p_checkout_session_id: `invoice_${str(inv.id) ?? ""}`,
          p_amount_minor: typeof inv.amount_paid === "number" ? inv.amount_paid : 0,
          p_stripe_customer_id: str(inv.customer),
          p_stripe_subscription_id: subscriptionId,
          p_payment_intent_id: str(inv.payment_intent),
        },
      };
    }

    case "invoice.payment_failed": {
      const inv = event.data.object;
      const subscriptionId = str(inv.subscription);
      if (!subscriptionId) return { kind: "noop", reason: "no_subscription" };
      return { kind: "freeze", subscriptionId };
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const id = str(sub.id);
      if (!id) return { kind: "noop", reason: "no_subscription_id" };
      return { kind: "cancel", rpc: "mark_subscription_cancelled", args: { p_subscription_id: id } };
    }

    default:
      return { kind: "noop", reason: `unhandled_${event.type}` };
  }
}
