import type { ClassSession } from "@cloud-core/shared";
import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { FitScoreRing } from "@/components/FitScoreRing";
import { InsightPill } from "@/components/InsightPill";
import {
  getLocalizedText,
  type PremiumExperience,
  type SessionInsight,
} from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii, shadows } from "@/theme/colors";

export function PremiumHero({
  experience,
  recommendedSession,
  insight,
}: {
  experience: PremiumExperience;
  recommendedSession: ClassSession;
  insight: SessionInsight;
}) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";
  const title = locale === "he" ? recommendedSession.titleHe : recommendedSession.titleEn;

  return (
    <View style={styles.hero}>
      <View style={[styles.logoRow, direction === "rtl" && styles.rowReverse]}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.kicker, { textAlign: align }]}>Cloud&Core Studio</Text>
          <Text style={[styles.greeting, { textAlign: align }]}>
            {getLocalizedText(experience.member.greeting, locale)}
          </Text>
        </View>
      </View>

      <View style={[styles.recommendation, direction === "rtl" && styles.rowReverse]}>
        <View style={{ flex: 1, gap: 10 }}>
          <Text style={[styles.headline, { textAlign: align }]}>
            {getLocalizedText(experience.today.headline, locale)}
          </Text>
          <Text style={[styles.classTitle, { textAlign: align }]}>{title}</Text>
          <Text style={[styles.summary, { textAlign: align }]}>
            {getLocalizedText(experience.today.summary, locale)}
          </Text>
        </View>
        <FitScoreRing score={insight.fitScore} label={locale === "he" ? "התאמה" : "fit"} />
      </View>

      <View style={[styles.reasonRow, direction === "rtl" && styles.rowReverse]}>
        {insight.reasons.slice(0, 2).map((reason) => (
          <InsightPill key={reason.en} text={getLocalizedText(reason, locale)} />
        ))}
      </View>

      <Link href={`/class/${recommendedSession.id}`} asChild>
        <Pressable style={styles.cta}>
          <Text style={styles.ctaText}>{getLocalizedText(experience.today.primaryCta, locale)}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.navy,
    borderRadius: radii.hero,
    padding: 22,
    gap: 20,
    ...shadows.premium,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.ivory,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  greeting: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    marginTop: 4,
  },
  recommendation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headline: {
    color: colors.blue,
    fontWeight: "900",
    fontSize: 14,
  },
  classTitle: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 34,
    lineHeight: 38,
  },
  summary: {
    color: colors.sand,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  reasonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cta: {
    backgroundColor: colors.gold,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaText: {
    color: colors.navy,
    fontWeight: "900",
    fontSize: 16,
  },
});
