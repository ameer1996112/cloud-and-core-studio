import type { MembershipStatus } from "@cloud-core/shared";

export interface MembershipSummary {
  membershipId: string;
  planName: string;
  planType: string;
  status: MembershipStatus;
  remainingCredits: number | null; // null => unlimited
  isUnlimited: boolean;
  expiresAt: string | null;
  startsAt: string;
  canBook: boolean;
}

export interface MembershipRow {
  id: string;
  status: string;
  starts_at: string;
  expires_at: string | null;
  remaining_credits: number | null;
  membership_plans:
    | { name_en: string; name_he: string; plan_type: string }
    | Array<{ name_en: string; name_he: string; plan_type: string }>
    | null;
}

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

/**
 * A membership lets the member book when it is active, not expired, and either
 * unlimited or has credits remaining. Mirrors the DB book_class eligibility.
 */
export function isMembershipBookable(row: MembershipRow, now = new Date()): boolean {
  if (row.status !== "active") return false;
  if (row.expires_at && new Date(row.expires_at) <= now) return false;
  if (row.remaining_credits !== null && row.remaining_credits <= 0) return false;
  return true;
}

export function mapMembershipRow(row: MembershipRow, locale: "he" | "en" = "en"): MembershipSummary {
  const plan = relationOne(row.membership_plans);
  const isUnlimited = row.remaining_credits === null;
  return {
    membershipId: row.id,
    planName: plan ? (locale === "he" ? plan.name_he : plan.name_en) : "Membership",
    planType: plan?.plan_type ?? "unknown",
    status: row.status as MembershipStatus,
    remainingCredits: row.remaining_credits,
    isUnlimited,
    expiresAt: row.expires_at,
    startsAt: row.starts_at,
    canBook: isMembershipBookable(row),
  };
}

/**
 * Pick the member's "best" current membership to surface: prefer one that can
 * book, then the latest-starting. Returns null when there is no membership.
 */
export function selectActiveMembership(rows: MembershipRow[], now = new Date()): MembershipRow | null {
  const sorted = [...rows].sort((a, b) => {
    const aBookable = isMembershipBookable(a, now) ? 0 : 1;
    const bBookable = isMembershipBookable(b, now) ? 0 : 1;
    if (aBookable !== bBookable) return aBookable - bBookable;
    return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime();
  });
  return sorted[0] ?? null;
}
