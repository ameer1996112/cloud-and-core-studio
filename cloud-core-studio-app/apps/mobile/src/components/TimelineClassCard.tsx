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
