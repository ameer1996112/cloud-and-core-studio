import { describe, expect, test } from "@jest/globals";
import { capacityTone, formatIls, getDaySchedule, getMemberCreditsLabel, studioSnapshot } from "./studioPrototype";

describe("studio prototype data", () => {
  test("matches the web prototype overview numbers", () => {
    expect(studioSnapshot.stats).toEqual({
      totalMembers: 8,
      bookingsToday: 47,
      revenueMonth: 18400,
    });
    expect(formatIls(studioSnapshot.stats.revenueMonth)).toBe("₪18,400");
  });

  test("uses the same capacity tones as the web shell", () => {
    expect(capacityTone(6, 10)).toBe("green");
    expect(capacityTone(8, 10)).toBe("gold");
    expect(capacityTone(10, 10)).toBe("red");
  });

  test("sorts Friday schedule and labels unlimited credits", () => {
    expect(getDaySchedule("Fri").map((session) => session.time)).toEqual(["09:00", "11:00", "13:00", "17:00", "19:30"]);
    expect(getMemberCreditsLabel(studioSnapshot.members[0])).toBe("∞ Unlimited");
    expect(getMemberCreditsLabel(studioSnapshot.members[2])).toBe("6 left");
  });
});
