import { decideBooking } from "@cloud-core/shared";
import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FitScoreRing } from "@/components/FitScoreRing";
import { Screen } from "@/components/Screen";
import { entitlement, sessions } from "@/fixtures/classes";
import { getLocalizedText, getSessionInsight, premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii, shadows } from "@/theme/colors";

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, locale, direction } = useCopy();
  const session = sessions.find((item) => item.id === id) ?? sessions[0];
  const insight = getSessionInsight(session.id, premiumExperience);
  const decision = decideBooking(session, entitlement);
  const align = direction === "rtl" ? "right" : "left";
  const title = locale === "he" ? session.titleHe : session.titleEn;
  const description = locale === "he" ? session.descriptionHe : session.descriptionEn;
  const equipment = locale === "he" ? session.equipmentHe : session.equipmentEn;
  const cta = insight
    ? getLocalizedText(insight.bookingCta, locale)
    : decision.mode === "waitlist"
      ? t.joinWaitlist
      : t.book;

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={[styles.heroTop, direction === "rtl" && styles.rowReverse]}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={[styles.kicker, { textAlign: align }]}>{locale === "he" ? "תיק שיעור" : "Class dossier"}</Text>
            <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
            <Text style={[styles.description, { textAlign: align }]}>{description}</Text>
          </View>
          {insight ? <FitScoreRing score={insight.fitScore} label={locale === "he" ? "התאמה" : "fit"} /> : null}
        </View>
      </View>

      <View style={styles.detailGrid}>
        <Info label={t.instructor} value={session.instructor.displayName} />
        <Info label={t.available} value={`${Math.max(session.capacity - session.bookedCount, 0)} / ${session.capacity}`} />
        <Info label={t.policy} value={`${session.cancellationWindowHours}h`} />
      </View>

      {insight ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: align }]}>
            {locale === "he" ? "למה זה מתאים לך" : "Why this fits you"}
          </Text>
          {insight.reasons.map((reason) => (
            <Text key={reason.en} style={[styles.rowText, { textAlign: align }]}>
              • {getLocalizedText(reason, locale)}
            </Text>
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { textAlign: align }]}>
          {locale === "he" ? "לפני שמגיעים" : "Before you come"}
        </Text>
        {equipment.map((item) => (
          <Text key={item} style={[styles.rowText, { textAlign: align }]}>
            • {item}
          </Text>
        ))}
        {insight?.preparation.map((item) => (
          <Text key={item.en} style={[styles.rowText, { textAlign: align }]}>
            • {getLocalizedText(item, locale)}
          </Text>
        ))}
      </View>

      {insight?.waitlistOdds ? (
        <View style={styles.waitlist}>
          <Text style={[styles.sectionTitle, { textAlign: align }]}>
            {locale === "he" ? "המתנה חכמה" : "Smart waitlist"}
          </Text>
          <Text style={[styles.waitlistValue, { textAlign: align }]}>{insight.waitlistOdds}%</Text>
          <Text style={[styles.rowText, { textAlign: align }]}>
            {locale === "he"
              ? "סיכוי משוער לקידום. אם יתפנה מקום, תקבלי חלון אישור של 30 דקות."
              : "Estimated promotion odds. If a spot opens, you will get a 30-minute confirmation window."}
          </Text>
        </View>
      ) : null}

      <Pressable style={[styles.primaryButton, decision.mode === "waitlist" && styles.waitlistButton]}>
        <Text style={styles.primaryText}>{cta}</Text>
      </Pressable>
    </Screen>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.navy,
    borderRadius: radii.hero,
    padding: 22,
    ...shadows.premium,
  },
  heroTop: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  kicker: {
    color: colors.gold,
    fontWeight: "900",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontSize: 12,
  },
  title: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
  },
  description: {
    color: colors.sand,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
  },
  detailGrid: {
    flexDirection: "row",
    gap: 10,
  },
  info: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.sand,
    padding: 12,
    gap: 4,
  },
  infoLabel: {
    color: colors.slate,
    fontSize: 12,
    fontWeight: "800",
  },
  infoValue: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: "900",
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.sand,
    padding: 18,
    gap: 9,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 20,
    fontWeight: "900",
  },
  rowText: {
    color: colors.slate,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  waitlist: {
    backgroundColor: colors.goldSoft,
    borderRadius: radii.large,
    padding: 18,
    gap: 8,
  },
  waitlistValue: {
    color: colors.navy,
    fontSize: 42,
    fontWeight: "900",
  },
  primaryButton: {
    backgroundColor: colors.navy,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  waitlistButton: {
    backgroundColor: colors.gold,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 17,
  },
});
