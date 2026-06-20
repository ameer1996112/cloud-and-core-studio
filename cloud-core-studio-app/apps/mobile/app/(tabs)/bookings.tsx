import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ConfirmationDialog,
  CreditBalanceCard,
  EmptyState,
  Header,
  LoadingSkeleton,
  SecondaryButton,
  StatusBadge,
  SurfaceCard,
  Toast,
} from "@/components/design-system";
import { useCopy } from "@/i18n/LocaleProvider";
import { hasSupabaseMobileConfig } from "@/lib/availableClasses";
import { cancelBooking, loadMyBookings, loadMyMembership } from "@/lib/memberApi";
import type { MembershipSummary } from "@/lib/membershipData";
import { canCancelEarly, type MyBooking } from "@/lib/myBookingsData";
import { colors, fitness, spacing, typography } from "@/theme/colors";

type TabKey = "upcoming" | "history";

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

function statusBadge(
  booking: MyBooking,
  locale: "he" | "en",
): { status: Parameters<typeof StatusBadge>[0]["status"]; label: string } {
  if (booking.isWaitlisted) {
    return {
      status: "waitlist",
      label: locale === "he" ? `המתנה #${booking.waitlistPosition ?? ""}` : `Waitlist #${booking.waitlistPosition ?? ""}`,
    };
  }
  switch (booking.status) {
    case "confirmed":
      return { status: "booked", label: locale === "he" ? "מאושר" : "Confirmed" };
    case "completed":
      return { status: "success", label: locale === "he" ? "נכח/ה" : "Attended" };
    case "cancelled":
      return { status: "closed", label: locale === "he" ? "בוטל" : "Cancelled" };
    case "late_cancelled":
      return { status: "danger", label: locale === "he" ? "ביטול מאוחר" : "Late cancel" };
    case "no_show":
      return { status: "danger", label: locale === "he" ? "לא הגיע/ה" : "No show" };
    default:
      return { status: "open", label: booking.status };
  }
}

export default function BookingsScreen() {
  const { locale, direction, textAlign } = useCopy();
  const insets = useSafeAreaInsets();
  const hasBackend = hasSupabaseMobileConfig();

  const [tab, setTab] = useState<TabKey>("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [upcoming, setUpcoming] = useState<MyBooking[]>([]);
  const [history, setHistory] = useState<MyBooking[]>([]);
  const [membership, setMembership] = useState<MembershipSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notSignedIn, setNotSignedIn] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "warning" | "danger" } | null>(null);
  const [pendingCancel, setPendingCancel] = useState<MyBooking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    const [bookingsResult, membershipResult] = await Promise.all([
      loadMyBookings(locale),
      loadMyMembership(locale),
    ]);

    setNotSignedIn(bookingsResult.error === "not_signed_in");
    if (bookingsResult.error && bookingsResult.error !== "not_signed_in") {
      setError(bookingsResult.error);
    }
    setUpcoming(bookingsResult.upcoming);
    setHistory(bookingsResult.history);
    setMembership(membershipResult.membership);
  }, [locale]);

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

  async function confirmCancel() {
    if (!pendingCancel) return;
    setIsCancelling(true);
    const result = await cancelBooking(pendingCancel.bookingId);
    setIsCancelling(false);
    setPendingCancel(null);

    if (result.status === "error") {
      setToast({ message: locale === "he" ? "הביטול נכשל. נסו שוב." : "Cancellation failed. Try again.", tone: "danger" });
      return;
    }
    if (result.status === "late_cancelled") {
      setToast({
        message: locale === "he" ? "בוטל באיחור — לא הוחזר קרדיט." : "Late cancel — no credit returned.",
        tone: "warning",
      });
    } else {
      setToast({
        message: result.refunded
          ? locale === "he"
            ? "בוטל. הקרדיט הוחזר."
            : "Cancelled. Credit returned."
          : locale === "he"
            ? "ההזמנה בוטלה."
            : "Booking cancelled.",
        tone: "success",
      });
    }
    await load();
  }

  const creditValue = membership
    ? membership.isUnlimited
      ? locale === "he"
        ? "ללא הגבלה"
        : "Unlimited"
      : String(membership.remainingCredits ?? 0)
    : "—";

  const list = tab === "upcoming" ? upcoming : history;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 110 + insets.bottom }]}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.gold} />}
        showsVerticalScrollIndicator={false}
      >
        <Header
          eyebrow={locale === "he" ? "ההזמנות שלי" : "My bookings"}
          title={locale === "he" ? "השיעורים שלי" : "Your classes"}
          subtitle={locale === "he" ? "ניהול הזמנות, רשימות המתנה וקרדיטים." : "Manage bookings, waitlists, and credits."}
        />

        {membership ? (
          <CreditBalanceCard
            label={membership.planName}
            value={creditValue}
            caption={
              membership.expiresAt
                ? locale === "he"
                  ? `בתוקף עד ${formatWhen(membership.expiresAt, locale)}`
                  : `Valid until ${formatWhen(membership.expiresAt, locale)}`
                : locale === "he"
                  ? "מנוי פעיל"
                  : "Active membership"
            }
          />
        ) : !notSignedIn && !isLoading ? (
          <SurfaceCard>
            <Text style={[styles.cardBody, { textAlign, writingDirection: direction }]}>
              {locale === "he" ? "אין מנוי פעיל. עברו ללשונית התוכניות כדי לרכוש." : "No active plan. Visit Plans to purchase."}
            </Text>
          </SurfaceCard>
        ) : null}

        <View style={styles.tabRow}>
          {(["upcoming", "history"] as TabKey[]).map((key) => (
            <Text
              key={key}
              accessibilityRole="button"
              onPress={() => setTab(key)}
              style={[styles.tab, tab === key && styles.tabActive]}
            >
              {key === "upcoming"
                ? locale === "he"
                  ? "הקרובים"
                  : "Upcoming"
                : locale === "he"
                  ? "היסטוריה"
                  : "History"}
            </Text>
          ))}
        </View>

        {error ? (
          <SurfaceCard>
            <Text style={[styles.cardBody, styles.errorText, { textAlign, writingDirection: direction }]}>
              {locale === "he" ? "טעינת ההזמנות נכשלה." : "Could not load bookings."}
            </Text>
            <SecondaryButton icon="refresh-outline" onPress={onRefresh}>
              {locale === "he" ? "נסו שוב" : "Retry"}
            </SecondaryButton>
          </SurfaceCard>
        ) : null}

        {isLoading ? (
          <SurfaceCard>
            <LoadingSkeleton lines={4} />
          </SurfaceCard>
        ) : notSignedIn ? (
          <EmptyState
            title={locale === "he" ? "התחברות נדרשת" : "Sign in required"}
            body={locale === "he" ? "התחברו בלשונית הפרופיל כדי לראות הזמנות." : "Sign in from the Profile tab to see your bookings."}
          />
        ) : list.length === 0 ? (
          <EmptyState
            title={
              tab === "upcoming"
                ? locale === "he"
                  ? "אין שיעורים קרובים"
                  : "No upcoming classes"
                : locale === "he"
                  ? "אין היסטוריה עדיין"
                  : "No history yet"
            }
            body={
              tab === "upcoming"
                ? locale === "he"
                  ? "הזמינו שיעור מהלוח כדי שיופיע כאן."
                  : "Book a class from the schedule to see it here."
                : locale === "he"
                  ? "שיעורים שהושלמו יופיעו כאן."
                  : "Completed classes will appear here."
            }
          />
        ) : (
          <View style={styles.list}>
            {list.map((booking) => {
              const badge = statusBadge(booking, locale);
              const cancellable = tab === "upcoming" && canCancelEarly(booking);
              return (
                <SurfaceCard key={booking.bookingId} elevated>
                  <View style={styles.rowBetween}>
                    <Text style={[styles.classTitle, { textAlign, writingDirection: direction }]}>{booking.title}</Text>
                    <StatusBadge status={badge.status} label={badge.label} />
                  </View>
                  <Text style={[styles.meta, { textAlign, writingDirection: direction }]}>
                    {formatWhen(booking.startsAt, locale)} · {booking.instructorName} · {booking.roomName}
                  </Text>
                  {tab === "upcoming" ? (
                    <SecondaryButton icon="close-circle-outline" danger onPress={() => setPendingCancel(booking)}>
                      {booking.isWaitlisted
                        ? locale === "he"
                          ? "צאו מרשימת ההמתנה"
                          : "Leave waitlist"
                        : cancellable
                          ? locale === "he"
                            ? "ביטול (החזר קרדיט)"
                            : "Cancel (credit back)"
                          : locale === "he"
                            ? "ביטול מאוחר (ללא החזר)"
                            : "Late cancel (no refund)"}
                    </SecondaryButton>
                  ) : null}
                </SurfaceCard>
              );
            })}
          </View>
        )}

        {!hasBackend ? (
          <SurfaceCard>
            <Text style={[styles.cardBody, styles.warning, { textAlign, writingDirection: direction }]}>
              {locale === "he" ? "חסרה הגדרת Supabase מקומית." : "Local Supabase configuration is missing."}
            </Text>
          </SurfaceCard>
        ) : null}
      </ScrollView>

      <ConfirmationDialog
        visible={Boolean(pendingCancel)}
        title={locale === "he" ? "לבטל את ההזמנה?" : "Cancel this booking?"}
        body={
          pendingCancel && !pendingCancel.isWaitlisted && !canCancelEarly(pendingCancel)
            ? locale === "he"
              ? "מועד הביטול חלף — לא יוחזר קרדיט."
              : "The cancellation window has passed — no credit will be returned."
            : locale === "he"
              ? "אפשר להזמין מחדש כל עוד יש מקום."
              : "You can rebook later while space remains."
        }
        confirmLabel={
          isCancelling
            ? locale === "he"
              ? "מבטל..."
              : "Cancelling..."
            : locale === "he"
              ? "כן, לבטל"
              : "Yes, cancel"
        }
        cancelLabel={locale === "he" ? "חזרה" : "Keep booking"}
        onConfirm={confirmCancel}
        onCancel={() => setPendingCancel(null)}
      />

      {toast ? (
        <View style={[styles.toastWrap, { bottom: 90 + insets.bottom }]} pointerEvents="none">
          <Toast message={toast.message} tone={toast.tone} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: fitness.appBg },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.md },
  tabRow: { flexDirection: "row", gap: spacing.sm },
  tab: {
    ...typography.label,
    color: fitness.textSecondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    overflow: "hidden",
  },
  tabActive: { color: fitness.appBg, backgroundColor: colors.gold },
  list: { gap: spacing.md },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.sm },
  classTitle: { ...typography.h3, color: fitness.textPrimary, flex: 1 },
  meta: { ...typography.body, color: fitness.textSecondary, marginTop: spacing.xs, marginBottom: spacing.sm },
  cardBody: { ...typography.body, color: fitness.textSecondary },
  errorText: { marginBottom: spacing.sm },
  warning: { color: "#A66A1F" },
  toastWrap: { position: "absolute", left: spacing.lg, right: spacing.lg },
});
