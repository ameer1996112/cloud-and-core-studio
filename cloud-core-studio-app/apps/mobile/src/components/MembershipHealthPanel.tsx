import { StyleSheet, Text, View } from "react-native";
import { getLocalizedText, type MembershipHealth } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, fitness, radii } from "@/theme/colors";

export function MembershipHealthPanel({ membership }: { membership: MembershipHealth }) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";
  const credits = membership.entitlement.remainingCredits ?? "∞";
  const renewal = membership.entitlement.expiresAt
    ? new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date(membership.entitlement.expiresAt))
    : locale === "he"
      ? "פתוח"
      : "Open";
  const freeze = membership.entitlement.status === "active" ? (locale === "he" ? "זכאית" : "Eligible") : getLocalizedText(membership.status, locale);

  return (
    <View style={styles.panel}>
      <View style={[styles.header, direction === "rtl" && styles.rowReverse]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { textAlign: align }]}>
            {locale === "he" ? "דופק המנוי" : "Membership pulse"}
          </Text>
          <Text style={[styles.subtitle, { textAlign: align }]}>{getLocalizedText(membership.rhythm, locale)}</Text>
        </View>
        <View style={styles.scorePill}>
          <Text style={styles.score}>{membership.score}%</Text>
        </View>
      </View>

      <View style={[styles.metrics, direction === "rtl" && styles.rowReverse]}>
        <Metric label={locale === "he" ? "קרדיטים" : "Credits"} value={`${credits}`} important />
        <Metric label={locale === "he" ? "חידוש" : "Renewal"} value={renewal} />
        <Metric label={locale === "he" ? "הקפאה" : "Freeze"} value={freeze} />
      </View>

      <Text style={[styles.secondary, { textAlign: align }]}>{getLocalizedText(membership.renewalAdvice, locale)}</Text>
    </View>
  );
}

function Metric({ label, value, important = false }: { label: string; value: string; important?: boolean }) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.value, !important && styles.valueSecondary]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: fitness.surface,
    borderColor: fitness.border,
    borderWidth: 1,
    borderRadius: radii.large,
    padding: 18,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  title: {
    color: fitness.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  subtitle: {
    color: fitness.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
    marginTop: 4,
  },
  scorePill: {
    borderRadius: 999,
    backgroundColor: fitness.goldGlow,
    borderColor: fitness.borderStrong,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  score: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "900",
  },
  metrics: {
    flexDirection: "row",
    gap: 10,
  },
  secondary: {
    color: fitness.textMuted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  metric: {
    flex: 1,
    minWidth: 0,
    borderRadius: radii.medium,
    backgroundColor: fitness.surfaceRaised,
    borderColor: fitness.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  value: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: "900",
  },
  valueSecondary: {
    color: fitness.textPrimary,
    fontSize: 17,
  },
  label: {
    color: fitness.textSecondary,
    fontSize: 12,
    fontWeight: "800",
  },
});
