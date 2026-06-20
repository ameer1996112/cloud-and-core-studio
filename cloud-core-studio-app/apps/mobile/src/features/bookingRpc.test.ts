import { describe, expect, test } from "@jest/globals";
import { mapBookingError, normalizeBookingRpcResult } from "@/lib/bookingsData";

describe("booking RPC mapping", () => {
  test("normalizes confirmed booking results", () => {
    expect(normalizeBookingRpcResult({ status: "booked", booking_id: "booking-1" })).toEqual({
      status: "booked",
      bookingId: "booking-1",
    });
  });

  test("normalizes waitlist booking results", () => {
    expect(normalizeBookingRpcResult({ status: "waitlisted", waitlist_id: "waitlist-1", waitlist_position: 3 })).toEqual({
      status: "waitlisted",
      waitlistId: "waitlist-1",
      waitlistPosition: 3,
    });
  });

  test("maps database exception messages into stable blocked reasons", () => {
    expect(mapBookingError("membership_required")).toEqual({ status: "blocked", reason: "membership_required" });
    expect(mapBookingError("no_credits")).toEqual({ status: "blocked", reason: "no_credits" });
    expect(mapBookingError("already_booked")).toEqual({ status: "blocked", reason: "already_booked" });
    expect(mapBookingError("class_not_bookable")).toEqual({ status: "blocked", reason: "class_not_bookable" });
  });
});
