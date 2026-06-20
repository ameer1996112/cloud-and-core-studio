import { mapBookingError, normalizeBookingRpcResult, type BookingResult } from "@/lib/bookingsData";

export function hasSupabaseBookingConfig() {
  return Boolean(
    process.env.EXPO_PUBLIC_SUPABASE_URL &&
      (process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  );
}

export async function bookClassSession(sessionId: string): Promise<BookingResult> {
  if (!hasSupabaseBookingConfig()) {
    return { status: "blocked", reason: "backend_unavailable" };
  }

  const { supabase } = await import("@/lib/supabase");
  const { data, error } = await supabase.rpc("book_class", { p_session_id: sessionId });

  if (error) {
    return mapBookingError(error.message);
  }

  return normalizeBookingRpcResult(data ?? {});
}
