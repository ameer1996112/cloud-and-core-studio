import { useState } from "react";
import { Screen } from "@/components/Screen";
import { sessions } from "@/fixtures/classes";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function BookingsScreen() {
  const { t, direction, locale } = useCopy();
  const [savedToCalendar, setSavedToCalendar] = useState(false);
  const [bookingCancelled, setBookingCancelled] = useState(false);
  const next = sessions[0];
  const title = locale === "he" ? next.titleHe : next.titleEn;
  const align = direction === "rtl" ? "right" : "left";
  const statusText = bookingCancelled
    ? locale === "he"
      ? "ההזמנה בוטלה מקומית. אפשר לחזור ללוח ולהזמין מחדש."
      : "Booking cancelled locally. You can return to the schedule and book again."
    : savedToCalendar
      ? locale === "he"
        ? "נשמר תזכורת מקומית ליומן עבור השיעור הקרוב."
        : "A local calendar reminder was saved for your next class."
      : locale === "he"
        ? "ההזמנה נשמרת מקומית עד שתבחרי פעולה."
        : "Your booking is kept locally until you choose an action.";

  return (
    <Screen>
      <Text style={[styles.title, { textAlign: align }]}>{t.bookings}</Text>
      <View style={styles.card}>
        <Text style={[styles.label, { textAlign: align }]}>{t.nextBooking}</Text>
        <Text style={[styles.classTitle, { textAlign: align }]}>{title}</Text>
        <Text style={[styles.meta, { textAlign: align }]}>19 Jun · 18:30 · {next.roomName}</Text>
        <View style={[styles.actions, direction === "rtl" && styles.rowReverse]}>
          <Pressable
            disabled={bookingCancelled}
            onPress={() => setSavedToCalendar(true)}
            style={[
              styles.secondaryButton,
              savedToCalendar && !bookingCancelled && styles.activeButton,
              bookingCancelled && styles.disabledButton,
            ]}
          >
            <Text style={[styles.secondaryText, bookingCancelled && styles.disabledText]}>
              {savedToCalendar && !bookingCancelled
                ? locale === "he"
                  ? "נשמר ביומן"
                  : "Saved"
                : t.calendar}
            </Text>
          </Pressable>
          <Pressable
            disabled={bookingCancelled}
            onPress={() => {
              setBookingCancelled(true);
              setSavedToCalendar(false);
            }}
            style={[styles.cancelButton, bookingCancelled && styles.disabledButton]}
          >
            <Text style={[styles.cancelText, bookingCancelled && styles.disabledText]}>{t.cancel}</Text>
          </Pressable>
        </View>
        <Text style={[styles.statusText, { textAlign: align }]}>{statusText}</Text>
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
  statusText: {
    color: colors.slate,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    marginTop: 4,
  },
  disabledButton: {
    borderColor: colors.sand,
    backgroundColor: colors.ivory,
  },
  disabledText: {
    color: colors.slate,
  },
  activeButton: {
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
  },
});
