# Cloud&Core Studio Platform

Production-oriented monorepo for the Cloud&Core Studio iOS/Android member app, web admin dashboard, Supabase backend, and launch documentation.

## Apps

- `apps/mobile`: Expo React Native app with RTL/LTR support, schedule browsing, booking, waitlist, memberships, notifications, and instructor mode entry points.
- `apps/admin`: Next.js App Router dashboard for studio owners and staff.
- `packages/shared`: shared domain types, booking rules, payment abstractions, and copy keys.
- `supabase`: database schema, RLS policies, and Edge Functions.
- `docs`: PRD, sitemap, user stories, API design, and launch readiness notes.

## Local Setup

1. Copy `.env.example` to `.env.local` in the relevant app folders.
2. Start Supabase locally from this folder with `npm run supabase:start`.
3. Apply schema with `npm run supabase:reset`.
4. Start the admin dashboard with `npm run dev:admin`.
5. Start the mobile app with `npm run dev:mobile`.

## Architecture Notes

- Supabase RLS is the primary data boundary. The admin dashboard uses server-side privileged routes only where required.
- Payment support is provider-neutral. Providers implement the shared payment interface and send signed webhooks to Edge Functions.
- Booking and waitlist decisions are duplicated in shared TypeScript for UX feedback, but authoritative writes happen in PostgreSQL/Edge Functions.
- Hebrew is treated as first-class: every screen reads direction from locale and keeps layout RTL-safe.
