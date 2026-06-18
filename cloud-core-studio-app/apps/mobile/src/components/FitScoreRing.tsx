import { colors } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

export function FitScoreRing({ score, label }: { score: number; label: string }) {
  return (
    <View style={styles.ring}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 6,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  score: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 28,
  },
  label: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
