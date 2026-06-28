import type { ClassSession } from "@cloud-core/shared";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getLocalizedText, type SessionInsight } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, fitness, radii } from "@/theme/colors";

function formatTime(value: string, locale: "he" | "en") {
  return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function TimelineClassCard({
  session,
  insight,
}: {
  session: ClassSession;
  insight: SessionInsight | undefined;
}) {
  const { locale, direction, rowDirection, textAlign } = useCopy();
  const align = textAlign;
  const title = locale === "he" ? session.titleHe : session.titleEn;
  const spots = Math.max(session.capacity - session.bookedCount, 0);
  const cta = insight ? getLocalizedText(insight.bookingCta, locale) : locale === "he" ? "לראות פרטים" : "View details";
  const reason = insight?.reasons[0] ? getLocalizedText(insight.reasons[0], locale) : session.instructor.displayName;
  const durationMinutes = Math.round((new Date(session.endsAt).getTime() - new Date(session.startsAt).getTime()) / 60000);
  const availabilityText =
    spots > 0
      ? `${spots} ${locale === "he" ? "מקומות פנויים" : "spots left"}`
      : locale === "he"
        ? "רשימת המתנה"
        : "Waitlist";
  const capacityPercent = session.capacity > 0 ? Math.min((session.bookedCount / session.capacity) * 100, 100) : 0;

  return (
    <Link href={`/class/${session.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <View style={[styles.topRow, { flexDirection: rowDirection }]}>
          <View style={styles.timeBlock}>
            <Text style={styles.time}>{formatTime(session.startsAt, locale)}</Text>
            <Text style={styles.duration}>{durationMinutes}m</Text>
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={[styles.title, { textAlign: align, writingDirection: direction }]}>{title}</Text>
            <Text style={[styles.meta, { textAlign: align, writingDirection: direction }]}>
              {session.instructor.displayName} · {session.roomName}
            </Text>
          </View>
        </View>
        <Text style={[styles.reason, { textAlign: align, writingDirection: direction }]}>{reason}</Text>
        <View style={[styles.footer, { flexDirection: rowDirection }]}>
          <View style={styles.capacityTrack}>
            <View style={[styles.capacityFill, { width: `${capacityPercent}%` }]} />
          </View>
          <Text style={[styles.availability, spots === 0 && styles.waitlistText, { writingDirection: direction }]}>{availabilityText}</Text>
          <Text style={[styles.cta, { writingDirection: direction }]}>{cta}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: fitness.surfaceRaised,
    borderColor: fitness.border,
    borderWidth: 1,
    borderRadius: radii.large,
    padding: 16,
    gap: 14,
    shadowColor: colors.ink,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 7,
  },
  cardPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 13,
  },
  timeBlock: {
    width: 66,
    borderRadius: radii.medium,
    backgroundColor: fitness.surface,
    borderColor: fitness.borderStrong,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
  },
  time: {
    color: fitness.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },
  duration: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
  },
  title: {
    color: fitness.textPrimary,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900",
  },
  meta: {
    color: fitness.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  reason: {
    color: fitness.textMuted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  capacityTrack: {
    flex: 1,
    minWidth: 72,
    height: 7,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: fitness.surfaceSoft,
  },
  capacityFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.gold,
  },
  availability: {
    color: fitness.textSecondary,
    fontSize: 12,
    fontWeight: "900",
    flexShrink: 1,
  },
  waitlistText: {
    color: colors.rose,
  },
  cta: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
    flexShrink: 1,
  },
});

