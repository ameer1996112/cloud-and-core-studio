import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import type { ClassSession } from "@cloud-core/shared";
import {
  ClassCard,
  EmptyState,
  Header,
  LoadingSkeleton,
  StatusBadge,
  SurfaceCard,
} from "@/components/design-system";
import { useCopy } from "@/i18n/LocaleProvider";
import { hasSupabaseMobileConfig, loadAvailableClasses } from "@/lib/availableClasses";
import { loadMyBookings, loadMyMembership } from "@/lib/memberApi";
import type { MembershipSummary } from "@/lib/membershipData";
import type { MyBooking } from "@/lib/myBookingsData";
import { colors, fitness, radii, spacing, typography } from "@/theme/colors";

function greeting(locale: "he" | "en", now = new Date()): string {
  const hour = now.getHours();
  if (locale === "he") {
    if (hour < 12) return "בוקר טוב";
    if (hour < 18) return "צהריים טובים";
    return "ערב טוב";
  }
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatWhen(value: string, locale: "he" | "en") {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jerusalem",
  }).format(new Date(value));
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function DashboardSummaryCard({
  planName,
  creditValue,
  creditCaption,
  nextBooking,
  todayCount,
}: {
  planName: string;
  creditValue: string;
  creditCaption: string;
  nextBooking: MyBooking | null;
  todayCount: number;
}) {
  const { locale, direction, rowDirection, textAlign } = useCopy();
  const nextLabel = nextBooking
    ? formatWhen(nextBooking.startsAt, locale)
    : locale === "he"
      ? "בחרו שיעור"
      : "Choose a class";

  return (
    <View style={styles.dashboardHero}>
      <View style={[styles.heroTop, { flexDirection: rowDirection }]}>
        <View style={[styles.heroKicker, { flexDirection: rowDirection }]}>
          <Ionicons name="sparkles-outline" size={14} color={colors.gold} />
          <Text style={[styles.heroKickerText, { textAlign, writingDirection: direction }]}>
            {locale === "he" ? "מנוי סטודיו" : "Studio membership"}
          </Text>
        </View>
        <View style={styles.heroSeal}>
          <Ionicons name="diamond-outline" size={18} color={colors.gold} />
        </View>
      </View>

      <Text style={[styles.heroTitle, { textAlign, writingDirection: direction }]} numberOfLines={2}>
        {planName}
      </Text>
      <Text style={[styles.heroBody, { textAlign, writingDirection: direction }]}>
        {locale === "he"
          ? "מבט מהיר על היתרה, השיעור הבא והלו״ז של היום."
          : "A quick view of your balance, next class, and today’s schedule."}
      </Text>

      <View style={[styles.heroMetrics, { flexDirection: rowDirection }]}>
        <View style={styles.heroMetric}>
          <Text style={[styles.heroMetricValue, { writingDirection: direction }]} numberOfLines={1}>
            {creditValue}
          </Text>
          <Text style={[styles.heroMetricLabel, { textAlign, writingDirection: direction }]} numberOfLines={2}>
            {creditCaption}
          </Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.heroMetricWide}>
          <Text style={[styles.heroMetricValueSmall, { textAlign, writingDirection: direction }]} numberOfLines={1}>
            {nextLabel}
          </Text>
          <Text style={[styles.heroMetricLabel, { textAlign, writingDirection: direction }]} numberOfLines={2}>
            {locale === "he" ? "השיעור הבא" : "Next class"}
          </Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.heroMetric}>
          <Text style={[styles.heroMetricValue, { writingDirection: direction }]}>{todayCount}</Text>
          <Text style={[styles.heroMetricLabel, { textAlign, writingDirection: direction }]} numberOfLines={2}>
            {locale === "he" ? "היום" : "Today"}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { locale, direction, textAlign } = useCopy();
  const insets = useSafeAreaInsets();
  const hasBackend = hasSupabaseMobileConfig();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [membership, setMembership] = useState<MembershipSummary | null>(null);
  const [nextBooking, setNextBooking] = useState<MyBooking | null>(null);
  const [todayClasses, setTodayClasses] = useState<ClassSession[]>([]);

  const load = useCallback(async () => {
    // Resolve the signed-in member's display name (best-effort).
    if (hasBackend) {
      const { supabase } = await import("@/lib/supabase");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setSignedIn(Boolean(user));
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();
        setName(profile?.full_name ?? user.email ?? null);
      } else {
        setName(null);
      }
    }

    const [membershipResult, bookingsResult, classesResult] = await Promise.all([
      loadMyMembership(locale),
      loadMyBookings(locale),
      loadAvailableClasses(),
    ]);

    setMembership(membershipResult.membership);
    setNextBooking(bookingsResult.upcoming[0] ?? null);

    const now = new Date();
    setTodayClasses(classesResult.sessions.filter((s) => isSameDay(new Date(s.startsAt), now)));
  }, [hasBackend, locale]);

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      await load();
      if (active) setIsLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [load]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await load();
    setIsRefreshing(false);
  }, [load]);

  const creditValue = membership
    ? membership.isUnlimited
      ? locale === "he"
        ? "ללא הגבלה"
        : "Unlimited"
      : String(membership.remainingCredits ?? 0)
    : "—";
  const creditCaption = membership?.isUnlimited
    ? locale === "he"
      ? "מנוי פעיל"
      : "Active membership"
    : locale === "he"
      ? "קרדיטים נותרו"
      : "credits remaining";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 110 + insets.bottom }]}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.gold} />}
        showsVerticalScrollIndicator={false}
      >
        <Header
          eyebrow={greeting(locale)}
          title={name ?? (locale === "he" ? "ברוכים הבאים" : "Welcome")}
          subtitle={locale === "he" ? "הסטודיו שלך לפילאטיס ואוויר." : "Your pilates & aerial studio."}
        />

        {isLoading ? (
          <SurfaceCard>
            <LoadingSkeleton lines={4} />
          </SurfaceCard>
        ) : !signedIn && hasBackend ? (
          <EmptyState
            title={locale === "he" ? "התחברות נדרשת" : "Sign in to get started"}
            body={
              locale === "he"
                ? "התחברו בלשונית הפרופיל כדי להזמין שיעורים ולראות קרדיטים."
                : "Sign in from the Profile tab to book classes and see your credits."
            }
          />
        ) : (
          <>
            {membership ? (
              <DashboardSummaryCard
                planName={membership.planName}
                creditValue={creditValue}
                creditCaption={creditCaption}
                nextBooking={nextBooking}
                todayCount={todayClasses.length}
              />
            ) : signedIn ? (
              <SurfaceCard elevated>
                <Text style={[styles.cardTitle, { textAlign, writingDirection: direction }]}>
                  {locale === "he" ? "אין מנוי פעיל" : "No active plan"}
                </Text>
                <Text style={[styles.cardBody, { textAlign, writingDirection: direction }]}>
                  {locale === "he"
                    ? "עברו ללשונית התוכניות כדי לרכוש מנוי ולהתחיל להזמין."
                    : "Visit the Plans tab to buy a membership and start booking."}
                </Text>
              </SurfaceCard>
            ) : null}

            {nextBooking ? (
              <SurfaceCard elevated>
                <View style={styles.rowBetween}>
                  <Text style={[styles.sectionLabel, { textAlign, writingDirection: direction }]}>
                    {locale === "he" ? "השיעור הבא שלך" : "Your next class"}
                  </Text>
                  <StatusBadge
                    status={nextBooking.isWaitlisted ? "waitlist" : "booked"}
                    label={
                      nextBooking.isWaitlisted
                        ? locale === "he"
                          ? `המתנה #${nextBooking.waitlistPosition ?? ""}`
                          : `Waitlist #${nextBooking.waitlistPosition ?? ""}`
                        : locale === "he"
                          ? "מאושר"
                          : "Confirmed"
                    }
                  />
                </View>
                <Text style={[styles.cardTitle, { textAlign, writingDirection: direction }]}>{nextBooking.title}</Text>
                <Text style={[styles.cardBody, { textAlign, writingDirection: direction }]}>
                  {formatWhen(nextBooking.startsAt, locale)} · {nextBooking.instructorName}
                </Text>
              </SurfaceCard>
            ) : null}

            <View style={styles.rowBetween}>
              <Text style={[styles.sectionTitle, { textAlign, writingDirection: direction }]}>
                {locale === "he" ? "שיעורים היום" : "Today's classes"}
              </Text>
              <Link href="/schedule" style={styles.link}>
                {locale === "he" ? "כל הלוח" : "View all"}
              </Link>
            </View>

            {todayClasses.length === 0 ? (
              <EmptyState
                title={locale === "he" ? "אין שיעורים היום" : "No classes today"}
                body={
                  locale === "he"
                    ? "עברו ללוח כדי לראות שיעורים קרובים."
                    : "Check the schedule for upcoming classes."
                }
              />
            ) : (
              <View style={styles.list}>
                {todayClasses.map((session) => (
                  <ClassCard key={session.id} session={session} compact />
                ))}
              </View>
            )}
          </>
        )}

        {!hasBackend ? (
          <SurfaceCard>
            <Text style={[styles.cardBody, styles.warning, { textAlign, writingDirection: direction }]}>
              {locale === "he" ? "חסרה הגדרת Supabase מקומית." : "Local Supabase configuration is missing."}
            </Text>
          </SurfaceCard>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: fitness.appBg },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.md },
  list: { gap: spacing.md },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.sm },
  dashboardHero: {
    overflow: "hidden",
    borderRadius: radii.fullCard,
    borderWidth: 1,
    borderColor: fitness.borderStrong,
    backgroundColor: "#121722",
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: "#000000",
    shadowOpacity: 0.34,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
  },
  heroTop: { alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  heroKicker: {
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(212,175,106,0.32)",
    backgroundColor: "rgba(212,175,106,0.12)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  heroKickerText: { ...typography.caption, color: colors.gold, textTransform: "uppercase" },
  heroSeal: {
    width: 42,
    height: 42,
    borderRadius: radii.large,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,106,0.38)",
    backgroundColor: "rgba(250,247,242,0.06)",
  },
  heroTitle: { ...typography.h1, color: fitness.textPrimary },
  heroBody: { ...typography.bodySmall, color: fitness.textSecondary },
  heroMetrics: {
    alignItems: "stretch",
    gap: spacing.sm,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: "rgba(250,247,242,0.09)",
    backgroundColor: "rgba(250,247,242,0.045)",
    padding: spacing.sm,
  },
  heroMetric: { flex: 0.78, minWidth: 0, justifyContent: "center", gap: 3 },
  heroMetricWide: { flex: 1.35, minWidth: 0, justifyContent: "center", gap: 3 },
  heroMetricValue: { fontSize: 24, lineHeight: 29, fontWeight: "800", color: colors.gold },
  heroMetricValueSmall: { ...typography.bodySmall, color: fitness.textPrimary, fontWeight: "800" },
  heroMetricLabel: { ...typography.caption, color: fitness.textMuted },
  metricDivider: { width: 1, alignSelf: "stretch", backgroundColor: "rgba(250,247,242,0.09)" },
  sectionTitle: { ...typography.h3, color: fitness.textPrimary },
  sectionLabel: { ...typography.label, color: fitness.textSecondary, textTransform: "uppercase" },
  cardTitle: { ...typography.h3, color: fitness.textPrimary, marginTop: spacing.xs },
  cardBody: { ...typography.body, color: fitness.textSecondary, marginTop: spacing.xs },
  link: { ...typography.label, color: colors.gold, fontWeight: "700" },
  warning: { color: "#A66A1F" },
});
