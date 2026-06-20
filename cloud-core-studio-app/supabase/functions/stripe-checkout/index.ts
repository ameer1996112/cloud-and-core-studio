// Stripe Checkout session creator (Supabase Edge Function).
//
// Auth: requires the caller's Supabase JWT (Authorization: Bearer <access_token>).
// We resolve the member from the JWT, validate the plan, and create a Stripe
// Checkout Session. Membership activation does NOT happen here — only after the
// webhook confirms payment.
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY,
//      STRIPE_SECRET_KEY, APP_URL
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";
import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const appUrl = Deno.env.get("APP_URL") ?? "http://localhost:3000";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const stripe = new Stripe(stripeSecret, { apiVersion: "2024-12-18.acacia" });

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const authHeader = request.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return json({ error: "unauthorized" }, 401);
  }

  // Identify the user from their JWT using the anon client.
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();
  if (userError || !user) {
    return json({ error: "unauthorized" }, 401);
  }

  let body: { plan_id?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_body" }, 400);
  }
  if (!body.plan_id) {
    return json({ error: "plan_id_required" }, 400);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Resolve the member record for this user.
  const { data: member, error: memberError } = await admin
    .from("members")
    .select("id, profile_id, profiles(email, full_name)")
    .eq("profile_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (memberError || !member) {
    return json({ error: "member_profile_required" }, 400);
  }

  // Validate the plan and its Stripe price.
  const { data: plan, error: planError } = await admin
    .from("membership_plans")
    .select("id, name_en, plan_type, price_minor, currency, stripe_price_id, is_active")
    .eq("id", body.plan_id)
    .is("deleted_at", null)
    .maybeSingle();
  if (planError || !plan || !plan.is_active) {
    return json({ error: "plan_not_found" }, 404);
  }

  // Subscriptions (monthly/annual) need a recurring price id; one-time packs
  // can fall back to price_data if no price id is configured.
  const isRecurring = plan.plan_type === "monthly" || plan.plan_type === "subscription";

  const lineItem = plan.stripe_price_id
    ? { price: plan.stripe_price_id, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: (plan.currency ?? "ILS").toLowerCase(),
          unit_amount: plan.price_minor,
          product_data: { name: plan.name_en },
          ...(isRecurring
            ? { recurring: { interval: plan.plan_type === "monthly" ? "month" : "year" } }
            : {}),
        },
      };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? "subscription" : "payment",
      line_items: [lineItem as Stripe.Checkout.SessionCreateParams.LineItem],
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment/cancelled`,
      client_reference_id: member.id,
      customer_email: (member.profiles as { email?: string } | null)?.email ?? user.email ?? undefined,
      metadata: {
        member_id: member.id,
        plan_id: plan.id,
        user_id: user.id,
      },
      // Mirror metadata onto the subscription so lifecycle events can resolve it.
      ...(isRecurring
        ? { subscription_data: { metadata: { member_id: member.id, plan_id: plan.id } } }
        : {}),
    });

    // Pre-create a pending payment row keyed on the checkout session for idempotency.
    await admin.from("payments").insert({
      member_id: member.id,
      plan_id: plan.id,
      provider: "stripe",
      stripe_checkout_session_id: session.id,
      amount_minor: plan.price_minor,
      currency: plan.currency ?? "ILS",
      status: "pending",
    });

    return json({ url: session.url, session_id: session.id }, 200);
  } catch (err) {
    return json({ error: "stripe_error", detail: String((err as Error).message ?? err) }, 502);
  }
});

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
