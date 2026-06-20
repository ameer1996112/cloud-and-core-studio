import type { ClassSession } from "@cloud-core/shared";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ClassCard } from "@/components/ClassCard";
import { loadAvailableClasses } from "@/lib/availableClasses";
import { colors, radii, spacing } from "@/theme/colors";
import { useCopy } from "@/i18n/LocaleProvider";

const allFilter = "all";

function titleFor(session: ClassSession, locale: "he" | "en") {
  return locale === "he" ? session.titleHe : session.titleEn;
}

function classTypeLabel(type: string) {
  return type
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ScheduleScreen() {
  const { locale, direction, rowDirection, textAlign } = useCopy();
  const insets = useSafeAreaInsets();
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(allFilter);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      const result = await loadAvailableClasses();

      if (!isMounted) {
        return;
      }

      setSessions(result.sessions);
      setMessage(result.error ? (locale === "he" ? "לוח השיעורים מתעדכן. מוצגת גרסה שמורה." : "Schedule is refreshing. Showing saved classes.") : null);
      setIsLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  const typeFilters = useMemo(() => {
    const types = Array.from(new Set(sessions.map((session) => session.categoryId))).sort();
    return [allFilter, ...types];
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesType = selectedType === allFilter || session.categoryId === selectedType;
      const matchesSearch =
        !needle ||
        titleFor(session, locale).toLowerCase().includes(needle) ||
        session.instructor.displayName.toLowerCase().includes(needle) ||
        session.roomName.toLowerCase().includes(needle);

      return matchesType && matchesSearch;
    });
  }, [locale, search, selectedType, sessions]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: 110 + insets.bottom,
          },
        ]}
      >
        <View style={[styles.header, { flexDirection: rowDirection }]}>
          <View style={styles.headerCopy}>
            <Text style={[styles.eyebrow, { textAlign, writingDirection: direction }]}>{locale === "he" ? "לוח שבועי" : "Weekly schedule"}</Text>
            <Text style={[styles.title, { textAlign, writingDirection: direction }]}>{locale === "he" ? "שיעורים זמינים" : "Browse classes"}</Text>
            <Text style={[styles.subtitle, { textAlign, writingDirection: direction }]}>
              {locale === "he" ? "בחרו שיעור לפי שעה, מורה ומקום פנוי." : "Choose by time, instructor, and open spots."}
            </Text>
          </View>
          <View style={styles.countBadge}>
            {isLoading ? <ActivityIndicator color={colors.gold} /> : <Text style={styles.countNumber}>{filteredSessions.length}</Text>}
            <Text style={styles.countLabel}>{locale === "he" ? "שיעורים" : "classes"}</Text>
          </View>
        </View>

        <View style={[styles.searchBox, { flexDirection: rowDirection }]}>
          <Ionicons name="search" size={18} color={colors.slate} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={locale === "he" ? "חיפוש שיעור, מורה או חדר" : "Search class, instructor, or room"}
            placeholderTextColor={colors.slate}
            style={[styles.searchInput, { textAlign, writingDirection: direction }]}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterRow, { flexDirection: rowDirection }]}>
          {typeFilters.map((type) => {
            const isSelected = selectedType === type;
            return (
              <Pressable key={type} onPress={() => setSelectedType(type)} style={[styles.filterChip, isSelected && styles.filterChipSelected]}>
                <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                  {type === allFilter ? (locale === "he" ? "הכל" : "All") : classTypeLabel(type)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {message ? <Text style={[styles.notice, { textAlign, writingDirection: direction }]}>{message}</Text> : null}

        <View style={styles.list}>
          {isLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color={colors.gold} />
            </View>
          ) : filteredSessions.length > 0 ? (
            filteredSessions.map((session) => <ClassCard key={session.id} session={session} />)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={26} color={colors.gold} />
              <Text style={[styles.emptyTitle, { textAlign, writingDirection: direction }]}>{locale === "he" ? "אין שיעורים זמינים" : "No available classes"}</Text>
              <Text style={[styles.emptyBody, { textAlign, writingDirection: direction }]}>
                {locale === "he" ? "נסו לשנות חיפוש או סוג שיעור." : "Try another search or class type."}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  header: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
  },
  title: {
    color: colors.navy,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
  },
  subtitle: {
    color: colors.slate,
    fontSize: 14,
    lineHeight: 20,
  },
  countBadge: {
    minWidth: 76,
    minHeight: 76,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sand,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
  },
  countNumber: {
    color: colors.navy,
    fontSize: 24,
    fontWeight: "900",
  },
  countLabel: {
    color: colors.slate,
    fontSize: 11,
    fontWeight: "700",
  },
  searchBox: {
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.sand,
    borderRadius: radii.medium,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  searchInput: {
    flex: 1,
    color: colors.navy,
    fontSize: 15,
    minHeight: 52,
  },
  filterRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.sand,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
  },
  filterChipSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
  },
  filterText: {
    color: colors.slate,
    fontSize: 13,
    fontWeight: "800",
  },
  filterTextSelected: {
    color: colors.gold,
  },
  notice: {
    borderRadius: radii.medium,
    backgroundColor: colors.goldSoft,
    color: colors.navy,
    padding: spacing.md,
    fontSize: 13,
    lineHeight: 20,
  },
  list: {
    gap: spacing.md,
  },
  emptyState: {
    minHeight: 180,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.sand,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.lg,
  },
  emptyTitle: {
    color: colors.navy,
    fontSize: 17,
    fontWeight: "900",
  },
  emptyBody: {
    color: colors.slate,
    fontSize: 14,
  },
});
