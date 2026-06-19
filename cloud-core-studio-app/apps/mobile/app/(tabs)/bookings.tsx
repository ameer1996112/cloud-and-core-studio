import { useState } from "react";
import { Screen } from "@/components/Screen";
import { sessions } from "@/fixtures/classes";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, fitness, radii } from "@/theme/colors";
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
        <View style={[styles.headerRow, direction === "rtl" && styles.rowReverse]}>
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>18:30</Text>
            <Text style={styles.timeLabel}>{locale === "he" ? "היום" : "Today"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { textAlign: align }]}>{t.nextBooking}</Text>
            <Text style={[styles.classTitle, { textAlign: align }]}>{title}</Text>
            <Text style={[styles.meta, { textAlign: align }]}>19 Jun · {next.roomName}</Text>
          </View>
        </View>
        <View style={styles.note}>
          <Text style={[styles.noteText, { textAlign: align }]}>
            {locale === "he"
              ? "הגיעי 8 דקות לפני השיעור. הסטודיו ישמור לך מקום שקט."
              : "Arrive 8 minutes early. The studio will keep your spot ready."}
          </Text>
        </View>
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
    color: fitness.textPrimary,
    fontSize: 30,
    fontWeight: "900",
  },
  card: {
    backgroundColor: fitness.surface,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: fitness.border,
    padding: 18,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  timeBadge: {
    width: 72,
    borderRadius: 18,
    backgroundColor: fitness.goldGlow,
    borderWidth: 1,
    borderColor: fitness.borderStrong,
    padding: 10,
    alignItems: "center",
  },
  timeText: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: "900",
  },
  timeLabel: {
    color: fitness.textSecondary,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2,
  },
  label: {
    color: fitness.textSecondary,
    fontWeight: "800",
  },
  classTitle: {
    color: fitness.textPrimary,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 3,
  },
  meta: {
    color: fitness.textMuted,
    fontWeight: "700",
    marginTop: 4,
  },
  note: {
    borderRadius: radii.medium,
    backgroundColor: fitness.surfaceRaised,
    borderColor: fitness.border,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  noteText: {
    color: fitness.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: fitness.borderStrong,
    borderRadius: radii.small,
    padding: 12,
    alignItems: "center",
    backgroundColor: fitness.surfaceRaised,
  },
  secondaryText: {
    color: fitness.textPrimary,
    fontWeight: "900",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: fitness.dangerGlow,
    borderWidth: 1,
    borderColor: "rgba(166,66,66,0.42)",
    borderRadius: radii.small,
    padding: 12,
    alignItems: "center",
  },
  cancelText: {
    color: colors.danger,
    fontWeight: "900",
  },
  statusText: {
    color: fitness.textMuted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },
  disabledButton: {
    borderColor: fitness.border,
    backgroundColor: fitness.surfaceSoft,
  },
  disabledText: {
    color: fitness.textMuted,
  },
  activeButton: {
    borderColor: fitness.borderStrong,
    backgroundColor: fitness.goldGlow,
  },
});
