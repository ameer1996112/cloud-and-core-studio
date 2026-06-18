# Product Requirements Document

## Product

Cloud&Core Studio is a branded bilingual class-booking platform for a boutique Israeli studio. The product includes a customer mobile app, instructor mode, studio admin dashboard, Supabase backend, payment abstraction, notifications, and app-store launch assets.

## Goals

- Let returning customers book a class in under three taps.
- Make Hebrew RTL first-class while preserving English LTR.
- Reduce no-shows with reminders, clear cancellation rules, and smart waitlist promotion.
- Give owners real visibility into occupancy, revenue, retention, attendance, and waitlists.
- Avoid marketplace feel by using Cloud&Core brand colors, imagery, and tone.

## Benchmark Findings

- Arbox positions itself around activities, class scheduling, membership management, payments, CRM, and marketing automation.
- Allout Israel highlights schedule viewing, class signup, friend invite, staff/coach communication, notifications, reminders, profile setup, membership renewal, and merchandise.
- Cielo's current listing focuses on browsing classes, reserving sessions, and schedule management.
- Studio booking platforms commonly ship branded member apps, real-time alerts, waitlist updates, reminders, and payments.

Cloud&Core differentiates with a calmer branded UX, Hebrew-first RTL, clearer membership health, waitlist confirm windows, no-show prevention, instructor mode, account deletion, and provider-neutral Israel-ready payments.

## Personas

- Guest: checks schedule, views class detail, starts trial request, creates account.
- Member: books/cancels classes, joins waitlists, manages membership and notifications.
- Instructor: views assigned classes, marks attendance, writes internal notes, reports issues.
- Admin: manages classes, members, memberships, payments, staff, content, and reports.

## MVP Scope

- Auth-ready app shell with role-aware navigation.
- Public schedule and class detail.
- Booking/cancellation/waitlist flows.
- Membership/package visibility and purchase handoff.
- Push/email notification registration hooks.
- Instructor attendance screen.
- Admin dashboard for schedule, member, booking, payment, and report management.
- Supabase schema with RLS and Edge Function boundaries.

## Non-Goals For First Release

- Hard-coded payment vendor.
- Raw card storage.
- Public marketplace discovery.
- Social network features beyond configured friend invite.
- Placeholder production screens.

## Success Metrics

- Booking completion rate.
- Average taps to book for returning members.
- Occupancy by class category and instructor.
- Waitlist promotion acceptance rate.
- Late cancellation and no-show rates.
- Trial-to-member conversion.
