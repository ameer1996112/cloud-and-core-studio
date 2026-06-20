// Stripe webhook handler (Supabase Edge Function).
//
// Verifies the Stripe signature, then drives membership activation through the
// idempotent DB function activate_membership_for_payment. Activation happens
// ONLY here — never from the browser success page. Repeated events are safe.
//
// Configure this function with verify_jwt = false (Stripe calls it directly).
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY,
//      STRIPE_WEBHOOK_SECRET
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";
import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";
import { mapStripeEvent } from "../_shared/stripeEvents.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

const stripe = new Stripe(stripeSecret, { apiVersion: "2024-12-18.acacia" });

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("method_not_allowed", { status: 405 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!signature || !webhookSecret) {
    return new Response("missing_signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // Async variant is required in Deno (uses WebCrypto under the hood).
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    return new Response(`invalid_signature: ${(err as Error).message}`, { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Record every event for auditing/debugging (best-effort).
  await admin.from("payment_events").insert({
    provider: "stripe",
    provider_event_id: event.id,
    event_type: event.type,
    payload: event as unknown as Record<string, unknown>,
  });

  try {
    // For renewal invoices, the member/plan live on the subscription metadata.
    let subscriptionMeta: { member_id?: string; plan_id?: string } | undefined;
    if (event.type === "invoice.payment_succeeded") {
      const inv = event.data.object as Stripe.Invoice;
      const subId = inv.subscription as string | null;
      if (subId && inv.billing_reason !== "subscription_create") {
        const sub = await stripe.subscriptions.retrieve(subId);
        subscriptionMeta = {
          member_id: sub.metadata?.member_id,
          plan_id: sub.metadata?.plan_id,
        };
      }
    }

    const action = mapStripeEvent(
      event as unknown as { type: string; data: { object: Record<string, unknown> } },
      subscriptionMeta,
    );

    switch (action.kind) {
      case "activate": {
        const { error } = await admin.rpc(action.rpc, action.args);
        if (error) return jsonError(error.message, 500);
        break;
      }
      case "cancel": {
        const { error } = await admin.rpc(action.rpc, action.args);
        if (error) return jsonError(error.message, 500);
        break;
      }
      case "freeze": {
        await admin
          .from("memberships")
          .update({ status: "frozen", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", action.subscriptionId)
          .eq("status", "active");
        break;
      }
      case "error":
        return jsonError(action.message, action.status);
      case "noop":
      default:
        break;
    }
  } catch (err) {
    return jsonError(String((err as Error).message ?? err), 500);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
