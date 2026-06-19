# Premium Dark Fitness Mobile Redesign

## Purpose

The current mobile app is functional and calm, but it does not yet feel competitive with premium fitness apps such as Awan Fit or Arbox-style member experiences. The interface still reads as a basic AI-generated wellness app because it is too quiet, too card-light without enough product energy, and not visually assertive enough for daily booking behavior.

This spec supersedes the boutique editorial visual direction. The app should still feel premium and studio-owned, but the product language must become more eye-catching, energetic, and commercially polished.

## Approved Direction

- Direction: premium dark fitness app with warm boutique studio details.
- Base mood: deep navy/black, ivory text, gold action accents, electric powder-blue highlights, and strong class photography.
- Competitive target: feel closer to modern fitness booking apps than a calm wellness brochure.
- Energy: confident, high-contrast, trainer-led, social, and fast to act on.
- Implementation posture: redesign the mobile member app surfaces in place, without changing backend scope or tab structure.

## Visual Thesis

Cloud&Core should feel like a premium fitness club app at night: dark, crisp, photo-led, and highly actionable, with warm gold details that keep the studio human instead of corporate.

## Content Plan

1. Home: immersive dark hero with class photo, bold brand title, today recommendation, membership pulse, and one strong booking CTA.
2. Schedule: energetic class feed with large time hierarchy, image thumbnails, availability bars, and clear book/waitlist actions.
3. Class detail: cinematic class page with sticky booking action, instructor context, smart match reasons, and waitlist confidence.
4. Bookings: upcoming reservation command center with calendar/cancel actions, arrival details, and local status feedback.
5. Profile: premium member account with membership tier, credits, studio care, language, notifications, and account controls.

## Interaction Thesis

- First screen should feel alive: hero fades in, recommendation lifts into place, and the CTA has a clear pressed state.
- Schedule cards should behave like real app surfaces: selected states, active filters, and quick actions are obvious.
- Class detail should keep the booking action visible near the bottom so the member never has to hunt for the next step.

## Design Principles

- Dark app shell first. The app should not look like a white brochure.
- Photography must be large enough to carry emotion and class energy.
- Use fewer, stronger surfaces: hero, class card, action bar, status strip.
- Make CTAs visually decisive. Primary actions use deep navy/gold contrast or gold on dark.
- Make status readable at a glance: available, waitlist, booked, credits, renewal, and notification state.
- Keep Hebrew RTL and English LTR polished. Dark UI must not reduce readability.
- Avoid generic AI wellness copy. Use short product copy that sounds like a real studio app.
- Avoid cloning any competitor. Use the competitive category language while keeping Cloud&Core's brand palette and studio identity.

## Visual System

### Palette

Keep the existing brand colors but rebalance their use:

- `ink`: main app background, near black navy.
- `navy`: elevated surfaces and deep controls.
- `ivory`: primary text on dark.
- `gold`: primary CTA and important accents.
- `blue`: active state, class tags, and secondary highlights.
- `sand`: subtle borders and dark-mode separators with opacity.
- `slate`: secondary text, never the main text on dark.

Add dark-mode tokens rather than replacing the brand palette:

- app background: `#050914`
- elevated surface: `#0B1224`
- raised surface: `#111B31`
- glass surface: translucent navy over imagery
- gold glow: transparent gold for active states
- blue glow: transparent powder blue for focus/selected states

### Typography

- Home hero uses large, bold title treatment.
- Class cards use strong title and time hierarchy.
- Section titles should be compact but confident.
- Body copy stays short. No long paragraphs on Home or Schedule.

### Shape And Depth

- Use 16-24px radii for hero and class cards.
- Keep rounded pills only for clear filters or compact status.
- Use dark shadows and hairline borders sparingly.
- Avoid many equal cards stacked vertically. Each surface needs a distinct role.

## Home Screen

Home becomes the premium entry point, not a quiet editorial cover.

### Hero

- Full-width dark hero with a high-impact studio/class image.
- Text overlays the image with a dark scrim.
- Cloud&Core Studio is prominent.
- The hero includes:
  - personal greeting
  - today's recommended class
  - time and instructor
  - availability or waitlist state
  - one primary CTA
- Add a compact membership pulse row under the CTA: credits, next renewal, and weekly rhythm.

### Smart Recommendation

The recommendation must look like a premium app decision, not a data widget.

- Keep smart matching, but do not lead with "fit score."
- Use copy like "Best match today" or Hebrew equivalent.
- Show reasons as concise rows with icon-like markers or short labels.
- The primary action is visually dominant.

### Supporting Status

- Concierge and membership become dark status strips.
- They should look like app-native product modules, not brochure sections.
- Active requests and membership warnings use clear accent states.

## Schedule Screen

Schedule should become a premium class feed.

- Use a dark background.
- Keep intent filters but make them tactile and visibly selected.
- Recommended class appears first with a larger treatment.
- Other classes use strong rows/cards with:
  - time
  - class title
  - instructor
  - room
  - availability count or waitlist
  - one compact action
- Add subtle visual differentiation for full/waitlist classes.
- Avoid filter overload. The first read should be class, time, and action.

## Class Detail Screen

Class detail should feel cinematic and conversion-focused.

- Top image hero with class title, instructor, and time.
- Replace static bottom-only CTA with a sticky booking bar.
- Booking bar shows:
  - action label
  - local state after press
  - waitlist or blocked state when relevant
- "Why this fits" should use short, polished rows.
- Preparation information should be practical and secondary.
- Waitlist intelligence should feel useful, not game-like.

## Bookings Screen

Bookings should feel like a member command center.

- Dark elevated reservation card.
- Next booking is visually clear with time, class, instructor/room, and status.
- Calendar and cancel buttons remain local for now but must feel real:
  - saved state changes label and styling
  - canceled state disables actions and updates status
- Add a compact studio note section using existing fixture data where available, or short local copy when no fixture field exists.

## Profile Screen

Profile should feel like premium account care.

- Member identity and membership tier are the first read.
- Membership credits and renewal appear as a dark premium panel.
- Concierge appears as a studio-care module.
- Language and notification settings remain functional.
- Notification failure/unavailable states must be explicit because Expo Go has notification limitations.
- Account deletion remains low in hierarchy but still visible and tappable.

## Navigation

Keep the existing tab structure, but make it feel more premium:

- Dark tab bar.
- Strong active state using gold or powder blue.
- Improve icon/label contrast.
- Avoid oversized tab labels.
- Do not add new routes for this pass.

## Asset Direction

Existing generated editorial images can be reused temporarily, but the implementation should crop and treat them more aggressively.

If new images are generated, use this direction:

- high-contrast boutique fitness studio
- reformer/Pilates or mat class energy
- trainer guiding members
- cinematic dark navy foregrounds with warm practical light
- real human expressions
- no text, no logos, no UI, no distorted anatomy

## Data And Scope

Keep the app fixture-backed.

- Do not add Supabase media storage.
- Do not wire payments.
- Do not change admin.
- Do not change tab structure.
- Do not add authentication flows.
- Local interaction feedback is acceptable for booking, waitlist, calendar, cancellation, notifications, and deletion states.

## Implementation Scope For Next Plan

The implementation plan should:

1. Add dark fitness tokens to `apps/mobile/src/theme/colors.ts`.
2. Update `Screen` and tab layout for the dark app shell.
3. Rebuild `PremiumHero` as a high-contrast app hero with CTA and membership pulse.
4. Rebuild `TimelineClassCard` for premium class-feed rows.
5. Update Home composition around hero, recommendation, and compact status strips.
6. Update Schedule filters and class feed.
7. Update Class Detail with cinematic hero and sticky booking bar.
8. Update Bookings to match the new dark command-center language.
9. Update Profile hierarchy and dark-mode settings/status modules.
10. Add or adjust tests where fixture helpers or local interaction behavior changes.
11. Verify with `npm run typecheck`, `npm test`, `npx expo install --check`, and iOS export.
12. Launch through Expo Go on a physical phone and collect user feedback before marking the goal complete.

## Success Criteria

- The first screen looks like a premium fitness app, not a generated wellness brochure.
- The app is clearly more eye-catching than the current version.
- Booking actions are visually obvious and responsive.
- Schedule feels like a high-quality class product, not a plain list.
- Dark UI remains readable in Hebrew and English.
- Existing smart fixtures and local actions still work.
- Expo Go loads the app on the user's phone.

## Self-Review Notes

- No backend, payment, admin, or tab-structure changes are required.
- The design intentionally replaces the prior quiet editorial direction.
- Competitor references are used only for category expectations; the UI must remain Cloud&Core branded.
- The spec avoids placeholders and is scoped to one mobile redesign pass.
