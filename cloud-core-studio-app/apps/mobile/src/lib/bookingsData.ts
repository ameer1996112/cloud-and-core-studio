export type BookingResult =
  | { status: "booked"; bookingId: string }
  | { status: "waitlisted"; waitlistId: string; waitlistPosition: number }
  | { status: "blocked"; reason: BookingBlockedReason };

export type BookingBlockedReason =
  | "backend_unavailable"
  | "membership_required"
  | "no_credits"
  | "already_booked"
  | "class_not_bookable"
  | "class_full"
  | "unknown";

type BookingRpcPayload = {
  status?: unknown;
  booking_id?: unknown;
  waitlist_id?: unknown;
  waitlist_position?: unknown;
};

const knownBlockedReasons = new Set<BookingBlockedReason>([
  "membership_required",
  "no_credits",
  "already_booked",
  "class_not_bookable",
  "class_full",
]);

export function normalizeBookingRpcResult(payload: BookingRpcPayload): BookingResult {
  if (payload.status === "booked" && typeof payload.booking_id === "string") {
    return { status: "booked", bookingId: payload.booking_id };
  }

  if (payload.status === "waitlisted" && typeof payload.waitlist_id === "string") {
    return {
      status: "waitlisted",
      waitlistId: payload.waitlist_id,
      waitlistPosition: typeof payload.waitlist_position === "number" ? payload.waitlist_position : 0,
    };
  }

  return { status: "blocked", reason: "unknown" };
}

export function mapBookingError(message: string | null | undefined): BookingResult {
  const normalized = (message ?? "").trim();
  const reason = knownBlockedReasons.has(normalized as BookingBlockedReason) ? (normalized as BookingBlockedReason) : "unknown";

  return { status: "blocked", reason };
}
