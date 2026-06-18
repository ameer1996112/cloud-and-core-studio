import type { ClassSession, Locale } from "@cloud-core/shared";
import { Link } from "expo-router";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function titleFor(session: ClassSession, locale: Locale) {
  return locale === "he" ? session.titleHe : session.titleEn;
}

export function ClassCard({ session }: { session: ClassSession }) {
  const { t, locale, direction } = useCopy();
  const remaining = Math.max(session.capacity - session.bookedCount, 0);
  const waitlisted = session.status === "waitlist" || remaining === 0;

  return (
    <Link href={`/class/${session.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={[styles.top, direction === "rtl" && styles.rowReverse]}>
          <View style={styles.timePill}>
            <Text style={styles.time}>{formatTime(session.startsAt)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { textAlign: direction === "rtl" ? "right" : "left" }]}>{titleFor(session, locale)}</Text>
            <Text style={[styles.meta, { textAlign: direction === "rtl" ? "right" : "left" }]}>
              {session.instructor.displayName} · {session.roomName}
            </Text>
          </View>
        </View>
        <View style={[styles.footer, direction === "rtl" && styles.rowReverse]}>
          <Text style={[styles.status, waitlisted && styles.waitlist]}>
            {waitlisted ? `${t.waitlist} · ${session.waitlistCount}` : `${remaining} ${t.available}`}
          </Text>
          <Text style={styles.level}>{waitlisted ? "86% promotion odds" : session.level.replace("_", " ")}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.large,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.sand,
    shadowColor: colors.navy,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  top: {
    flexDirection: "row",
    gap: 14,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  timePill: {
    width: 76,
    borderRadius: 18,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  time: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 18,
  },
  title: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: "800",
  },
  meta: {
    color: colors.slate,
    marginTop: 4,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  status: {
    color: colors.success,
    fontWeight: "800",
  },
  waitlist: {
    color: colors.warning,
  },
  level: {
    color: colors.slate,
    textTransform: "capitalize",
  },
});
