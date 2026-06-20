import { hasSupabaseMobileConfig } from "@/lib/availableClasses";
import {
  mapMembershipRow,
  selectActiveMembership,
  type MembershipRow,
  type MembershipSummary,
} from "@/lib/membershipData";
import {
  mapMyBookingRow,
  mapMyWaitlistRow,
  partitionBookings,
  type MyBooking,
  type MyBookingRow,
  type MyWaitlistRow,
} from "@/lib/myBookingsData";

export interface MembershipResult {
  membership: MembershipSummary | null;
  isLive: boolean;
  error: string | null;
}

export interface MyBookingsResult {
  upcoming: MyBooking[];
  history: MyBooking[];
  isLive: boolean;
  error: string | null;
}

export type CancelResult =
  | { status: "cancelled"; refunded: boolean }
  | { status: "late_cancelled"; refunded: boolean }
  | { status: "error"; reason: string };

const membershipSelect = `
  id, status, starts_at, expires_at, remaining_credits,
  membership_plans(name_en, name_he, plan_type)
`;

const bookingSelect = `
  id, status, class_session_id,
  class_sessions(
    title_en, title_he, starts_at, ends_at,
    instructors(display_name),
    rooms(name),
    cancellation_policies(free_cancel_until_hours)
  ),
  attendance_records(status)
`;

const waitlistSelect = `
  id, position, status, class_session_id,
  class_sessions(
    title_en, title_he, starts_at, ends_at,
    instructors(display_name),
    rooms(name),
    cancellation_policies(free_cancel_until_hours)
  )
`;

/** Load the signed-in member's current membership summary (credits/plan/status). */
export async function loadMyMembership(locale: "he" | "en" = "en"): Promise<MembershipResult> {
  if (!hasSupabaseMobileConfig()) {
    return { membership: null, isLive: false, error: null };
  }

  const { supabase } = await import("@/lib/supabase");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { membership: null, isLive: true, error: "not_signed_in" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("profile_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!member) {
    return { membership: null, isLive: true, error: null };
  }

  const { data, error } = await supabase
    .from("memberships")
    .select(membershipSelect)
    .eq("member_id", member.id)
    .is("deleted_at", null);

  if (error) {
    return { membership: null, isLive: false, error: error.message };
  }

  const rows = (data ?? []) as MembershipRow[];
  const active = selectActiveMembership(rows);
  return {
    membership: active ? mapMembershipRow(active, locale) : null,
    isLive: true,
    error: null,
  };
}

/** Load the signed-in member's bookings + waitlist entries, split into upcoming/history. */
export async function loadMyBookings(
  locale: "he" | "en" = "en",
  now = new Date(),
): Promise<MyBookingsResult> {
  if (!hasSupabaseMobileConfig()) {
    return { upcoming: [], history: [], isLive: false, error: null };
  }

  const { supabase } = await import("@/lib/supabase");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { upcoming: [], history: [], isLive: true, error: "not_signed_in" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("profile_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!member) {
    return { upcoming: [], history: [], isLive: true, error: null };
  }

  const [bookingsResult, waitlistResult] = await Promise.all([
    supabase.from("bookings").select(bookingSelect).eq("member_id", member.id).is("deleted_at", null),
    supabase
      .from("waitlist_entries")
      .select(waitlistSelect)
      .eq("member_id", member.id)
      .in("status", ["waiting", "offered"])
      .is("deleted_at", null),
  ]);

  if (bookingsResult.error) {
    return { upcoming: [], history: [], isLive: false, error: bookingsResult.error.message };
  }

  const bookings = ((bookingsResult.data ?? []) as MyBookingRow[]).map((row) => mapMyBookingRow(row, locale));
  const waitlisted = ((waitlistResult.data ?? []) as MyWaitlistRow[]).map((row) => mapMyWaitlistRow(row, locale));
  const { upcoming, history } = partitionBookings([...bookings, ...waitlisted], now);

  return { upcoming, history, isLive: true, error: null };
}

/** Cancel a booking via the transactional cancel_booking RPC. */
export async function cancelBooking(bookingId: string): Promise<CancelResult> {
  if (!hasSupabaseMobileConfig()) {
    return { status: "error", reason: "backend_unavailable" };
  }

  const { supabase } = await import("@/lib/supabase");
  const { data, error } = await supabase.rpc("cancel_booking", { p_booking_id: bookingId });
  if (error) {
    return { status: "error", reason: error.message };
  }

  const result = (data ?? {}) as { status?: string; refunded?: boolean };
  if (result.status === "cancelled") {
    return { status: "cancelled", refunded: Boolean(result.refunded) };
  }
  if (result.status === "late_cancelled") {
    return { status: "late_cancelled", refunded: Boolean(result.refunded) };
  }
  return { status: "error", reason: "unknown" };
}

/**
 * Start a Stripe Checkout for a plan via the stripe-checkout Edge Function.
 * Returns the hosted checkout URL to open in a browser.
 */
export async function createCheckoutSession(
  planId: string,
): Promise<{ url: string } | { error: string }> {
  if (!hasSupabaseMobileConfig()) {
    return { error: "backend_unavailable" };
  }

  const { supabase } = await import("@/lib/supabase");
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return { error: "not_signed_in" };
  }

  const { data, error } = await supabase.functions.invoke("stripe-checkout", {
    body: { plan_id: planId },
  });
  if (error) {
    return { error: error.message };
  }
  const payload = (data ?? {}) as { url?: string; error?: string };
  if (payload.url) return { url: payload.url };
  return { error: payload.error ?? "checkout_failed" };
}
