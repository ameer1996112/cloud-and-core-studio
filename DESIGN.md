# Cloud & Core Studio Design System

Last updated: 2026-06-02

This is the durable source of truth for Cloud & Core Studio interface and brand decisions. Use it before editing the public site in `site/`.

## Brand Promise

Cloud & Core Studio is a calm boutique aerial-yoga studio for women, children, couples, and events in Yanuh-Jat and Hurfeish.

The page should feel warm, safe, personal, and local. It should not feel like a generic gym, SaaS landing page, or stock fitness template.

Primary emotional jobs:
- Reassure beginners that the class is safe and guided.
- Help parents understand the children path quickly.
- Show that the studio is real, local, intimate, and personal.
- Make contact feel low-pressure and human.

## Audience

Primary audience:
- Women 17+ who want movement, relaxation, and a safe first aerial-yoga experience.
- Parents of children ages 7-17 looking for a confidence-building class.

Secondary audience:
- Couples looking for a different workshop/date experience.
- Mothers and daughters looking for shared quality time.
- Birthday/event customers.

Key questions the design must answer:
- "Will I feel safe?"
- "Will I be embarrassed if I am new?"
- "Is this warm and personal, or just another gym?"
- "Can I understand the price and next step quickly?"

## Visual Tokens

Colors:
- Background dark: `#131920`
- Surface: `#1b232d`
- Navy: `#384a5d`
- Gold accent: `#b1a898`
- Gold light: `#c8bfb0`
- Text main: `rgba(255,255,255,.92)`
- Text muted: `rgba(255,255,255,.6)`
- Ivory: `#F8F6F1`

Color rules:
- Keep the page dark, warm, and quiet.
- Use gold as an accent for CTAs, proof, focus, and meaningful highlights.
- Avoid purple/blue SaaS gradients, beige-only palettes, and decorative color blobs.
- Use imagery and real studio texture for atmosphere instead of abstract decoration.

Typography:
- Display/hero/section headings: `Cormorant Garamond`.
- Body/navigation/buttons/forms: `Outfit`.
- Hebrew text must use normal letter spacing.
- Do not apply wide tracking to Hebrew words except tiny Latin-style labels where visual testing confirms readability.
- Headings can be expressive; operational UI text should stay compact and readable.

Shape and spacing:
- Primary buttons use pill radius.
- Cards may use soft rounded corners for premium feel.
- Avoid nested cards.
- Content containers max at 1280px with responsive inline padding.
- Section spacing is generous on desktop and compact on mobile.

## Layout

Required page flow:
1. Nav
2. Hero
3. Marquee
4. About
5. Classes
6. Founder
7. Pricing
8. Studio strip
9. Testimonials
10. Studio Proof
11. FAQ
12. Contact
13. Footer

First-screen priorities:
- Studio identity and atmosphere through the hero image and logo.
- Main promise: a safe, warm place to breathe and fly.
- Clear next step plus local certainty: intro lesson, Yanuh-Jat/Hurfeish, small groups, personal guidance.

Post-hero hierarchy:
- Explain why the studio exists and why aerial yoga is safe for beginners.
- Show class paths before founder biography so users quickly find the option that fits them.
- Introduce the founder before pricing so price is understood through trust and personal guidance.

## Components

Buttons:
- Use clear CTA text with low-pressure, personal wording.
- Primary CTAs use gold fill.
- Secondary CTAs use restrained outline styling.
- Minimum visible touch target is 44px.

Navigation and drawer:
- Nav must expose a useful brand/logo signal.
- Mobile drawer must be inert or unfocusable while closed.
- Closed overlays must not trap focus.

Pricing:
- Adults tab is the default.
- Tabs use `aria-pressed`.
- Every pricing card must include a short "Best for" line before or near the description.
- The line should help users decide without reading every paragraph.

FAQ:
- Questions use buttons.
- Buttons expose `aria-expanded`.
- Only one panel may be open at a time unless the interaction model changes intentionally.

Form:
- Fields: full name, phone, preferred plan.
- Inputs have labels, autocomplete where relevant, and required validation.
- Status uses a polite live region.
- Submit button is disabled while sending.
- Success text: `הפרטים התקבלו. אחזור אלייך בהקדם.`
- Validation errors keep entered values, focus the first invalid field, and show a short plain-language message.
- Backend/network errors keep entered values, restore the submit button, and reveal a WhatsApp fallback CTA.

Studio Proof:
- Use 4-5 images maximum.
- Every image needs a useful caption.
- Captions should answer a user concern: safety, real studio space, small groups, adult class, children/workshop fit.
- Remove images that are only decorative mood filler.

## Motion

Motion may add atmosphere but must not hide essential content.

Rules:
- `prefers-reduced-motion` disables nonessential motion.
- Scroll reveal must fail open: content is visible without JavaScript.
- Decorative parallax, cursor effects, marquee movement, and auto-scrolling galleries are optional enhancement only.
- Motion must not create layout shifts or page-level horizontal overflow.

## RTL And Hebrew

Rules:
- The page is Hebrew RTL.
- Do not use negative or wide letter spacing on Hebrew body text.
- Keep line-height generous enough for Hebrew readability.
- Check mixed Hebrew/English text visually, especially brand text, prices, and locations.
- CTAs should sound like a human invitation, not hard-sales copy.

## Accessibility

Required:
- One `h1`, matching the visible hero promise.
- `main` landmark and skip link.
- Nav landmark with label.
- All images have width, height, and useful alt text.
- Decorative visuals use `aria-hidden`.
- Closed mobile drawer and hidden sticky CTA are inert or unfocusable.
- FAQ buttons expose `aria-expanded`.
- Pricing tabs expose `aria-pressed`.
- Carousel dots expose current state.
- Form fields have labels, autocomplete, and required validation.
- Form status uses polite live region.
- Focus-visible state is clear and high contrast.
- Minimum touch target is 44px.
- No page-level horizontal overflow at 390px mobile and 1440px desktop.

## Performance

Required:
- Hero image uses `fetchpriority="high"` and `loading="eager"`.
- Non-hero images use lazy loading where appropriate.
- Images include explicit dimensions.
- No blocking preloader.
- CSS/JS remain static and cacheable on Netlify.
- Decorative animations must not force layout shifts.

## Pre-Deploy Verification

Before publishing changes:
- Capture desktop screenshot at `1440x1000` or similar.
- Capture mobile screenshot at `390x844`.
- Confirm console errors are empty.
- Confirm `document.documentElement.scrollWidth <= clientWidth`.
- Confirm `document.body.scrollWidth <= clientWidth`.
- Confirm all images have `width`, `height`, and useful `alt`.
- Confirm all visible interactive targets are at least 44px wide and 44px tall.
- Confirm page loads at `scrollY = 0` on mobile.
- Confirm hidden mobile drawer and hidden sticky CTA are inert/unfocusable.
- Confirm there is exactly one `h1`.
- Confirm `theme-color` and dark `color-scheme` are present.

## AI-Slop Blacklist

Avoid:
- Generic three-feature "modern landing page" patterns without story.
- Decorative icon grids that do not build trust.
- Oversized marketing copy that hides practical questions.
- Stock-like imagery that does not show the actual studio or aerial-yoga context.
- Purple/blue gradient SaaS styling.
- Generic image galleries with no conversion job.
- Decorative proof sections where the captions do not answer user concerns.

Use instead:
- Real studio/aerial imagery.
- Local Hebrew copy written like a human invitation.
- Trust details connected to safety, beginner support, small groups, and local identity.
- Alternating class rows with image and practical details.
- A compact `Studio Proof` section where every image does useful conversion work.
- Contact actions repeated only at natural decision points.
