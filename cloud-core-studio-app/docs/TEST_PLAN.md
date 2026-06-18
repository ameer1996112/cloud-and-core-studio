# Test Plan

## Unit Tests

- Booking eligibility: capacity, expired membership, no credits, closed class.
- Cancellation policy: inside/outside window, returned credit, late cancellation.
- Waitlist promotion: FIFO, confirm timeout, manual promotion override.
- Payment normalization: pending, paid, failed, refunded, partially refunded.

## Integration Tests

- Member books an open class through Supabase RPC.
- Member cancels and the next waitlist entry is offered.
- Payment webhook updates payment and inserts a payment event.
- Instructor can read only assigned classes and mark attendance.
- Admin can manage sessions and members.

## End-To-End Tests

- Guest views schedule, signs up, accepts legal documents, and books a trial.
- Returning member books a class in under three taps from home.
- Full class routes user to waitlist and sends promotion notification later.
- Admin creates a recurring class template and publishes sessions.
- Instructor marks attendance from mobile.

## Device QA

- Real iPhone with push token.
- Real Android with notification channel.
- Hebrew RTL smoke test on every primary screen.
- English LTR smoke test on every primary screen.
- Accessibility labels and dynamic text sizing pass.
