import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Header, PrimaryButton, SecondaryButton, StatusBadge, SurfaceCard } from "@/components/design-system";
import { useCopy } from "@/i18n/LocaleProvider";
import { hasSupabaseMobileConfig } from "@/lib/availableClasses";
import { colors, fitness, radii, spacing, typography } from "@/theme/colors";

const demoCredentials = {
  email: "demo.customer@cloudcore.local",
  password: "CloudCoreDemo123!",
};

export default function ProfileScreen() {
  const { locale, direction, rowDirection, textAlign } = useCopy();
  const insets = useSafeAreaInsets();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const hasBackend = hasSupabaseMobileConfig();

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: null | (() => void) = null;

    async function loadSession() {
      if (!hasBackend) {
        return;
      }

      const { supabase } = await import("@/lib/supabase");
      const { data } = await supabase.auth.getSession();

      if (isMounted) {
        setSession(data.session);
      }

      const authListener = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
      });

      unsubscribe = () => authListener.data.subscription.unsubscribe();
    }

    loadSession();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [hasBackend]);

  async function signInDemoCustomer() {
    if (!hasBackend || isLoading) {
      return;
    }

    setIsLoading(true);
    setMessage("");
    const { supabase } = await import("@/lib/supabase");
    const { data, error } = await supabase.auth.signInWithPassword(demoCredentials);
    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSession(data.session);
    setMessage(locale === "he" ? "נכנסת לחשבון הדמו." : "Signed in to the demo account.");
  }

  async function signOut() {
    if (!hasBackend || isLoading) {
      return;
    }

    setIsLoading(true);
    setMessage("");
    const { supabase } = await import("@/lib/supabase");
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSession(null);
    setMessage(locale === "he" ? "התנתקת מהחשבון." : "Signed out.");
  }

  const signedIn = Boolean(session);
  const align = textAlign;
  const accountEmail = session?.user.email ?? demoCredentials.email;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 112 + insets.bottom }]}
      >
        <Header
          eyebrow={locale === "he" ? "חשבון" : "Account"}
          title={locale === "he" ? "הפרופיל שלך בסטודיו" : "Your studio profile"}
          subtitle={
            signedIn
              ? locale === "he"
                ? "החשבון מחובר ואפשר להזמין שיעורים אמיתיים."
                : "You are signed in and ready to book real classes."
              : locale === "he"
                ? "התחברי לדמו כדי לראות הזמנות, קרדיטים ומדיניות."
                : "Sign in to the demo to see bookings, credits, and policies."
          }
          action={<StatusBadge status={signedIn ? "success" : "warning"} label={signedIn ? "Live" : "Guest"} />}
        />

        <SurfaceCard elevated style={styles.profileHero}>
          <View style={[styles.identityTop, { flexDirection: rowDirection }]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{signedIn ? "SF" : "G"}</Text>
            </View>
            <View style={styles.identityCopy}>
              <Text style={[styles.label, { textAlign: align, writingDirection: direction }]}>
                {signedIn ? (locale === "he" ? "חשבון פעיל" : "Active account") : locale === "he" ? "חשבון דמו" : "Demo account"}
              </Text>
              <Text style={[styles.email, { textAlign: align, writingDirection: direction }]} numberOfLines={2}>
                {accountEmail}
              </Text>
              <Text style={[styles.body, { textAlign: align, writingDirection: direction }]}>
                {signedIn
                  ? locale === "he"
                    ? "הזמנות נשמרות מול Supabase והקרדיטים מתעדכנים בזמן אמת."
                    : "Bookings save to Supabase and credits update in real time."
                  : locale === "he"
                    ? "הדמו כולל מנוי פעיל כדי לבדוק את חוויית הלקוח."
                    : "The demo includes an active membership for testing the client flow."}
              </Text>
            </View>
          </View>

          <View style={[styles.statsGrid, { flexDirection: rowDirection }]}>
            <MiniStat label={locale === "he" ? "תוכנית" : "Plan"} value={locale === "he" ? "פעיל" : "Active"} />
            <MiniStat label={locale === "he" ? "קרדיטים" : "Credits"} value="7" />
            <MiniStat label={locale === "he" ? "ביטול" : "Cancel"} value="6h" />
          </View>

          {signedIn ? (
            <SecondaryButton icon="log-out-outline" onPress={signOut}>
              {isLoading ? (locale === "he" ? "מתנתק..." : "Signing out...") : locale === "he" ? "התנתקות" : "Sign out"}
            </SecondaryButton>
          ) : (
            <PrimaryButton icon="person-circle-outline" onPress={signInDemoCustomer} disabled={!hasBackend || isLoading}>
              {isLoading
                ? locale === "he"
                  ? "מתחבר..."
                  : "Signing in..."
                : locale === "he"
                  ? "כניסה כלקוח דמו"
                  : "Sign in demo customer"}
            </PrimaryButton>
          )}
        </SurfaceCard>

        <View style={styles.twoCards}>
          <SurfaceCard style={styles.infoCard}>
            <IconBubble name="calendar-outline" />
            <Text style={[styles.cardTitle, { textAlign: align, writingDirection: direction }]}>
              {locale === "he" ? "הזמנות" : "Bookings"}
            </Text>
            <Text style={[styles.body, { textAlign: align, writingDirection: direction }]}>
              {locale === "he" ? "שיעורים קרובים, המתנה וביטולים מרוכזים בלשונית אחת." : "Upcoming classes, waitlists, and cancellations stay in one place."}
            </Text>
          </SurfaceCard>
          <SurfaceCard style={styles.infoCard}>
            <IconBubble name="card-outline" />
            <Text style={[styles.cardTitle, { textAlign: align, writingDirection: direction }]}>
              {locale === "he" ? "תשלומים" : "Payments"}
            </Text>
            <Text style={[styles.body, { textAlign: align, writingDirection: direction }]}>
              {locale === "he" ? "תשלום מאובטח, קרדיטים ומנויים מחוברים לזרימת ההזמנה." : "Secure checkout, credits, and plans are tied to booking."}
            </Text>
          </SurfaceCard>
        </View>

        <SurfaceCard>
          <Text style={[styles.cardTitle, { textAlign: align, writingDirection: direction }]}>
            {locale === "he" ? "מדיניות הסטודיו" : "Studio policy"}
          </Text>
          <PolicyLine text={locale === "he" ? "אפשר לבטל עד 6 שעות לפני השיעור." : "Cancel up to 6 hours before class."} />
          <PolicyLine text={locale === "he" ? "בהמתנה, קרדיט יורד רק אחרי אישור מקום." : "Waitlist credits are used only after a spot is confirmed."} />
          <PolicyLine text={locale === "he" ? "הסטודיו שולח תזכורת לפני כל שיעור." : "The studio sends a reminder before every class."} />
        </SurfaceCard>

        {!hasBackend ? (
          <SurfaceCard>
            <Text style={[styles.body, styles.warning, { textAlign: align, writingDirection: direction }]}>
              {locale === "he" ? "חסרה הגדרת Supabase מקומית." : "Local Supabase configuration is missing."}
            </Text>
          </SurfaceCard>
        ) : null}

        {message ? (
          <SurfaceCard>
            <Text style={[styles.body, { textAlign: align, writingDirection: direction }]}>{message}</Text>
          </SurfaceCard>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

function IconBubble({ name }: { name: React.ComponentProps<typeof Ionicons>["name"] }) {
  return (
    <View style={styles.iconBubble}>
      <Ionicons name={name} size={18} color={colors.success} />
    </View>
  );
}

function PolicyLine({ text }: { text: string }) {
  return (
    <View style={styles.policyLine}>
      <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
      <Text style={styles.policyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: fitness.appBg,
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  profileHero: {
    gap: spacing.lg,
  },
  identityTop: {
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: "rgba(184,138,66,0.32)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.gold,
    fontSize: 22,
    fontWeight: "900",
  },
  identityCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: fitness.textMuted,
    textTransform: "uppercase",
  },
  email: {
    ...typography.h2,
    color: fitness.textPrimary,
  },
  body: {
    ...typography.body,
    color: fitness.textSecondary,
  },
  statsGrid: {
    gap: spacing.sm,
  },
  miniStat: {
    flex: 1,
    minHeight: 82,
    borderRadius: radii.medium,
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: fitness.border,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
  },
  miniStatValue: {
    color: fitness.textPrimary,
    fontSize: 20,
    fontWeight: "900",
  },
  miniStatLabel: {
    color: fitness.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },
  twoCards: {
    gap: spacing.md,
  },
  infoCard: {
    gap: spacing.sm,
  },
  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: fitness.successGlow,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    ...typography.h3,
    color: fitness.textPrimary,
  },
  policyLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  policyText: {
    ...typography.bodySmall,
    color: fitness.textSecondary,
    flex: 1,
  },
  warning: {
    color: colors.warning,
  },
});
