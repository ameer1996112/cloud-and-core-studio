import type { ClassSession, Locale } from "@cloud-core/shared";
import { Link } from "expo-router";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii, spacing } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function titleFor(session: ClassSession, locale: Locale) {
  return locale === "he" ? session.titleHe : session.titleEn;
}

export function ClassCard({ session }: { session: ClassSession }) {
  const { t, locale, direction, rowDirection } = useCopy();
  const remaining = Math.max(session.capacity - session.bookedCount, 0);
  const waitlisted = session.status === "waitlist" || remaining === 0;
  const fewSpots = remaining > 0 && remaining <= 2;
  const isCancelled = session.status === "cancelled" || session.status === "closed";
  const duration = Math.round((new Date(session.endsAt).getTime() - new Date(session.startsAt).getTime()) / 60000);
  const actionLabel = isCancelled
    ? locale === "he"
      ? "בוטל"
      : "Cancelled"
    : waitlisted
      ? t.joinWaitlist
      : locale === "he"
        ? "הזמנה"
        : "Book";
  const statusLabel = isCancelled
    ? locale === "he"
      ? "בוטל"
      : "Cancelled"
    : waitlisted
      ? `${t.waitlist} · ${session.waitlistCount}`
      : fewSpots
        ? locale === "he"
          ? `נותרו ${remaining} מקומות`
          : `Only ${remaining} spots left`
        : `${remaining} ${t.available}`;

  return (
    <Link href={`/class/${session.id}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${titleFor(session, locale)}, ${statusLabel}`}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed, isCancelled && styles.cancelledCard]}
      >
        <View style={[styles.top, { flexDirection: rowDirection }]}>
          <View style={styles.timePill}>
            <Text style={styles.time}>{formatTime(session.startsAt)}</Text>
            <Text style={styles.timeMeta}>{duration}m</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { textAlign: direction === "rtl" ? "right" : "left", writingDirection: direction }]}>{titleFor(session, locale)}</Text>
            <Text style={[styles.meta, { textAlign: direction === "rtl" ? "right" : "left", writingDirection: direction }]}>
              {session.instructor.displayName} · {session.roomName}
            </Text>
            <View style={[styles.metaRow, { flexDirection: rowDirection }]}>
              <Text style={[styles.metaChip, { writingDirection: direction }]}>{session.level.replace("_", " ")}</Text>
              <Text style={[styles.metaChip, { writingDirection: direction }]}>
                {locale === "he" ? `ביטול עד ${session.cancellationWindowHours} שעות` : `Cancel ${session.cancellationWindowHours}h before`}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.footer, { flexDirection: rowDirection }]}>
          <Text style={[styles.status, waitlisted && styles.waitlist, isCancelled && styles.cancelledText, { writingDirection: direction }]}>
            {statusLabel}
          </Text>
          <View style={[styles.ctaPill, waitlisted && styles.waitlistCta, isCancelled && styles.disabledCta]}>
            <Text style={[styles.ctaText, waitlisted && styles.waitlistCtaText, isCancelled && styles.cancelledText]}>{actionLabel}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.medium,
    padding: spacing.md,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.sand,
    shadowColor: colors.navy,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
  },
  cancelledCard: {
    opacity: 0.72,
  },
  top: {
    flexDirection: "row",
    gap: 14,
  },
  timePill: {
    width: 76,
    borderRadius: 18,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  time: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 18,
  },
  timeMeta: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  title: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: "800",
  },
  meta: {
    color: colors.slate,
    marginTop: 4,
    fontSize: 14,
  },
  metaRow: {
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  metaChip: {
    overflow: "hidden",
    borderRadius: radii.pill,
    backgroundColor: colors.ivory,
    color: colors.slate,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  status: {
    color: colors.success,
    fontWeight: "800",
  },
  waitlist: {
    color: colors.warning,
  },
  cancelledText: {
    color: colors.danger,
  },
  ctaPill: {
    borderRadius: radii.pill,
    backgroundColor: colors.navy,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  waitlistCta: {
    backgroundColor: colors.goldSoft,
  },
  disabledCta: {
    backgroundColor: colors.ivory,
  },
  ctaText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
  },
  waitlistCtaText: {
    color: colors.warning,
  },
});
