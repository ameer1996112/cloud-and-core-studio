import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const webhookSecret = Deno.env.get("PAYMENT_WEBHOOK_SECRET") ?? "";

function timingSafeEqual(a: string, b: string) {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i];
  return diff === 0;
}

Deno.serve(async (request) => {
  const signature = request.headers.get("x-payment-signature") ?? "";
  const rawBody = await request.text();

  if (!webhookSecret || !timingSafeEqual(signature, webhookSecret)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    provider: string;
    provider_payment_id: string;
    provider_event_id?: string;
    event_type: string;
    status: "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
  };

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .update({ status: event.status, updated_at: new Date().toISOString() })
    .eq("provider", event.provider)
    .eq("provider_payment_id", event.provider_payment_id)
    .select("id")
    .single();

  if (paymentError) {
    return Response.json({ error: paymentError.message }, { status: 400 });
  }

  await supabase.from("payment_events").insert({
    payment_id: payment.id,
    provider: event.provider,
    provider_event_id: event.provider_event_id,
    event_type: event.event_type,
    payload: event,
  });

  return Response.json({ ok: true });
});
