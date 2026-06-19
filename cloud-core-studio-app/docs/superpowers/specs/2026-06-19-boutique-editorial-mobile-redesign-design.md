# Boutique Editorial Mobile Redesign

## Purpose

The current premium mobile pass is functional and smarter than a generic booking app, but it still feels too much like generated dashboard UI. The next pass should make Cloud&Core feel like a real boutique studio with people, warmth, editorial restraint, and a strong visual point of view.

This is a design spec for the next implementation pass. It replaces the visual direction of the current home and supporting surfaces without changing the core product scope: booking, schedule, class detail, membership health, and concierge remain the main member experience.

## Approved Direction

- Direction: boutique studio editorial.
- Imagery: generated editorial photography for now, replaceable with real studio photos later.
- Energy: warm boutique community with members and instructor presence.

## Visual Thesis

Cloud&Core should feel like a premium neighborhood wellness studio photographed in soft daylight: human, calm, intimate, and quietly expensive, with the interface behaving like a thoughtful studio concierge rather than an analytics dashboard.

## Content Plan

1. Home hero: full-bleed editorial image, Cloud&Core identity, personal greeting, and one primary recommendation.
2. Support: next best class with instructor context, availability, and a single booking action.
3. Detail: membership rhythm and concierge requests shown as quiet studio-status rows, not heavy cards.
4. Final action: secondary schedule/profile paths remain available, but the first screen always answers what the member should do next.

## Interaction Thesis

- Hero entrance should feel like a calm editorial reveal: image first, then greeting, then CTA.
- Recommendation details should reveal progressively: a short human sentence first, with fit reasons available below.
- Actions should respond with subtle press depth and color change, not large animated effects.

## Design Principles

- Lead with people and place, not widgets.
- Use photography as the first visual anchor on Home.
- Use cards only where the card is the interaction, such as a tappable class recommendation.
- Reduce circular scores, pill clusters, heavy shadows, and equal-weight dashboard modules.
- Keep the brand palette restrained: ivory surface, navy text, warm gold as the only strong accent, slate for secondary text.
- Make the app feel handmade and local, not like SaaS UI.
- Keep Hebrew RTL and English LTR equally usable.
- Keep copy short and human. Avoid technical language such as "fit score" in the first read.

## Home Screen Design

The Home screen should stop looking like a stack of cards. The top should become an editorial cover.

### Hero

- Full-bleed or near full-bleed image at the top of the screen.
- Image content: warm boutique class moment, instructor presence, real-looking members, soft daylight, no visible fake branding, no embedded text.
- Text sits on a calm darkened or naturally low-contrast area of the image.
- Cloud&Core Studio is prominent.
- Greeting is personal and conversational.
- One dominant CTA appears inside the image area or immediately below it.

Example English tone:

- "Noa, Maya saved a quiet spot for you."
- "Stretch & Flow is the right class today."
- "Reserve my place."

Example Hebrew tone should stay natural and studio-like, not mechanically translated.

### Recommendation

The recommendation should feel like advice from the studio, not a score panel.

- Lead with instructor, class title, time, and why it fits.
- Show intelligence through one sentence first.
- Move numeric fit score to secondary treatment or remove it from the home hero.
- Replace reason chips with short editorial rows or a small "why this class" reveal.
- Keep one primary action: reserve, join waitlist, or ask studio.

### Membership And Concierge

Membership health and concierge should become quieter status bands below the hero.

- Use rows, dividers, and compact summaries instead of large stacked cards.
- Membership copy should communicate rhythm: credits, pace, renewal, freeze eligibility.
- Concierge should show active studio requests as a small studio inbox preview.
- Avoid making every module visually equal to the hero.

## Schedule Screen Design

Schedule can keep its utility, but should feel less like filters and more like guided class discovery.

- Keep the intent selector, but simplify the visual treatment.
- Present the recommended class as an editorial list item with instructor context.
- Use a timeline layout with clear day/time hierarchy.
- Class availability, waitlist, and eligibility should be readable but visually secondary.
- Avoid many badges competing with the class title.

## Class Detail Design

Class detail should feel like a studio dossier.

- Use the same image language when possible.
- Lead with class title, instructor, time, and booking state.
- "Why this works for you" should use plain human reasons.
- Preparation should be practical and warm.
- Waitlist intelligence should feel reassuring, not gamified.

## Profile Design

Profile should feel like account care and studio relationship management.

- Membership status appears first.
- Concierge requests appear as a studio conversation/status list.
- Language and notification controls remain practical and clear.
- Instructor mode and account deletion stay available but should not visually compete with membership and concierge.

## Data And Asset Model

The next implementation should add an image-ready content boundary without wiring a real media backend.

- Add local generated image assets under the mobile app assets folder.
- Add fixture metadata for hero image, instructor image, and class mood image where needed.
- Keep image metadata replaceable by future Supabase storage URLs.
- Do not add a payment provider or real recommendation backend in this pass.

## Generated Image Direction

Generate or source temporary images with this art direction:

- Boutique wellness studio class in soft daylight.
- Warm instructor/member interaction.
- Natural movement, not posed stock photography.
- Ivory walls, wood or warm neutral flooring, deep navy or muted blue accents if possible.
- No embedded text, no logos, no obvious AI artifacts, no surreal anatomy, no overly glossy luxury hotel mood.

## Implementation Scope For Next Plan

The next implementation plan should focus on:

1. Add editorial image assets and metadata.
2. Replace `PremiumHero` with an image-led editorial hero.
3. Refactor Home from stacked cards into hero plus quiet status bands.
4. Soften Schedule class rows and reduce badge/chip density.
5. Soften Class Detail and Profile styling so they match the new editorial system.
6. Keep existing smart fixtures and tests working.
7. Run `npm run typecheck`, `npm test`, `npx expo install --check`, and iOS export.
8. Verify Expo Go launches successfully on device.

## Non-Goals

- No real Supabase media storage integration.
- No payment-provider wiring.
- No full admin redesign.
- No new tab structure.
- No broad backend changes.

## Success Criteria

- First screen no longer resembles a generic card dashboard.
- The app has a strong human photographic anchor.
- The recommendation feels personal and studio-led, not AI-generated.
- The experience still supports fast booking.
- Hebrew RTL and English LTR remain usable.
- Expo Go can load the app on a physical device.

## Self-Review Notes

- No placeholders are intentionally left in this spec.
- The scope is limited to mobile visual redesign and local image-backed fixtures.
- The spec keeps the existing product model and does not require backend changes.
- The implementation plan must wait for user review and approval of this spec.
