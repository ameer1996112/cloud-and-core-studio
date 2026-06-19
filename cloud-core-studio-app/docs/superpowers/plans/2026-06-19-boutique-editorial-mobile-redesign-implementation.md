# Boutique Editorial Mobile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current smart-but-dashboard-like mobile UI with a boutique editorial member experience using generated studio photography, warmer copy, quieter status bands, and fewer widget-like treatments.

**Architecture:** Keep the existing Expo Router app and fixture-backed smart model. Add an editorial content boundary to `premiumExperience`, create local image assets under `apps/mobile/assets/editorial`, then update the existing mobile surfaces in place so the current routes, tests, and Expo Go flow remain stable. UI changes stay local to mobile components and screens; no backend, payment, or Supabase media integration is added.

**Tech Stack:** Expo SDK 54, React Native 0.81.5, React 19.1.0, Expo Router 6, TypeScript, Jest, local PNG assets.

## Global Constraints

- Mobile app remains in `apps/mobile`.
- Direction is boutique studio editorial.
- Imagery is generated editorial photography for now, replaceable with real studio photos later.
- Energy is warm boutique community with members and instructor presence.
- Lead with people and place, not widgets.
- Use photography as the first visual anchor on Home.
- Use cards only where the card is the interaction.
- Reduce circular scores, pill clusters, heavy shadows, and equal-weight dashboard modules.
- Keep ivory surface, navy text, warm gold as the only strong accent, and slate for secondary text.
- Hebrew RTL and English LTR must remain usable.
- Keep copy short and human; avoid technical language such as "fit score" in the first read.
- Do not add real Supabase media storage integration.
- Do not wire a payment provider.
- Do not redesign admin.
- Do not change the tab structure.
- Required verification commands: `npm run typecheck`, `npm test`, `npx expo install --check`, `npx expo export --platform ios --output-dir /tmp/cloud-core-mobile-export`.
- Expo Go must load on a physical device before the goal can be marked complete.

---

## File Structure

- `apps/mobile/assets/editorial/studio-community-hero.png`: generated warm boutique studio hero image.
- `apps/mobile/assets/editorial/class-stretch-flow.png`: generated class mood image for recommendation and class detail.
- `apps/mobile/assets/editorial/instructor-maya.png`: generated instructor/member detail image.
- `apps/mobile/src/fixtures/premiumExperience.ts`: adds editorial copy and asset metadata while keeping existing helper exports.
- `apps/mobile/src/features/premiumExperience.test.ts`: verifies editorial content accessors and recommendation copy.
- `apps/mobile/src/theme/colors.ts`: adds restrained editorial color tokens and lighter border/shadow values.
- `apps/mobile/src/components/PremiumHero.tsx`: becomes the image-led editorial home hero.
- `apps/mobile/src/components/MembershipHealthPanel.tsx`: becomes a quiet rhythm/status band.
- `apps/mobile/src/components/ConciergePanel.tsx`: becomes a quiet studio inbox/status band.
- `apps/mobile/src/components/TimelineClassCard.tsx`: becomes a softer editorial schedule row.
- `apps/mobile/app/(tabs)/index.tsx`: removes the stacked dashboard composition and uses hero plus quiet supporting bands.
- `apps/mobile/app/(tabs)/schedule.tsx`: simplifies the header and intent selector.
- `apps/mobile/app/class/[id]/index.tsx`: softens the dossier and uses image-led context.
- `apps/mobile/app/(tabs)/profile.tsx`: softens profile hierarchy around membership and concierge.

---

### Task 1: Editorial Fixture Boundary And Image Assets

**Files:**
- Create: `apps/mobile/assets/editorial/studio-community-hero.png`
- Create: `apps/mobile/assets/editorial/class-stretch-flow.png`
- Create: `apps/mobile/assets/editorial/instructor-maya.png`
- Modify: `apps/mobile/src/fixtures/premiumExperience.ts`
- Modify: `apps/mobile/src/features/premiumExperience.test.ts`

**Interfaces:**
- Consumes: `Locale` from `@cloud-core/shared`.
- Produces:
  - `EditorialImageKey = "homeHero" | "classMood" | "instructorMoment"`
  - `EditorialCopy`
  - `getEditorialLine(copy: EditorialCopy, locale: Locale): string`
  - `premiumExperience.editorial`

- [ ] **Step 1: Generate local editorial image assets**

Generate three PNG assets and save them to these exact paths:

```text
apps/mobile/assets/editorial/studio-community-hero.png
apps/mobile/assets/editorial/class-stretch-flow.png
apps/mobile/assets/editorial/instructor-maya.png
```

Use these prompts:

```text
studio-community-hero.png:
Warm boutique Pilates and wellness studio class in soft morning daylight, instructor gently guiding two adult members, ivory walls, warm wood floor, subtle navy textile accents, natural human expressions, premium neighborhood studio, editorial photography, no text, no logos, no UI, no surreal anatomy.

class-stretch-flow.png:
Close editorial photograph of a calm stretch and flow class, adult women moving naturally on mats, soft daylight, warm neutral studio, intimate community mood, refined but not glossy, no text, no logos, no UI, no distorted hands.

instructor-maya.png:
Editorial portrait moment of a warm Pilates instructor helping an adult member adjust posture, boutique studio, soft daylight, human and approachable, premium local studio atmosphere, no text, no logos, no UI, no surreal anatomy.
```

Expected: all three files exist and are PNG images.

- [ ] **Step 2: Add failing tests for editorial fixture content**

Replace `apps/mobile/src/features/premiumExperience.test.ts` with:

```ts
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
```

- [ ] **Step 3: Run test to verify it fails**

Run:

```bash
npm --workspace @cloud-core/mobile test -- premiumExperience.test.ts
```

Expected: FAIL because `getEditorialLine` and `premiumExperience.editorial` do not exist.

- [ ] **Step 4: Extend premium experience fixture**

Modify `apps/mobile/src/fixtures/premiumExperience.ts` so the top half includes the new editorial types and the `PremiumExperience` interface includes `editorial`:

```ts
export interface LocalizedText {
  he: string;
  en: string;
}

export type EditorialImageKey = "homeHero" | "classMood" | "instructorMoment";

export type EditorialCopy = LocalizedText;

export interface EditorialExperience {
  heroLine: EditorialCopy;
  recommendationLine: EditorialCopy;
  classContext: EditorialCopy;
  membershipLine: EditorialCopy;
  conciergeLine: EditorialCopy;
  images: {
    homeHero: EditorialImageKey;
    classMood: EditorialImageKey;
    instructorMoment: EditorialImageKey;
  };
}
```

Add this field to `PremiumExperience`:

```ts
  editorial: EditorialExperience;
```

Add this object inside `premiumExperience` after `today`:

```ts
  editorial: {
    heroLine: {
      he: "נועה, מאיה שמרה לך מקום שקט.",
      en: "Noa, Maya saved a quiet spot for you.",
    },
    recommendationLine: {
      he: "מתיחות וזרימה הוא השיעור הנכון להיום.",
      en: "Stretch & Flow is the right class today.",
    },
    classContext: {
      he: "שיעור ערב רך עם קהילה קטנה, מאיה, וחלון אישור ברור אם יתפנה מקום.",
      en: "A calm evening class with a small community, Maya, and a clear confirmation window if a spot opens.",
    },
    membershipLine: {
      he: "המנוי שלך בקצב טוב, עם מספיק קרדיטים לשמור על רצף שבועי.",
      en: "Your membership is in a good rhythm, with enough credits to keep a weekly routine.",
    },
    conciergeLine: {
      he: "הסטודיו כבר מטפל בבקשות הפעילות שלך.",
      en: "The studio is already taking care of your active requests.",
    },
    images: {
      homeHero: "homeHero",
      classMood: "classMood",
      instructorMoment: "instructorMoment",
    },
  },
```

Add this helper near the existing helper exports:

```ts
export function getEditorialLine(copy: EditorialCopy, locale: Locale) {
  return copy[locale];
}
```

- [ ] **Step 5: Run tests to verify the data boundary**

Run:

```bash
npm --workspace @cloud-core/mobile test -- premiumExperience.test.ts
npm test
```

Expected: both commands pass.

- [ ] **Step 6: Commit**

```bash
git add apps/mobile/assets/editorial apps/mobile/src/fixtures/premiumExperience.ts apps/mobile/src/features/premiumExperience.test.ts
git commit -m "feat: add boutique editorial mobile fixtures"
```

---

### Task 2: Image-Led Editorial Home Hero

**Files:**
- Modify: `apps/mobile/src/theme/colors.ts`
- Modify: `apps/mobile/src/components/PremiumHero.tsx`
- Modify: `apps/mobile/app/(tabs)/index.tsx`

**Interfaces:**
- Consumes:
  - `PremiumExperience`
  - `SessionInsight`
  - `getEditorialLine(copy, locale)`
  - local asset `apps/mobile/assets/editorial/studio-community-hero.png`
- Produces: `PremiumHero` with image-led editorial composition and one dominant CTA.

- [ ] **Step 1: Add editorial tokens**

Modify `apps/mobile/src/theme/colors.ts` to add these values without removing existing exported names:

```ts
export const editorial = {
  hairline: "rgba(11,29,58,0.12)",
  navyOverlay: "rgba(7,19,38,0.48)",
  ivoryOverlay: "rgba(250,247,242,0.92)",
  softGold: "rgba(212,175,106,0.22)",
  quietShadow: {
    shadowColor: colors.navy,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
};
```

- [ ] **Step 2: Replace `PremiumHero` with editorial image composition**

Replace `apps/mobile/src/components/PremiumHero.tsx` with:

```tsx
import type { ClassSession } from "@cloud-core/shared";
import { Link } from "expo-router";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import {
  getEditorialLine,
  getLocalizedText,
  type PremiumExperience,
  type SessionInsight,
} from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, editorial, radii } from "@/theme/colors";

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
  const instructor = recommendedSession.instructor.displayName;
  const primary = getLocalizedText(insight.bookingCta, locale);

  return (
    <View style={styles.wrap}>
      <ImageBackground
        source={require("../../assets/editorial/studio-community-hero.png")}
        style={styles.image}
        imageStyle={styles.imageRadius}
        resizeMode="cover"
      >
        <View style={styles.scrim}>
          <View style={styles.identity}>
            <Text style={[styles.brand, { textAlign: align }]}>Cloud&Core Studio</Text>
            <Text style={[styles.line, { textAlign: align }]}>{getEditorialLine(experience.editorial.heroLine, locale)}</Text>
          </View>

          <View style={styles.recommendation}>
            <Text style={[styles.eyebrow, { textAlign: align }]}>
              {locale === "he" ? "הבחירה של הסטודיו להיום" : "Studio pick for today"}
            </Text>
            <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
            <Text style={[styles.context, { textAlign: align }]}>
              {getEditorialLine(experience.editorial.recommendationLine, locale)}
            </Text>
            <Text style={[styles.meta, { textAlign: align }]}>
              {instructor} · {locale === "he" ? "ערב רגוע, קהילה קטנה" : "Calm evening, small community"}
            </Text>
          </View>

          <Link href={`/class/${recommendedSession.id}`} asChild>
            <Pressable style={styles.cta}>
              <Text style={styles.ctaText}>{primary}</Text>
            </Pressable>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: -20,
    marginTop: -12,
  },
  image: {
    minHeight: 540,
    justifyContent: "flex-end",
  },
  imageRadius: {
    borderBottomLeftRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
  },
  scrim: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: editorial.navyOverlay,
    borderBottomLeftRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
  },
  identity: {
    gap: 10,
  },
  brand: {
    color: colors.ivory,
    fontSize: 16,
    fontWeight: "900",
  },
  line: {
    color: colors.ivory,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    maxWidth: 320,
  },
  recommendation: {
    gap: 8,
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
  },
  title: {
    color: colors.white,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "900",
  },
  context: {
    color: colors.ivory,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "800",
    maxWidth: 330,
  },
  meta: {
    color: colors.sand,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  cta: {
    backgroundColor: colors.ivory,
    borderRadius: 999,
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

- [ ] **Step 3: Refactor Home composition**

Modify `apps/mobile/app/(tabs)/index.tsx` so it removes `ClassCard` and uses only the editorial hero plus quiet support rows:

```tsx
import { ConciergePanel } from "@/components/ConciergePanel";
import { MembershipHealthPanel } from "@/components/MembershipHealthPanel";
import { PremiumHero } from "@/components/PremiumHero";
import { Screen } from "@/components/Screen";
import { sessions } from "@/fixtures/classes";
import { getEditorialLine, getRecommendedSessions, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, editorial } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { locale, direction } = useCopy();
  const orderedSessions = getRecommendedSessions(sessions, premiumExperience);
  const recommendedSession = orderedSessions[0] ?? sessions[0];
  const insight = getSessionInsight(recommendedSession.id, premiumExperience) ?? premiumExperience.sessionInsights[0];
  const align = direction === "rtl" ? "right" : "left";

  return (
    <Screen>
      <PremiumHero experience={premiumExperience} recommendedSession={recommendedSession} insight={insight} />

      <View style={styles.editorialNote}>
        <Text style={[styles.noteTitle, { textAlign: align }]}>
          {locale === "he" ? "למה זה נכון להיום" : "Why this works today"}
        </Text>
        <Text style={[styles.noteBody, { textAlign: align }]}>
          {getEditorialLine(premiumExperience.editorial.classContext, locale)}
        </Text>
      </View>

      <MembershipHealthPanel membership={premiumExperience.membership} />
      <ConciergePanel requests={premiumExperience.concierge} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  editorialNote: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: editorial.hairline,
    paddingVertical: 18,
    gap: 6,
  },
  noteTitle: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: "900",
  },
  noteBody: {
    color: colors.slate,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700",
  },
});
```

- [ ] **Step 4: Verify Home task**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/src/theme/colors.ts apps/mobile/src/components/PremiumHero.tsx apps/mobile/app/'(tabs)'/index.tsx
git commit -m "feat: add boutique editorial home hero"
```

---

### Task 3: Quiet Membership And Concierge Bands

**Files:**
- Modify: `apps/mobile/src/components/MembershipHealthPanel.tsx`
- Modify: `apps/mobile/src/components/ConciergePanel.tsx`

**Interfaces:**
- Consumes:
  - `MembershipHealth`
  - `ConciergeRequest[]`
  - `premiumExperience.editorial.membershipLine`
  - `premiumExperience.editorial.conciergeLine`
- Produces: quieter status bands with row/divider styling.

- [ ] **Step 1: Replace `MembershipHealthPanel`**

Replace `apps/mobile/src/components/MembershipHealthPanel.tsx` with:

```tsx
import { StyleSheet, Text, View } from "react-native";
import { getEditorialLine, getLocalizedText, premiumExperience, type MembershipHealth } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, editorial } from "@/theme/colors";

export function MembershipHealthPanel({ membership }: { membership: MembershipHealth }) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";
  const credits = membership.entitlement.remainingCredits ?? "∞";

  return (
    <View style={styles.band}>
      <View style={[styles.row, direction === "rtl" && styles.rowReverse]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.kicker, { textAlign: align }]}>{getLocalizedText(membership.label, locale)}</Text>
          <Text style={[styles.title, { textAlign: align }]}>{getLocalizedText(membership.status, locale)}</Text>
        </View>
        <View style={styles.creditBlock}>
          <Text style={styles.credits}>{credits}</Text>
          <Text style={styles.creditLabel}>{locale === "he" ? "קרדיטים" : "credits"}</Text>
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${membership.score}%` }]} />
      </View>
      <Text style={[styles.body, { textAlign: align }]}>{getEditorialLine(premiumExperience.editorial.membershipLine, locale)}</Text>
      <Text style={[styles.secondary, { textAlign: align }]}>{getLocalizedText(membership.renewalAdvice, locale)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: editorial.hairline,
    paddingVertical: 18,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 18,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  kicker: {
    color: colors.slate,
    fontSize: 12,
    fontWeight: "900",
  },
  title: {
    color: colors.navy,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 2,
  },
  creditBlock: {
    alignItems: "center",
    minWidth: 74,
  },
  credits: {
    color: colors.gold,
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 40,
  },
  creditLabel: {
    color: colors.slate,
    fontSize: 11,
    fontWeight: "900",
  },
  track: {
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.sand,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.gold,
  },
  body: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "800",
  },
  secondary: {
    color: colors.slate,
    fontSize: 14,
    lineHeight: 20,
  },
});
```

- [ ] **Step 2: Replace `ConciergePanel`**

Replace `apps/mobile/src/components/ConciergePanel.tsx` with:

```tsx
import { StyleSheet, Text, View } from "react-native";
import { getEditorialLine, getLocalizedText, premiumExperience, type ConciergeRequest } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, editorial } from "@/theme/colors";

const toneColor: Record<ConciergeRequest["tone"], string> = {
  approved: colors.success,
  waiting: colors.warning,
  reply: colors.plum,
};

export function ConciergePanel({ requests }: { requests: ConciergeRequest[] }) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";

  return (
    <View style={styles.band}>
      <Text style={[styles.kicker, { textAlign: align }]}>
        {locale === "he" ? "קונסיירז׳ הסטודיו" : "Studio concierge"}
      </Text>
      <Text style={[styles.body, { textAlign: align }]}>{getEditorialLine(premiumExperience.editorial.conciergeLine, locale)}</Text>
      {requests.map((request) => (
        <View key={request.id} style={[styles.row, direction === "rtl" && styles.rowReverse]}>
          <Text style={[styles.requestTitle, { textAlign: align }]}>
            {getLocalizedText(request.title, locale)}
          </Text>
          <Text style={[styles.status, { color: toneColor[request.tone] }]}>
            {getLocalizedText(request.status, locale)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    borderBottomWidth: 1,
    borderColor: editorial.hairline,
    paddingBottom: 18,
    gap: 12,
  },
  kicker: {
    color: colors.navy,
    fontSize: 20,
    fontWeight: "900",
  },
  body: {
    color: colors.slate,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(11,29,58,0.08)",
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
  status: {
    fontSize: 12,
    fontWeight: "900",
  },
});
```

- [ ] **Step 3: Verify quiet band task**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/src/components/MembershipHealthPanel.tsx apps/mobile/src/components/ConciergePanel.tsx
git commit -m "feat: add quiet studio status bands"
```

---

### Task 4: Softer Editorial Schedule

**Files:**
- Modify: `apps/mobile/src/components/TimelineClassCard.tsx`
- Modify: `apps/mobile/app/(tabs)/schedule.tsx`

**Interfaces:**
- Consumes:
  - `ClassSession`
  - `SessionInsight | undefined`
  - `getLocalizedText`
- Produces: editorial schedule rows with reduced badge density and no score ring.

- [ ] **Step 1: Replace `TimelineClassCard`**

Replace `apps/mobile/src/components/TimelineClassCard.tsx` with:

```tsx
import type { ClassSession } from "@cloud-core/shared";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getLocalizedText, type SessionInsight } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, editorial } from "@/theme/colors";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function TimelineClassCard({
  session,
  insight,
}: {
  session: ClassSession;
  insight: SessionInsight | undefined;
}) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";
  const title = locale === "he" ? session.titleHe : session.titleEn;
  const spots = Math.max(session.capacity - session.bookedCount, 0);
  const cta = insight ? getLocalizedText(insight.bookingCta, locale) : locale === "he" ? "לראות פרטים" : "View details";
  const reason = insight?.reasons[0] ? getLocalizedText(insight.reasons[0], locale) : session.instructor.displayName;

  return (
    <Link href={`/class/${session.id}`} asChild>
      <Pressable style={styles.row}>
        <View style={styles.timeRail}>
          <Text style={styles.time}>{formatTime(session.startsAt)}</Text>
          <View style={styles.dot} />
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
          <Text style={[styles.meta, { textAlign: align }]}>
            {session.instructor.displayName} · {session.roomName}
          </Text>
          <Text style={[styles.reason, { textAlign: align }]}>{reason}</Text>
          <View style={[styles.footer, direction === "rtl" && styles.rowReverse]}>
            <Text style={styles.availability}>
              {spots > 0
                ? `${spots} ${locale === "he" ? "מקומות פנויים" : "spots left"}`
                : locale === "he"
                  ? "רשימת המתנה"
                  : "Waitlist"}
            </Text>
            <Text style={styles.cta}>{cta}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: editorial.hairline,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  timeRail: {
    width: 64,
    alignItems: "center",
    gap: 10,
  },
  time: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: "900",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.gold,
  },
  title: {
    color: colors.navy,
    fontSize: 22,
    fontWeight: "900",
  },
  meta: {
    color: colors.slate,
    fontWeight: "800",
  },
  reason: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  availability: {
    color: colors.slate,
    fontSize: 12,
    fontWeight: "900",
  },
  cta: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
  },
});
```

- [ ] **Step 2: Soften Schedule screen header and filters**

Replace `apps/mobile/app/(tabs)/schedule.tsx` with:

```tsx
import { Screen } from "@/components/Screen";
import { TimelineClassCard } from "@/components/TimelineClassCard";
import { sessions } from "@/fixtures/classes";
import { getRecommendedSessions, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors } from "@/theme/colors";
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
      <View style={styles.intro}>
        <Text style={[styles.introTitle, { textAlign: align }]}>
          {locale === "he" ? "השיעור הנכון, לא רק השיעור הקרוב." : "The right class, not just the next class."}
        </Text>
        <Text style={[styles.introBody, { textAlign: align }]}>
          {locale === "he"
            ? "הסטודיו מסדר את היום לפי התאמה, זמינות וקצב המנוי שלך."
            : "The studio orders today by fit, availability, and your membership rhythm."}
        </Text>
      </View>
      <View style={[styles.filters, direction === "rtl" && styles.rowReverse]}>
        {intents[locale].map((intent, index) => (
          <Pressable key={intent} style={[styles.filter, index === 0 && styles.selectedFilter]}>
            <Text style={[styles.filterText, index === 0 && styles.selectedFilterText]}>{intent}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.dayLabel, { textAlign: align }]}>
        {locale === "he" ? "מומלץ עבורך" : "Recommended for you"}
      </Text>
      {orderedSessions.map((session) => (
        <TimelineClassCard
          key={session.id}
          session={session}
          insight={getSessionInsight(session.id, premiumExperience)}
        />
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
  intro: {
    borderBottomWidth: 1,
    borderColor: "rgba(11,29,58,0.12)",
    paddingBottom: 18,
    gap: 7,
  },
  introTitle: {
    color: colors.navy,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
  },
  introBody: {
    color: colors.slate,
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
    borderBottomWidth: 1,
    borderColor: colors.sand,
    paddingHorizontal: 2,
    paddingVertical: 9,
  },
  selectedFilter: {
    borderColor: colors.gold,
  },
  filterText: {
    color: colors.slate,
    fontWeight: "900",
  },
  selectedFilterText: {
    color: colors.navy,
  },
  dayLabel: {
    color: colors.navy,
    fontWeight: "900",
    fontSize: 16,
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
git commit -m "feat: soften boutique schedule"
```

---

### Task 5: Editorial Class Detail And Profile Polish

**Files:**
- Modify: `apps/mobile/app/class/[id]/index.tsx`
- Modify: `apps/mobile/app/(tabs)/profile.tsx`

**Interfaces:**
- Consumes:
  - `premiumExperience.editorial.classContext`
  - local assets `class-stretch-flow.png` and `instructor-maya.png`
- Produces: class detail and profile surfaces matching the boutique editorial system.

- [ ] **Step 1: Update class detail hero imports**

Modify the import list in `apps/mobile/app/class/[id]/index.tsx`:

```tsx
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { entitlement, sessions } from "@/fixtures/classes";
import { getEditorialLine, getLocalizedText, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, editorial, radii } from "@/theme/colors";
```

Remove the `FitScoreRing` and `shadows` imports.

- [ ] **Step 2: Replace class detail hero markup**

Inside `ClassDetailScreen`, replace the first `<View style={styles.hero}>...</View>` block with:

```tsx
      <ImageBackground
        source={require("../../../assets/editorial/class-stretch-flow.png")}
        style={styles.hero}
        imageStyle={styles.heroImage}
        resizeMode="cover"
      >
        <View style={styles.heroScrim}>
          <Text style={[styles.kicker, { textAlign: align }]}>{locale === "he" ? "תיק שיעור" : "Class dossier"}</Text>
          <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
          <Text style={[styles.description, { textAlign: align }]}>{description}</Text>
          <Text style={[styles.context, { textAlign: align }]}>
            {getEditorialLine(premiumExperience.editorial.classContext, locale)}
          </Text>
        </View>
      </ImageBackground>
```

- [ ] **Step 3: Replace class detail StyleSheet**

Replace the class detail `StyleSheet.create` block with:

```ts
const styles = StyleSheet.create({
  hero: {
    minHeight: 360,
    justifyContent: "flex-end",
    marginHorizontal: -20,
    marginTop: -12,
  },
  heroImage: {
    borderBottomLeftRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
  },
  heroScrim: {
    minHeight: 360,
    justifyContent: "flex-end",
    backgroundColor: editorial.navyOverlay,
    borderBottomLeftRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
    padding: 22,
    gap: 9,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  kicker: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 12,
  },
  title: {
    color: colors.white,
    fontSize: 38,
    lineHeight: 43,
    fontWeight: "900",
  },
  description: {
    color: colors.ivory,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "800",
  },
  context: {
    color: colors.sand,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },
  detailGrid: {
    flexDirection: "row",
    gap: 10,
  },
  info: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: editorial.hairline,
    paddingBottom: 10,
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
    borderTopWidth: 1,
    borderColor: editorial.hairline,
    paddingTop: 18,
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
    borderRadius: radii.medium,
    padding: 18,
    gap: 8,
  },
  waitlistValue: {
    color: colors.navy,
    fontSize: 36,
    fontWeight: "900",
  },
  primaryButton: {
    backgroundColor: colors.navy,
    borderRadius: 999,
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

- [ ] **Step 4: Soften Profile screen controls**

Modify `apps/mobile/app/(tabs)/profile.tsx` so `card`, `rowCard`, `premiumCard`, and title styling become quieter:

```ts
const styles = StyleSheet.create({
  title: {
    color: colors.navy,
    fontSize: 32,
    fontWeight: "900",
  },
  card: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.sand,
    paddingVertical: 18,
    gap: 12,
  },
  rowCard: {
    borderBottomWidth: 1,
    borderColor: colors.sand,
    paddingVertical: 18,
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
    borderRadius: 999,
    backgroundColor: colors.sand,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 999,
  },
  selected: {
    backgroundColor: colors.white,
  },
  segmentText: {
    color: colors.navy,
    fontWeight: "900",
  },
  premiumCard: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.sand,
    paddingVertical: 18,
    gap: 8,
  },
  premiumTitle: {
    color: colors.navy,
    fontSize: 21,
    fontWeight: "900",
  },
  premiumBody: {
    color: colors.slate,
    fontSize: 15,
    lineHeight: 22,
  },
  deleteButton: {
    borderRadius: 999,
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

- [ ] **Step 5: Verify detail/profile task**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add apps/mobile/app/class/'[id]'/index.tsx apps/mobile/app/'(tabs)'/profile.tsx
git commit -m "feat: polish editorial detail and profile"
```

---

### Task 6: Final Expo Verification And Device Launch

**Files:**
- No planned file changes.
- If verification exposes a concrete issue, fix only the file that causes that issue and run this task again from Step 1.

**Interfaces:**
- Consumes: completed tasks 1-5.
- Produces: verified Expo Go runtime for the boutique editorial app.

- [ ] **Step 1: Run full verification**

Run:

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
- iOS export succeeds and finishes with `Exported: /tmp/cloud-core-mobile-export`.

- [ ] **Step 2: Restart Metro on LAN**

Stop any existing Expo process on port `8081`, then run:

```bash
npm --workspace @cloud-core/mobile run start -- --host lan --clear
```

Expected:

- Metro starts without the non-interactive Expo auth 500.
- The terminal prints a scannable QR code.
- `curl -sS http://192.168.0.25:8081/status` returns `packager-status:running` when `192.168.0.25` is still the Mac Wi-Fi IP.

- [ ] **Step 3: Probe the signed manifest path**

Run:

```bash
curl -sS -i 'http://192.168.0.25:8081' \
  -H 'expo-platform: ios' \
  -H 'expo-protocol-version: 1' \
  -H 'expo-expect-signature: sig, keyid="expo-root", alg="rsa-v1_5-sha256"' \
  | sed -n '1,20p'
```

Expected: `HTTP/1.1 200 OK`, not the old non-interactive `EXPO_TOKEN` error.

- [ ] **Step 4: Verify Expo Go on physical device**

On the phone, open Expo Go and load:

```text
exp://192.168.0.25:8081
```

Expected:

- App launches on the phone.
- Home shows the generated editorial hero image.
- First screen presents one clear recommendation CTA.
- No `Invalid hook call`.
- No `empty-module.js` resolution error.
- No non-interactive Expo authentication error.

- [ ] **Step 5: Commit any verification fix**

If a concrete verification fix was required, commit only the changed app files. If there are no app changes, run only the status command and do not create a commit.

```bash
git status --short
```

Expected: no commit is created if there are no verification fixes.
