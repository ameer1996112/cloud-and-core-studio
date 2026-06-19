import { StyleSheet, Text, View } from "react-native";
import { getEditorialLine, getLocalizedText, premiumExperience, type MembershipHealth } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, editorial } from "@/theme/colors";

export function MembershipHealthPanel({ membership }: { membership: MembershipHealth }) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";
  const credits = membership.entitlement.remainingCredits ?? "∞";

  return (
    <View style={styles.band}>
      <View style={[styles.row, direction === "rtl" && styles.rowReverse]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.kicker, { textAlign: align }]}>{getLocalizedText(membership.label, locale)}</Text>
          <Text style={[styles.title, { textAlign: align }]}>{getLocalizedText(membership.status, locale)}</Text>
        </View>
        <View style={styles.creditBlock}>
          <Text style={styles.credits}>{credits}</Text>
          <Text style={styles.creditLabel}>{locale === "he" ? "קרדיטים" : "credits"}</Text>
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${membership.score}%` }]} />
      </View>
      <Text style={[styles.body, { textAlign: align }]}>{getEditorialLine(premiumExperience.editorial.membershipLine, locale)}</Text>
      <Text style={[styles.secondary, { textAlign: align }]}>{getLocalizedText(membership.renewalAdvice, locale)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: editorial.hairline,
    paddingVertical: 18,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 18,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  kicker: {
    color: colors.slate,
    fontSize: 12,
    fontWeight: "900",
  },
  title: {
    color: colors.navy,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 2,
  },
  creditBlock: {
    alignItems: "center",
    minWidth: 74,
  },
  credits: {
    color: colors.gold,
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 40,
  },
  creditLabel: {
    color: colors.slate,
    fontSize: 11,
    fontWeight: "900",
  },
  track: {
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.sand,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.gold,
  },
  body: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "800",
  },
  secondary: {
    color: colors.slate,
    fontSize: 14,
    lineHeight: 20,
  },
});
