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
              {session.instructor.displayName} ·{" "}
              {spots > 0
                ? `${spots} ${locale === "he" ? "מקומות" : "spots"}`
                : locale === "he"
                  ? "רשימת המתנה"
                  : "Waitlist"}
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
