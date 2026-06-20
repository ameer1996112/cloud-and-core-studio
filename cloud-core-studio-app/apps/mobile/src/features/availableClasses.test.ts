import { describe, expect, test } from "@jest/globals";
import { filterAvailableClassRows, mapAvailableClassRow, selectSessionById } from "@/lib/availableClassesData";

describe("available class loading", () => {
  test("maps Supabase class session rows into mobile class sessions", () => {
    const session = mapAvailableClassRow({
      id: "session-1",
      category_id: "yoga",
      title_he: "יוגה בוקר",
      title_en: "Morning Flow Yoga",
      description_he: "זרימה עדינה.",
      description_en: "Gentle morning flow.",
      starts_at: "2026-06-21T06:30:00.000Z",
      ends_at: "2026-06-21T07:30:00.000Z",
      level: "beginner",
      capacity: 12,
      status: "open",
      cancellation_policies: { free_cancel_until_hours: 12 },
      instructors: {
        id: "instructor-1",
        profile_id: "profile-1",
        display_name: "Maya Khoury",
        bio: "Aerial yoga instructor.",
        avatar_url: null,
      },
      rooms: { name: "Studio A" },
      bookings: [{ status: "confirmed" }, { status: "cancelled" }, { status: "completed" }],
      waitlist_entries: [{ status: "waiting" }, { status: "cancelled" }],
    });

    expect(session).toMatchObject({
      id: "session-1",
      categoryId: "yoga",
      titleEn: "Morning Flow Yoga",
      instructor: { displayName: "Maya Khoury" },
      roomName: "Studio A",
      capacity: 12,
      bookedCount: 2,
      waitlistCount: 1,
      status: "open",
      cancellationWindowHours: 12,
    });
  });

  test("keeps only future customer-visible classes", () => {
    const rows = [
      { id: "past", starts_at: "2026-06-20T08:00:00.000Z", status: "open" },
      { id: "future-open", starts_at: "2026-06-21T08:00:00.000Z", status: "open" },
      { id: "future-waitlist", starts_at: "2026-06-21T09:00:00.000Z", status: "waitlist" },
      { id: "closed", starts_at: "2026-06-21T09:30:00.000Z", status: "closed" },
      { id: "cancelled", starts_at: "2026-06-21T10:00:00.000Z", status: "cancelled" },
      { id: "draft", starts_at: "2026-06-21T11:00:00.000Z", status: "draft" },
    ];

    expect(filterAvailableClassRows(rows, new Date("2026-06-20T12:00:00.000Z")).map((row) => row.id)).toEqual([
      "future-open",
      "future-waitlist",
    ]);
  });

  test("selects a requested session without falling through to the first class", () => {
    const sessions = [
      { id: "class-1", titleEn: "First class" },
      { id: "class-2", titleEn: "Second class" },
    ];

    expect(selectSessionById(sessions, "class-2")?.titleEn).toBe("Second class");
    expect(selectSessionById(sessions, "missing")?.titleEn).toBe("First class");
  });
});
