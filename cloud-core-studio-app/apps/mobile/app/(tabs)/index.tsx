import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import type { ClassSession } from "@cloud-core/shared";
import {
  ClassCard,
  CreditBalanceCard,
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
import { colors, fitness, spacing, typography } from "@/theme/colors";

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
              <CreditBalanceCard
                label={membership.planName}
                value={creditValue}
                caption={
                  membership.isUnlimited
                    ? locale === "he"
                      ? "מנוי פעיל"
                      : "Active membership"
                    : locale === "he"
                      ? "קרדיטים נותרו"
                      : "credits remaining"
                }
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
  sectionTitle: { ...typography.h3, color: fitness.textPrimary },
  sectionLabel: { ...typography.label, color: fitness.textSecondary, textTransform: "uppercase" },
  cardTitle: { ...typography.h3, color: fitness.textPrimary, marginTop: spacing.xs },
  cardBody: { ...typography.body, color: fitness.textSecondary, marginTop: spacing.xs },
  link: { ...typography.label, color: colors.gold, fontWeight: "700" },
  warning: { color: "#A66A1F" },
});
