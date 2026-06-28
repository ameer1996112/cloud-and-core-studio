import type { ClassSession } from "@cloud-core/shared";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { getLocalizedText, type LocalizedText, type SessionInsight } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, fitness, palette, radii, shadows, spacing, typography, useResponsiveMetrics } from "@/theme/colors";

type IconName = ComponentProps<typeof Ionicons>["name"];

export function triggerSelectionHaptic() {
  void Haptics.selectionAsync().catch(() => undefined);
}

export function triggerImpactHaptic(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
  void Haptics.impactAsync(style).catch(() => undefined);
}

export function AppScreen({
  children,
  scroll = true,
  style,
}: PropsWithChildren<{ scroll?: boolean; style?: StyleProp<ViewStyle> }>) {
  const { direction } = useCopy();
  const metrics = useResponsiveMetrics();
  const contentStyle = [
    styles.screenContent,
    {
      paddingHorizontal: metrics.horizontalPadding,
      paddingBottom: metrics.bottomInset,
      maxWidth: metrics.maxContentWidth,
      width: "100%" as const,
      alignSelf: "center" as const,
    },
    style,
  ];

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      {scroll ? (
        <ScrollView style={styles.flex} contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Header({
  eyebrow,
  title,
  subtitle,
  action,
  showLogo,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  showLogo?: boolean;
}) {
  const { direction, rowDirection, textAlign } = useCopy();
  const align = textAlign;

  return (
    <View style={[styles.header, { flexDirection: rowDirection }]}>
      <View style={styles.headerCopy}>
        <View
          style={[
            styles.headerTopRow,
            { flexDirection: rowDirection },
            { justifyContent: direction === "rtl" ? "flex-end" : "flex-start" },
          ]}
        >
          {showLogo ? (
            <Image
              source={require("../../assets/logo-transparent.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          ) : null}
          {eyebrow ? <Text style={[styles.eyebrow, { textAlign: align, writingDirection: direction }]}>{eyebrow}</Text> : null}
        </View>
        <Text style={[styles.screenTitle, { textAlign: align, writingDirection: direction }]} adjustsFontSizeToFit numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? <Text style={[styles.screenSubtitle, { textAlign: align, writingDirection: direction }]}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function PrimaryButton({
  children,
  onPress,
  icon,
  disabled,
  style,
}: PropsWithChildren<{
  onPress?: (event: GestureResponderEvent) => void;
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}>) {
  return (
    <Pressable
      disabled={disabled}
      onPress={(event) => {
        triggerImpactHaptic();
        onPress?.(event);
      }}
      style={({ pressed }) => [styles.primaryButton, disabled && styles.disabled, pressed && styles.buttonPressed, style]}
    >
      {icon ? <Ionicons name={icon} size={17} color={colors.ink} /> : null}
      <Text style={styles.primaryButtonText}>{children}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  children,
  onPress,
  icon,
  danger,
  style,
}: PropsWithChildren<{
  onPress?: (event: GestureResponderEvent) => void;
  icon?: IconName;
  danger?: boolean;
  style?: StyleProp<ViewStyle>;
}>) {
  return (
    <Pressable
      onPress={(event) => {
        triggerSelectionHaptic();
        onPress?.(event);
      }}
      style={({ pressed }) => [
        styles.secondaryButton,
        danger && styles.dangerButton,
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={17} color={danger ? colors.danger : fitness.textPrimary} /> : null}
      <Text style={[styles.secondaryButtonText, danger && styles.dangerText]}>{children}</Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={(event) => {
        triggerSelectionHaptic();
        onPress?.(event);
      }}
      style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}
    >
      <Ionicons name={icon} color={fitness.textPrimary} size={19} />
    </Pressable>
  );
}

export function SurfaceCard({
  children,
  elevated,
  style,
}: PropsWithChildren<{ elevated?: boolean; style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.surfaceCard, elevated && styles.surfaceElevated, style]}>{children}</View>;
}

export function StatusBadge({
  status,
  label,
}: {
  status: "open" | "booked" | "waitlist" | "full" | "closed" | "success" | "warning" | "danger";
  label: string;
}) {
  const tone =
    status === "open" || status === "booked" || status === "success"
      ? styles.successBadge
      : status === "waitlist" || status === "warning"
        ? styles.warningBadge
        : styles.dangerBadge;
  const textTone =
    status === "open" || status === "booked" || status === "success"
      ? styles.successBadgeText
      : status === "waitlist" || status === "warning"
        ? styles.warningBadgeText
        : styles.dangerBadgeText;

  return (
    <View style={[styles.badge, tone]}>
      <Text style={[styles.badgeText, textTone]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function WaitlistBadge({ position, odds }: { position: number; odds?: number | null }) {
  const { locale } = useCopy();
  return (
    <View style={styles.waitlistBadge}>
      <Ionicons name="sparkles-outline" size={13} color={colors.warning} />
      <Text style={styles.waitlistBadgeText}>
        {locale === "he"
          ? `מקום ${position}${odds ? ` · ${odds}% סיכוי` : ""}`
          : `Position ${position}${odds ? ` · ${odds}% odds` : ""}`}
      </Text>
    </View>
  );
}

export function InstructorAvatar({ name, size = 38 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

export function ScheduleDaySelector({
  selectedIndex,
  onSelect,
  bookedDays = [0],
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
  bookedDays?: number[];
}) {
  const { locale, direction, rowDirection } = useCopy();
  const labels =
    locale === "he"
      ? [
          ["ו׳", "19"],
          ["ש׳", "20"],
          ["א׳", "21"],
          ["ב׳", "22"],
          ["ג׳", "23"],
        ]
      : [
          ["Fri", "19"],
          ["Sat", "20"],
          ["Sun", "21"],
          ["Mon", "22"],
          ["Tue", "23"],
        ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.daySelector, { flexDirection: rowDirection }]}
    >
      {labels.map(([day, date], index) => (
        <Pressable
          key={`${day}-${date}`}
          onPress={() => {
            triggerSelectionHaptic();
            onSelect(index);
          }}
          style={[styles.dayPill, selectedIndex === index && styles.dayPillSelected]}
        >
          <Text style={[styles.dayName, selectedIndex === index && styles.dayNameSelected]}>{day}</Text>
          <Text style={[styles.dayDate, selectedIndex === index && styles.dayDateSelected]}>{date}</Text>
          {bookedDays.includes(index) ? (
            <View style={[styles.dayDot, selectedIndex === index && styles.dayDotSelected]} />
          ) : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function PremiumHeroCard({
  greeting,
  title,
  subtitle,
  image,
  ctaLabel,
  ctaHref,
  meta,
}: {
  greeting: string;
  title: string;
  subtitle: string;
  image: number;
  ctaLabel: string;
  ctaHref: string;
  meta: string;
}) {
  const { direction, rowDirection, textAlign } = useCopy();
  const align = textAlign;
  const metrics = useResponsiveMetrics();

  return (
    <View style={[styles.heroCard, { minHeight: metrics.heroHeight }]}>
      <Image source={image} style={styles.heroImage} resizeMode="cover" />
      <View style={styles.heroOverlay} />
      <View style={styles.heroContent}>
        <Text style={[styles.heroGreeting, { textAlign: align, writingDirection: direction }]}>{greeting}</Text>
        <Text style={[styles.heroTitle, metrics.isSmall && styles.heroTitleSmall, { textAlign: align, writingDirection: direction }]}>{title}</Text>
        <Text style={[styles.heroSubtitle, { textAlign: align, writingDirection: direction }]}>{subtitle}</Text>
        <View style={[styles.heroActions, { flexDirection: rowDirection }]}>
          <Link href={ctaHref} asChild>
            <PrimaryButton icon="calendar-clear-outline" style={styles.heroCta}>
              {ctaLabel}
            </PrimaryButton>
          </Link>
          <Text style={[styles.heroMeta, { textAlign: align, writingDirection: direction }]}>{meta}</Text>
        </View>
      </View>
    </View>
  );
}

export function MembershipPulseCard({
  title,
  subtitle,
  credits,
  renewal,
  score,
}: {
  title: string;
  subtitle: string;
  credits: string;
  renewal: string;
  score: number;
}) {
  const { direction, rowDirection, textAlign } = useCopy();
  const align = textAlign;

  return (
    <SurfaceCard elevated style={styles.membershipPulse}>
      <View style={[styles.splitRow, { flexDirection: rowDirection }]}>
        <View style={styles.creditOrb}>
          <Text style={styles.creditValue}>{credits}</Text>
          <Text style={styles.creditLabel}>{direction === "rtl" ? "כניסות" : "credits"}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={[styles.cardTitle, { textAlign: align, writingDirection: direction }]}>{title}</Text>
          <Text style={[styles.cardBody, { textAlign: align, writingDirection: direction }]}>{subtitle}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(Math.max(score, 0), 100)}%` }]} />
          </View>
          <Text style={[styles.cardCaption, { textAlign: align, writingDirection: direction }]}>{renewal}</Text>
        </View>
      </View>
    </SurfaceCard>
  );
}

export function CreditBalanceCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  const { direction, textAlign } = useCopy();
  const align = textAlign;

  return (
    <View style={styles.creditBalance}>
      <Text style={[styles.metricLabel, { textAlign: align, writingDirection: direction }]}>{label}</Text>
      <Text style={[styles.metricValue, { textAlign: align, writingDirection: direction }]}>{value}</Text>
      <Text style={[styles.metricCaption, { textAlign: align, writingDirection: direction }]}>{caption}</Text>
    </View>
  );
}

export function BookingCTA({
  decision,
  bookLabel,
  waitlistLabel,
  blockedLabel,
  onPress,
}: {
  decision: "book" | "waitlist" | "blocked";
  bookLabel: string;
  waitlistLabel: string;
  blockedLabel: string;
  onPress: () => void;
}) {
  const label = decision === "book" ? bookLabel : decision === "waitlist" ? waitlistLabel : blockedLabel;
  return (
    <PrimaryButton
      disabled={decision === "blocked"}
      icon={decision === "waitlist" ? "hourglass-outline" : "checkmark-circle-outline"}
      onPress={onPress}
      style={decision === "waitlist" && styles.waitlistCta}
    >
      {label}
    </PrimaryButton>
  );
}

export function ClassCard({
  session,
  insight,
  compact,
  hideWaitlistBadge = false,
}: {
  session: ClassSession;
  insight?: SessionInsight;
  compact?: boolean;
  hideWaitlistBadge?: boolean;
}) {
  const { locale, direction, rowDirection, textAlign } = useCopy();
  const align = textAlign;
  const title = locale === "he" ? session.titleHe : session.titleEn;
  const spots = Math.max(session.capacity - session.bookedCount, 0);
  const durationMinutes = Math.round((new Date(session.endsAt).getTime() - new Date(session.startsAt).getTime()) / 60000);
  const time = new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(session.startsAt));
  const statusLabel =
    session.status === "waitlist" || spots === 0
      ? locale === "he"
        ? "המתנה"
        : "Waitlist"
      : locale === "he"
        ? "פתוח"
        : "Open";
  const capacityPercent = session.capacity > 0 ? Math.min((session.bookedCount / session.capacity) * 100, 100) : 0;
  const reason = insight?.reasons[0] ? getLocalizedText(insight.reasons[0], locale) : session.instructor.displayName;

  const categoryColors: Record<string, string> = {
    reformer: colors.gold,
    aerial: colors.blue,
    stretch: colors.rose,
    recovery: colors.moss,
    kids: colors.plum,
  };
  const borderLeftColor = categoryColors[session.categoryId] ?? colors.gold;

  return (
    <Link href={`/class/${session.id}`} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.classCard,
          { borderLeftColor },
          compact && styles.classCardCompact,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={[styles.classTop, { flexDirection: rowDirection }]}>
          <View style={styles.timeTile}>
            <Text style={[styles.timeText, { writingDirection: direction }]}>{time}</Text>
            <Text style={styles.timeSub}>{durationMinutes}m</Text>
          </View>
          <View style={styles.flex}>
            <View style={[styles.classTitleRow, { flexDirection: rowDirection }]}>
              <Text style={[styles.classTitle, { textAlign: align, writingDirection: direction }]} numberOfLines={2}>
                {title}
              </Text>
              <StatusBadge status={spots > 0 ? "open" : "waitlist"} label={statusLabel} />
            </View>
            <View style={[styles.instructorRow, { flexDirection: rowDirection }]}>
              <InstructorAvatar name={session.instructor.displayName} size={24} />
              <Text style={[styles.classMeta, { textAlign: align, writingDirection: direction }]} numberOfLines={1}>
                {session.instructor.displayName}
              </Text>
              <View style={styles.metaSeparator} />
              <Ionicons name="location-outline" size={13} color={colors.gold} style={{ opacity: 0.8 }} />
              <Text style={[styles.classMeta, { textAlign: align, writingDirection: direction }]} numberOfLines={1}>
                {session.roomName}
              </Text>
            </View>
          </View>
        </View>
        {!compact ? <Text style={[styles.classReason, { textAlign: align, writingDirection: direction }]}>{reason}</Text> : null}
        <View style={[styles.classFooter, { flexDirection: rowDirection }]}>
          <View style={styles.capacityTrack}>
            <View style={[styles.capacityFill, { width: `${capacityPercent}%` }]} />
          </View>
          <Text style={[styles.capacityLabel, { textAlign: align, writingDirection: direction }]}>
            {spots > 0
              ? locale === "he"
                ? `${spots} מקומות`
                : `${spots} spots`
              : locale === "he"
                ? `${session.waitlistCount + 1} בהמתנה`
                : `${session.waitlistCount + 1} waiting`}
          </Text>
          <Ionicons name={direction === "rtl" ? "chevron-back" : "chevron-forward"} size={16} color={colors.gold} />
        </View>
        {spots === 0 && !hideWaitlistBadge ? <WaitlistBadge position={session.waitlistCount + 1} odds={insight?.waitlistOdds} /> : null}
      </Pressable>
    </Link>
  );
}

export function ProfileCard({
  title,
  subtitle,
  icon,
  children,
}: PropsWithChildren<{ title: string; subtitle?: string; icon: IconName }>) {
  const { direction, rowDirection, textAlign } = useCopy();
  const align = textAlign;

  return (
    <SurfaceCard>
      <View style={[styles.profileHeader, { flexDirection: rowDirection }]}>
        <View style={styles.profileIcon}>
          <Ionicons name={icon} size={18} color={colors.gold} />
        </View>
        <View style={styles.flex}>
          <Text style={[styles.cardTitle, { textAlign: align, writingDirection: direction }]}>{title}</Text>
          {subtitle ? <Text style={[styles.cardCaption, { textAlign: align, writingDirection: direction }]}>{subtitle}</Text> : null}
        </View>
      </View>
      {children}
    </SurfaceCard>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  const { direction, textAlign } = useCopy();
  const align = textAlign;
  return (
    <SurfaceCard style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="calendar-clear-outline" size={22} color={colors.gold} />
      </View>
      <Text style={[styles.cardTitle, { textAlign: align, writingDirection: direction }]}>{title}</Text>
      <Text style={[styles.cardBody, { textAlign: align, writingDirection: direction }]}>{body}</Text>
      {action}
    </SurfaceCard>
  );
}

export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  const opacity = useRef(new Animated.Value(0.38)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.78, duration: 720, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.38, duration: 720, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <SurfaceCard>
      {Array.from({ length: lines }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.skeletonLine,
            { opacity, width: `${index === 0 ? 72 : index === lines - 1 ? 56 : 92}%` },
          ]}
        />
      ))}
    </SurfaceCard>
  );
}

export function Toast({ message, tone = "success" }: { message: string; tone?: "success" | "warning" | "danger" }) {
  const { direction, rowDirection } = useCopy();
  return (
    <View
      style={[
        styles.toast,
        { flexDirection: rowDirection },
        tone === "warning" && styles.toastWarning,
        tone === "danger" && styles.toastDanger,
      ]}
    >
      <Ionicons
        name={tone === "success" ? "checkmark-circle-outline" : tone === "warning" ? "alert-circle-outline" : "close-circle-outline"}
        size={18}
        color={tone === "success" ? colors.success : tone === "warning" ? colors.warning : colors.danger}
      />
      <Text style={[styles.toastText, { textAlign: direction === "rtl" ? "right" : "left", writingDirection: direction }]}>{message}</Text>
    </View>
  );
}

export function ModalBottomSheet({
  visible,
  title,
  children,
  onClose,
}: PropsWithChildren<{ visible: boolean; title: string; onClose: () => void }>) {
  const { direction, rowDirection, textAlign } = useCopy();
  const insets = useSafeAreaInsets();
  const align = textAlign;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <View style={[styles.sheetHeader, { flexDirection: rowDirection }]}>
          <Text style={[styles.cardTitle, { textAlign: align, writingDirection: direction }]}>{title}</Text>
          <IconButton icon="close" label="Close" onPress={onClose} />
        </View>
        {children}
      </View>
    </Modal>
  );
}

export function ConfirmationDialog({
  visible,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <ModalBottomSheet visible={visible} title={title} onClose={onCancel}>
      <Text style={styles.cardBody}>{body}</Text>
      <View style={styles.sheetActions}>
        <PrimaryButton icon="checkmark-outline" onPress={onConfirm}>
          {confirmLabel}
        </PrimaryButton>
        <SecondaryButton icon="close-outline" onPress={onCancel}>
          {cancelLabel}
        </SecondaryButton>
      </View>
    </ModalBottomSheet>
  );
}

export function StatStrip({
  items,
}: {
  items: { label: string; value: string; tone?: "gold" | "success" | "muted" }[];
}) {
  const { direction, rowDirection } = useCopy();
  return (
    <View style={[styles.statStrip, { flexDirection: rowDirection }]}>
      {items.map((item) => (
        <View key={`${item.label}-${item.value}`} style={styles.statItem}>
          <Text style={[styles.statValue, item.tone === "success" && styles.statSuccess, { writingDirection: direction }]} numberOfLines={1}>
            {item.value}
          </Text>
          <Text style={[styles.statLabel, { writingDirection: direction }]} numberOfLines={2}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function localized(text: LocalizedText, locale: "he" | "en") {
  return text[locale];
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: fitness.appBg,
  },
  screenContent: {
    gap: spacing.lg,
    backgroundColor: fitness.appBg,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerLogo: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  eyebrow: {
    ...typography.label,
    color: colors.gold,
    textTransform: "uppercase",
  },
  screenTitle: {
    ...typography.display,
    color: fitness.textPrimary,
  },
  screenSubtitle: {
    ...typography.body,
    color: fitness.textSecondary,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.ink,
    textAlign: "center",
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: fitness.border,
    backgroundColor: fitness.surfaceRaised,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  secondaryButtonText: {
    ...typography.button,
    color: fitness.textPrimary,
    textAlign: "center",
  },
  dangerButton: {
    borderColor: "rgba(170,63,63,0.24)",
    backgroundColor: fitness.dangerGlow,
  },
  dangerText: {
    color: colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.955 }],
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: fitness.border,
    backgroundColor: fitness.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  surfaceCard: {
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: fitness.border,
    backgroundColor: fitness.surface,
    padding: spacing.lg,
    gap: spacing.md,
  },
  surfaceElevated: {
    backgroundColor: fitness.surfaceRaised,
    borderColor: fitness.borderStrong,
    ...shadows.soft,
  },
  badge: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    maxWidth: 108,
  },
  badgeText: {
    ...typography.caption,
  },
  successBadge: {
    backgroundColor: fitness.successGlow,
    borderColor: "rgba(79,111,97,0.28)",
  },
  successBadgeText: {
    color: colors.success,
  },
  warningBadge: {
    backgroundColor: colors.goldSoft,
    borderColor: "rgba(180,123,42,0.34)",
  },
  warningBadgeText: {
    color: colors.warning,
  },
  dangerBadge: {
    backgroundColor: fitness.dangerGlow,
    borderColor: "rgba(170,63,63,0.24)",
  },
  dangerBadgeText: {
    color: colors.danger,
  },
  waitlistBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.goldSoft,
    borderColor: "rgba(180,123,42,0.28)",
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  waitlistBadgeText: {
    ...typography.caption,
    color: colors.warning,
  },
  avatar: {
    backgroundColor: fitness.goldGlow,
    borderWidth: 1,
    borderColor: fitness.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    ...typography.caption,
    color: colors.gold,
  },
  daySelector: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  dayPill: {
    width: 62,
    borderRadius: radii.fullCard,
    borderWidth: 1,
    borderColor: fitness.border,
    backgroundColor: fitness.surface,
    paddingVertical: spacing.md,
    alignItems: "center",
    gap: 4,
  },
  dayPillSelected: {
    borderColor: fitness.borderStrong,
    backgroundColor: colors.gold,
  },
  dayName: {
    ...typography.caption,
    color: fitness.textMuted,
  },
  dayNameSelected: {
    color: colors.ink,
  },
  dayDate: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "900",
    color: fitness.textPrimary,
  },
  dayDateSelected: {
    color: colors.ink,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.gold,
    marginTop: 2,
  },
  dayDotSelected: {
    backgroundColor: colors.ink,
  },
  metaSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: fitness.borderStrong,
    marginHorizontal: spacing.xs,
    alignSelf: "center",
  },
  heroCard: {
    overflow: "hidden",
    borderRadius: radii.large,
    backgroundColor: fitness.surface,
    borderColor: fitness.borderStrong,
    borderWidth: 1,
    ...shadows.soft,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: fitness.imageScrimStrong,
  },
  heroContent: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.xs,
  },
  heroGreeting: {
    ...typography.label,
    color: colors.gold,
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "900",
    color: colors.ivory,
  },
  heroTitleSmall: {
    fontSize: 19,
    lineHeight: 23,
  },
  heroSubtitle: {
    ...typography.caption,
    color: "#C7CEDD",
    maxWidth: 360,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flexWrap: "wrap",
  },
  heroCta: {
    flexGrow: 1,
  },
  heroMeta: {
    ...typography.bodySmall,
    color: fitness.textSecondary,
    flex: 1,
    minWidth: 128,
  },
  membershipPulse: {
    overflow: "hidden",
    borderColor: colors.gold,
    borderWidth: 1.5,
    backgroundColor: fitness.surfaceRaised,
    ...shadows.premium,
  },
  splitRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  creditOrb: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: fitness.goldGlow,
    borderWidth: 1,
    borderColor: fitness.borderStrong,
  },
  creditValue: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",
    color: colors.gold,
  },
  creditLabel: {
    ...typography.caption,
    color: fitness.textMuted,
  },
  cardTitle: {
    ...typography.h3,
    color: fitness.textPrimary,
  },
  cardBody: {
    ...typography.body,
    color: fitness.textSecondary,
  },
  cardCaption: {
    ...typography.bodySmall,
    color: fitness.textMuted,
  },
  progressTrack: {
    height: 7,
    borderRadius: radii.pill,
    overflow: "hidden",
    backgroundColor: fitness.surfaceSoft,
  },
  progressFill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
  },
  creditBalance: {
    flex: 1,
    minWidth: 120,
    borderRadius: radii.large,
    backgroundColor: fitness.surface,
    borderWidth: 1,
    borderColor: fitness.border,
    padding: spacing.lg,
    gap: 5,
  },
  metricLabel: {
    ...typography.caption,
    color: fitness.textMuted,
  },
  metricValue: {
    fontSize: 28,
    lineHeight: 33,
    fontWeight: "900",
    color: fitness.textPrimary,
  },
  metricCaption: {
    ...typography.bodySmall,
    color: fitness.textSecondary,
  },
  waitlistCta: {
    backgroundColor: colors.warning,
  },
  classCard: {
    borderRadius: radii.medium,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    borderColor: fitness.border,
    backgroundColor: fitness.surfaceRaised,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.soft,
  },
  classCardCompact: {
    padding: spacing.sm,
  },
  cardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.992 }],
  },
  classTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  timeTile: {
    width: 66,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: fitness.borderStrong,
    backgroundColor: fitness.surface,
    paddingVertical: spacing.sm,
    alignItems: "center",
    gap: 3,
  },
  timeText: {
    color: fitness.textPrimary,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "900",
  },
  timeSub: {
    ...typography.caption,
    color: colors.gold,
  },
  classTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  classTitle: {
    ...typography.h3,
    color: fitness.textPrimary,
    flex: 1,
  },
  instructorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: 7,
  },
  classMeta: {
    ...typography.bodySmall,
    color: fitness.textSecondary,
    flex: 1,
  },
  classReason: {
    ...typography.bodySmall,
    color: fitness.textMuted,
  },
  classFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  capacityTrack: {
    flex: 1,
    minWidth: 72,
    height: 7,
    borderRadius: radii.pill,
    overflow: "hidden",
    backgroundColor: fitness.surfaceSoft,
  },
  capacityFill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
  },
  capacityLabel: {
    ...typography.caption,
    color: fitness.textSecondary,
    maxWidth: 104,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: fitness.goldGlow,
    borderWidth: 1,
    borderColor: fitness.borderStrong,
  },
  emptyState: {
    alignItems: "stretch",
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: fitness.goldGlow,
    borderWidth: 1,
    borderColor: fitness.borderStrong,
  },
  skeletonLine: {
    height: 14,
    borderRadius: radii.pill,
    backgroundColor: fitness.surfaceSoft,
    marginVertical: 5,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: "rgba(79,111,97,0.28)",
    backgroundColor: fitness.successGlow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toastWarning: {
    borderColor: "rgba(180,123,42,0.34)",
    backgroundColor: colors.goldSoft,
  },
  toastDanger: {
    borderColor: "rgba(170,63,63,0.24)",
    backgroundColor: fitness.dangerGlow,
  },
  toastText: {
    ...typography.bodySmall,
    color: fitness.textPrimary,
    flex: 1,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.54)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radii.fullCard,
    borderTopRightRadius: radii.fullCard,
    borderWidth: 1,
    borderColor: fitness.border,
    backgroundColor: fitness.surfaceRaised,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  sheetActions: {
    gap: spacing.sm,
  },
  statStrip: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statItem: {
    flex: 1,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: fitness.border,
    backgroundColor: "rgba(12,20,38,0.82)",
    padding: spacing.md,
    gap: 4,
  },
  statValue: {
    ...typography.h3,
    color: colors.gold,
  },
  statSuccess: {
    color: palette.dark.success,
  },
  statLabel: {
    ...typography.caption,
    color: fitness.textMuted,
  },
});
