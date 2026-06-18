import { useCopy } from "@/i18n/LocaleProvider";
import { colors } from "@/theme/colors";
import { Image, StyleSheet, Text, View } from "react-native";

export function BrandHeader() {
  const { direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";

  return (
    <View style={styles.wrap}>
      <View style={[styles.logoRow, direction === "rtl" && styles.rowReverse]}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.eyebrow, { textAlign: align }]}>Cloud&Core Studio</Text>
          <Text style={[styles.subline, { textAlign: align }]}>
            {direction === "rtl" ? "בוטיק תנועה חכם" : "Intelligent boutique movement"}
          </Text>
        </View>
      </View>
      <Text style={[styles.title, { textAlign: align }]}>
        {direction === "rtl" ? "היום שלך כבר מסודר" : "Your studio day is already curated"}
      </Text>
      <Text style={[styles.body, { textAlign: align }]}>
        {direction === "rtl"
          ? "המלצות, זמינות, מנוי והודעות סטודיו במקום אחד."
          : "Recommendations, availability, membership, and studio messages in one place."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 12,
    gap: 12,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.white,
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  subline: {
    color: colors.slate,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    color: colors.navy,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "900",
  },
  body: {
    color: colors.slate,
    fontSize: 16,
    lineHeight: 23,
  },
});
