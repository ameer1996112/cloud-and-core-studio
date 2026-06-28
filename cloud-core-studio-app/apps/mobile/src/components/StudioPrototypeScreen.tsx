import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  capacityPercent,
  capacityTone,
  formatIls,
  getDaySchedule,
  getMemberCreditsLabel,
  initials,
  studioSnapshot,
  type CapacityTone,
  type StudioClass,
  type StudioMember,
} from "@/fixtures/studioPrototype";

type PrototypeScreen = "home" | "schedule" | "members" | "settings";

const token = {
  ivory: "#FAF7F2",
  ivoryDark: "#F0EBE2",
  gold: "#D4AF6A",
  goldLight: "#F0E3C4",
  goldMid: "#C49A45",
  blue: "#B7CCE6",
  blueLight: "#E8F1F9",
  blueMid: "#7AAAD0",
  sand: "#E8DFD1",
  sandLight: "#F4F0EA",
  sandDark: "#C4B49A",
  textMain: "#0B1D3A",
  textMid: "#4A5568",
  textMuted: "#7A8899",
  white: "#FFFFFF",
  greenBg: "#E5F4E0",
  greenText: "#3A7A2A",
  redBg: "#FDE8E8",
  redText: "#A03030",
  redBar: "#D97070",
};

const accentByColor: Record<StudioClass["color"], string> = {
  blue: token.blueMid,
  gold: token.gold,
  sand: token.sandDark,
  green: "#7CBF6D",
  red: token.redBar,
  purple: "#A98AC7",
};

export function StudioPrototypeScreen({ screen }: { screen: PrototypeScreen }) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {screen === "home" ? <AdminHome /> : null}
      {screen === "schedule" ? <Schedule /> : null}
      {screen === "members" ? <Members /> : null}
      {screen === "settings" ? <Settings /> : null}
    </SafeAreaView>
  );
}

function AdminHome() {
  const todayClasses = getDaySchedule("Fri").slice(0, 5);

  return (
    <View style={styles.screen}>
      <Greeting />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard label="Members" value={String(studioSnapshot.stats.totalMembers)} />
          <StatCard label="Today" value={String(studioSnapshot.stats.bookingsToday)} />
          <StatCard label="Revenue" value={formatIls(studioSnapshot.stats.revenueMonth)} />
        </View>
        <View style={styles.quickGrid}>
          <QuickAction icon="add" label="Add class" />
          <QuickAction icon="person-add-outline" label="Add member" />
          <QuickAction icon="qr-code-outline" label="QR Check-in" />
          <QuickAction icon="cash-outline" label="Reports" />
        </View>
        <SectionTitle title="Today's classes" action="View week" />
        <View style={styles.stack}>
          {todayClasses.map((session) => (
            <ClassCard key={session.id} session={session} />
          ))}
        </View>
        <SectionTitle title="Recent activity" />
        <View style={[styles.card, styles.cardPad]}>
          {studioSnapshot.activity.map((item, index) => (
            <View key={item} style={styles.activityRow}>
              <View style={styles.activityDot} />
              <Text style={styles.activityText}>{item}</Text>
              <Text style={styles.activityTime}>{index + 1}m ago</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Schedule() {
  return (
    <View style={styles.screen}>
      <TopBar title="Schedule" subtitle="Week view" action="+" />
      <View style={styles.dayStrip}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <View key={day} style={[styles.day, day === "Fri" && styles.dayToday, day === "Fri" && styles.daySelected]}>
            <Text style={[styles.dayName, day === "Fri" && styles.dayTodayText]}>{day}</Text>
            <Text style={[styles.dayNumber, day === "Fri" && styles.dayTodayText]}>{day === "Fri" ? "20" : day === "Sat" ? "21" : "19"}</Text>
          </View>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {getDaySchedule("Fri").map((session) => (
          <ClassCard key={session.id} session={session} detailed />
        ))}
      </ScrollView>
    </View>
  );
}

function Members() {
  return (
    <View style={styles.screen}>
      <TopBar title="Members" subtitle={`${studioSnapshot.members.length} visible`} action="+" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={token.textMuted} />
          <Text style={styles.searchText}>Search name, email, phone</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {["All", "Active", "Monthly", "10-class pack", "Annual", "Expired"].map((chip, index) => (
            <View key={chip} style={[styles.chip, index === 0 && styles.chipActive]}>
              <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>{chip}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.card}>
          {studioSnapshot.members.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Settings() {
  return (
    <View style={styles.screen}>
      <TopBar title="Settings" subtitle="Studio control" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, styles.cardPad, styles.profileHeader]}>
          <Avatar label={studioSnapshot.admin.name} tone="gold" size={44} />
          <View style={styles.flex}>
            <Text style={styles.profileName}>{studioSnapshot.admin.name}</Text>
            <Pill tone="blue" label={studioSnapshot.admin.role} />
          </View>
        </View>
        <SettingsGroup title="Studio" rows={["Studio profile", "Instructors", "Class packages"]} />
        <View style={[styles.card, styles.cardPad]}>
          <SectionTitle title="Notifications" />
          <SettingsRow label="Push notifications" enabled />
          <SettingsRow label="WhatsApp reminders" enabled />
        </View>
        <View style={[styles.card, styles.cardPad]}>
          <SectionTitle title="Booking rules" />
          <SettingsRow label="Cancel deadline" value="12h" />
          <SettingsRow label="Waitlist auto-enroll" enabled />
        </View>
        <View style={[styles.card, styles.cardPad]}>
          <SectionTitle title="App" />
          <SettingsRow label="Language" value="English" />
          <TouchableOpacity style={styles.logout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function Greeting() {
  return (
    <View style={styles.greeting}>
      <View>
        <Text style={styles.greetingTitle}>Good morning, {studioSnapshot.admin.name}</Text>
        <Text style={styles.greetingSub}>{studioSnapshot.today}</Text>
      </View>
      <Avatar label={studioSnapshot.admin.name} tone="gold" size={44} />
    </View>
  );
}

function TopBar({ title, subtitle, action }: { title: string; subtitle?: string; action?: string }) {
  return (
    <View style={styles.greeting}>
      <View>
        <Text style={styles.greetingTitle}>{title}</Text>
        {subtitle ? <Text style={styles.greetingSub}>{subtitle}</Text> : null}
      </View>
      {action ? (
        <View style={styles.iconButton}>
          <Text style={styles.iconButtonText}>{action}</Text>
        </View>
      ) : null}
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

function QuickAction({ icon, label }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string }) {
  return (
    <View style={styles.quickAction}>
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={18} color={token.goldMid} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </View>
  );
}

function ClassCard({ session, detailed = false }: { session: StudioClass; detailed?: boolean }) {
  const tone = capacityTone(session.registered, session.capacity);
  return (
    <View style={[styles.classCard, { borderLeftColor: accentByColor[session.color] }]}>
      <View style={styles.classMain}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeBadgeText}>{session.time}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.classTitle} numberOfLines={1}>
            {session.name}
          </Text>
          <Text style={styles.classMeta} numberOfLines={1}>
            {session.instructor} · {session.studio}
          </Text>
        </View>
        <Pill tone={tone} label={`${session.registered}/${session.capacity}`} />
      </View>
      {detailed ? (
        <View style={styles.instructorLine}>
          <Avatar label={session.instructor} tone="blue" size={36} />
          <Text style={styles.classMeta}>
            {session.time}-{session.endTime}
          </Text>
          <Text style={styles.classMeta}>{session.waitlist ? `${session.waitlist} waitlist` : "Open"}</Text>
        </View>
      ) : null}
      <View style={styles.progress}>
        <View
          style={[
            styles.progressFill,
            tone === "gold" && styles.progressGold,
            tone === "red" && styles.progressRed,
            { width: `${capacityPercent(session.registered, session.capacity)}%` },
          ]}
        />
      </View>
    </View>
  );
}

function MemberRow({ member }: { member: StudioMember }) {
  return (
    <View style={styles.memberRow}>
      <Avatar label={member.name} tone={member.planType === "Annual" ? "gold" : member.planType === "Monthly" ? "blue" : "sand"} size={36} />
      <View style={styles.flex}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberMeta}>
          {member.plan} · {member.attended} attended
        </Text>
      </View>
      <View style={styles.memberRight}>
        <Pill tone={member.status === "Expired" ? "red" : member.status === "Paused" ? "sand" : "green"} label={member.status} />
        <Text style={styles.memberCredits}>{getMemberCreditsLabel(member)}</Text>
      </View>
    </View>
  );
}

function Avatar({ label, tone, size }: { label: string; tone: "gold" | "blue" | "sand"; size: number }) {
  return (
    <View
      style={[
        styles.avatar,
        tone === "gold" && styles.avatarGold,
        tone === "blue" && styles.avatarBlue,
        tone === "sand" && styles.avatarSand,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={styles.avatarText}>{initials(label)}</Text>
    </View>
  );
}

function Pill({ tone, label }: { tone: CapacityTone | "blue" | "sand"; label: string }) {
  return (
    <View style={[styles.pill, getPillStyle(tone)]}>
      <Text style={[styles.pillText, getPillTextStyle(tone)]}>{label}</Text>
    </View>
  );
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

function SettingsGroup({ title, rows }: { title: string; rows: string[] }) {
  return (
    <View style={[styles.card, styles.cardPad]}>
      <SectionTitle title={title} />
      {rows.map((row) => (
        <SettingsRow key={row} label={row} value="›" />
      ))}
    </View>
  );
}

function SettingsRow({ label, enabled, value }: { label: string; enabled?: boolean; value?: string }) {
  return (
    <View style={styles.settingsRow}>
      <Text style={styles.settingsLabel}>{label}</Text>
      {enabled ? (
        <View style={styles.toggle}>
          <View style={styles.toggleKnob} />
        </View>
      ) : (
        <Text style={styles.settingsValue}>{value}</Text>
      )}
    </View>
  );
}

function getPillStyle(tone: CapacityTone | "blue" | "sand") {
  switch (tone) {
    case "green":
      return styles.pillGreen;
    case "gold":
      return styles.pillGold;
    case "red":
      return styles.pillRed;
    case "blue":
      return styles.pillBlue;
    case "sand":
      return styles.pillSand;
  }
}

function getPillTextStyle(tone: CapacityTone | "blue" | "sand") {
  switch (tone) {
    case "green":
      return styles.pillTextGreen;
    case "gold":
      return styles.pillTextGold;
    case "red":
      return styles.pillTextRed;
    case "blue":
      return styles.pillTextBlue;
    case "sand":
      return styles.pillTextSand;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: token.ivory,
  },
  screen: {
    flex: 1,
    backgroundColor: token.ivory,
  },
  content: {
    padding: 16,
    paddingBottom: 112,
    gap: 14,
  },
  card: {
    backgroundColor: token.white,
    borderColor: token.sand,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
  },
  cardPad: {
    padding: 16,
  },
  greeting: {
    minHeight: 72,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: token.white,
    borderBottomColor: token.sand,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  greetingTitle: {
    color: token.textMain,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
  },
  greetingSub: {
    marginTop: 2,
    color: token.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    minHeight: 86,
    paddingHorizontal: 10,
    paddingVertical: 13,
    backgroundColor: token.white,
    borderColor: token.sand,
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 3,
    borderTopColor: token.gold,
    borderRadius: 16,
    justifyContent: "space-between",
  },
  statLabel: {
    color: token.textMuted,
    fontSize: 11,
  },
  statValue: {
    color: token.textMain,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "700",
  },
  quickGrid: {
    flexDirection: "row",
    gap: 9,
  },
  quickAction: {
    flex: 1,
    minHeight: 76,
    borderColor: token.sand,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    backgroundColor: token.white,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  quickIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: token.goldLight,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    color: token.textMid,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionTitle: {
    minHeight: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitleText: {
    color: token.textMain,
    fontSize: 14,
    fontWeight: "600",
  },
  sectionAction: {
    color: token.goldMid,
    fontSize: 12,
    fontWeight: "600",
  },
  stack: {
    gap: 10,
  },
  classCard: {
    padding: 14,
    gap: 11,
    backgroundColor: token.white,
    borderColor: token.sand,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 4,
    borderRadius: 16,
  },
  classMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  timeBadge: {
    width: 48,
    height: 34,
    borderRadius: 8,
    backgroundColor: token.blueLight,
    alignItems: "center",
    justifyContent: "center",
  },
  timeBadgeText: {
    color: token.textMain,
    fontSize: 12,
    fontWeight: "700",
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  classTitle: {
    color: token.textMain,
    fontSize: 14,
    fontWeight: "600",
  },
  classMeta: {
    color: token.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  progress: {
    height: 7,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: token.sandLight,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: token.blue,
  },
  progressGold: {
    backgroundColor: token.gold,
  },
  progressRed: {
    backgroundColor: token.redBar,
  },
  instructorLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 9,
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  pillGreen: {
    backgroundColor: token.greenBg,
  },
  pillGold: {
    backgroundColor: token.goldLight,
    borderColor: token.gold,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pillRed: {
    backgroundColor: token.redBg,
  },
  pillBlue: {
    backgroundColor: token.blueLight,
  },
  pillSand: {
    backgroundColor: token.sandLight,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  pillTextGreen: {
    color: token.greenText,
  },
  pillTextGold: {
    color: "#7A5A10",
  },
  pillTextRed: {
    color: token.redText,
  },
  pillTextBlue: {
    color: "#1A5080",
  },
  pillTextSand: {
    color: token.textMid,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarGold: {
    backgroundColor: token.goldLight,
    borderColor: token.gold,
    borderWidth: 1.5,
  },
  avatarBlue: {
    backgroundColor: token.blue,
  },
  avatarSand: {
    backgroundColor: token.sand,
  },
  avatarText: {
    color: token.textMain,
    fontSize: 12,
    fontWeight: "700",
  },
  activityRow: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomColor: token.sand,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: token.gold,
  },
  activityText: {
    flex: 1,
    color: token.textMain,
    fontSize: 12,
    fontWeight: "600",
  },
  activityTime: {
    color: token.textMuted,
    fontSize: 11,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderColor: token.sand,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: token.sandLight,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonText: {
    color: token.textMain,
    fontSize: 20,
  },
  dayStrip: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: token.white,
    borderBottomColor: token.sand,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  day: {
    minWidth: 48,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    gap: 4,
  },
  dayToday: {
    backgroundColor: token.textMain,
  },
  daySelected: {
    borderBottomColor: token.gold,
  },
  dayName: {
    color: token.textMuted,
    fontSize: 12,
  },
  dayNumber: {
    color: token.textMain,
    fontSize: 13,
    fontWeight: "700",
  },
  dayTodayText: {
    color: token.white,
  },
  searchBox: {
    minHeight: 42,
    paddingHorizontal: 13,
    borderRadius: 8,
    borderColor: token.sandDark,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: token.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchText: {
    color: token.textMuted,
    fontSize: 14,
  },
  chips: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    borderColor: token.sand,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: token.white,
  },
  chipActive: {
    borderColor: token.gold,
    backgroundColor: token.goldLight,
  },
  chipText: {
    color: token.textMid,
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: token.goldMid,
  },
  memberRow: {
    minHeight: 62,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderBottomColor: token.sand,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  memberName: {
    color: token.textMain,
    fontSize: 14,
    fontWeight: "600",
  },
  memberMeta: {
    color: token.textMuted,
    fontSize: 11,
  },
  memberRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  memberCredits: {
    color: token.textMuted,
    fontSize: 11,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileName: {
    color: token.textMain,
    fontSize: 17,
    fontWeight: "600",
  },
  settingsRow: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: token.sand,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingsLabel: {
    color: token.textMain,
    fontSize: 14,
    fontWeight: "500",
  },
  settingsValue: {
    color: token.textMuted,
    fontSize: 14,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 999,
    backgroundColor: token.gold,
    alignItems: "flex-end",
    justifyContent: "center",
    padding: 3,
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: token.white,
  },
  logout: {
    minHeight: 43,
    borderRadius: 12,
    backgroundColor: token.redBg,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: token.redText,
    fontSize: 14,
    fontWeight: "700",
  },
});
