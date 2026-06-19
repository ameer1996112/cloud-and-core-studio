import type { ClassSession } from "@cloud-core/shared";
import { Link } from "expo-router";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import {
  getEditorialLine,
  getLocalizedText,
  type PremiumExperience,
  type SessionInsight,
} from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, editorial, radii } from "@/theme/colors";

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
  const instructor = recommendedSession.instructor.displayName;
  const primary = getLocalizedText(insight.bookingCta, locale);
  const metaLine = locale === "he" ? "ערב רגוע, קהילה קטנה" : "Calm evening, small community";

  return (
    <View style={styles.wrap}>
      <ImageBackground
        source={require("../../assets/editorial/studio-community-hero.png")}
        style={styles.image}
        imageStyle={styles.imageRadius}
        resizeMode="cover"
      >
        <View style={styles.scrim}>
          <View style={styles.identity}>
            <Text style={[styles.brand, { textAlign: align }]}>Cloud&Core Studio</Text>
            <Text style={[styles.line, { textAlign: align }]}>
              {getEditorialLine(experience.editorial.heroLine, locale)}
            </Text>
          </View>

          <View style={styles.recommendation}>
            <Text style={[styles.eyebrow, { textAlign: align }]}>
              {locale === "he" ? "הבחירה של הסטודיו להיום" : "Studio pick for today"}
            </Text>
            <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
            <Text style={[styles.context, { textAlign: align }]}>
              {getEditorialLine(experience.editorial.recommendationLine, locale)}
            </Text>
            <View style={[styles.metaRow, direction === "rtl" && styles.metaRowReverse]}>
              <Text style={styles.meta}>{instructor}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={[styles.meta, { textAlign: align }]}>{metaLine}</Text>
            </View>
          </View>

          <Link href={`/class/${recommendedSession.id}`} asChild>
            <Pressable style={styles.cta}>
              <Text style={styles.ctaText}>{primary}</Text>
            </Pressable>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: -20,
    marginTop: -12,
  },
  image: {
    minHeight: 540,
    justifyContent: "flex-end",
  },
  imageRadius: {
    borderBottomLeftRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
  },
  scrim: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: editorial.navyOverlay,
    borderBottomLeftRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
  },
  identity: {
    gap: 10,
  },
  brand: {
    color: colors.ivory,
    fontSize: 16,
    fontWeight: "900",
  },
  line: {
    color: colors.ivory,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    maxWidth: 320,
  },
  recommendation: {
    gap: 8,
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
  },
  title: {
    color: colors.white,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "900",
  },
  context: {
    color: colors.ivory,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "800",
    maxWidth: 330,
  },
  meta: {
    color: colors.sand,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  metaRowReverse: {
    flexDirection: "row-reverse",
  },
  metaDot: {
    color: colors.sand,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  cta: {
    backgroundColor: colors.ivory,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaText: {
    color: colors.navy,
    fontWeight: "900",
    fontSize: 16,
  },
});
