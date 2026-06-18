import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

Deno.serve(async (request) => {
  const { class_session_id } = await request.json();
  if (!class_session_id) {
    return Response.json({ error: "class_session_id is required" }, { status: 400 });
  }

  const { data: session, error: sessionError } = await supabase
    .from("class_sessions")
    .select("id, waitlist_confirm_minutes")
    .eq("id", class_session_id)
    .single();

  if (sessionError) {
    return Response.json({ error: sessionError.message }, { status: 400 });
  }

  const { data: entry, error } = await supabase
    .from("waitlist_entries")
    .select("id, member_id")
    .eq("class_session_id", class_session_id)
    .eq("status", "waiting")
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  if (!entry) {
    return Response.json({ promoted: false });
  }

  const offerExpiresAt = new Date(Date.now() + session.waitlist_confirm_minutes * 60 * 1000).toISOString();
  await supabase
    .from("waitlist_entries")
    .update({ status: "offered", offered_at: new Date().toISOString(), offer_expires_at: offerExpiresAt })
    .eq("id", entry.id);

  return Response.json({ promoted: true, waitlist_entry_id: entry.id, offer_expires_at: offerExpiresAt });
});
