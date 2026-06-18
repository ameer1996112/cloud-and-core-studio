import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

Deno.serve(async (request) => {
  const input = await request.json() as {
    profile_id: string;
    channel: "push" | "email" | "sms" | "whatsapp";
    type: string;
    title: string;
    body: string;
    payload?: Record<string, unknown>;
  };

  if (!input.profile_id || !input.channel || !input.title) {
    return Response.json({ error: "profile_id, channel, and title are required" }, { status: 400 });
  }

  const { error } = await supabase.from("notifications").insert({
    profile_id: input.profile_id,
    channel: input.channel,
    type: input.type,
    title: input.title,
    body: input.body,
    payload: input.payload ?? {},
    sent_at: new Date().toISOString(),
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ queued: true });
});
