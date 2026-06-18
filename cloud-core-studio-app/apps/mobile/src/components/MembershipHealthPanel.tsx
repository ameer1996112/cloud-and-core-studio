import { StyleSheet, Text, View } from "react-native";
import { getLocalizedText, type MembershipHealth } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii, shadows } from "@/theme/colors";

export function MembershipHealthPanel({ membership }: { membership: MembershipHealth }) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";
  const credits = membership.entitlement.remainingCredits ?? "∞";

  return (
    <View style={styles.panel}>
      <View style={[styles.header, direction === "rtl" && styles.rowReverse]}>
        <View>
          <Text style={[styles.label, { textAlign: align }]}>{getLocalizedText(membership.label, locale)}</Text>
          <Text style={[styles.status, { textAlign: align }]}>{getLocalizedText(membership.status, locale)}</Text>
        </View>
        <Text style={styles.credits}>{credits}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${membership.score}%` }]} />
      </View>
      <Text style={[styles.rhythm, { textAlign: align }]}>{getLocalizedText(membership.rhythm, locale)}</Text>
      <Text style={[styles.advice, { textAlign: align }]}>{getLocalizedText(membership.renewalAdvice, locale)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.white,
    borderRadius: radii.large,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.sand,
    ...shadows.soft,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  label: {
    color: colors.slate,
    fontSize: 13,
    fontWeight: "900",
  },
  status: {
    color: colors.navy,
    fontSize: 25,
    fontWeight: "900",
    marginTop: 2,
  },
  credits: {
    color: colors.gold,
    fontSize: 42,
    fontWeight: "900",
  },
  track: {
    height: 9,
    borderRadius: 999,
    backgroundColor: colors.sand,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.navy,
  },
  rhythm: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
  },
  advice: {
    color: colors.slate,
    fontSize: 14,
    lineHeight: 20,
  },
});
