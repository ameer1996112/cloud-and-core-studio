import { describe, expect, test } from "@jest/globals";
import { sessions } from "@/fixtures/classes";
import {
  getLocalizedText,
  getRecommendedSessions,
  getSessionInsight,
  premiumExperience,
} from "@/fixtures/premiumExperience";

describe("premium experience helpers", () => {
  test("returns localized Hebrew and English strings", () => {
    expect(getLocalizedText({ he: "שלום", en: "Hello" }, "he")).toBe("שלום");
    expect(getLocalizedText({ he: "שלום", en: "Hello" }, "en")).toBe("Hello");
  });

  test("orders recommended session first without dropping sessions", () => {
    const ordered = getRecommendedSessions(sessions, premiumExperience);
    expect(ordered).toHaveLength(sessions.length);
    expect(ordered[0]?.id).toBe(premiumExperience.today.recommendedSessionId);
    expect(new Set(ordered.map((session) => session.id)).size).toBe(sessions.length);
  });

  test("finds smart insight for a class session", () => {
    const insight = getSessionInsight("class-2", premiumExperience);
    expect(insight?.fitScore).toBeGreaterThanOrEqual(80);
    expect(insight?.bookingCta.en).toBe("Join priority waitlist");
  });
});
