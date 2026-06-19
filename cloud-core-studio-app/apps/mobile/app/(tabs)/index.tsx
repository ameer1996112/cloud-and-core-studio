import { ConciergePanel } from "@/components/ConciergePanel";
import { MembershipHealthPanel } from "@/components/MembershipHealthPanel";
import { PremiumHero } from "@/components/PremiumHero";
import { Screen } from "@/components/Screen";
import { sessions } from "@/fixtures/classes";
import { getEditorialLine, getRecommendedSessions, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, editorial } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { locale, direction } = useCopy();
  const orderedSessions = getRecommendedSessions(sessions, premiumExperience);
  const recommendedSession = orderedSessions[0] ?? sessions[0];
  const insight = getSessionInsight(recommendedSession.id, premiumExperience) ?? premiumExperience.sessionInsights[0];
  const align = direction === "rtl" ? "right" : "left";

  return (
    <Screen>
      <PremiumHero experience={premiumExperience} recommendedSession={recommendedSession} insight={insight} />

      <View style={styles.editorialNote}>
        <Text style={[styles.noteTitle, { textAlign: align }]}>
          {locale === "he" ? "למה זה נכון להיום" : "Why this works today"}
        </Text>
        <Text style={[styles.noteBody, { textAlign: align }]}>
          {getEditorialLine(premiumExperience.editorial.classContext, locale)}
        </Text>
      </View>

      <MembershipHealthPanel membership={premiumExperience.membership} />
      <ConciergePanel requests={premiumExperience.concierge} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  editorialNote: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: editorial.hairline,
    paddingVertical: 18,
    gap: 6,
  },
  noteTitle: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: "900",
  },
  noteBody: {
    color: colors.slate,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700",
  },
});
