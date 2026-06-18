import { Screen } from "@/components/Screen";
import { sessions } from "@/fixtures/classes";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function BookingsScreen() {
  const { t, direction, locale } = useCopy();
  const next = sessions[0];
  const title = locale === "he" ? next.titleHe : next.titleEn;

  return (
    <Screen>
      <Text style={[styles.title, { textAlign: direction === "rtl" ? "right" : "left" }]}>{t.bookings}</Text>
      <View style={styles.card}>
        <Text style={[styles.label, { textAlign: direction === "rtl" ? "right" : "left" }]}>{t.nextBooking}</Text>
        <Text style={[styles.classTitle, { textAlign: direction === "rtl" ? "right" : "left" }]}>{title}</Text>
        <Text style={[styles.meta, { textAlign: direction === "rtl" ? "right" : "left" }]}>19 Jun · 18:30 · {next.roomName}</Text>
        <View style={[styles.actions, direction === "rtl" && styles.rowReverse]}>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Calendar</Text>
          </Pressable>
          <Pressable style={styles.cancelButton}>
            <Text style={styles.cancelText}>{t.cancel}</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.navy,
    fontSize: 30,
    fontWeight: "900",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.sand,
    padding: 20,
    gap: 10,
  },
  label: {
    color: colors.slate,
    fontWeight: "800",
  },
  classTitle: {
    color: colors.navy,
    fontSize: 24,
    fontWeight: "900",
  },
  meta: {
    color: colors.slate,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.navy,
    borderRadius: radii.small,
    padding: 12,
    alignItems: "center",
  },
  secondaryText: {
    color: colors.navy,
    fontWeight: "900",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.sand,
    borderRadius: radii.small,
    padding: 12,
    alignItems: "center",
  },
  cancelText: {
    color: colors.danger,
    fontWeight: "900",
  },
});
