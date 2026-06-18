# Premium Mobile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the basic member mobile surfaces with a premium Cloud&Core concierge experience backed by structured smart fixture data.

**Architecture:** Keep the current Expo Router structure and improve the member app incrementally. Add a typed premium experience model in fixtures first, then build focused visual modules that consume those data boundaries so Supabase can replace fixtures later. Each screen remains RTL-safe through `useCopy()` direction handling.

**Tech Stack:** Expo SDK 54, React Native 0.81.5, React 19.1.0, Expo Router 6, TypeScript, Jest, Supabase client scaffolding.

## Global Constraints

- Mobile app remains in `apps/mobile`.
- Use fixture-backed smart states now; do not wire a real recommendation backend in this pass.
- Do not hard-code any payment provider.
- Hebrew RTL and English LTR must both remain usable.
- The first screen must no longer resemble a generic card dashboard.
- The member must see one dominant recommended action immediately.
- Existing booking-rule tests must still pass.
- Verification commands: `npm run typecheck`, `npm test`, `npx expo install --check`, `npx expo export --platform ios --output-dir /tmp/cloud-core-mobile-export`.
- Expo Go notification limitations remain acceptable; full push testing is out of scope for this pass.

---

## File Structure

- `apps/mobile/src/fixtures/premiumExperience.ts`: creates typed premium member experience data and helper functions for localized text.
- `apps/mobile/src/fixtures/classes.ts`: keeps class session fixtures only; exports remain compatible with existing tests.
- `apps/mobile/src/theme/colors.ts`: expands premium tokens and shadows without changing existing color names.
- `apps/mobile/src/components/PremiumHero.tsx`: full-width luxury concierge hero with dominant booking CTA.
- `apps/mobile/src/components/FitScoreRing.tsx`: small reusable class-fit score visualization.
- `apps/mobile/src/components/InsightPill.tsx`: compact reason/benefit chip.
- `apps/mobile/src/components/MembershipHealthPanel.tsx`: premium membership rhythm/credit panel.
- `apps/mobile/src/components/ConciergePanel.tsx`: studio request/status module.
- `apps/mobile/src/components/TimelineClassCard.tsx`: schedule-focused premium class card.
- `apps/mobile/src/features/premiumExperience.test.ts`: unit tests for recommendation ordering and localized accessors.
- `apps/mobile/app/(tabs)/index.tsx`: premium home composition.
- `apps/mobile/app/(tabs)/schedule.tsx`: intent selector and recommendation-first timeline.
- `apps/mobile/app/class/[id]/index.tsx`: class dossier with fit/preparation/waitlist sections.
- `apps/mobile/app/(tabs)/profile.tsx`: membership health and concierge entry points.

---

### Task 1: Premium Experience Data Boundary

**Files:**
- Create: `apps/mobile/src/fixtures/premiumExperience.ts`
- Create: `apps/mobile/src/features/premiumExperience.test.ts`
- Modify: `apps/mobile/src/fixtures/classes.ts`

**Interfaces:**
- Consumes: `ClassSession`, `MemberEntitlement`, `Locale` from `@cloud-core/shared`.
- Produces:
  - `PremiumExperience` type
  - `premiumExperience: PremiumExperience`
  - `getLocalizedText(text: LocalizedText, locale: Locale): string`
  - `getRecommendedSessions(sessions: ClassSession[], experience: PremiumExperience): ClassSession[]`
  - `getSessionInsight(sessionId: string, experience: PremiumExperience): SessionInsight | undefined`

- [ ] **Step 1: Write failing tests for premium data helpers**

Create `apps/mobile/src/features/premiumExperience.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm --workspace @cloud-core/mobile test -- premiumExperience.test.ts
```

Expected: FAIL because `@/fixtures/premiumExperience` does not exist.

- [ ] **Step 3: Create premium experience fixture**

Create `apps/mobile/src/fixtures/premiumExperience.ts`:

```ts
import type { ClassSession, Locale, MemberEntitlement } from "@cloud-core/shared";
import { entitlement } from "@/fixtures/classes";

export interface LocalizedText {
  he: string;
  en: string;
}

export interface SessionInsight {
  sessionId: string;
  fitScore: number;
  waitlistOdds: number | null;
  urgency: "low" | "medium" | "high";
  bookingCta: LocalizedText;
  reasons: LocalizedText[];
  preparation: LocalizedText[];
}

export interface ConciergeRequest {
  id: string;
  title: LocalizedText;
  status: LocalizedText;
  tone: "approved" | "waiting" | "reply";
}

export interface MembershipHealth {
  label: LocalizedText;
  status: LocalizedText;
  rhythm: LocalizedText;
  renewalAdvice: LocalizedText;
  score: number;
  entitlement: MemberEntitlement;
}

export interface PremiumExperience {
  member: {
    firstName: LocalizedText;
    greeting: LocalizedText;
  };
  today: {
    recommendedSessionId: string;
    headline: LocalizedText;
    summary: LocalizedText;
    primaryCta: LocalizedText;
  };
  membership: MembershipHealth;
  sessionInsights: SessionInsight[];
  concierge: ConciergeRequest[];
}

export const premiumExperience: PremiumExperience = {
  member: {
    firstName: { he: "נועה", en: "Noa" },
    greeting: {
      he: "היי נועה, השיעור הבא שלך מוכן",
      en: "Hi Noa, your next class is ready",
    },
  },
  today: {
    recommendedSessionId: "class-2",
    headline: {
      he: "הבחירה המדויקת להיום",
      en: "Your best-fit class today",
    },
    summary: {
      he: "מתיחות וזרימה מתאים לרמת העומס שלך, למנוי הפעיל ולחלון הביטול.",
      en: "Stretch & Flow fits your current load, active membership, and cancellation window.",
    },
    primaryCta: {
      he: "להזמין את השיעור המתאים",
      en: "Book my best class",
    },
  },
  membership: {
    label: { he: "בריאות מנוי", en: "Membership health" },
    status: { he: "בריא", en: "Healthy" },
    rhythm: {
      he: "את בקצב של 2 שיעורים בשבוע",
      en: "You are on pace for 2 classes a week",
    },
    renewalAdvice: {
      he: "חידוש מומלץ עד 24 באוגוסט כדי לשמור על הרצף.",
      en: "Renew by Aug 24 to keep your rhythm.",
    },
    score: 72,
    entitlement,
  },
  sessionInsights: [
    {
      sessionId: "class-1",
      fitScore: 88,
      waitlistOdds: null,
      urgency: "medium",
      bookingCta: { he: "לשמור מקום", en: "Reserve my place" },
      reasons: [
        { he: "מתאים לרמת מתחילות", en: "Fits beginner level" },
        { he: "נותרו מקומות פנויים", en: "Spots are still available" },
        { he: "חלון הביטול עדיין פתוח", en: "Cancellation window is still open" },
      ],
      preparation: [
        { he: "להגיע 10 דקות לפני תחילת השיעור", en: "Arrive 10 minutes before class" },
        { he: "בגדים נוחים וללא תכשיטים", en: "Comfortable clothes and no jewelry" },
      ],
    },
    {
      sessionId: "class-2",
      fitScore: 92,
      waitlistOdds: 86,
      urgency: "high",
      bookingCta: { he: "להצטרף להמתנה חכמה", en: "Join priority waitlist" },
      reasons: [
        { he: "התאמה גבוהה להיסטוריית השיעורים שלך", en: "High match with your class history" },
        { he: "סיכוי קידום גבוה מרשימת המתנה", en: "High waitlist promotion odds" },
        { he: "עומס שיעור מאוזן אחרי יום עבודה", en: "Balanced load after work" },
      ],
      preparation: [
        { he: "אם יתפנה מקום, יהיה חלון אישור של 30 דקות", en: "If a spot opens, you will have 30 minutes to confirm" },
        { he: "מומלץ להפעיל התראת המתנה דחופה", en: "Urgent waitlist alerts are recommended" },
      ],
    },
    {
      sessionId: "class-3",
      fitScore: 74,
      waitlistOdds: null,
      urgency: "low",
      bookingCta: { he: "לראות פרטים", en: "View details" },
      reasons: [
        { he: "שיעור מתאים למשפחה ולחברות", en: "Good for family and friend invites" },
        { he: "זמינות גבוהה", en: "High availability" },
      ],
      preparation: [
        { he: "מתאים לילדות ונערות עם ליווי הורה לפי צורך", en: "Suitable for girls and teens with parent support if needed" },
      ],
    },
  ],
  concierge: [
    {
      id: "friend-trial",
      title: { he: "להביא חברה לשיעור ניסיון", en: "Bring a friend to trial" },
      status: { he: "מאושר על ידי הסטודיו", en: "Approved by studio" },
      tone: "approved",
    },
    {
      id: "freeze-request",
      title: { he: "בקשה להקפאת מנוי", en: "Membership freeze request" },
      status: { he: "ממתין לאישור", en: "Waiting for approval" },
      tone: "waiting",
    },
  ],
};

export function getLocalizedText(text: LocalizedText, locale: Locale) {
  return text[locale];
}

export function getSessionInsight(sessionId: string, experience: PremiumExperience) {
  return experience.sessionInsights.find((insight) => insight.sessionId === sessionId);
}

export function getRecommendedSessions(sessions: ClassSession[], experience: PremiumExperience) {
  return [...sessions].sort((left, right) => {
    if (left.id === experience.today.recommendedSessionId) return -1;
    if (right.id === experience.today.recommendedSessionId) return 1;
    return new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime();
  });
}
```

- [ ] **Step 4: Keep `classes.ts` focused on class sessions**

Modify `apps/mobile/src/fixtures/classes.ts` by removing `studioSignals` and `conciergeThreads` exports. Keep `entitlement` and `sessions` unchanged so existing booking tests continue to pass.

- [ ] **Step 5: Run tests to verify the data boundary**

Run:

```bash
npm --workspace @cloud-core/mobile test -- premiumExperience.test.ts
npm test
```

Expected: both commands pass.

- [ ] **Step 6: Commit**

```bash
git add apps/mobile/src/fixtures/premiumExperience.ts apps/mobile/src/features/premiumExperience.test.ts apps/mobile/src/fixtures/classes.ts
git commit -m "feat: add premium mobile experience fixtures"
```

---

### Task 2: Premium Home Screen Composition

**Files:**
- Create: `apps/mobile/src/components/PremiumHero.tsx`
- Create: `apps/mobile/src/components/FitScoreRing.tsx`
- Create: `apps/mobile/src/components/InsightPill.tsx`
- Create: `apps/mobile/src/components/MembershipHealthPanel.tsx`
- Create: `apps/mobile/src/components/ConciergePanel.tsx`
- Modify: `apps/mobile/app/(tabs)/index.tsx`
- Modify: `apps/mobile/src/theme/colors.ts`

**Interfaces:**
- Consumes:
  - `PremiumExperience`
  - `SessionInsight`
  - `getLocalizedText(text, locale)`
- Produces:
  - `PremiumHero`
  - `FitScoreRing`
  - `InsightPill`
  - `MembershipHealthPanel`
  - `ConciergePanel`

- [ ] **Step 1: Add theme tokens**

Modify `apps/mobile/src/theme/colors.ts` so it includes these exported values:

```ts
export const colors = {
  navy: "#0B1D3A",
  ink: "#071326",
  ivory: "#FAF7F2",
  gold: "#D4AF6A",
  goldSoft: "#F2DFB8",
  blue: "#B7CCE6",
  sand: "#E8DFD1",
  slate: "#6F7A8C",
  mist: "#EEF4F8",
  rose: "#E8C8BD",
  moss: "#4E6B60",
  plum: "#5E526E",
  white: "#FFFFFF",
  success: "#326A5A",
  warning: "#A66A1F",
  danger: "#A64242",
};

export const radii = {
  small: 8,
  medium: 14,
  large: 24,
  hero: 32,
};

export const shadows = {
  premium: {
    shadowColor: colors.navy,
    shadowOpacity: 0.14,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  soft: {
    shadowColor: colors.navy,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
};
```

- [ ] **Step 2: Create `FitScoreRing`**

Create `apps/mobile/src/components/FitScoreRing.tsx`:

```tsx
import { colors } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

export function FitScoreRing({ score, label }: { score: number; label: string }) {
  return (
    <View style={styles.ring}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 6,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  score: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 28,
  },
  label: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
```

- [ ] **Step 3: Create `InsightPill`**

Create `apps/mobile/src/components/InsightPill.tsx`:

```tsx
import { colors } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

export function InsightPill({ text }: { text: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    backgroundColor: "rgba(250,247,242,0.14)",
    borderWidth: 1,
    borderColor: "rgba(250,247,242,0.22)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  text: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 12,
  },
});
```

- [ ] **Step 4: Create `PremiumHero`**

Create `apps/mobile/src/components/PremiumHero.tsx`:

```tsx
import type { ClassSession } from "@cloud-core/shared";
import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { FitScoreRing } from "@/components/FitScoreRing";
import { InsightPill } from "@/components/InsightPill";
import { getLocalizedText, type PremiumExperience, type SessionInsight } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii, shadows } from "@/theme/colors";

export function PremiumHero({
  experience,
  recommendedSession,
  insight,
}: {
  experience: PremiumExperience;
  recommendedSession: ClassSession;
  insight: SessionInsight;
}) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";
  const title = locale === "he" ? recommendedSession.titleHe : recommendedSession.titleEn;

  return (
    <View style={styles.hero}>
      <View style={[styles.logoRow, direction === "rtl" && styles.rowReverse]}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.kicker, { textAlign: align }]}>Cloud&Core Studio</Text>
          <Text style={[styles.greeting, { textAlign: align }]}>{getLocalizedText(experience.member.greeting, locale)}</Text>
        </View>
      </View>

      <View style={[styles.recommendation, direction === "rtl" && styles.rowReverse]}>
        <View style={{ flex: 1, gap: 10 }}>
          <Text style={[styles.headline, { textAlign: align }]}>{getLocalizedText(experience.today.headline, locale)}</Text>
          <Text style={[styles.classTitle, { textAlign: align }]}>{title}</Text>
          <Text style={[styles.summary, { textAlign: align }]}>{getLocalizedText(experience.today.summary, locale)}</Text>
        </View>
        <FitScoreRing score={insight.fitScore} label={locale === "he" ? "התאמה" : "fit"} />
      </View>

      <View style={[styles.reasonRow, direction === "rtl" && styles.rowReverse]}>
        {insight.reasons.slice(0, 2).map((reason) => (
          <InsightPill key={reason.en} text={getLocalizedText(reason, locale)} />
        ))}
      </View>

      <Link href={`/class/${recommendedSession.id}`} asChild>
        <Pressable style={styles.cta}>
          <Text style={styles.ctaText}>{getLocalizedText(experience.today.primaryCta, locale)}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.navy,
    borderRadius: radii.hero,
    padding: 22,
    gap: 20,
    ...shadows.premium,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.ivory,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  greeting: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    marginTop: 4,
  },
  recommendation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headline: {
    color: colors.blue,
    fontWeight: "900",
    fontSize: 14,
  },
  classTitle: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 34,
    lineHeight: 38,
  },
  summary: {
    color: colors.sand,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  reasonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cta: {
    backgroundColor: colors.gold,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaText: {
    color: colors.navy,
    fontWeight: "900",
    fontSize: 16,
  },
});
```

- [ ] **Step 5: Create `MembershipHealthPanel`**

Create `apps/mobile/src/components/MembershipHealthPanel.tsx`:

```tsx
import { StyleSheet, Text, View } from "react-native";
import { getLocalizedText, type MembershipHealth } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii, shadows } from "@/theme/colors";

export function MembershipHealthPanel({ membership }: { membership: MembershipHealth }) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";
  const credits = membership.entitlement.remainingCredits ?? "∞";

  return (
    <View style={styles.panel}>
      <View style={[styles.header, direction === "rtl" && styles.rowReverse]}>
        <View>
          <Text style={[styles.label, { textAlign: align }]}>{getLocalizedText(membership.label, locale)}</Text>
          <Text style={[styles.status, { textAlign: align }]}>{getLocalizedText(membership.status, locale)}</Text>
        </View>
        <Text style={styles.credits}>{credits}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${membership.score}%` }]} />
      </View>
      <Text style={[styles.rhythm, { textAlign: align }]}>{getLocalizedText(membership.rhythm, locale)}</Text>
      <Text style={[styles.advice, { textAlign: align }]}>{getLocalizedText(membership.renewalAdvice, locale)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.white,
    borderRadius: radii.large,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.sand,
    ...shadows.soft,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  label: {
    color: colors.slate,
    fontSize: 13,
    fontWeight: "900",
  },
  status: {
    color: colors.navy,
    fontSize: 25,
    fontWeight: "900",
    marginTop: 2,
  },
  credits: {
    color: colors.gold,
    fontSize: 42,
    fontWeight: "900",
  },
  track: {
    height: 9,
    borderRadius: 999,
    backgroundColor: colors.sand,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.navy,
  },
  rhythm: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
  },
  advice: {
    color: colors.slate,
    fontSize: 14,
    lineHeight: 20,
  },
});
```

- [ ] **Step 6: Create `ConciergePanel`**

Create `apps/mobile/src/components/ConciergePanel.tsx`:

```tsx
import { StyleSheet, Text, View } from "react-native";
import { getLocalizedText, type ConciergeRequest } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii } from "@/theme/colors";

const toneColor: Record<ConciergeRequest["tone"], string> = {
  approved: colors.success,
  waiting: colors.warning,
  reply: colors.plum,
};

export function ConciergePanel({ requests }: { requests: ConciergeRequest[] }) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";

  return (
    <View style={styles.panel}>
      <Text style={[styles.title, { textAlign: align }]}>{locale === "he" ? "קונסיירז׳ הסטודיו" : "Studio concierge"}</Text>
      {requests.map((request) => (
        <View key={request.id} style={[styles.row, direction === "rtl" && styles.rowReverse]}>
          <Text style={[styles.requestTitle, { textAlign: align }]}>{getLocalizedText(request.title, locale)}</Text>
          <View style={[styles.badge, { borderColor: toneColor[request.tone] }]}>
            <Text style={[styles.badgeText, { color: toneColor[request.tone] }]}>
              {getLocalizedText(request.status, locale)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.mist,
    borderRadius: radii.large,
    padding: 18,
    gap: 14,
  },
  title: {
    color: colors.navy,
    fontSize: 21,
    fontWeight: "900",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(11,29,58,0.08)",
    paddingTop: 14,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  requestTitle: {
    flex: 1,
    color: colors.ink,
    fontWeight: "900",
    fontSize: 15,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
  },
});
```

- [ ] **Step 7: Replace Home composition**

Modify `apps/mobile/app/(tabs)/index.tsx` so it composes the new premium modules:

```tsx
import { ClassCard } from "@/components/ClassCard";
import { ConciergePanel } from "@/components/ConciergePanel";
import { MembershipHealthPanel } from "@/components/MembershipHealthPanel";
import { PremiumHero } from "@/components/PremiumHero";
import { Screen } from "@/components/Screen";
import { premiumExperience, getRecommendedSessions, getSessionInsight } from "@/fixtures/premiumExperience";
import { sessions } from "@/fixtures/classes";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { t, direction } = useCopy();
  const orderedSessions = getRecommendedSessions(sessions, premiumExperience);
  const recommendedSession = orderedSessions[0] ?? sessions[0];
  const insight = getSessionInsight(recommendedSession.id, premiumExperience) ?? premiumExperience.sessionInsights[0];
  const align = direction === "rtl" ? "right" : "left";

  return (
    <Screen>
      <PremiumHero experience={premiumExperience} recommendedSession={recommendedSession} insight={insight} />
      <MembershipHealthPanel membership={premiumExperience.membership} />
      <ConciergePanel requests={premiumExperience.concierge} />
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { textAlign: align }]}>{t.classesToday}</Text>
      </View>
      {orderedSessions.slice(0, 2).map((session) => (
        <ClassCard key={session.id} session={session} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: 4,
  },
  sectionTitle: {
    color: colors.slate,
    fontWeight: "900",
    fontSize: 14,
  },
});
```

- [ ] **Step 8: Verify Home task**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 9: Commit**

```bash
git add apps/mobile/src/theme/colors.ts apps/mobile/src/components/PremiumHero.tsx apps/mobile/src/components/FitScoreRing.tsx apps/mobile/src/components/InsightPill.tsx apps/mobile/src/components/MembershipHealthPanel.tsx apps/mobile/src/components/ConciergePanel.tsx apps/mobile/app/'(tabs)'/index.tsx
git commit -m "feat: redesign premium member home"
```

---

### Task 3: Recommendation-First Schedule

**Files:**
- Create: `apps/mobile/src/components/TimelineClassCard.tsx`
- Modify: `apps/mobile/app/(tabs)/schedule.tsx`

**Interfaces:**
- Consumes:
  - `getRecommendedSessions(sessions, premiumExperience)`
  - `getSessionInsight(session.id, premiumExperience)`
- Produces:
  - `TimelineClassCard({ session, insight })`

- [ ] **Step 1: Create `TimelineClassCard`**

Create `apps/mobile/src/components/TimelineClassCard.tsx`:

```tsx
import type { ClassSession } from "@cloud-core/shared";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FitScoreRing } from "@/components/FitScoreRing";
import { getLocalizedText, type SessionInsight } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii, shadows } from "@/theme/colors";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function TimelineClassCard({ session, insight }: { session: ClassSession; insight: SessionInsight | undefined }) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";
  const title = locale === "he" ? session.titleHe : session.titleEn;
  const spots = Math.max(session.capacity - session.bookedCount, 0);
  const cta = insight ? getLocalizedText(insight.bookingCta, locale) : locale === "he" ? "לראות פרטים" : "View details";

  return (
    <Link href={`/class/${session.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={[styles.row, direction === "rtl" && styles.rowReverse]}>
          <View style={styles.timeBlock}>
            <Text style={styles.time}>{formatTime(session.startsAt)}</Text>
            <Text style={styles.room}>{session.roomName}</Text>
          </View>
          <View style={{ flex: 1, gap: 7 }}>
            <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
            <Text style={[styles.meta, { textAlign: align }]}>
              {session.instructor.displayName} · {spots > 0 ? `${spots} ${locale === "he" ? "מקומות" : "spots"}` : locale === "he" ? "רשימת המתנה" : "Waitlist"}
            </Text>
            <Text style={[styles.cta, { textAlign: align }]}>{cta}</Text>
          </View>
          {insight ? <FitScoreRing score={insight.fitScore} label={locale === "he" ? "התאמה" : "fit"} /> : null}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.large,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.sand,
    ...shadows.soft,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  timeBlock: {
    width: 76,
    borderRadius: 20,
    backgroundColor: colors.navy,
    alignItems: "center",
    paddingVertical: 12,
    gap: 4,
  },
  time: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  room: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: "800",
  },
  title: {
    color: colors.navy,
    fontSize: 20,
    fontWeight: "900",
  },
  meta: {
    color: colors.slate,
    fontWeight: "700",
  },
  cta: {
    color: colors.gold,
    fontWeight: "900",
  },
});
```

- [ ] **Step 2: Replace Schedule with intent selector and timeline**

Modify `apps/mobile/app/(tabs)/schedule.tsx`:

```tsx
import { TimelineClassCard } from "@/components/TimelineClassCard";
import { Screen } from "@/components/Screen";
import { sessions } from "@/fixtures/classes";
import { getRecommendedSessions, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

const intents = {
  he: ["הכי מתאים", "היום", "בטוח למתחילות", "עומס נמוך", "אחרי עבודה"],
  en: ["Best for me", "Today", "Beginner safe", "Low capacity", "After work"],
};

export default function ScheduleScreen() {
  const { t, locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";
  const orderedSessions = getRecommendedSessions(sessions, premiumExperience);

  return (
    <Screen>
      <Text style={[styles.title, { textAlign: align }]}>{t.schedule}</Text>
      <View style={styles.heroStrip}>
        <Text style={[styles.heroTitle, { textAlign: align }]}>
          {locale === "he" ? "לא רק לוח שיעורים. החלטה טובה יותר." : "Not just a timetable. A better decision."}
        </Text>
        <Text style={[styles.heroBody, { textAlign: align }]}>
          {locale === "he"
            ? "השיעורים מדורגים לפי התאמה, מנוי, זמינות וסיכוי המתנה."
            : "Classes are ranked by fit, membership, availability, and waitlist odds."}
        </Text>
      </View>
      <View style={[styles.filters, direction === "rtl" && styles.rowReverse]}>
        {intents[locale].map((intent, index) => (
          <Pressable key={intent} style={[styles.filter, index === 0 && styles.selectedFilter]}>
            <Text style={[styles.filterText, index === 0 && styles.selectedFilterText]}>{intent}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.dayLabel, { textAlign: align }]}>{locale === "he" ? "מומלץ עבורך" : "Recommended for you"}</Text>
      {orderedSessions.map((session) => (
        <TimelineClassCard key={session.id} session={session} insight={getSessionInsight(session.id, premiumExperience)} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.navy,
    fontSize: 34,
    fontWeight: "900",
  },
  heroStrip: {
    backgroundColor: colors.navy,
    borderRadius: radii.hero,
    padding: 20,
    gap: 8,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
  },
  heroBody: {
    color: colors.blue,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  filter: {
    borderWidth: 1,
    borderColor: colors.sand,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: colors.white,
  },
  selectedFilter: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  filterText: {
    color: colors.navy,
    fontWeight: "900",
  },
  selectedFilterText: {
    color: colors.ink,
  },
  dayLabel: {
    color: colors.slate,
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
```

- [ ] **Step 3: Verify Schedule task**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/src/components/TimelineClassCard.tsx apps/mobile/app/'(tabs)'/schedule.tsx
git commit -m "feat: add premium recommendation-first schedule"
```

---

### Task 4: Premium Class Detail Dossier

**Files:**
- Modify: `apps/mobile/app/class/[id]/index.tsx`

**Interfaces:**
- Consumes:
  - `getSessionInsight(session.id, premiumExperience)`
  - `getLocalizedText(text, locale)`
  - `decideBooking(session, entitlement)`
- Produces: class detail layout with hero, fit reasons, preparation, and waitlist intelligence.

- [ ] **Step 1: Replace class detail screen**

Modify `apps/mobile/app/class/[id]/index.tsx`:

```tsx
import { decideBooking } from "@cloud-core/shared";
import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FitScoreRing } from "@/components/FitScoreRing";
import { Screen } from "@/components/Screen";
import { entitlement, sessions } from "@/fixtures/classes";
import { getLocalizedText, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii, shadows } from "@/theme/colors";

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, locale, direction } = useCopy();
  const session = sessions.find((item) => item.id === id) ?? sessions[0];
  const insight = getSessionInsight(session.id, premiumExperience);
  const decision = decideBooking(session, entitlement);
  const align = direction === "rtl" ? "right" : "left";
  const title = locale === "he" ? session.titleHe : session.titleEn;
  const description = locale === "he" ? session.descriptionHe : session.descriptionEn;
  const equipment = locale === "he" ? session.equipmentHe : session.equipmentEn;
  const cta = insight ? getLocalizedText(insight.bookingCta, locale) : decision.mode === "waitlist" ? t.joinWaitlist : t.book;

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={[styles.heroTop, direction === "rtl" && styles.rowReverse]}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={[styles.kicker, { textAlign: align }]}>{locale === "he" ? "תיק שיעור" : "Class dossier"}</Text>
            <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
            <Text style={[styles.description, { textAlign: align }]}>{description}</Text>
          </View>
          {insight ? <FitScoreRing score={insight.fitScore} label={locale === "he" ? "התאמה" : "fit"} /> : null}
        </View>
      </View>

      <View style={styles.detailGrid}>
        <Info label={t.instructor} value={session.instructor.displayName} />
        <Info label={t.available} value={`${Math.max(session.capacity - session.bookedCount, 0)} / ${session.capacity}`} />
        <Info label={t.policy} value={`${session.cancellationWindowHours}h`} />
      </View>

      {insight ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: align }]}>{locale === "he" ? "למה זה מתאים לך" : "Why this fits you"}</Text>
          {insight.reasons.map((reason) => (
            <Text key={reason.en} style={[styles.rowText, { textAlign: align }]}>• {getLocalizedText(reason, locale)}</Text>
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { textAlign: align }]}>{locale === "he" ? "לפני שמגיעים" : "Before you come"}</Text>
        {equipment.map((item) => (
          <Text key={item} style={[styles.rowText, { textAlign: align }]}>• {item}</Text>
        ))}
        {insight?.preparation.map((item) => (
          <Text key={item.en} style={[styles.rowText, { textAlign: align }]}>• {getLocalizedText(item, locale)}</Text>
        ))}
      </View>

      {insight?.waitlistOdds ? (
        <View style={styles.waitlist}>
          <Text style={[styles.sectionTitle, { textAlign: align }]}>{locale === "he" ? "המתנה חכמה" : "Smart waitlist"}</Text>
          <Text style={[styles.waitlistValue, { textAlign: align }]}>{insight.waitlistOdds}%</Text>
          <Text style={[styles.rowText, { textAlign: align }]}>
            {locale === "he"
              ? "סיכוי משוער לקידום. אם יתפנה מקום, תקבלי חלון אישור של 30 דקות."
              : "Estimated promotion odds. If a spot opens, you will get a 30-minute confirmation window."}
          </Text>
        </View>
      ) : null}

      <Pressable style={[styles.primaryButton, decision.mode === "waitlist" && styles.waitlistButton]}>
        <Text style={styles.primaryText}>{cta}</Text>
      </Pressable>
    </Screen>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.navy,
    borderRadius: radii.hero,
    padding: 22,
    ...shadows.premium,
  },
  heroTop: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  kicker: {
    color: colors.gold,
    fontWeight: "900",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontSize: 12,
  },
  title: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
  },
  description: {
    color: colors.sand,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
  },
  detailGrid: {
    flexDirection: "row",
    gap: 10,
  },
  info: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.sand,
    padding: 12,
    gap: 4,
  },
  infoLabel: {
    color: colors.slate,
    fontSize: 12,
    fontWeight: "800",
  },
  infoValue: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: "900",
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.sand,
    padding: 18,
    gap: 9,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 20,
    fontWeight: "900",
  },
  rowText: {
    color: colors.slate,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  waitlist: {
    backgroundColor: colors.goldSoft,
    borderRadius: radii.large,
    padding: 18,
    gap: 8,
  },
  waitlistValue: {
    color: colors.navy,
    fontSize: 42,
    fontWeight: "900",
  },
  primaryButton: {
    backgroundColor: colors.navy,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  waitlistButton: {
    backgroundColor: colors.gold,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 17,
  },
});
```

- [ ] **Step 2: Verify Class Detail task**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/app/class/'[id]'/index.tsx
git commit -m "feat: add premium class dossier"
```

---

### Task 5: Membership And Concierge Profile Surface

**Files:**
- Modify: `apps/mobile/app/(tabs)/profile.tsx`

**Interfaces:**
- Consumes:
  - `MembershipHealthPanel`
  - `ConciergePanel`
  - `premiumExperience`
- Produces: profile screen that surfaces membership health, notification preferences, concierge, instructor mode, and account deletion.

- [ ] **Step 1: Replace Profile content**

Modify `apps/mobile/app/(tabs)/profile.tsx`:

```tsx
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { ConciergePanel } from "@/components/ConciergePanel";
import { MembershipHealthPanel } from "@/components/MembershipHealthPanel";
import { Screen } from "@/components/Screen";
import { premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { colors, radii } from "@/theme/colors";

export default function ProfileScreen() {
  const { t, locale, setLocale, direction } = useCopy();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const align = direction === "rtl" ? "right" : "left";

  async function toggleNotifications(value: boolean) {
    setNotificationsEnabled(value);
    if (value) {
      await registerForPushNotificationsAsync();
    }
  }

  return (
    <Screen>
      <Text style={[styles.title, { textAlign: align }]}>{t.profile}</Text>
      <MembershipHealthPanel membership={premiumExperience.membership} />
      <ConciergePanel requests={premiumExperience.concierge} />

      <View style={styles.card}>
        <Text style={[styles.label, { textAlign: align }]}>{t.language}</Text>
        <View style={[styles.segment, direction === "rtl" && styles.rowReverse]}>
          <Pressable onPress={() => setLocale("he")} style={[styles.segmentButton, locale === "he" && styles.selected]}>
            <Text style={styles.segmentText}>עברית</Text>
          </Pressable>
          <Pressable onPress={() => setLocale("en")} style={[styles.segmentButton, locale === "en" && styles.selected]}>
            <Text style={styles.segmentText}>English</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.rowCard, direction === "rtl" && styles.rowReverse]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { textAlign: align }]}>{t.notifications}</Text>
          <Text style={[styles.body, { textAlign: align }]}>
            {locale === "he" ? "התראות חכמות להזמנות, המתנה ומנוי." : "Smart alerts for bookings, waitlist, and membership."}
          </Text>
        </View>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
      </View>

      <View style={styles.premiumCard}>
        <Text style={[styles.premiumTitle, { textAlign: align }]}>{t.instructorMode}</Text>
        <Text style={[styles.premiumBody, { textAlign: align }]}>
          {locale === "he" ? "כניסה מהירה לרשימת משתתפות, נוכחות והערות פנימיות." : "Fast access to participant lists, attendance, and internal notes."}
        </Text>
      </View>

      <Pressable style={styles.deleteButton}>
        <Text style={styles.deleteText}>{t.accountDeletion}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.navy,
    fontSize: 34,
    fontWeight: "900",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.sand,
    padding: 18,
    gap: 12,
  },
  rowCard: {
    backgroundColor: colors.white,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.sand,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  label: {
    color: colors.navy,
    fontWeight: "900",
    fontSize: 16,
  },
  body: {
    color: colors.slate,
    lineHeight: 21,
    marginTop: 4,
  },
  segment: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: colors.sand,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
  },
  selected: {
    backgroundColor: colors.white,
  },
  segmentText: {
    color: colors.navy,
    fontWeight: "900",
  },
  premiumCard: {
    backgroundColor: colors.navy,
    borderRadius: radii.hero,
    padding: 20,
    gap: 8,
  },
  premiumTitle: {
    color: colors.gold,
    fontSize: 22,
    fontWeight: "900",
  },
  premiumBody: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
  },
  deleteButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: 14,
    alignItems: "center",
  },
  deleteText: {
    color: colors.danger,
    fontWeight: "900",
  },
});
```

- [ ] **Step 2: Verify Profile task**

Run:

```bash
npm run typecheck
npm test
npx expo install --check
rm -rf /tmp/cloud-core-mobile-export
npx expo export --platform ios --output-dir /tmp/cloud-core-mobile-export
```

Expected: all commands pass. Export should show `iOS Bundled` and finish with `Exported: /tmp/cloud-core-mobile-export`.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/app/'(tabs)'/profile.tsx
git commit -m "feat: add premium profile concierge surface"
```

---

## Final Verification

- [ ] Run full verification:

```bash
npm run typecheck
npm test
npx expo install --check
rm -rf /tmp/cloud-core-mobile-export
npx expo export --platform ios --output-dir /tmp/cloud-core-mobile-export
```

Expected:

- TypeScript passes for admin, mobile, and shared.
- Jest passes booking rules and premium experience helper tests.
- Expo dependency check says dependencies are up to date.
- iOS export succeeds without Metro module resolution errors.

- [ ] Start Metro with a cleared cache:

```bash
npm --workspace @cloud-core/mobile run start -- --localhost --clear
```

Expected:

- Metro waits on `http://localhost:8081`.
- Expo may still print the `xcrun simctl` warning on this machine; that warning is acceptable if the real-device Expo Go flow works.

- [ ] Commit any final verification/doc adjustment:

```bash
git status --short
git add docs/superpowers/plans/2026-06-19-premium-mobile-redesign-implementation.md
git commit -m "docs: add premium mobile redesign implementation plan"
```

