import { Screen } from "@/components/Screen";
import { TimelineClassCard } from "@/components/TimelineClassCard";
import { sessions } from "@/fixtures/classes";
import { getRecommendedSessions, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii } from "@/theme/colors";
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
      <View style={styles.heroStrip}>
        <Text style={[styles.heroTitle, { textAlign: align }]}>
          {locale === "he" ? "לא רק לוח שיעורים. החלטה טובה יותר." : "Not just a timetable. A better decision."}
        </Text>
        <Text style={[styles.heroBody, { textAlign: align }]}>
          {locale === "he"
            ? "השיעורים מדורגים לפי התאמה, מנוי, זמינות וסיכוי המתנה."
            : "Classes are ranked by fit, membership, availability, and waitlist odds."}
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
  heroStrip: {
    backgroundColor: colors.navy,
    borderRadius: radii.hero,
    padding: 20,
    gap: 8,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
  },
  heroBody: {
    color: colors.blue,
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
    borderWidth: 1,
    borderColor: colors.sand,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: colors.white,
  },
  selectedFilter: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  filterText: {
    color: colors.navy,
    fontWeight: "900",
  },
  selectedFilterText: {
    color: colors.ink,
  },
  dayLabel: {
    color: colors.slate,
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
