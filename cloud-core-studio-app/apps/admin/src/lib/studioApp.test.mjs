import assert from "node:assert/strict";
import test from "node:test";

import {
  buildStudioSnapshot,
  capacityTone,
  formatIls,
  getDaySchedule,
  getMemberCreditsLabel,
} from "./studioApp.mjs";

test("capacity tone follows reference thresholds", () => {
  assert.equal(capacityTone(6, 10), "green");
  assert.equal(capacityTone(8, 10), "gold");
  assert.equal(capacityTone(10, 10), "red");
});

test("studio snapshot exposes admin stats and sorted daily schedule", () => {
  const snapshot = buildStudioSnapshot();

  assert.equal(snapshot.stats.totalMembers, 8);
  assert.equal(snapshot.stats.bookingsToday, 47);
  assert.equal(snapshot.stats.revenueMonth, 18400);
  assert.equal(snapshot.stats.attendanceRate, 87);
  assert.equal(formatIls(snapshot.stats.revenueMonth), "₪18,400");

  const friday = getDaySchedule(snapshot, "Sun");
  assert.deepEqual(
    friday.map((session) => session.time),
    ["07:30", "09:00", "11:15", "17:30", "19:00"],
  );
});

test("member credit labels distinguish unlimited plans from packs", () => {
  const snapshot = buildStudioSnapshot();

  assert.equal(getMemberCreditsLabel(snapshot.members[0]), "∞ Unlimited");
  assert.equal(getMemberCreditsLabel(snapshot.members[2]), "6 left");
});
