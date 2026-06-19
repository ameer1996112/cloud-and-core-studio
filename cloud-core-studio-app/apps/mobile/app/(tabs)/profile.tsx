import { useState } from "react";
import { Image, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { ConciergePanel } from "@/components/ConciergePanel";
import { MembershipHealthPanel } from "@/components/MembershipHealthPanel";
import { Screen } from "@/components/Screen";
import { premiumExperience } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { colors } from "@/theme/colors";

export default function ProfileScreen() {
  const { t, locale, setLocale, direction } = useCopy();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsStatus, setNotificationsStatus] = useState<"idle" | "checking" | "enabled" | "disabled" | "unavailable">(
    "idle",
  );
  const [accountDeletionRequested, setAccountDeletionRequested] = useState(false);
  const align = direction === "rtl" ? "right" : "left";

  async function toggleNotifications(value: boolean) {
    if (!value) {
      setNotificationsEnabled(false);
      setNotificationsStatus("disabled");
      return;
    }

    try {
      setNotificationsStatus("checking");
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setNotificationsEnabled(true);
        setNotificationsStatus("enabled");
        return;
      }
    } catch {
      // Keep the UI local and explicit when registration fails.
    }

    setNotificationsEnabled(false);
    setNotificationsStatus("unavailable");
  }

  const notificationsStatusText =
    notificationsStatus === "enabled"
      ? locale === "he"
        ? "ההתראות פעילות במכשיר הזה."
        : "Notifications are enabled on this device."
      : notificationsStatus === "disabled"
        ? locale === "he"
          ? "ההתראות כבויות כרגע."
          : "Notifications are currently turned off."
        : notificationsStatus === "checking"
          ? locale === "he"
            ? "בודקים הרשאה והתאמת מכשיר להתראות."
            : "Checking notification permission and device availability."
          : notificationsStatus === "unavailable"
            ? locale === "he"
              ? "התראות אינן זמינות כרגע במכשיר או בפרויקט הזה."
              : "Notifications are unavailable on this device or in this project right now."
            : locale === "he"
              ? "אפשר להפעיל התראות לאחר שהרישום למכשיר מצליח."
              : "Notifications can be enabled after device registration succeeds.";
  const deletionStatusText = accountDeletionRequested
    ? locale === "he"
      ? "בקשת המחיקה נשמרה מקומית לבדיקה לפני שליחה."
      : "Your deletion request was saved locally for review before sending."
    : locale === "he"
      ? "כפתור זה שומר בקשה מקומית בלבד בשלב הזה."
      : "This button stores a local-only request at this stage.";

  return (
    <Screen>
      <Text style={[styles.title, { textAlign: align }]}>{t.profile}</Text>
      <View style={[styles.editorialRow, direction === "rtl" && styles.rowReverse]}>
        <Image source={require("../../assets/editorial/instructor-maya.png")} style={styles.editorialImage} />
        <View style={styles.editorialCopy}>
          <Text style={[styles.editorialEyebrow, { textAlign: align }]}>
            {locale === "he" ? "קשר סטודיו" : "Studio care"}
          </Text>
          <Text style={[styles.editorialTitle, { textAlign: align }]}>
            {locale === "he" ? "מאיה עוקבת אחרי הקצב וההעדפות שלך." : "Maya keeps track of your pace and preferences."}
          </Text>
          <Text style={[styles.editorialBody, { textAlign: align }]}>
            {locale === "he"
              ? "הערות מדריכה, נוכחות והתאמות נשמרות יחד כדי שההמשך יהיה אישי ושקט."
              : "Instructor notes, attendance, and class adjustments stay together for a quieter, more personal follow-up."}
          </Text>
        </View>
      </View>

      <MembershipHealthPanel membership={premiumExperience.membership} />
      <ConciergePanel requests={premiumExperience.concierge} />

      <View style={styles.card}>
        <Text style={[styles.label, { textAlign: align }]}>{t.language}</Text>
        <View style={[styles.segment, direction === "rtl" && styles.rowReverse]}>
          <Pressable onPress={() => setLocale("he")} style={[styles.segmentButton, locale === "he" && styles.selected]}>
            <Text style={styles.segmentText}>עברית</Text>
          </Pressable>
          <Pressable onPress={() => setLocale("en")} style={[styles.segmentButton, locale === "en" && styles.selected]}>
            <Text style={styles.segmentText}>English</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.rowCard, direction === "rtl" && styles.rowReverse]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { textAlign: align }]}>{t.notifications}</Text>
          <Text style={[styles.body, { textAlign: align }]}>
            {locale === "he"
              ? "התראות חכמות להזמנות, המתנה ומנוי."
              : "Smart alerts for bookings, waitlist, and membership."}
          </Text>
          <Text style={[styles.statusText, { textAlign: align }]}>{notificationsStatusText}</Text>
        </View>
        <Switch
          disabled={notificationsStatus === "checking"}
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      <View style={styles.premiumCard}>
        <Text style={[styles.premiumTitle, { textAlign: align }]}>{t.instructorMode}</Text>
        <Text style={[styles.premiumBody, { textAlign: align }]}>
          {locale === "he"
            ? "כניסה מהירה לרשימת משתתפות, נוכחות והערות פנימיות."
            : "Fast access to participant lists, attendance, and internal notes."}
        </Text>
      </View>

      <Pressable onPress={() => setAccountDeletionRequested(true)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>{t.accountDeletion}</Text>
      </Pressable>
      <Text style={[styles.statusText, { textAlign: align }]}>{deletionStatusText}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.navy,
    fontSize: 32,
    fontWeight: "900",
  },
  card: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.sand,
    paddingVertical: 18,
    gap: 12,
  },
  rowCard: {
    borderBottomWidth: 1,
    borderColor: colors.sand,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  editorialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 1,
    borderColor: colors.sand,
    paddingBottom: 18,
  },
  editorialImage: {
    width: 88,
    height: 110,
    borderRadius: 8,
    backgroundColor: colors.sand,
  },
  editorialCopy: {
    flex: 1,
    gap: 4,
  },
  editorialEyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
  },
  editorialTitle: {
    color: colors.navy,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900",
  },
  editorialBody: {
    color: colors.slate,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    color: colors.navy,
    fontWeight: "900",
    fontSize: 16,
  },
  body: {
    color: colors.slate,
    lineHeight: 21,
    marginTop: 4,
  },
  statusText: {
    color: colors.slate,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    marginTop: 8,
  },
  segment: {
    flexDirection: "row",
    borderRadius: 999,
    backgroundColor: colors.sand,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 999,
  },
  selected: {
    backgroundColor: colors.white,
  },
  segmentText: {
    color: colors.navy,
    fontWeight: "900",
  },
  premiumCard: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.sand,
    paddingVertical: 18,
    gap: 8,
  },
  premiumTitle: {
    color: colors.navy,
    fontSize: 21,
    fontWeight: "900",
  },
  premiumBody: {
    color: colors.slate,
    fontSize: 15,
    lineHeight: 22,
  },
  deleteButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: 14,
    alignItems: "center",
  },
  deleteText: {
    color: colors.danger,
    fontWeight: "900",
  },
});
