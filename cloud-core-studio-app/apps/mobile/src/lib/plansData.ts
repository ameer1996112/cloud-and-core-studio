import { hasSupabaseMobileConfig } from "@/lib/availableClasses";

export interface PlanCard {
  id: string;
  name: string;
  planType: string;
  priceMinor: number;
  currency: string;
  credits: number | null;
  durationDays: number | null;
  isUnlimited: boolean;
}

export interface PlanRow {
  id: string;
  name_en: string;
  name_he: string;
  plan_type: string;
  price_minor: number;
  currency: string;
  credits: number | null;
  duration_days: number | null;
  is_active: boolean;
}

export function mapPlanRow(row: PlanRow, locale: "he" | "en" = "en"): PlanCard {
  return {
    id: row.id,
    name: locale === "he" ? row.name_he : row.name_en,
    planType: row.plan_type,
    priceMinor: row.price_minor,
    currency: row.currency,
    credits: row.credits,
    durationDays: row.duration_days,
    isUnlimited: row.credits === null,
  };
}

/** Format minor units (agorot) as a localized ILS price. */
export function formatPrice(priceMinor: number, currency = "ILS", locale: "he" | "en" = "en"): string {
  const amount = priceMinor / 100;
  try {
    return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₪${amount}`;
  }
}

export interface PlansResult {
  plans: PlanCard[];
  isLive: boolean;
  error: string | null;
}

export async function loadPlans(locale: "he" | "en" = "en"): Promise<PlansResult> {
  if (!hasSupabaseMobileConfig()) {
    return { plans: [], isLive: false, error: null };
  }

  const { supabase } = await import("@/lib/supabase");
  const { data, error } = await supabase
    .from("membership_plans")
    .select("id, name_en, name_he, plan_type, price_minor, currency, credits, duration_days, is_active")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("price_minor", { ascending: true });

  if (error) {
    return { plans: [], isLive: false, error: error.message };
  }

  return {
    plans: ((data ?? []) as PlanRow[]).map((row) => mapPlanRow(row, locale)),
    isLive: true,
    error: null,
  };
}
