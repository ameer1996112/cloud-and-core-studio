import { useEffect, useState } from "react";
import { Screen } from "@/components/Screen";
import { TimelineClassCard } from "@/components/TimelineClassCard";
import { sessions } from "@/fixtures/classes";
import { getRecommendedSessions, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, fitness, radii } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

const intents = {
  he: ["הכי מתאים", "היום", "בטוח למתחילות", "עומס נמוך", "אחרי עבודה"],
  en: ["Best for me", "Today", "Beginner safe", "Low capacity", "After work"],
};

export default function ScheduleScreen() {
  const { t, locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";
  const orderedSessions = getRecommendedSessions(sessions, premiumExperience);
  const localizedIntents = intents[locale];
  const [selectedIntent, setSelectedIntent] = useState(localizedIntents[0]);
  const filterStatus =
    locale === "he" ? `סינון פעיל: ${selectedIntent}` : `Active filter: ${selectedIntent}`;

  useEffect(() => {
    setSelectedIntent(localizedIntents[0]);
  }, [locale]);

  return (
    <Screen>
      <Text style={[styles.title, { textAlign: align }]}>{t.schedule}</Text>
      <View style={styles.intro}>
        <Text style={[styles.introTitle, { textAlign: align }]}>
          {locale === "he" ? "בחרו את השיעור הבא." : "Choose your next class."}
        </Text>
        <Text style={[styles.introBody, { textAlign: align }]}>
          {locale === "he"
            ? "ההמלצות מסודרות לפי התאמה, זמינות וקצב המנוי."
            : "Recommendations are ordered by fit, availability, and membership rhythm."}
        </Text>
      </View>
      <View style={[styles.filters, direction === "rtl" && styles.rowReverse]}>
        {localizedIntents.map((intent) => (
          <Pressable
            key={intent}
            onPress={() => setSelectedIntent(intent)}
            style={[styles.filter, selectedIntent === intent && styles.selectedFilter]}
          >
            <Text style={[styles.filterText, selectedIntent === intent && styles.selectedFilterText]}>{intent}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.filterStatus, { textAlign: align }]}>{filterStatus}</Text>
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
    color: fitness.textPrimary,
    fontSize: 34,
    fontWeight: "900",
  },
  intro: {
    borderBottomWidth: 1,
    borderColor: fitness.border,
    paddingBottom: 18,
    gap: 7,
  },
  introTitle: {
    color: fitness.textPrimary,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
  },
  introBody: {
    color: fitness.textSecondary,
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
    borderRadius: 999,
    borderColor: fitness.border,
    backgroundColor: fitness.surface,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  selectedFilter: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  filterText: {
    color: fitness.textSecondary,
    fontWeight: "900",
  },
  selectedFilterText: {
    color: colors.ink,
  },
  filterStatus: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: radii.small,
    borderWidth: 1,
    borderColor: fitness.borderStrong,
    backgroundColor: fitness.goldGlow,
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  dayLabel: {
    color: fitness.textPrimary,
    fontWeight: "900",
    fontSize: 16,
  },
});
