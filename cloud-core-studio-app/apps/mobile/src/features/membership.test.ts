import { describe, expect, test } from "@jest/globals";
import {
  isMembershipBookable,
  mapMembershipRow,
  selectActiveMembership,
  type MembershipRow,
} from "@/lib/membershipData";

const now = new Date("2026-06-20T12:00:00.000Z");

function row(overrides: Partial<MembershipRow>): MembershipRow {
  return {
    id: "m1",
    status: "active",
    starts_at: "2026-06-01T00:00:00.000Z",
    expires_at: "2026-07-01T00:00:00.000Z",
    remaining_credits: 5,
    membership_plans: { name_en: "10-Class Pack", name_he: "כרטיסייה", plan_type: "class_card" },
    ...overrides,
  };
}

describe("membership eligibility", () => {
  test("active credit-based membership with credits is bookable", () => {
    expect(isMembershipBookable(row({}), now)).toBe(true);
  });

  test("active unlimited membership (null credits) is bookable", () => {
    expect(isMembershipBookable(row({ remaining_credits: null }), now)).toBe(true);
  });

  test("zero credits is not bookable", () => {
    expect(isMembershipBookable(row({ remaining_credits: 0 }), now)).toBe(false);
  });

  test("expired membership is not bookable", () => {
    expect(isMembershipBookable(row({ expires_at: "2026-06-10T00:00:00.000Z" }), now)).toBe(false);
  });

  test("non-active status is not bookable", () => {
    expect(isMembershipBookable(row({ status: "frozen" }), now)).toBe(false);
  });
});

describe("membership mapping", () => {
  test("maps credit-based plan with localized name", () => {
    const summary = mapMembershipRow(row({}), "en");
    expect(summary.planName).toBe("10-Class Pack");
    expect(summary.isUnlimited).toBe(false);
    expect(summary.remainingCredits).toBe(5);
    expect(summary.canBook).toBe(true);
  });

  test("marks unlimited memberships", () => {
    const summary = mapMembershipRow(row({ remaining_credits: null }), "he");
    expect(summary.isUnlimited).toBe(true);
    expect(summary.planName).toBe("כרטיסייה");
  });
});

describe("active membership selection", () => {
  test("prefers a bookable membership over an exhausted one", () => {
    const exhausted = row({ id: "exhausted", remaining_credits: 0, starts_at: "2026-06-15T00:00:00.000Z" });
    const bookable = row({ id: "bookable", remaining_credits: 3, starts_at: "2026-06-02T00:00:00.000Z" });
    const selected = selectActiveMembership([exhausted, bookable], now);
    expect(selected?.id).toBe("bookable");
  });

  test("returns null when there are no memberships", () => {
    expect(selectActiveMembership([], now)).toBeNull();
  });
});
