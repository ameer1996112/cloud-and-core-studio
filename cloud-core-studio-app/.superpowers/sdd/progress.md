# Subagent-driven development progress

Task 1: complete (commits 337b3e6..7f6f8d2, review clean)
Task 2: complete (commits 7f6f8d2..8a623a3, review clean after fix)
Task 3: complete (commits 8a623a3..98860de, review clean)
Task 4: complete (commits 98860de..52e588b, review clean after fix)
Task 5: complete (commits 52e588b..377697b, review clean)

## Production hardening (adapt-existing-monorepo track)

PH-1 Core booking business rules (DONE)
- Migration 202606200004_booking_business_rules.sql: credit_charged column, log_activity(),
  session_cancellation_minutes(), rebuilt book_class (credit_charged + activity log),
  promote_waitlist(), cancel_booking() (early refund + late no-refund + auto-promote),
  mark_attendance(), admin_adjust_credits(). Seeded real plans (₪280/₪350/₪2800).
  app_settings seeded (timezone, deadline, auto-promote, booking window).
- Verified live against local Postgres + supabase/tests/booking_rules_test.sql (8 assertions PASS).

PH-2 Admin authentication + role gating (DONE) — was a critical hole (service-role, no auth)
- @supabase/ssr cookie clients (server/browser), requireAdmin() guard, middleware route gating,
  /login + /forbidden pages, AdminGuard + SignOutButton, AdminGuard wired into all admin pages.
- Migration 202606200005_service_role_grants.sql (service_role table privileges).
- supabase/scripts/create-admin.mjs (idempotent admin bootstrap).
- Verified: unauth GET / /members /classes -> 307 /login; admin sign-in via GoTrue OK;
  admin build OK; typecheck + all JS tests green.

NEXT: customer-side membership/booking surfacing, Stripe checkout + webhook->membership,
admin class CRUD completeness (cancel/duplicate/attendance UI), reports wired to live data.

PH-3 Stripe payments (DONE — logic verified; edge HTTP runtime blocked in sandbox)
- Migration 202606200006_stripe_payments.sql: stripe ids on plans/memberships/payments,
  unique idempotency indexes, activate_membership_for_payment() (idempotent),
  record_failed_payment(), mark_subscription_cancelled().
- Edge functions: stripe-checkout (JWT-gated checkout session create + pending payment row),
  stripe-webhook (signature verify via constructEventAsync -> shared mapper -> DB RPCs).
- _shared/stripeEvents.ts pure mapper + 10 Node tests (all event types, double-activation guards).
- config.toml: verify_jwt flags per function.
- Verified: activate idempotency + credits + failed-payment-no-membership against live DB;
  mapper unit tests 10/10. Edge HTTP boot blocked by sandbox (esm.sh egress) — same error on
  pre-existing payment-webhook, so environmental not code. Needs live Stripe test keys to e2e.

NEXT: customer-side membership/booking surfacing (mobile), admin class CRUD completeness
(cancel/duplicate/attendance UI), members management UI, reports wired to live data.
