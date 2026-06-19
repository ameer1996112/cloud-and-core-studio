import { ConciergePanel } from "@/components/ConciergePanel";
import { MembershipHealthPanel } from "@/components/MembershipHealthPanel";
import { PremiumHero } from "@/components/PremiumHero";
import { Screen } from "@/components/Screen";
import { sessions } from "@/fixtures/classes";
import { getRecommendedSessions, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { fitness } from "@/theme/colors";
import { StyleSheet, Text } from "react-native";

export default function HomeScreen() {
  const { locale, direction } = useCopy();
  const orderedSessions = getRecommendedSessions(sessions, premiumExperience);
  const recommendedSession = orderedSessions[0] ?? sessions[0];
  const recommendedInsight = getSessionInsight(recommendedSession.id, premiumExperience) ?? premiumExperience.sessionInsights[0];
  const align = direction === "rtl" ? "right" : "left";

  return (
    <Screen>
      <PremiumHero experience={premiumExperience} recommendedSession={recommendedSession} insight={recommendedInsight} />
      <Text style={[styles.sectionLabel, { textAlign: align }]}>
        {locale === "he" ? "מה קורה בסטודיו" : "Studio status"}
      </Text>
      <MembershipHealthPanel membership={premiumExperience.membership} />
      <ConciergePanel requests={premiumExperience.concierge} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: fitness.textSecondary,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: 2,
  },
});
