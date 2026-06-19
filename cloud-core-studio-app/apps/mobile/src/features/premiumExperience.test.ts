import { describe, expect, test } from "@jest/globals";
import { sessions } from "@/fixtures/classes";
import {
  getEditorialLine,
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

  test("exposes boutique editorial lines in both languages", () => {
    expect(getEditorialLine(premiumExperience.editorial.heroLine, "en")).toBe(
      "Noa, Maya saved a quiet spot for you.",
    );
    expect(getEditorialLine(premiumExperience.editorial.heroLine, "he")).toBe("נועה, מאיה שמרה לך מקום שקט.");
  });

  test("keeps editorial image keys stable for local assets", () => {
    expect(premiumExperience.editorial.images.homeHero).toBe("homeHero");
    expect(premiumExperience.editorial.images.classMood).toBe("classMood");
    expect(premiumExperience.editorial.images.instructorMoment).toBe("instructorMoment");
  });
});
