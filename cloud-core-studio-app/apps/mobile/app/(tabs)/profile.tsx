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
  const align = direction === "rtl" ? "right" : "left";

  async function toggleNotifications(value: boolean) {
    setNotificationsEnabled(value);
    if (value) {
      await registerForPushNotificationsAsync();
    }
  }

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
        </View>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
      </View>

      <View style={styles.premiumCard}>
        <Text style={[styles.premiumTitle, { textAlign: align }]}>{t.instructorMode}</Text>
        <Text style={[styles.premiumBody, { textAlign: align }]}>
          {locale === "he"
            ? "כניסה מהירה לרשימת משתתפות, נוכחות והערות פנימיות."
            : "Fast access to participant lists, attendance, and internal notes."}
        </Text>
      </View>

      <Pressable style={styles.deleteButton}>
        <Text style={styles.deleteText}>{t.accountDeletion}</Text>
      </Pressable>
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
