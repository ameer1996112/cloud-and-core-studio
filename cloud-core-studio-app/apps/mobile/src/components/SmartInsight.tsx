import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

export function SmartInsight({
  label,
  value,
  detail,
  tone = "blue",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "blue" | "gold" | "moss" | "rose";
}) {
  const { direction, textAlign } = useCopy();
  const align = textAlign;

  return (
    <View style={[styles.card, styles[tone]]}>
      <Text style={[styles.label, { textAlign: align }]}>{label}</Text>
      <Text style={[styles.value, { textAlign: align }]}>{value}</Text>
      <Text style={[styles.detail, { textAlign: align }]}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 132,
    borderRadius: radii.medium,
    padding: 14,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(11, 29, 58, 0.08)",
  },
  blue: {
    backgroundColor: colors.mist,
  },
  gold: {
    backgroundColor: colors.goldSoft,
  },
  moss: {
    backgroundColor: "#E3ECE7",
  },
  rose: {
    backgroundColor: "#F3E2DC",
  },
  label: {
    color: colors.slate,
    fontWeight: "800",
    fontSize: 12,
  },
  value: {
    color: colors.navy,
    fontWeight: "900",
    fontSize: 26,
  },
  detail: {
    color: colors.ink,
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 18,
  },
});
