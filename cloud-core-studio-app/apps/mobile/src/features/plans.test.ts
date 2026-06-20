import { describe, expect, test } from "@jest/globals";
import { formatPrice, mapPlanRow, type PlanRow } from "@/lib/plansData";

function row(overrides: Partial<PlanRow>): PlanRow {
  return {
    id: "p1",
    name_en: "10-Class Pack",
    name_he: "כרטיסיית 10 שיעורים",
    plan_type: "class_card",
    price_minor: 35000,
    currency: "ILS",
    credits: 10,
    duration_days: 180,
    is_active: true,
    ...overrides,
  };
}

describe("plan mapping", () => {
  test("maps a credit pack with localized name", () => {
    const card = mapPlanRow(row({}), "en");
    expect(card.name).toBe("10-Class Pack");
    expect(card.credits).toBe(10);
    expect(card.isUnlimited).toBe(false);
  });

  test("treats null credits as unlimited", () => {
    const card = mapPlanRow(row({ credits: null, plan_type: "monthly", price_minor: 28000 }), "he");
    expect(card.isUnlimited).toBe(true);
    expect(card.name).toBe("כרטיסיית 10 שיעורים");
  });
});

describe("price formatting", () => {
  test("formats agorot to ILS major units", () => {
    // 28000 agorot = ₪280
    expect(formatPrice(28000, "ILS", "en")).toContain("280");
    expect(formatPrice(280000, "ILS", "en")).toContain("2,800");
  });
});
