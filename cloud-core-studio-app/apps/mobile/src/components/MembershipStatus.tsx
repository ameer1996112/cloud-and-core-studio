import type { MemberEntitlement } from "@cloud-core/shared";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

export function MembershipStatus({ entitlement }: { entitlement: MemberEntitlement }) {
  const { t, direction } = useCopy();
  return (
    <View style={styles.card}>
      <View style={[styles.header, direction === "rtl" && styles.rowReverse]}>
        <Text style={styles.label}>{t.membership}</Text>
        <Text style={styles.badge}>{direction === "rtl" ? "בריא" : "Healthy"}</Text>
      </View>
      <Text style={[styles.plan, { textAlign: direction === "rtl" ? "right" : "left" }]}>{entitlement.planName}</Text>
      <View style={[styles.row, direction === "rtl" && styles.rowReverse]}>
        <Text style={styles.credits}>{entitlement.remainingCredits}</Text>
        <Text style={styles.body}>{t.creditsLeft}</Text>
      </View>
      <View style={styles.track}>
        <View style={styles.trackFill} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.navy,
    borderRadius: radii.large,
    padding: 20,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: "700",
  },
  badge: {
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "rgba(183, 204, 230, 0.18)",
    color: colors.blue,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "900",
  },
  plan: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  credits: {
    color: colors.gold,
    fontSize: 34,
    fontWeight: "900",
  },
  body: {
    color: colors.white,
    fontSize: 15,
  },
  track: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
    marginTop: 4,
  },
  trackFill: {
    width: "72%",
    height: "100%",
    backgroundColor: colors.gold,
  },
});
