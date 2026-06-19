# Premium Dark Fitness Mobile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current calm boutique mobile UI with a dark, high-contrast premium fitness app experience that is more eye-catching, action-oriented, and competitive with modern class booking apps.

**Architecture:** Keep the existing Expo Router app, route structure, fixtures, and local interaction model. Add dark fitness design tokens, then update the mobile shell and existing screens in place so Home, Schedule, Class Detail, Bookings, and Profile share one premium dark system. No backend, payment, admin, auth, or tab-structure changes are introduced.

**Tech Stack:** Expo SDK 54, React Native 0.81.5, React 19.1.0, Expo Router 6, TypeScript, Jest, local PNG assets, `@expo/vector-icons`.

## Global Constraints

- Direction: premium dark fitness app with warm boutique studio details.
- Base mood: deep navy/black, ivory text, gold action accents, electric powder-blue highlights, and strong class photography.
- Competitive target: feel closer to modern fitness booking apps than a calm wellness brochure.
- Energy: confident, high-contrast, trainer-led, social, and fast to act on.
- Redesign the mobile member app surfaces in place, without changing backend scope or tab structure.
- Keep the existing brand colors but rebalance their use.
- Dark UI must remain readable in Hebrew RTL and English LTR.
- Avoid generic AI wellness copy.
- Avoid cloning any competitor.
- Keep the app fixture-backed.
- Do not add Supabase media storage.
- Do not wire payments.
- Do not change admin.
- Do not change tab structure.
- Do not add authentication flows.
- Local interaction feedback is acceptable for booking, waitlist, calendar, cancellation, notifications, and deletion states.
- Required verification: `npm run typecheck`, `npm test`, `npx expo install --check`, `npx expo export --platform ios --output-dir /tmp/cloud-core-mobile-export`.
- Expo Go must load on a physical phone before the broader goal can be marked complete.

---

## File Structure

- Modify: `apps/mobile/src/theme/colors.ts`
  - Adds dark fitness tokens while preserving existing color exports used by old components.
- Modify: `apps/mobile/src/components/Screen.tsx`
  - Makes the app shell dark and keeps RTL/LTR scroll behavior.
- Modify: `apps/mobile/app/(tabs)/_layout.tsx`
  - Updates tab bar and headers to the dark premium shell.
- Modify: `apps/mobile/src/components/PremiumHero.tsx`
  - Rebuilds Home hero as a high-contrast, action-first fitness hero.
- Modify: `apps/mobile/src/components/MembershipHealthPanel.tsx`
  - Converts membership into a compact dark pulse/status module.
- Modify: `apps/mobile/src/components/ConciergePanel.tsx`
  - Converts concierge into a compact studio-care module.
- Modify: `apps/mobile/app/(tabs)/index.tsx`
  - Re-composes Home around hero, class recommendation, and compact status.
- Modify: `apps/mobile/src/components/TimelineClassCard.tsx`
  - Rebuilds schedule rows as premium class feed cards.
- Modify: `apps/mobile/app/(tabs)/schedule.tsx`
  - Updates filters and feed hierarchy.
- Modify: `apps/mobile/app/class/[id]/index.tsx`
  - Rebuilds class detail as cinematic page with sticky booking bar.
- Modify: `apps/mobile/app/(tabs)/bookings.tsx`
  - Updates next booking as a dark command-center card.
- Modify: `apps/mobile/app/(tabs)/profile.tsx`
  - Updates profile as premium member care screen.
- Read: `apps/mobile/src/features/premiumExperience.test.ts`
  - Existing fixture tests must keep passing; do not edit unless a task explicitly changes fixture helper names.

---

### Task 1: Dark Fitness Shell And Design Tokens

**Files:**
- Modify: `apps/mobile/src/theme/colors.ts`
- Modify: `apps/mobile/src/components/Screen.tsx`
- Modify: `apps/mobile/app/(tabs)/_layout.tsx`

**Interfaces:**
- Consumes: existing `colors`, `radii`, `shadows`, `editorial` exports.
- Produces:
  - `fitness` export with dark app tokens.
  - `Screen` dark background and scroll content behavior.
  - Dark tab bar and header styling.

- [ ] **Step 1: Add dark fitness tokens**

Modify `apps/mobile/src/theme/colors.ts` by appending this export below `editorial`:

```ts
export const fitness = {
  appBg: "#050914",
  surface: "#0B1224",
  surfaceRaised: "#111B31",
  surfaceSoft: "#17233A",
  textPrimary: colors.ivory,
  textSecondary: "#B8C0D4",
  textMuted: "#7F8AA3",
  border: "rgba(250,247,242,0.12)",
  borderStrong: "rgba(212,175,106,0.34)",
  goldGlow: "rgba(212,175,106,0.18)",
  blueGlow: "rgba(183,204,230,0.18)",
  imageScrim: "rgba(5,9,20,0.58)",
  imageScrimStrong: "rgba(5,9,20,0.76)",
  dangerGlow: "rgba(166,66,66,0.2)",
  successGlow: "rgba(50,106,90,0.2)",
};
```

Expected: no existing color token is removed.

- [ ] **Step 2: Update the app shell**

Modify `apps/mobile/src/components/Screen.tsx` so it imports `fitness` and uses dark background colors:

```ts
import { useCopy } from "@/i18n/LocaleProvider";
import { fitness } from "@/theme/colors";
import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children }: PropsWithChildren) {
  const { direction } = useCopy();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={[styles.content, { direction }]} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: fitness.appBg,
  },
  content: {
    padding: 18,
    paddingBottom: 124,
    backgroundColor: fitness.appBg,
  },
  inner: {
    gap: 18,
  },
});
```

- [ ] **Step 3: Update dark tab navigation**

Modify `apps/mobile/app/(tabs)/_layout.tsx` to use `fitness` and set dark headers/tabs:

```ts
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, fitness } from "@/theme/colors";

export default function TabsLayout() {
  const { t } = useCopy();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: fitness.textMuted,
        tabBarStyle: {
          backgroundColor: fitness.surface,
          borderTopColor: fitness.border,
          height: 88,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
        },
        headerStyle: { backgroundColor: fitness.appBg },
        headerTintColor: fitness.textPrimary,
        headerTitleStyle: { fontWeight: "900" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.home,
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: t.schedule,
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: t.bookings,
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.profile,
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
```

- [ ] **Step 4: Verify shell compiles**

Run:

```bash
npm --workspace @cloud-core/mobile run typecheck
```

Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/src/theme/colors.ts apps/mobile/src/components/Screen.tsx 'apps/mobile/app/(tabs)/_layout.tsx'
git commit -m "feat: add premium dark mobile shell"
```

---

### Task 2: Premium Home Hero And Status Modules

**Files:**
- Modify: `apps/mobile/src/components/PremiumHero.tsx`
- Modify: `apps/mobile/src/components/MembershipHealthPanel.tsx`
- Modify: `apps/mobile/src/components/ConciergePanel.tsx`
- Modify: `apps/mobile/app/(tabs)/index.tsx`

**Interfaces:**
- Consumes:
  - `PremiumExperience`
  - `ClassSession`
  - `SessionInsight`
  - `getEditorialLine(copy, locale)`
  - `getLocalizedText(copy, locale)`
  - `fitness`
- Produces:
  - Image-led dark hero with CTA, availability, and membership pulse.
  - Compact dark membership and concierge modules.

- [ ] **Step 1: Rebuild `PremiumHero` as action-first dark hero**

Modify `apps/mobile/src/components/PremiumHero.tsx` with these required behavior changes:

```ts
const spots = Math.max(recommendedSession.capacity - recommendedSession.bookedCount, 0);
const spotLine =
  spots > 0
    ? locale === "he"
      ? `${spots} מקומות נשארו`
      : `${spots} spots left`
    : locale === "he"
      ? "רשימת המתנה פעילה"
      : "Waitlist active";
const timeLine = new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(recommendedSession.startsAt));
```

The component must render:

```tsx
<View style={styles.wrap}>
  <ImageBackground
    source={require("../../assets/editorial/studio-community-hero.png")}
    style={styles.image}
    imageStyle={styles.imageRadius}
    resizeMode="cover"
  >
    <View style={styles.scrim}>
      <View style={styles.topLine}>
        <Text style={[styles.brand, { textAlign: align }]}>Cloud&Core Studio</Text>
        <Text style={styles.liveBadge}>{locale === "he" ? "היום" : "Today"}</Text>
      </View>

      <View style={styles.heroCopy}>
        <Text style={[styles.eyebrow, { textAlign: align }]}>
          {locale === "he" ? "הבחירה החזקה להיום" : "Best match today"}
        </Text>
        <Text style={[styles.line, { textAlign: align }]}>
          {getEditorialLine(experience.editorial.heroLine, locale)}
        </Text>
        <Text style={[styles.classTitle, { textAlign: align }]}>{title}</Text>
        <Text style={[styles.context, { textAlign: align }]}>
          {timeLine} · {instructor} · {spotLine}
        </Text>
      </View>

      <Link href={`/class/${recommendedSession.id}`} asChild>
        <Pressable style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
          <Text style={styles.ctaText}>{primary}</Text>
        </Pressable>
      </Link>

      <View style={[styles.pulseRow, direction === "rtl" && styles.rowReverse]}>
        <Pulse
          label={locale === "he" ? "קרדיטים" : "Credits"}
          value={`${experience.membership.entitlement.remainingCredits ?? "∞"}`}
        />
        <Pulse label={locale === "he" ? "קצב" : "Rhythm"} value={locale === "he" ? "שבועי" : "Weekly"} />
        <Pulse label={locale === "he" ? "סטטוס" : "Status"} value={spotLine} />
      </View>
    </View>
  </ImageBackground>
</View>
```

Add a local helper in the same file:

```tsx
function Pulse({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pulse}>
      <Text style={styles.pulseLabel}>{label}</Text>
      <Text style={styles.pulseValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}
```

Expected visual result: first screen is dark, bold, and action-led.

- [ ] **Step 2: Convert membership panel to dark pulse module**

Modify `apps/mobile/src/components/MembershipHealthPanel.tsx` so it:

- Uses `fitness.surface` or `fitness.surfaceRaised`.
- Shows a title like `Membership pulse` / Hebrew equivalent.
- Shows credits, renewal, and freeze eligibility as compact columns.
- Uses `colors.gold` for the most important value.
- Does not use large white cards.

Required style pattern:

```ts
panel: {
  backgroundColor: fitness.surface,
  borderColor: fitness.border,
  borderWidth: 1,
  borderRadius: radii.large,
  padding: 18,
  gap: 14,
},
title: {
  color: fitness.textPrimary,
  fontSize: 18,
  fontWeight: "900",
},
value: {
  color: colors.gold,
  fontSize: 24,
  fontWeight: "900",
},
label: {
  color: fitness.textSecondary,
  fontSize: 12,
  fontWeight: "800",
},
```

- [ ] **Step 3: Convert concierge panel to dark studio-care module**

Modify `apps/mobile/src/components/ConciergePanel.tsx` so it:

- Uses dark elevated surface.
- Uses `colors.blue` or `colors.gold` for active request accents.
- Shows active requests as compact status rows.
- Keeps copy short and practical.

Required row pattern:

```tsx
<View style={[styles.requestRow, direction === "rtl" && styles.rowReverse]}>
  <View style={styles.requestDot} />
  <View style={{ flex: 1 }}>
    <Text style={[styles.requestTitle, { textAlign: align }]}>{title}</Text>
    <Text style={[styles.requestBody, { textAlign: align }]}>{body}</Text>
  </View>
</View>
```

- [ ] **Step 4: Re-compose Home**

Modify `apps/mobile/app/(tabs)/index.tsx` so Home renders in this order:

```tsx
<Screen>
  <PremiumHero
    experience={premiumExperience}
    recommendedSession={recommendedSession}
    insight={recommendedInsight}
  />
  <Text style={[styles.sectionLabel, { textAlign: align }]}>
    {locale === "he" ? "מה קורה בסטודיו" : "Studio status"}
  </Text>
  <MembershipHealthPanel membership={premiumExperience.membership} />
  <ConciergePanel requests={premiumExperience.concierge} />
</Screen>
```

Remove any quiet editorial helper text that makes Home feel like a brochure.

- [ ] **Step 5: Verify Home compiles and tests stay green**

Run:

```bash
npm --workspace @cloud-core/mobile run typecheck
npm --workspace @cloud-core/mobile test -- premiumExperience.test.ts
```

Expected: both commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add apps/mobile/src/components/PremiumHero.tsx apps/mobile/src/components/MembershipHealthPanel.tsx apps/mobile/src/components/ConciergePanel.tsx 'apps/mobile/app/(tabs)/index.tsx'
git commit -m "feat: rebuild premium dark home"
```

---

### Task 3: Premium Schedule Class Feed

**Files:**
- Modify: `apps/mobile/src/components/TimelineClassCard.tsx`
- Modify: `apps/mobile/app/(tabs)/schedule.tsx`

**Interfaces:**
- Consumes:
  - `ClassSession`
  - `SessionInsight | undefined`
  - `fitness`
  - existing route `/class/[id]`
- Produces:
  - Dark, tappable class feed cards.
  - Tactile selected intent filters.

- [ ] **Step 1: Rebuild class row into dark feed card**

Modify `apps/mobile/src/components/TimelineClassCard.tsx` so each card uses:

```tsx
<Link href={`/class/${session.id}`} asChild>
  <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
    <View style={[styles.topRow, direction === "rtl" && styles.rowReverse]}>
      <View style={styles.timeBlock}>
        <Text style={styles.time}>{formatTime(session.startsAt, locale)}</Text>
        <Text style={styles.duration}>{session.durationMinutes}m</Text>
      </View>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
        <Text style={[styles.meta, { textAlign: align }]}>
          {session.instructor.displayName} · {session.roomName}
        </Text>
      </View>
    </View>
    <Text style={[styles.reason, { textAlign: align }]}>{reason}</Text>
    <View style={[styles.footer, direction === "rtl" && styles.rowReverse]}>
      <View style={styles.capacityTrack}>
        <View style={[styles.capacityFill, { width: `${Math.min((session.bookedCount / session.capacity) * 100, 100)}%` }]} />
      </View>
      <Text style={[styles.availability, spots === 0 && styles.waitlistText]}>{availabilityText}</Text>
      <Text style={styles.cta}>{cta}</Text>
    </View>
  </Pressable>
</Link>
```

Update `formatTime` signature:

```ts
function formatTime(value: string, locale: "he" | "en") {
  return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
```

Expected: cards are dark, elevated, and action-readable.

- [ ] **Step 2: Update Schedule header and filters**

Modify `apps/mobile/app/(tabs)/schedule.tsx` so:

- Title color uses `fitness.textPrimary`.
- Intro copy is short and action-led.
- Filters use dark selected states.
- Selected filter status remains visible.
- Recommended class feed remains first.

Required selected filter style:

```ts
selectedFilter: {
  backgroundColor: colors.gold,
  borderColor: colors.gold,
},
selectedFilterText: {
  color: colors.ink,
},
```

- [ ] **Step 3: Verify schedule compiles**

Run:

```bash
npm --workspace @cloud-core/mobile run typecheck
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/src/components/TimelineClassCard.tsx 'apps/mobile/app/(tabs)/schedule.tsx'
git commit -m "feat: add premium dark schedule feed"
```

---

### Task 4: Cinematic Class Detail With Sticky Booking Bar

**Files:**
- Modify: `apps/mobile/app/class/[id]/index.tsx`

**Interfaces:**
- Consumes:
  - `sessions`
  - `entitlement`
  - `decideBooking(session, entitlement)`
  - `getSessionInsight(session.id, premiumExperience)`
  - `fitness`
- Produces:
  - Dark cinematic class detail screen.
  - Sticky booking/action bar with local feedback.

- [ ] **Step 1: Keep local booking state but move action into sticky bar**

In `apps/mobile/app/class/[id]/index.tsx`, preserve:

```ts
const [bookingState, setBookingState] = useState<null | "booked" | "waitlisted" | "blocked">(null);
```

Keep `handleBookingPress()` behavior:

```ts
function handleBookingPress() {
  if (decision.mode === "book") {
    setBookingState("booked");
    return;
  }

  if (decision.mode === "waitlist") {
    setBookingState("waitlisted");
    return;
  }

  setBookingState("blocked");
}
```

Move the `Pressable` CTA into a bottom action block rendered after content:

```tsx
<View style={styles.stickyBar}>
  <View style={{ flex: 1 }}>
    <Text style={[styles.stickyLabel, { textAlign: align }]}>
      {locale === "he" ? "הפעולה הבאה" : "Next action"}
    </Text>
    <Text style={[styles.stickyStatus, { textAlign: align }]} numberOfLines={2}>
      {bookingStatusText ?? (locale === "he" ? "המקום עדיין לא נשמר." : "Your spot is not reserved yet.")}
    </Text>
  </View>
  <Pressable
    onPress={handleBookingPress}
    style={({ pressed }) => [
      styles.primaryButton,
      decision.mode === "waitlist" && styles.waitlistButton,
      decision.mode === "blocked" && styles.blockedButton,
      pressed && styles.primaryButtonPressed,
    ]}
  >
    <Text style={styles.primaryText}>{cta}</Text>
  </Pressable>
</View>
```

Expected: action remains visually available near the bottom of the screen.

- [ ] **Step 2: Apply dark cinematic styling**

Update major styles:

```ts
heroScrim: {
  minHeight: 390,
  justifyContent: "flex-end",
  backgroundColor: fitness.imageScrimStrong,
  borderBottomLeftRadius: radii.hero,
  borderBottomRightRadius: radii.hero,
  padding: 22,
  gap: 9,
},
title: {
  color: fitness.textPrimary,
  fontSize: 40,
  lineHeight: 44,
  fontWeight: "900",
},
section: {
  backgroundColor: fitness.surface,
  borderColor: fitness.border,
  borderWidth: 1,
  borderRadius: radii.large,
  padding: 18,
  gap: 9,
},
stickyBar: {
  backgroundColor: fitness.surfaceRaised,
  borderColor: fitness.borderStrong,
  borderWidth: 1,
  borderRadius: radii.large,
  padding: 14,
  flexDirection: "row",
  gap: 12,
  alignItems: "center",
},
```

Use `direction === "rtl" && styles.rowReverse` on `stickyBar` if needed.

- [ ] **Step 3: Verify class detail compiles**

Run:

```bash
npm --workspace @cloud-core/mobile run typecheck
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add 'apps/mobile/app/class/[id]/index.tsx'
git commit -m "feat: add cinematic class booking detail"
```

---

### Task 5: Dark Bookings And Profile Command Screens

**Files:**
- Modify: `apps/mobile/app/(tabs)/bookings.tsx`
- Modify: `apps/mobile/app/(tabs)/profile.tsx`

**Interfaces:**
- Consumes:
  - existing local booking state in `bookings.tsx`
  - `registerForPushNotificationsAsync()`
  - `premiumExperience.membership`
  - `premiumExperience.concierge`
  - `fitness`
- Produces:
  - Premium dark reservation command center.
  - Premium dark member profile/account care screen.

- [ ] **Step 1: Rebuild bookings card as dark reservation command center**

Modify `apps/mobile/app/(tabs)/bookings.tsx` so the main card uses:

```tsx
<View style={styles.card}>
  <View style={[styles.headerRow, direction === "rtl" && styles.rowReverse]}>
    <View style={styles.timeBadge}>
      <Text style={styles.timeText}>18:30</Text>
      <Text style={styles.timeLabel}>{locale === "he" ? "היום" : "Today"}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.label, { textAlign: align }]}>{t.nextBooking}</Text>
      <Text style={[styles.classTitle, { textAlign: align }]}>{title}</Text>
      <Text style={[styles.meta, { textAlign: align }]}>19 Jun · {next.roomName}</Text>
    </View>
  </View>
  <View style={styles.note}>
    <Text style={[styles.noteText, { textAlign: align }]}>
      {locale === "he"
        ? "הגיעי 8 דקות לפני השיעור. הסטודיו ישמור לך מקום שקט."
        : "Arrive 8 minutes early. The studio will keep your spot ready."}
    </Text>
  </View>
  <View style={[styles.actions, direction === "rtl" && styles.rowReverse]}>
    {/* existing Calendar and Cancel buttons with local state */}
  </View>
  <Text style={[styles.statusText, { textAlign: align }]}>{statusText}</Text>
</View>
```

Use dark colors:

```ts
card: {
  backgroundColor: fitness.surface,
  borderRadius: radii.large,
  borderWidth: 1,
  borderColor: fitness.border,
  padding: 18,
  gap: 14,
},
timeBadge: {
  width: 72,
  borderRadius: 18,
  backgroundColor: fitness.goldGlow,
  borderWidth: 1,
  borderColor: fitness.borderStrong,
  padding: 10,
  alignItems: "center",
},
```

- [ ] **Step 2: Rebuild profile as dark member account care**

Modify `apps/mobile/app/(tabs)/profile.tsx` so:

- Screen title uses `fitness.textPrimary`.
- The instructor image row becomes a dark member hero panel.
- Membership and concierge panels already converted in Task 2 are reused.
- Language segment uses dark surface and gold selected state.
- Notification row uses dark surface, explicit status copy, and switch remains functional.
- Account deletion stays low and danger-styled.

Required member hero pattern:

```tsx
<View style={[styles.memberHero, direction === "rtl" && styles.rowReverse]}>
  <Image source={require("../../assets/editorial/instructor-maya.png")} style={styles.editorialImage} />
  <View style={styles.editorialCopy}>
    <Text style={[styles.editorialEyebrow, { textAlign: align }]}>
      {locale === "he" ? "חברת סטודיו" : "Studio member"}
    </Text>
    <Text style={[styles.editorialTitle, { textAlign: align }]}>
      {locale === "he" ? "נועה - מנוי פרימיום פעיל" : "Noa - Premium membership active"}
    </Text>
    <Text style={[styles.editorialBody, { textAlign: align }]}>
      {locale === "he"
        ? "קרדיטים, התראות ובקשות סטודיו במקום אחד."
        : "Credits, alerts, and studio requests in one place."}
    </Text>
  </View>
</View>
```

- [ ] **Step 3: Verify local interactions remain wired**

Inspect the code and confirm:

- Calendar button still calls `setSavedToCalendar(true)`.
- Cancel button still calls `setBookingCancelled(true)` and `setSavedToCalendar(false)`.
- Notification switch still calls `toggleNotifications`.
- Deletion button still calls `setAccountDeletionRequested(true)`.

Run:

```bash
rg -n "setSavedToCalendar\\(true\\)|setBookingCancelled\\(true\\)|toggleNotifications|setAccountDeletionRequested\\(true\\)" apps/mobile/app
```

Expected: all four patterns are present.

- [ ] **Step 4: Verify bookings and profile compile**

Run:

```bash
npm --workspace @cloud-core/mobile run typecheck
```

Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add 'apps/mobile/app/(tabs)/bookings.tsx' 'apps/mobile/app/(tabs)/profile.tsx'
git commit -m "feat: add premium dark member command screens"
```

---

### Task 6: Final Verification And Expo Phone Launch

**Files:**
- Read: `apps/mobile/app.json`
- Read: `apps/mobile/package.json`
- Read: files modified in Tasks 1-5

**Interfaces:**
- Consumes: completed mobile app redesign.
- Produces: verified branch ready for user phone review.

- [ ] **Step 1: Run full typecheck**

Run:

```bash
npm run typecheck
```

Expected: all workspaces exit 0.

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm test
```

Expected: mobile Jest reports `2 passed, 2 total` or more, and no workspace test command fails.

- [ ] **Step 3: Check Expo dependencies**

Run:

```bash
npx expo install --check
```

from:

```bash
cd apps/mobile
```

Expected: `Dependencies are up to date`.

- [ ] **Step 4: Export iOS bundle**

Run:

```bash
npx expo export --platform ios --output-dir /tmp/cloud-core-mobile-export
```

from:

```bash
cd apps/mobile
```

Expected: export completes and writes `/tmp/cloud-core-mobile-export`.

- [ ] **Step 5: Start Expo for phone review**

Stop any stale Metro process on 8081:

```bash
PID=$(lsof -tiTCP:8081 -sTCP:LISTEN)
if [ -n "$PID" ]; then kill $PID; fi
```

Then run:

```bash
npx expo start --host lan --clear --port 8081
```

If phone cannot reach LAN, start tunnel fallback:

```bash
npx expo start --tunnel --clear --port 8082
```

Expected: Metro prints an `exp://...` URL and bundles iOS successfully when the phone opens it.

- [ ] **Step 6: Probe Expo endpoints**

For LAN:

```bash
curl -sS -i http://192.168.0.25:8081/status | sed -n '1,20p'
curl -sS -i 'http://192.168.0.25:8081' \
  -H 'expo-platform: ios' \
  -H 'expo-protocol-version: 1' \
  -H 'expo-expect-signature: sig, keyid="expo-root", alg="rsa-v1_5-sha256"' \
  | sed -n '1,35p'
```

Expected: `/status` includes `packager-status:running`; manifest returns `HTTP/1.1 200 OK`.

For tunnel, replace the host with the printed `*.exp.direct` hostname and use `https://`.

- [ ] **Step 7: Phone confirmation**

Ask the user to open Expo Go and confirm:

- Home first screen looks premium and eye-catching.
- Schedule looks like a premium class feed.
- Class detail CTA works and shows local status.
- Bookings calendar/cancel actions show visible local feedback.
- Profile language, notifications, and deletion request controls respond.

Do not mark the active goal complete until the user confirms the app opens and the redesigned UI is acceptable on their phone.

- [ ] **Step 8: Final commit if verification-only changes were needed**

If Task 6 required code/config changes, commit them:

```bash
git status --short
git add apps/mobile/app.json apps/mobile/package.json apps/mobile/src apps/mobile/app
git commit -m "fix: verify premium dark mobile launch"
```

If Task 6 only verified existing commits, do not create an empty commit.
