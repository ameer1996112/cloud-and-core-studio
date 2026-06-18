import { ClassCard } from "@/components/ClassCard";
import { ConciergePanel } from "@/components/ConciergePanel";
import { MembershipHealthPanel } from "@/components/MembershipHealthPanel";
import { PremiumHero } from "@/components/PremiumHero";
import { Screen } from "@/components/Screen";
import { sessions } from "@/fixtures/classes";
import { getRecommendedSessions, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { t, direction } = useCopy();
  const orderedSessions = getRecommendedSessions(sessions, premiumExperience);
  const recommendedSession = orderedSessions[0] ?? sessions[0];
  const insight = getSessionInsight(recommendedSession.id, premiumExperience) ?? premiumExperience.sessionInsights[0];
  const align = direction === "rtl" ? "right" : "left";

  return (
    <Screen>
      <PremiumHero experience={premiumExperience} recommendedSession={recommendedSession} insight={insight} />
      <MembershipHealthPanel membership={premiumExperience.membership} />
      <ConciergePanel requests={premiumExperience.concierge} />
      <View style={styles.listHeader}>
        <Text style={[styles.sectionTitle, { textAlign: align }]}>{t.classesToday}</Text>
      </View>
      {orderedSessions.slice(0, 2).map((session) => (
        <ClassCard key={session.id} session={session} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.slate,
    fontWeight: "900",
    fontSize: 14,
  },
  listHeader: {
    paddingTop: 4,
  },
});
