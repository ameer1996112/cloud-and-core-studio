import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { StyleSheet, Text, View } from "react-native";
import { Header, PrimaryButton, SecondaryButton, StatusBadge, SurfaceCard } from "@/components/design-system";
import { useCopy } from "@/i18n/LocaleProvider";
import { hasSupabaseMobileConfig } from "@/lib/availableClasses";
import { fitness, spacing, typography } from "@/theme/colors";

const demoCredentials = {
  email: "demo.customer@cloudcore.local",
  password: "CloudCoreDemo123!",
};

export default function ProfileScreen() {
  const { locale, direction, textAlign } = useCopy();
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

  return (
    <View style={styles.safe}>
      <View style={styles.content}>
        <Header
          eyebrow={locale === "he" ? "פרופיל" : "Profile"}
          title={locale === "he" ? "חשבון לקוח" : "Customer account"}
          subtitle={
            signedIn
              ? locale === "he"
                ? "הזמנות יישמרו מול Supabase."
                : "Bookings are saved against Supabase."
              : locale === "he"
                ? "התחברי כדי לבצע הזמנה אמיתית."
                : "Sign in to place a real booking."
          }
          action={<StatusBadge status={signedIn ? "open" : "waitlist"} label={signedIn ? "Live" : "Guest"} />}
        />

        <SurfaceCard elevated>
          <View style={styles.identityBlock}>
            <Text style={[styles.label, { textAlign: align, writingDirection: direction }]}>
              {locale === "he" ? "חשבון פעיל" : "Active account"}
            </Text>
            <Text style={[styles.email, { textAlign: align, writingDirection: direction }]}>
              {session?.user.email ?? demoCredentials.email}
            </Text>
            <Text style={[styles.body, { textAlign: align, writingDirection: direction }]}>
              {signedIn
                ? locale === "he"
                  ? "אפשר להזמין שיעורי דמו מהרשימה החיה."
                  : "You can book demo classes from the live schedule."
                : locale === "he"
                  ? "חשבון הדמו כולל מנוי פעיל וקרדיטים."
                  : "The demo account has an active plan and credits."}
            </Text>
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

        {!hasBackend ? (
          <SurfaceCard>
            <Text style={[styles.body, styles.warning, { textAlign: align, writingDirection: direction }]}>
              {locale === "he"
                ? "חסרה הגדרת Supabase מקומית."
                : "Local Supabase configuration is missing."}
            </Text>
          </SurfaceCard>
        ) : null}

        {message ? (
          <SurfaceCard>
            <Text style={[styles.body, { textAlign: align, writingDirection: direction }]}>{message}</Text>
          </SurfaceCard>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: fitness.appBg,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  identityBlock: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: fitness.textSecondary,
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
  warning: {
    color: "#A66A1F",
  },
});
