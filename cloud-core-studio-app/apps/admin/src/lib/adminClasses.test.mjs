import assert from "node:assert/strict";
import test from "node:test";

import { fallbackClassSessions, mapClassSessionRow } from "./adminClasses.mjs";

test("maps Supabase class session rows into admin schedule view models", () => {
  const session = mapClassSessionRow({
    id: "session-1",
    title_en: "Morning Flow Yoga",
    title_he: "יוגה בוקר",
    description_en: "Grounded aerial flow.",
    starts_at: "2026-06-21T06:30:00.000Z",
    ends_at: "2026-06-21T07:30:00.000Z",
    capacity: 12,
    status: "open",
    class_categories: { name_en: "Yoga", color: "#7aaad0" },
    instructors: { display_name: "Maya Khoury" },
    rooms: { name: "Studio A" },
    bookings: [{ status: "confirmed" }, { status: "cancelled" }, { status: "confirmed" }],
    waitlist_entries: [{ status: "waiting" }, { status: "cancelled" }],
  });

  assert.equal(session.name, "Morning Flow Yoga");
  assert.equal(session.type, "Yoga");
  assert.equal(session.timeRange, "09:30-10:30");
  assert.equal(session.instructor, "Maya Khoury");
  assert.equal(session.studio, "Studio A");
  assert.equal(session.capacity, 12);
  assert.equal(session.confirmedCount, 2);
  assert.equal(session.waitlistCount, 1);
  assert.equal(session.availableSpots, 10);
});

test("fallback sessions cover the first MVP admin class workflow", () => {
  assert.equal(fallbackClassSessions.length >= 3, true);
  assert.equal(fallbackClassSessions.some((session) => session.name === "Morning Flow Yoga"), true);
  assert.equal(fallbackClassSessions.every((session) => session.capacity > 0), true);
});
