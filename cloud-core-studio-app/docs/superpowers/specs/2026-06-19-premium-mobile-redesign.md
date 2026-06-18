# Cloud&Core Studio Premium Mobile Redesign

## Purpose

The current mobile app works as a class-booking scaffold, but it still feels like a basic scheduling app. The redesign should make Cloud&Core feel meaningfully more premium than common Israeli studio apps such as Arbox and Awan Fit by combining a luxury wellness concierge surface with a smart studio operating system underneath.

The member should not feel like they are using generic scheduling software. They should feel that the studio knows them, guides them, protects their membership value, and helps them choose the right class quickly.

## Design Direction

Recommended direction: **Luxury Wellness Concierge + Smart Studio OS**.

The surface should feel calm, personal, boutique, and high-trust. The logic underneath should feel intelligent: class-fit scores, waitlist odds, membership health, no-show prevention, trial conversion, and owner action queues.

This direction avoids two weaker extremes:

- Pure luxury editorial: beautiful, but can slow down fast booking.
- Pure analytics dashboard: smart, but can feel cold and operational.

Cloud&Core should feel like a private studio assistant: refined visually, useful immediately, and smarter than a timetable.

## Visual Principles

- Use Cloud&Core brand colors with stronger hierarchy: deep navy, warm ivory, restrained gold, powder blue, sand, and slate.
- Reduce the number of equal-weight cards. Use fewer, larger, more intentional modules.
- Use brand/logo and studio imagery as first-class surfaces, not small decorations.
- Create a clear premium rhythm: hero surface, recommendation surface, status surface, then secondary actions.
- Avoid generic dashboard density on the member app.
- Keep RTL Hebrew first-class; English must still feel native and balanced.
- Buttons should feel decisive and contextual, not generic.
- Empty states should be human and studio-branded.

## Home Screen

The home screen becomes a premium command center, not a list of cards.

Top section:

- Full-width branded hero in navy/ivory/gold.
- Cloud&Core logo is prominent.
- Greeting is personal and Hebrew-first.
- Example: `היי נועה, השיעור הבא שלך מוכן`.
- One dominant action: `Book your best class`.

Primary module:

- `Today's recommendation`.
- Shows recommended class, class-fit score, and reasons.
- Example: `Stretch & Flow · 92% fit`.
- Reasons can include:
  - matches your level
  - low capacity pressure
  - inside cancellation window
  - similar to classes you attended
  - fits remaining credits

Next booking module:

- Shows next class, time, room, instructor, and arrival reminder.
- Shows cancellation policy timer clearly.
- Includes add-to-calendar and cancel actions.
- Cancellation CTA should explain consequences before confirming.

Membership health module:

- Shows remaining credits, expiry date, and membership status.
- Uses a premium progress/rhythm visualization.
- Example: `7 credits left · healthy`.
- Shows recommended renewal date when relevant.

Concierge module:

- Shows active studio requests:
  - friend invite
  - freeze request
  - message studio
  - trial request
  - private class inquiry
- Each request has status: sent, seen, approved, needs reply.

## Schedule Screen

The schedule should not be a plain timetable. It should guide the member toward better decisions.

Top selector:

- Replace generic filters with booking intent:
  - `Best for me`
  - `Today`
  - `Beginner safe`
  - `Low capacity`
  - `After work`

Class ordering:

- Returning users see the recommended class first, even if it is not chronologically first.
- Remaining classes can be grouped by day and shown on a refined timeline.

Class row/card content:

- class title
- time and duration
- instructor
- room/location
- available spots
- waitlist status and estimated promotion odds
- class-fit score
- cancellation deadline
- membership eligibility

The schedule should answer: `Which class should I book?` not only `What classes exist?`.

## Class Detail

Class detail should feel like a premium class dossier.

Hero:

- Large title.
- Instructor.
- Level.
- Room.
- Exact booking state.
- Strong context-aware CTA.

Smart fit section:

- `Why this fits you`.
- Shows the reasons the recommendation engine picked this class.
- Example reasons:
  - good for your level
  - fits your remaining credits
  - similar to classes you attended
  - low no-show risk
  - suitable cancellation window

Preparation section:

- `Before you come`.
- Includes:
  - what to wear
  - what not to bring
  - arrival time
  - health or waiver reminder
  - studio rules

CTA rules:

- If class is open: `Reserve my place`.
- If class is full: `Join priority waitlist`.
- If member lacks package: `Buy package to book`.
- If exception applies: `Ask studio`.

Waitlist detail:

- current position
- estimated chance
- confirmation timeout
- option to enable urgent waitlist notification

## Membership

Membership should feel like a relationship with the studio, not just a credit counter.

Main concept: `Membership health`.

The membership screen shows:

- plan name
- remaining credits
- expiry date
- usage pace
- recommended renewal date
- freeze eligibility
- trial-to-member offer when relevant

Examples:

- `You're on pace for 2 classes/week`.
- `Renew by Aug 24 to keep your rhythm`.
- `7 credits left · healthy`.

Package purchase:

- Do not present packages as a generic price list.
- Frame packages around member intent:
  - `Start gently`
  - `Stay consistent`
  - `Deep practice`
- Each plan explains who it fits and how many weeks it usually lasts.
- Payment remains provider-neutral behind the scenes.

## Concierge

Concierge is a key differentiator from basic booking apps.

For the next implementation pass, Concierge should be a major module on Home and Profile, not a new tab. A dedicated Concierge tab can be considered after the premium home, schedule, class detail, and membership surfaces are working well.

Actions:

- message studio
- invite a friend
- request freeze
- ask about private class
- request trial class
- report issue

Every request has status tracking:

- sent
- seen
- approved
- needs reply

Concierge copy should sound like the studio, not like software support.

## Notifications

Notification preferences should feel premium and understandable.

Preference groups:

- essential only
- booking help
- studio updates
- membership reminders

Reminder logic:

- stronger reminders for high no-show risk
- gentler reminders for reliable members
- waitlist promotions with clear timeout
- membership expiry reminders tied to usage rhythm

Expo Go has notification limitations. Full push behavior should be tested in a development build.

## Admin / Owner Experience

The admin dashboard should become an owner cockpit, not a back-office table.

Owner home:

- occupancy
- revenue
- no-show risk
- waitlist pressure
- trial leads
- expiring memberships

Needs attention queue:

- classes likely to underfill
- members about to expire
- waitlist promotions waiting
- freeze requests
- unpaid packages
- high no-show members

One-click actions:

- send reminder
- open extra spot
- promote waitlist
- message class
- create follow-up offer

Class management:

- projected occupancy
- actual occupancy
- waitlist pressure
- cancellation risk
- instructor
- revenue estimate

Owner suggestions:

- `Add another Stretch & Flow on Thursday`.
- `This class underfills when opened after 18:00`.
- `Maya's beginner class converts trials best`.

Member management:

- credits
- attendance rhythm
- no-show history
- renewal likelihood
- last contact
- internal notes
- recommended next action

Segments:

- new trials
- healthy members
- at-risk renewals
- inactive
- frequent waitlist users

Reports should focus on decisions, not decorative charts.

## Implementation Scope For Next Pass

The next implementation should focus on the member mobile experience first.

In scope:

- premium home redesign
- schedule intent selector
- recommendation-first schedule ordering
- premium class detail dossier
- membership health module
- concierge module
- richer fixture data for smart states
- theme expansion for premium surfaces
- RTL-safe layout for all changed screens
- verification through typecheck, tests, Expo dependency check, and iOS export bundle

Out of scope for this redesign pass:

- real recommendation backend
- real payment provider integration
- complete admin redesign
- push notification development build
- full Supabase wiring for every screen

The UI should use fixture-backed smart states now, with clean data boundaries so real Supabase data can replace fixtures later.

## Acceptance Criteria

- The first screen no longer resembles a generic card dashboard.
- The member sees one dominant recommended action immediately.
- Schedule helps choose the right class, not only browse times.
- Class detail explains why to book and what to expect.
- Membership status feels like health/rhythm, not only credits.
- Concierge creates a direct studio relationship.
- Hebrew RTL and English LTR both remain usable.
- Existing booking-rule tests still pass.
- `npm run typecheck` passes.
- `npm test` passes.
- `npx expo install --check` passes.
- `npx expo export --platform ios` succeeds.

## Risks

- Overloading the home screen with intelligence can make it feel busy. The design must prioritize one primary recommendation.
- Too many scores can feel cold. Scores should be paired with human reasons.
- Premium visual treatment should not slow down returning-user booking.
- Fixture-backed smart states must be clearly structured so they do not become fake hard-coded product logic.
