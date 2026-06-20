import { useCallback, useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  EmptyState,
  Header,
  LoadingSkeleton,
  PrimaryButton,
  StatusBadge,
  SurfaceCard,
  Toast,
} from "@/components/design-system";
import { useCopy } from "@/i18n/LocaleProvider";
import { hasSupabaseMobileConfig } from "@/lib/availableClasses";
import { createCheckoutSession, loadMyMembership } from "@/lib/memberApi";
import type { MembershipSummary } from "@/lib/membershipData";
import { formatPrice, loadPlans, type PlanCard } from "@/lib/plansData";
import { colors, fitness, spacing, typography } from "@/theme/colors";

function planBenefit(plan: PlanCard, locale: "he" | "en"): string {
  if (plan.isUnlimited) {
    return locale === "he" ? "שיעורים ללא הגבלה" : "Unlimited classes";
  }
  return locale === "he" ? `${plan.credits} כניסות` : `${plan.credits} class credits`;
}

function planDuration(plan: PlanCard, locale: "he" | "en"): string {
  if (!plan.durationDays) return "";
  if (plan.durationDays >= 365) return locale === "he" ? "תוקף לשנה" : "Valid 1 year";
  if (plan.durationDays >= 30) {
    const months = Math.round(plan.durationDays / 30);
    return locale === "he" ? `תוקף ${months} חודשים` : `Valid ${months} month${months > 1 ? "s" : ""}`;
  }
  return locale === "he" ? `תוקף ${plan.durationDays} ימים` : `Valid ${plan.durationDays} days`;
}

export default function PlansScreen() {
  const { locale, direction, textAlign } = useCopy();
  const insets = useSafeAreaInsets();
  const hasBackend = hasSupabaseMobileConfig();

  const [plans, setPlans] = useState<PlanCard[]>([]);
  const [membership, setMembership] = useState<MembershipSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "warning" | "danger" } | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const [plansResult, membershipResult] = await Promise.all([loadPlans(locale), loadMyMembership(locale)]);
    if (plansResult.error) setError(plansResult.error);
    setPlans(plansResult.plans);
    setMembership(membershipResult.membership);
  }, [locale]);

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      await load();
      if (active) setIsLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [load]);

  async function handlePurchase(plan: PlanCard) {
    setCheckoutPlanId(plan.id);
    setToast(null);
    const result = await createCheckoutSession(plan.id);
    setCheckoutPlanId(null);

    if ("url" in result) {
      const canOpen = await Linking.canOpenURL(result.url);
      if (canOpen) {
        await Linking.openURL(result.url);
        return;
      }
      setToast({ message: locale === "he" ? "לא ניתן לפתוח את התשלום." : "Could not open checkout.", tone: "danger" });
      return;
    }

    const messages: Record<string, string> = {
      not_signed_in: locale === "he" ? "התחברו תחילה בלשונית הפרופיל." : "Sign in from the Profile tab first.",
      backend_unavailable: locale === "he" ? "התשלום אינו זמין כעת." : "Payments are unavailable right now.",
    };
    setToast({
      message: messages[result.error] ?? (locale === "he" ? "פתיחת התשלום נכשלה." : "Could not start checkout."),
      tone: "danger",
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Header
          eyebrow={locale === "he" ? "מנויים" : "Plans"}
          title={locale === "he" ? "בחרו תוכנית" : "Choose a plan"}
          subtitle={locale === "he" ? "תשלום מאובטח דרך Stripe." : "Secure checkout powered by Stripe."}
        />

        {membership ? (
          <SurfaceCard elevated>
            <View style={styles.rowBetween}>
              <Text style={[styles.currentLabel, { textAlign, writingDirection: direction }]}>
                {locale === "he" ? "התוכנית הנוכחית" : "Current plan"}
              </Text>
              <StatusBadge status="success" label={membership.planName} />
            </View>
            <Text style={[styles.currentCredits, { textAlign, writingDirection: direction }]}>
              {membership.isUnlimited
                ? locale === "he" ? "שיעורים ללא הגבלה" : "Unlimited classes"
                : locale === "he"
                  ? `${membership.remainingCredits ?? 0} קרדיטים נותרו`
                  : `${membership.remainingCredits ?? 0} credits remaining`}
            </Text>
          </SurfaceCard>
        ) : null}

        {error ? (
          <SurfaceCard>
            <Text style={[styles.body, styles.errorText, { textAlign, writingDirection: direction }]}>
              {locale === "he" ? "טעינת התוכניות נכשלה." : "Could not load plans."}
            </Text>
          </SurfaceCard>
        ) : null}

        {isLoading ? (
          <SurfaceCard>
            <LoadingSkeleton lines={4} />
          </SurfaceCard>
        ) : plans.length === 0 ? (
          <EmptyState
            title={locale === "he" ? "אין תוכניות זמינות" : "No plans available"}
            body={locale === "he" ? "התוכניות יתווספו בקרוב." : "Plans will be available soon."}
          />
        ) : (
          <View style={styles.list}>
            {plans.map((plan) => (
              <SurfaceCard key={plan.id} elevated style={styles.planCard}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.planName, { textAlign, writingDirection: direction }]}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{formatPrice(plan.priceMinor, plan.currency, locale)}</Text>
                </View>
                <Text style={[styles.benefit, { textAlign, writingDirection: direction }]}>{planBenefit(plan, locale)}</Text>
                {planDuration(plan, locale) ? (
                  <Text style={[styles.duration, { textAlign, writingDirection: direction }]}>{planDuration(plan, locale)}</Text>
                ) : null}
                <PrimaryButton
                  icon="card-outline"
                  disabled={!hasBackend || checkoutPlanId !== null}
                  onPress={() => handlePurchase(plan)}
                >
                  {checkoutPlanId === plan.id
                    ? locale === "he" ? "פותח תשלום..." : "Opening checkout..."
                    : locale === "he" ? "רכישה" : "Purchase"}
                </PrimaryButton>
              </SurfaceCard>
            ))}
          </View>
        )}

        {!hasBackend ? (
          <SurfaceCard>
            <Text style={[styles.body, styles.warning, { textAlign, writingDirection: direction }]}>
              {locale === "he" ? "חסרה הגדרת Supabase מקומית." : "Local Supabase configuration is missing."}
            </Text>
          </SurfaceCard>
        ) : null}
      </ScrollView>

      {toast ? (
        <View style={[styles.toastWrap, { bottom: 90 + insets.bottom }]} pointerEvents="none">
          <Toast message={toast.message} tone={toast.tone} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: fitness.appBg },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.md },
  list: { gap: spacing.md },
  planCard: { gap: spacing.xs },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.sm },
  planName: { ...typography.h3, color: fitness.textPrimary, flex: 1 },
  planPrice: { ...typography.h2, color: colors.gold, fontWeight: "700" },
  benefit: { ...typography.body, color: fitness.textPrimary, marginTop: spacing.xs },
  duration: { ...typography.caption, color: fitness.textSecondary, marginBottom: spacing.sm },
  currentLabel: { ...typography.label, color: fitness.textSecondary, textTransform: "uppercase" },
  currentCredits: { ...typography.body, color: fitness.textPrimary, marginTop: spacing.xs },
  body: { ...typography.body, color: fitness.textSecondary },
  errorText: { marginBottom: spacing.xs },
  warning: { color: "#A66A1F" },
  toastWrap: { position: "absolute", left: spacing.lg, right: spacing.lg },
});
