# API Design

Supabase auto-generates REST and realtime APIs from PostgreSQL. Client writes should prefer RPC functions or Edge Functions for booking, cancellation, waitlist promotion, and payment updates.

## Public Reads

- `GET /class_sessions?status=in.(open,full,waitlist)&starts_at=gte.now()`
- `GET /class_categories`
- `GET /instructors`
- `GET /legal_documents?is_published=eq.true`

## Authenticated Member Operations

- `book_class(session_id uuid, entitlement_id uuid)`
- `cancel_booking(booking_id uuid)`
- `join_waitlist(session_id uuid)`
- `leave_waitlist(waitlist_entry_id uuid)`
- `request_account_deletion(reason text)`
- `update_notification_preferences(profile_id uuid, preferences jsonb)`

## Admin Operations

- `create_class_session`
- `duplicate_class_session`
- `cancel_class_session`
- `manual_waitlist_promote`
- `freeze_membership`
- `export_report`
- `send_announcement`

## Edge Functions

- `payment-webhook`: verifies payment-provider signatures and updates payment state.
- `waitlist-promote`: promotes the next eligible waitlist entry when a booking is cancelled.
- `send-notification`: sends push/email and records delivery status.

## Payment Provider Contract

Providers must implement:

- `createCheckout`
- `refund`
- `verifyWebhook`

The app stores provider IDs, external payment IDs, normalized payment status, and raw webhook payloads for audit. It never stores raw card data.
