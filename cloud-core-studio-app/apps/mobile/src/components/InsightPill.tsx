import { colors } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

export function InsightPill({ text }: { text: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    backgroundColor: "rgba(250,247,242,0.14)",
    borderWidth: 1,
    borderColor: "rgba(250,247,242,0.22)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  text: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 12,
  },
});
