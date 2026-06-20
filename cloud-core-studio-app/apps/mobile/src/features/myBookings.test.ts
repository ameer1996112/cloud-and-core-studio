import { describe, expect, test } from "@jest/globals";
import {
  canCancelEarly,
  mapMyBookingRow,
  partitionBookings,
  type MyBooking,
  type MyBookingRow,
} from "@/lib/myBookingsData";

const now = new Date("2026-06-20T12:00:00.000Z");

function bookingRow(overrides: Partial<MyBookingRow>): MyBookingRow {
  return {
    id: "b1",
    status: "confirmed",
    class_session_id: "s1",
    class_sessions: {
      title_en: "Morning Flow",
      title_he: "זרימת בוקר",
      starts_at: "2026-06-25T06:30:00.000Z",
      ends_at: "2026-06-25T07:30:00.000Z",
      instructors: { display_name: "Maya" },
      rooms: { name: "Studio A" },
      cancellation_policies: { free_cancel_until_hours: 12 },
    },
    attendance_records: [],
    ...overrides,
  };
}

function booking(overrides: Partial<MyBooking>): MyBooking {
  return {
    bookingId: "b1",
    sessionId: "s1",
    title: "Morning Flow",
    startsAt: "2026-06-25T06:30:00.000Z",
    endsAt: "2026-06-25T07:30:00.000Z",
    instructorName: "Maya",
    roomName: "Studio A",
    status: "confirmed",
    attendance: null,
    isWaitlisted: false,
    waitlistPosition: null,
    cancellationWindowHours: 12,
    ...overrides,
  };
}

describe("my booking mapping", () => {
  test("maps a confirmed booking with localized title and attendance", () => {
    const mapped = mapMyBookingRow(
      bookingRow({ attendance_records: [{ status: "present" }] }),
      "en",
    );
    expect(mapped.title).toBe("Morning Flow");
    expect(mapped.instructorName).toBe("Maya");
    expect(mapped.attendance).toBe("present");
    expect(mapped.cancellationWindowHours).toBe(12);
  });
});

describe("partitionBookings", () => {
  test("future confirmed -> upcoming; past/terminal -> history", () => {
    const futureConfirmed = booking({ bookingId: "future", startsAt: "2026-06-25T06:30:00.000Z" });
    const pastCompleted = booking({
      bookingId: "done",
      status: "completed",
      startsAt: "2026-06-10T06:30:00.000Z",
    });
    const cancelled = booking({
      bookingId: "x",
      status: "cancelled",
      startsAt: "2026-06-22T06:30:00.000Z",
    });
    const { upcoming, history } = partitionBookings([futureConfirmed, pastCompleted, cancelled], now);
    expect(upcoming.map((b) => b.bookingId)).toEqual(["future"]);
    expect(history.map((b) => b.bookingId).sort()).toEqual(["done", "x"]);
  });

  test("future waitlisted entries are upcoming", () => {
    const wl = booking({ bookingId: "wl", isWaitlisted: true, status: "waitlisted", waitlistPosition: 1 });
    const { upcoming } = partitionBookings([wl], now);
    expect(upcoming).toHaveLength(1);
  });

  test("confirmed but past start moves to history", () => {
    const stale = booking({ bookingId: "stale", startsAt: "2026-06-10T06:30:00.000Z" });
    const { upcoming, history } = partitionBookings([stale], now);
    expect(upcoming).toHaveLength(0);
    expect(history.map((b) => b.bookingId)).toEqual(["stale"]);
  });
});

describe("canCancelEarly", () => {
  test("confirmed booking well before deadline can cancel early", () => {
    // start 2026-06-25 06:30, window 12h => deadline 2026-06-24 18:30; now is 06-20 => early
    expect(canCancelEarly(booking({}), now)).toBe(true);
  });

  test("inside the cancellation window cannot cancel early", () => {
    const soon = booking({ startsAt: "2026-06-20T18:00:00.000Z" }); // 6h away, window 12h
    expect(canCancelEarly(soon, now)).toBe(false);
  });

  test("non-confirmed booking cannot cancel early", () => {
    expect(canCancelEarly(booking({ status: "completed" }), now)).toBe(false);
  });

  test("waitlisted entry can always leave", () => {
    expect(canCancelEarly(booking({ isWaitlisted: true, status: "waitlisted" }), now)).toBe(true);
  });
});
