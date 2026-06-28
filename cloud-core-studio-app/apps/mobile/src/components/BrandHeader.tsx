import { useCopy } from "@/i18n/LocaleProvider";
import { colors } from "@/theme/colors";
import { Image, StyleSheet, Text, View } from "react-native";

export function BrandHeader() {
  const { direction, rowDirection, textAlign } = useCopy();
  const align = textAlign;

  return (
    <View style={styles.wrap}>
      <View style={[styles.logoRow, { flexDirection: rowDirection }]}>
        <Image source={require("../../assets/logo-transparent.png")} style={styles.logo} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.eyebrow, { textAlign: align, writingDirection: direction }]}>Cloud&Core Studio</Text>
          <Text style={[styles.subline, { textAlign: align, writingDirection: direction }]}>
            {direction === "rtl" ? "בוטיק תנועה חכם" : "Intelligent boutique movement"}
          </Text>
        </View>
      </View>
      <Text style={[styles.title, { textAlign: align, writingDirection: direction }]}>
        {direction === "rtl" ? "היום שלך כבר מסודר" : "Your studio day is already curated"}
      </Text>
      <Text style={[styles.body, { textAlign: align, writingDirection: direction }]}>
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
  logo: {
    width: 54,
    height: 54,
    borderRadius: 18,
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

