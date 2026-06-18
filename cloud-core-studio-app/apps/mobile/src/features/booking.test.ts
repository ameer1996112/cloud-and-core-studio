import { describe, expect, test } from "@jest/globals";
import { decideBooking, type ClassSession, type MemberEntitlement } from "@cloud-core/shared";

const session: Pick<ClassSession, "capacity" | "bookedCount" | "status"> = {
  capacity: 10,
  bookedCount: 4,
  status: "open",
};

const entitlement: Pick<MemberEntitlement, "canBook" | "remainingCredits" | "status"> = {
  canBook: true,
  remainingCredits: 3,
  status: "active",
};

describe("booking rules", () => {
  test("allows active members with capacity to book", () => {
    expect(decideBooking(session, entitlement)).toEqual({ allowed: true, mode: "book" });
  });

  test("routes full classes to waitlist", () => {
    expect(decideBooking({ ...session, bookedCount: 10 }, entitlement)).toEqual({
      allowed: true,
      mode: "waitlist",
      reason: "class_full",
    });
  });

  test("blocks expired or missing entitlement", () => {
    expect(decideBooking(session, { ...entitlement, status: "expired" })).toMatchObject({
      allowed: false,
      reason: "membership_required",
    });
  });
});
