import { useEffect, useState } from "react";
import { decideBooking } from "@cloud-core/shared";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BookingCTA,
  ClassCard,
  ConfirmationDialog,
  Header,
  IconButton,
  InstructorAvatar,
  ModalBottomSheet,
  PrimaryButton,
  SecondaryButton,
  StatStrip,
  StatusBadge,
  SurfaceCard,
  Toast,
  WaitlistBadge,
  triggerImpactHaptic,
} from "@/components/design-system";
import { entitlement, sessions as fixtureSessions } from "@/fixtures/classes";
import { getLocalizedText, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { loadAvailableClasses } from "@/lib/availableClasses";
import { selectSessionById } from "@/lib/availableClassesData";
import { bookClassSession } from "@/lib/bookings";
import type { BookingBlockedReason } from "@/lib/bookingsData";
import { colors, fitness, palette, radii, shadows, spacing, typography, useResponsiveMetrics } from "@/theme/colors";

function formatDate(value: string, locale: "he" | "en") {
  return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function blockedBookingMessage(reason: BookingBlockedReason, locale: "he" | "en") {
  const messages: Record<BookingBlockedReason, { he: string; en: string }> = {
    backend_unavailable: {
      he: "צריך לחבר Supabase כדי להזמין שיעור אמיתי.",
      en: "Connect Supabase before real class booking is available.",
    },
    membership_required: {
      he: "צריך מנוי פעיל או קרדיטים זמינים כדי להזמין.",
      en: "An active plan or available credits are required to book.",
    },
    no_credits: {
      he: "אין קרדיטים זמינים במנוי הזה.",
      en: "This membership has no available credits.",
    },
    already_booked: {
      he: "כבר יש לך הזמנה או המתנה לשיעור הזה.",
      en: "You already have a booking or waitlist spot for this class.",
    },
    class_not_bookable: {
      he: "השיעור כבר לא פתוח להזמנות.",
      en: "This class is no longer open for booking.",
    },
    class_full: {
      he: "השיעור מלא ואי אפשר להצטרף להמתנה כרגע.",
      en: "This class is full and waitlist is unavailable.",
    },
    unknown: {
      he: "לא ניתן להשלים הזמנה כרגע.",
      en: "Booking could not be completed right now.",
    },
  };

  return messages[reason][locale];
}

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, locale, direction, rowDirection, textAlign } = useCopy();
  const insets = useSafeAreaInsets();
  const metrics = useResponsiveMetrics();
  const [sessions, setSessions] = useState(fixtureSessions);
  const [bookingState, setBookingState] = useState<null | "booked" | "waitlisted" | "blocked">(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const session = selectSessionById(sessions, id) ?? fixtureSessions[0];
  const similar = sessions.filter((item) => item.id !== session.id).slice(0, 2);
  const insight = getSessionInsight(session.id, premiumExperience);
  const decision = decideBooking(session, entitlement);
  const align = textAlign;
  const title = locale === "he" ? session.titleHe : session.titleEn;
  const description = locale === "he" ? session.descriptionHe : session.descriptionEn;
  const equipment = locale === "he" ? session.equipmentHe : session.equipmentEn;
  const spots = Math.max(session.capacity - session.bookedCount, 0);
  const durationMinutes = Math.round((new Date(session.endsAt).getTime() - new Date(session.startsAt).getTime()) / 60000);
  const levelLabel =
    locale === "he"
      ? session.level === "beginner"
        ? "מתחיל"
        : session.level === "intermediate"
          ? "בינוני"
          : session.level === "advanced"
            ? "מתקדם"
            : "כל הרמות"
      : session.level === "all_levels"
        ? "All"
        : session.level;
  const cta = insight
    ? getLocalizedText(insight.bookingCta, locale)
    : decision.mode === "waitlist"
      ? t.joinWaitlist
      : t.book;
  const statusTone = bookingState === "booked" ? "success" : bookingState === "waitlisted" ? "warning" : decision.mode === "blocked" ? "danger" : spots > 0 ? "open" : "waitlist";
  const statusLabel =
    bookingState === "booked"
      ? locale === "he"
        ? "הוזמן"
        : "Booked"
      : bookingState === "waitlisted"
        ? locale === "he"
          ? "בהמתנה"
          : "Waitlisted"
        : spots > 0
          ? locale === "he"
            ? "פתוח"
            : "Open"
          : locale === "he"
            ? "המתנה"
            : "Waitlist";

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const result = await loadAvailableClasses();

      if (isMounted && result.sessions.length > 0) {
        setSessions(result.sessions);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleBookingPress() {
    if (isBookingSubmitting) {
      return;
    }

    triggerImpactHaptic();
    setIsBookingSubmitting(true);
    const result = await bookClassSession(session.id);
    setIsBookingSubmitting(false);

    if (result.status === "booked") {
      setBookingState("booked");
      setBookingMessage(locale === "he" ? "ההזמנה נשמרה במערכת." : "Your booking is confirmed.");
      return;
    }

    if (result.status === "waitlisted") {
      setBookingState("waitlisted");
      setBookingMessage(
        locale === "he"
          ? `נכנסת להמתנה במקום ${result.waitlistPosition}.`
          : `You joined the waitlist at position ${result.waitlistPosition}.`,
      );
      return;
    }

    setBookingState("blocked");
    setBookingMessage(blockedBookingMessage(result.reason, locale));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: metrics.horizontalPadding,
            paddingBottom: 150 + insets.bottom,
            maxWidth: metrics.maxContentWidth,
            alignSelf: "center",
            width: "100%",
          },
        ]}
      >
        <View style={[styles.topBar, { flexDirection: rowDirection }]}>
          <IconButton icon={direction === "rtl" ? "chevron-forward" : "chevron-back"} label="Back" onPress={() => router.back()} />
          <StatusBadge status={statusTone} label={statusLabel} />
        </View>

        <View style={[styles.hero, { minHeight: metrics.compact ? 330 : 390 }]}>
          <Image source={require("../../../assets/editorial/class-stretch-flow.png")} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroScrim} />
          <View style={styles.heroCopy}>
            <Text style={[styles.eyebrow, { textAlign: align }]}>{locale === "he" ? "תיק שיעור" : "Class dossier"}</Text>
            <Text style={[styles.heroTitle, metrics.isSmall && styles.heroTitleSmall, { textAlign: align }]} numberOfLines={3}>
              {title}
            </Text>
            <Text style={[styles.heroDescription, { textAlign: align }]}>{description}</Text>
          </View>
        </View>

        <SurfaceCard elevated>
          <View style={[styles.instructorRow, { flexDirection: rowDirection }]}>
            <InstructorAvatar name={session.instructor.displayName} size={46} />
            <View style={styles.flex}>
              <Text style={[styles.cardTitle, { textAlign: align }]}>{session.instructor.displayName}</Text>
              <Text style={[styles.cardBody, { textAlign: align }]}>
                {formatDate(session.startsAt, locale)} · {durationMinutes}m · {session.roomName}
              </Text>
            </View>
          </View>
          <StatStrip
            items={[
              { label: locale === "he" ? "מקומות פנויים" : "spots left", value: `${spots}` },
              { label: locale === "he" ? "קיבולת" : "capacity", value: `${session.bookedCount}/${session.capacity}` },
              { label: locale === "he" ? "רמה" : "level", value: levelLabel },
            ]}
          />
        </SurfaceCard>

        {bookingState ? (
          <Toast
            tone={bookingState === "blocked" ? "danger" : bookingState === "waitlisted" ? "warning" : "success"}
            message={
              bookingMessage ||
              (bookingState === "booked"
                ? locale === "he"
                  ? "ההזמנה נשמרה במערכת."
                  : "Your booking is confirmed."
                : bookingState === "waitlisted"
                  ? locale === "he"
                    ? "נכנסת להמתנה. חלון אישור יוצג אם יתפנה מקום."
                    : "You joined the waitlist. A confirmation window appears if a spot opens."
                  : locale === "he"
                    ? "לא ניתן להזמין כרגע. בדקי מנוי, קרדיטים או זמינות."
                    : "Booking is unavailable. Check membership, credits, or availability.")
            }
          />
        ) : null}

        {insight ? (
          <SurfaceCard>
            <Header
              eyebrow={locale === "he" ? "התאמה אישית" : "Personal fit"}
              title={locale === "he" ? "למה השיעור מתאים לך" : "Why this class fits"}
              subtitle={locale === "he" ? "הסבר קצר לפני פעולה." : "A short explanation before acting."}
            />
            {insight.reasons.map((reason) => (
              <DetailRow key={reason.en} text={getLocalizedText(reason, locale)} />
            ))}
            {insight.waitlistOdds ? <WaitlistBadge position={session.waitlistCount + 1} odds={insight.waitlistOdds} /> : null}
          </SurfaceCard>
        ) : null}

        <SurfaceCard>
          <Text style={[styles.cardTitle, { textAlign: align }]}>{locale === "he" ? "לפני שמגיעים" : "Before you arrive"}</Text>
          {equipment.map((item) => (
            <DetailRow key={item} text={item} />
          ))}
          {insight?.preparation.map((item) => <DetailRow key={item.en} text={getLocalizedText(item, locale)} />)}
        </SurfaceCard>

        <SurfaceCard>
          <Text style={[styles.cardTitle, { textAlign: align }]}>{locale === "he" ? "מדיניות וזמינות" : "Policy and availability"}</Text>
          <Text style={[styles.cardBody, { textAlign: align }]}>
            {locale === "he"
              ? `ביטול ללא חיוב עד ${session.cancellationWindowHours} שעות לפני השיעור. אם השיעור מלא, הצטרפות להמתנה אינה מורידה קרדיט עד אישור.`
              : `Cancel without charge up to ${session.cancellationWindowHours} hours before class. Joining a waitlist does not spend a credit until confirmation.`}
          </Text>
          <SecondaryButton icon="document-text-outline" onPress={() => setShowPolicy(true)}>
            {locale === "he" ? "לראות מדיניות מלאה" : "View full policy"}
          </SecondaryButton>
        </SurfaceCard>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { textAlign: align }]}>{locale === "he" ? "שיעורים דומים" : "Similar classes"}</Text>
        </View>
        {similar.map((item) => (
          <ClassCard key={item.id} session={item} insight={getSessionInsight(item.id, premiumExperience)} compact />
        ))}

        <ModalBottomSheet
          visible={showPolicy}
          title={locale === "he" ? "מדיניות ביטול והמתנה" : "Cancellation and waitlist policy"}
          onClose={() => setShowPolicy(false)}
        >
          <Text style={[styles.cardBody, { textAlign: align }]}>
            {locale === "he"
              ? "הסטודיו שולח תזכורת לפני השיעור. ביטול מאוחר עלול לחייב קרדיט. בהמתנה, תקבלי חלון אישור קצר כשמתפנה מקום."
              : "The studio sends a reminder before class. Late cancellation may spend a credit. On waitlist, you get a short confirmation window when a spot opens."}
          </Text>
        </ModalBottomSheet>

        <ConfirmationDialog
          visible={showConfirmCancel}
          title={locale === "he" ? "לבטל את ההזמנה?" : "Cancel booking?"}
          body={locale === "he" ? "הפעולה נשמרת מקומית כרגע." : "This action is stored locally for now."}
          confirmLabel={locale === "he" ? "לבטל" : "Cancel booking"}
          cancelLabel={locale === "he" ? "להשאיר" : "Keep booking"}
          onConfirm={() => {
            setBookingState(null);
            setShowConfirmCancel(false);
          }}
          onCancel={() => setShowConfirmCancel(false)}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.stickyBarCol}>
          <View style={[styles.stickyBarTop, { flexDirection: rowDirection }]}>
            <View style={[styles.metaPill, spots > 0 ? styles.metaPillOpen : styles.metaPillWaitlist]}>
              <Text style={styles.metaPillText}>
                {spots > 0
                  ? locale === "he"
                    ? `${spots} מקומות פנויים`
                    : `${spots} spots left`
                  : locale === "he"
                    ? `${session.waitlistCount + 1} בהמתנה`
                    : `${session.waitlistCount + 1} waiting`}
              </Text>
            </View>
            <Text style={styles.roomNameText}>{session.roomName} · {durationMinutes}m</Text>
          </View>
          
          <View style={styles.ctaWrapper}>
            {bookingState === "booked" ? (
              <SecondaryButton danger icon="close-circle-outline" onPress={() => setShowConfirmCancel(true)} style={styles.fullWidthBtn}>
                {locale === "he" ? "לבטל הזמנה" : "Cancel reservation"}
              </SecondaryButton>
            ) : (
              <BookingCTA
                decision={isBookingSubmitting ? "book" : decision.mode}
                bookLabel={isBookingSubmitting ? (locale === "he" ? "שומר הזמנה..." : "Booking...") : cta}
                waitlistLabel={isBookingSubmitting ? (locale === "he" ? "שומר המתנה..." : "Joining...") : cta}
                blockedLabel={locale === "he" ? "חסום" : "Blocked"}
                onPress={handleBookingPress}
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ text }: { text: string }) {
  const { direction, rowDirection, textAlign } = useCopy();
  const align = textAlign;
  return (
    <View style={[styles.detailRow, { flexDirection: rowDirection }]}>
      <Ionicons name="checkmark-circle-outline" size={17} color={colors.gold} />
      <Text style={[styles.detailText, { textAlign: align, writingDirection: direction }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: fitness.appBg,
  },
  content: {
    gap: spacing.lg,
    paddingTop: spacing.xs,
    backgroundColor: fitness.appBg,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hero: {
    overflow: "hidden",
    borderRadius: radii.fullCard,
    backgroundColor: fitness.surface,
    ...shadows.premium,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: fitness.imageScrimStrong,
  },
  heroCopy: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.xl,
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.label,
    color: colors.gold,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    color: fitness.textPrimary,
  },
  heroTitleSmall: {
    fontSize: 29,
    lineHeight: 35,
  },
  heroDescription: {
    ...typography.body,
    color: fitness.textSecondary,
  },
  instructorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: fitness.textPrimary,
  },
  cardBody: {
    ...typography.body,
    color: fitness.textSecondary,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  detailText: {
    ...typography.body,
    color: fitness.textSecondary,
    flex: 1,
  },
  sectionHeader: {
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.h2,
    color: fitness.textPrimary,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: "rgba(5,9,20,0.94)",
    borderTopWidth: 1,
    borderTopColor: fitness.border,
  },
  stickyBarCol: {
    gap: spacing.sm,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: fitness.borderStrong,
    backgroundColor: "rgba(8,15,30,0.96)",
    padding: spacing.md,
    alignItems: "stretch",
    ...shadows.premium,
  },
  stickyBarTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 4,
  },
  metaPill: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
  },
  metaPillOpen: {
    borderColor: "rgba(104,176,153,0.34)",
    backgroundColor: palette.dark.successMuted,
  },
  metaPillWaitlist: {
    borderColor: "rgba(224,162,77,0.38)",
    backgroundColor: palette.dark.warningMuted,
  },
  metaPillText: {
    ...typography.caption,
    color: colors.gold,
    fontWeight: "900",
  },
  roomNameText: {
    ...typography.bodySmall,
    color: fitness.textSecondary,
  },
  ctaWrapper: {
    width: "100%",
  },
  fullWidthBtn: {
    width: "100%",
  },
});
