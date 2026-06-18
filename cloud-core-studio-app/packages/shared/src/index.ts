export type Locale = "he" | "en";
export type Direction = "rtl" | "ltr";

export type UserRole = "guest" | "member" | "instructor" | "admin";
export type BookingStatus =
  | "confirmed"
  | "cancelled"
  | "late_cancelled"
  | "no_show"
  | "completed";
export type SessionStatus = "draft" | "open" | "full" | "waitlist" | "closed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
export type MembershipStatus = "active" | "frozen" | "expired" | "cancelled";

export interface Profile {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  locale: Locale;
  direction: Direction;
  roles: UserRole[];
}

export interface Instructor {
  id: string;
  profileId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
}

export interface ClassCategory {
  id: string;
  nameHe: string;
  nameEn: string;
  color: string;
}

export interface ClassSession {
  id: string;
  categoryId: string;
  titleHe: string;
  titleEn: string;
  startsAt: string;
  endsAt: string;
  instructor: Instructor;
  roomName: string;
  level: "beginner" | "all_levels" | "intermediate" | "advanced";
  capacity: number;
  bookedCount: number;
  waitlistCount: number;
  status: SessionStatus;
  cancellationWindowHours: number;
  descriptionHe: string;
  descriptionEn: string;
  equipmentHe: string[];
  equipmentEn: string[];
}

export interface MemberEntitlement {
  membershipId: string;
  planName: string;
  status: MembershipStatus;
  remainingCredits: number | null;
  expiresAt: string | null;
  canBook: boolean;
}

export interface BookingDecision {
  allowed: boolean;
  mode: "book" | "waitlist" | "blocked";
  reason?: string;
}

export function getDirection(locale: Locale): Direction {
  return locale === "he" ? "rtl" : "ltr";
}

export function decideBooking(
  session: Pick<ClassSession, "capacity" | "bookedCount" | "status">,
  entitlement: Pick<MemberEntitlement, "canBook" | "remainingCredits" | "status"> | null,
): BookingDecision {
  if (session.status === "cancelled" || session.status === "closed") {
    return { allowed: false, mode: "blocked", reason: "class_closed" };
  }

  if (!entitlement || !entitlement.canBook || entitlement.status !== "active") {
    return { allowed: false, mode: "blocked", reason: "membership_required" };
  }

  if (entitlement.remainingCredits !== null && entitlement.remainingCredits <= 0) {
    return { allowed: false, mode: "blocked", reason: "no_credits" };
  }

  if (session.bookedCount >= session.capacity) {
    return { allowed: true, mode: "waitlist", reason: "class_full" };
  }

  return { allowed: true, mode: "book" };
}

export interface PaymentProvider {
  id: string;
  createCheckout(input: CheckoutRequest): Promise<CheckoutResult>;
  refund(input: RefundRequest): Promise<RefundResult>;
  verifyWebhook(rawBody: string, signature: string): Promise<PaymentWebhookEvent>;
}

export interface CheckoutRequest {
  memberId: string;
  planId: string;
  amountMinor: number;
  currency: "ILS";
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}

export interface CheckoutResult {
  providerPaymentId: string;
  redirectUrl: string;
  status: PaymentStatus;
}

export interface RefundRequest {
  providerPaymentId: string;
  amountMinor?: number;
  reason: string;
}

export interface RefundResult {
  providerRefundId: string;
  status: PaymentStatus;
}

export interface PaymentWebhookEvent {
  providerPaymentId: string;
  status: PaymentStatus;
  amountMinor: number;
  currency: "ILS";
  occurredAt: string;
  raw: unknown;
}
