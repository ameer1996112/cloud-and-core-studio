import { useEffect, useState } from "react";
import { Screen } from "@/components/Screen";
import { TimelineClassCard } from "@/components/TimelineClassCard";
import { sessions } from "@/fixtures/classes";
import { getRecommendedSessions, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors } from "@/theme/colors";
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
          {locale === "he" ? "השיעור הנכון, לא רק השיעור הקרוב." : "The right class, not just the next class."}
        </Text>
        <Text style={[styles.introBody, { textAlign: align }]}>
          {locale === "he"
            ? "הסטודיו מסדר את היום לפי התאמה, זמינות וקצב המנוי שלך."
            : "We shape the day around what feels right, what is open, and what fits your pace."}
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
    color: colors.navy,
    fontSize: 34,
    fontWeight: "900",
  },
  intro: {
    borderBottomWidth: 1,
    borderColor: "rgba(11,29,58,0.12)",
    paddingBottom: 18,
    gap: 7,
  },
  introTitle: {
    color: colors.navy,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
  },
  introBody: {
    color: colors.slate,
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
    borderBottomWidth: 1,
    borderColor: colors.sand,
    paddingHorizontal: 2,
    paddingVertical: 9,
  },
  selectedFilter: {
    borderColor: colors.gold,
  },
  filterText: {
    color: colors.slate,
    fontWeight: "900",
  },
  selectedFilterText: {
    color: colors.navy,
  },
  filterStatus: {
    color: colors.slate,
    fontSize: 13,
    fontWeight: "700",
  },
  dayLabel: {
    color: colors.navy,
    fontWeight: "900",
    fontSize: 16,
  },
});
