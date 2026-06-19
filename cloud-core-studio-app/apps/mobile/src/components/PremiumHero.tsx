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
import { colors, fitness, radii } from "@/theme/colors";

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
  const spots = Math.max(recommendedSession.capacity - recommendedSession.bookedCount, 0);
  const spotLine =
    spots > 0
      ? locale === "he"
        ? `${spots} מקומות נשארו`
        : `${spots} spots left`
      : locale === "he"
        ? "רשימת המתנה פעילה"
        : "Waitlist active";
  const timeLine = new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(recommendedSession.startsAt));

  return (
    <View style={styles.wrap}>
      <ImageBackground
        source={require("../../assets/editorial/studio-community-hero.png")}
        style={styles.image}
        imageStyle={styles.imageRadius}
        resizeMode="cover"
      >
        <View style={styles.scrim}>
          <View style={styles.topLine}>
            <Text style={[styles.brand, { textAlign: align }]}>Cloud&Core Studio</Text>
            <Text style={styles.liveBadge}>{locale === "he" ? "היום" : "Today"}</Text>
          </View>

          <View style={styles.heroCopy}>
            <Text style={[styles.eyebrow, { textAlign: align }]}>
              {locale === "he" ? "הבחירה החזקה להיום" : "Best match today"}
            </Text>
            <Text style={[styles.line, { textAlign: align }]}>
              {getEditorialLine(experience.editorial.heroLine, locale)}
            </Text>
            <Text style={[styles.classTitle, { textAlign: align }]}>{title}</Text>
            <Text style={[styles.context, { textAlign: align }]}>
              {timeLine} · {instructor} · {spotLine}
            </Text>
          </View>

          <Link href={`/class/${recommendedSession.id}`} asChild>
            <Pressable style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
              <Text style={styles.ctaText}>{primary}</Text>
            </Pressable>
          </Link>

          <View style={[styles.pulseRow, direction === "rtl" && styles.rowReverse]}>
            <Pulse
              label={locale === "he" ? "קרדיטים" : "Credits"}
              value={`${experience.membership.entitlement.remainingCredits ?? "∞"}`}
            />
            <Pulse label={locale === "he" ? "קצב" : "Rhythm"} value={locale === "he" ? "שבועי" : "Weekly"} />
            <Pulse label={locale === "he" ? "סטטוס" : "Status"} value={spotLine} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

function Pulse({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pulse}>
      <Text style={styles.pulseLabel}>{label}</Text>
      <Text style={styles.pulseValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: -20,
    marginTop: -12,
  },
  image: {
    minHeight: 560,
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
    backgroundColor: fitness.imageScrimStrong,
    borderBottomLeftRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
  },
  topLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  brand: {
    color: colors.ivory,
    fontSize: 16,
    fontWeight: "900",
  },
  liveBadge: {
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: fitness.goldGlow,
    borderColor: fitness.borderStrong,
    borderWidth: 1,
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: "900",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  heroCopy: {
    gap: 10,
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  line: {
    color: colors.ivory,
    fontSize: 33,
    lineHeight: 39,
    fontWeight: "900",
    maxWidth: 330,
  },
  classTitle: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "900",
  },
  context: {
    color: fitness.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
    maxWidth: 330,
  },
  cta: {
    backgroundColor: colors.gold,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaPressed: {
    opacity: 0.82,
  },
  ctaText: {
    color: colors.ink,
    fontWeight: "700",
    fontSize: 16,
  },
  pulseRow: {
    flexDirection: "row",
    gap: 10,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  pulse: {
    flex: 1,
    minWidth: 0,
    borderRadius: radii.medium,
    borderColor: fitness.border,
    borderWidth: 1,
    backgroundColor: "rgba(11,18,36,0.78)",
    paddingHorizontal: 10,
    paddingVertical: 11,
    gap: 3,
  },
  pulseLabel: {
    color: fitness.textMuted,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  pulseValue: {
    color: fitness.textPrimary,
    fontSize: 13,
    fontWeight: "900",
  },
});
