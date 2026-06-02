# Cloud & Core Studio Design Plan

Generated: 2026-06-02
Target repo: `cloud-and-core-studio`
Current implementation: static Hebrew RTL landing page deployed from `master`

## Goal

Create a premium, warm, trustworthy landing page for Cloud & Core Studio that converts women, parents, couples, and event customers into WhatsApp/contact-form leads for aerial yoga classes in Yanuh-Jat and Hurfeish.

The page should feel like a calm boutique studio, not a generic fitness site. The strongest signals are safety, personal guidance, warmth, local identity, and the tactile feeling of suspended movement.

## Audience

Primary audience:
- Women 17+ who want movement, relaxation, and a safe first aerial yoga experience.
- Parents of children ages 7-17 looking for a confidence-building class.

Secondary audience:
- Couples looking for a different workshop/date experience.
- Mothers and daughters looking for shared quality time.
- Birthday/event customers.

Key emotional needs:
- "Will I feel safe?"
- "Will I be embarrassed if I am new?"
- "Is this warm and personal, or just another gym?"
- "Can I understand the price and next step quickly?"

## Design System

There is no standalone `DESIGN.md` yet. Until one exists, the implementation should use these page-level design decisions as the source of truth.

Before the next implementation pass, extract this section into a standalone `DESIGN.md`. That file should become the durable source of truth for brand/interface decisions so future edits do not reintroduce generic gradients, bad Hebrew tracking, decorative filler, or inconsistent mobile behavior.

### Visual Tokens

Colors:
- Background dark: `#131920`
- Surface: `#1b232d`
- Navy: `#384a5d`
- Gold accent: `#b1a898`
- Gold light: `#c8bfb0`
- Text main: `rgba(255,255,255,.92)`
- Text muted: `rgba(255,255,255,.6)`
- Ivory: `#F8F6F1`

Typography:
- Display/hero/section headings: `Cormorant Garamond`
- Body/navigation/buttons/forms: `Outfit`
- Hebrew text must use normal letter spacing. Do not apply wide tracking to Hebrew words except tiny Latin-style labels where visual testing confirms readability.

Shape and spacing:
- Primary buttons use pill radius.
- Content containers max at 1280px with responsive inline padding.
- Cards use soft rounded corners for premium feel, but avoid nested cards.
- Section spacing is generous on desktop and compact on mobile.

Motion:
- Scroll reveal may be used for atmosphere but must not hide essential first-viewport content.
- Decorative parallax and cursor effects are optional enhancement only.
- `prefers-reduced-motion` must disable nonessential motion.

Required `DESIGN.md` contents:
- Brand promise and audience.
- Color tokens and usage rules.
- Typography rules, including Hebrew letter-spacing constraints.
- Layout and spacing scale.
- Button, card, nav, drawer, pricing, FAQ, form, and proof-section patterns.
- Motion rules and reduced-motion fallback.
- RTL-specific requirements.
- Accessibility rules.
- AI-slop blacklist for this brand.

## Information Architecture

The landing page is a single-page conversion flow.

```text
NAV
  Logo
  Philosophy | Classes | Pricing | Testimonials | FAQ
  Primary CTA: intro lesson

HERO
  Local welcome
  Main promise: breathe, stretch, fly
  Emotional description
  Primary CTA: contact
  Secondary CTA: classes
  Quiet trust line: Yanuh-Jat and Hurfeish, small groups, personal guidance
  Trust stats: Google rating, members, safety
  Studio image

MARQUEE
  Short emotional proof phrases

ABOUT
  Why the studio exists
  Definition of aerial yoga
  Safety / personal guidance / intimate group proof
  Studio images

CLASSES
  Kids and teens
  Adults
  Birthdays
  Couples
  Mother-daughter

FOUNDER
  Founder image
  Quote
  Credentials and personal story
  CTA

PRICING
  Adults tab
  Kids tab
  Featured recommended plan
  Each card includes a `Best for` line that names the user fit in plain language

STUDIO STRIP
  Full-width atmosphere/proof moment

TESTIMONIALS
  Three recommendations
  Mobile dots/swipe behavior

STUDIO PROOF
  4-5 strongest images only
  Captions tied to safety, small groups, real studio space, and class variety
  No decorative filler images

FAQ
  Safety
  Beginner readiness
  Children ages
  Weight limits
  Class separation

CONTACT
  Benefits
  Name / phone / preferred plan
  Submit status

FOOTER
  Brand summary
  Navigation
  Contact links
  Final CTA
```

Top-three first-screen priorities:
1. Studio identity and atmosphere through the hero image and logo.
2. Main promise: a safe, warm place to breathe and fly.
3. Clear next step plus local certainty: intro lesson, Yanuh-Jat/Hurfeish, small groups, personal guidance.

Primary post-hero hierarchy:
1. Explain why the studio exists and why aerial yoga is safe for beginners.
2. Show class paths before founder biography so users can quickly find the option that fits them.
3. Introduce the founder before pricing so the price is interpreted through trust, care, and personal guidance rather than as a commodity.

## Responsive Plan

Desktop:
- Two-column hero with image and copy balanced.
- Fixed transparent/dark nav.
- Pricing uses three-column cards.
- Testimonials can sit side by side.
- Gallery remains horizontally scannable.

Tablet:
- Preserve strong image presence.
- Reduce hero typography and section padding.
- Pricing can move to two/three columns depending on available width.

Mobile:
- Hero must not be a blank full-screen overlay. Show nav/logo, image, then copy immediately.
- Mobile drawer uses hamburger, is inert/hidden while closed, and avoids focus leakage.
- CTAs become full-width where needed.
- Pricing cards may use horizontal swipe or stacked layout, but must not create page-level horizontal overflow.
- Touch targets must be at least 44px.
- Sticky CTA is hidden/inert until visible after the hero.

## Interaction State Coverage

```text
FEATURE              | LOADING                         | EMPTY                         | ERROR                                      | SUCCESS                              | PARTIAL
---------------------|---------------------------------|-------------------------------|--------------------------------------------|--------------------------------------|-------------------------------
Hero images          | Show layout with reserved space  | Use dark surface fallback     | Keep copy/CTA usable without image          | Image appears without layout shift    | Decorative motion may be off
Mobile menu          | Not applicable                   | Not applicable                | Drawer stays closed if JS fails             | Opens/closes, focus targets valid     | Overlay visible only when open
Pricing tabs         | Adults shown by default          | Adults tab remains visible    | If JS fails, adults pricing remains visible | Active tab updates cards/pressed state| User can still use contact CTA
Testimonials         | Static first card available      | Hide dots if no cards         | No auto-scroll dependency                   | Dots update current state             | Swipe sync may lag but content readable
FAQ accordion        | Closed by default                | No FAQ section if no items    | Questions remain readable if JS fails       | aria-expanded updates with panel      | Only one panel open at a time
Contact form         | Button says "שולח פרטים..." and fields remain readable | Fields are labeled and native required validation explains missing data | Show "לא הצלחתי לשלוח כרגע. אפשר לנסות שוב או לשלוח WhatsApp ישירות" with visible WhatsApp fallback CTA | Live polite success message: "הפרטים התקבלו. אחזור אלייך בהקדם." | If only some fields are valid, preserve user input and focus the first invalid field
WhatsApp CTA         | Visible fixed action             | Not applicable                | Link remains plain anchor                   | Opens WhatsApp/contact destination    | Lifted when sticky CTA appears
```

## User Journey And Emotional Arc

```text
STEP | USER DOES                 | USER FEELS                         | DESIGN SUPPORT
-----|---------------------------|------------------------------------|---------------------------------------------
1    | Lands on page             | Curious but unsure                 | Calm hero image, local welcome, soft colors
2    | Reads hero                | "This might be for me"             | Warm language, beginner-safe copy
3    | Sees location/trust line  | "This is nearby and personal"      | Quiet line: Yanuh-Jat/Hurfeish, small groups, personal guidance
4    | Scans safety/about        | Reassured                          | Safety proof, intimate group explanation
5    | Checks classes            | Finds their use case               | Separate cards for adults, kids, couples, events
6    | Checks pricing            | Wants clarity and low friction     | Tabs, simple price cards, recommended plan
7    | Reads testimonials/FAQ     | Builds trust                       | Social proof plus direct answers
8    | Contacts studio           | Ready but still wants low pressure | Form/WhatsApp with human, friendly wording
```

Time horizon:
- First 5 seconds: brand, image, emotional promise, CTA must be obvious.
- First 5 minutes: user can answer safety, class fit, price, location, and next step. Location should be visible before the user reaches the footer.
- Long-term relationship: page should feel like the same warm, personal studio experience the user expects in class.

## AI Slop Prevention

Avoid:
- Generic three-feature "modern landing page" patterns without story.
- Decorative icon grids that do not build trust.
- Oversized marketing copy that hides practical questions.
- Stock-like imagery that does not show the actual studio or aerial yoga context.
- Purple/blue gradient SaaS styling.
- Generic image galleries with no conversion job.

Use instead:
- Real studio/aerial imagery.
- Local Hebrew copy written like a human invitation.
- Trust details connected to actual concerns: safety, beginner support, small groups.
- Alternating class rows with image and practical details.
- A `Studio Proof` section where every image answers a user concern: "Is it safe?", "Is it real?", "Will the group feel personal?", or "Is there a class for me?"
- Contact actions repeated only at natural decision points.

## Accessibility Requirements

Required:
- One `h1`, matching the visible hero promise.
- `main` landmark and skip link.
- Nav landmark with label.
- All images have width, height, and useful alt text.
- Decorative visuals use `aria-hidden`.
- Closed mobile drawer and hidden sticky CTA must be inert or unfocusable.
- FAQ buttons expose `aria-expanded`.
- Pricing tabs expose `aria-pressed`.
- Carousel dots expose current state.
- Form fields have labels, autocomplete, and required validation.
- Form status uses polite live region.
- Focus-visible state is clear and high contrast.
- Minimum touch target: 44px.
- No horizontal overflow at 390px mobile and 1440px desktop.

Pre-deploy verification gate:
- Capture desktop screenshot at `1440x1000`.
- Capture mobile screenshot at `390x844`.
- Confirm console errors are empty.
- Confirm `document.documentElement.scrollWidth <= clientWidth` and `document.body.scrollWidth <= clientWidth`.
- Confirm all images have `width`, `height`, and useful `alt`.
- Confirm all visible interactive targets are at least 44px wide and 44px tall.
- Confirm page loads at `scrollY = 0` on mobile.
- Confirm hidden mobile drawer and hidden sticky CTA are inert/unfocusable.
- Confirm there is exactly one `h1`, and it is the visible hero promise.
- Confirm `theme-color` and dark `color-scheme` are present.

## Performance Requirements

Required:
- Hero image uses `fetchpriority="high"` and `loading="eager"`.
- Non-hero images use lazy loading where appropriate.
- Images include explicit dimensions.
- No blocking preloader.
- CSS/JS remain static and cacheable on Netlify.
- Decorative animations must not force layout shifts.

## Conversion Requirements

Primary conversion:
- Contact form submit.
- WhatsApp/final CTA click.

Primary CTA language:
- Friendly, low-pressure, personal.
- Avoid hard-sales wording.

Contact form fields:
- Full name.
- Phone.
- Preferred plan.

Pricing card rule:
- Every pricing card needs a short `Best for` line before or near the description.
- Examples: "Best for: first-time adult", "Best for: weekly routine", "Best for: flexible schedule", "Best for: trying the kids class", "Best for: siblings sharing a card".
- The line should help users decide without reading every paragraph.

Success behavior:
- Button changes to success state.
- Live text confirms details were received.
- Form resets after short delay.

Failure behavior:
- Validation error: keep entered values, focus the first invalid field, and show a short plain-language message near the field.
- Backend/network error: keep all entered values, restore the submit button, show a polite retry message, and reveal a WhatsApp fallback CTA.
- Duplicate submit: while sending, the submit button is disabled and the user sees the sending label.
- Screen reader behavior: all form status changes are announced through the polite live region.

## Not In Scope

- Online payment/checkout: pricing leads to contact, not purchase.
- Class calendar and booking engine: deferred until real scheduling data exists.
- CMS/admin editing: static site is enough for current launch.
- Multilingual support: current page is Hebrew RTL only.
- Analytics dashboard: deploy can use Netlify/GitHub analytics later.

## What Already Exists

Implemented files:
- `index.html`: full static landing page.
- `style.css`: design tokens, responsive layout, motion, forms, nav, cards.
- `script.js`: mobile menu, FAQ, pricing tabs, testimonials, form success, effects.
- `images/`: active visual assets.
- `netlify.toml`: static deploy config and headers.

Existing patterns to reuse:
- Dark premium studio palette.
- Serif display heading with sans body.
- Pill CTAs.
- Alternating class rows.
- Polite live status for form feedback.
- Inert hidden overlays and drawers.
- Reduced-motion support.

Studio Proof rules:
- Use 4-5 images maximum.
- Each image needs a short caption that does useful work, not mood text.
- Captions should cover: real studio space, aerial hammocks/safety setup, small group scale, adult class, kids/workshop use case.
- If an image does not answer a user concern, remove it.

## Resolved Design Decisions

1. Post-hero hierarchy should put classes before founder biography so users find the relevant path faster.
2. Hero should include a quiet local trust line, not a heavy location/contact strip.
3. Pricing cards should keep the card pattern but add a `Best for` line for fast scanning.
4. Gallery should become `Studio Proof` with 4-5 useful captioned images.
5. Contact form needs production failure states and WhatsApp fallback, not success-only behavior.
6. `DESIGN.md` should be created before the next implementation pass.
7. Pre-deploy desktop/mobile verification is required before publishing changes.

## Review Target

Run `/plan-design-review` against this file when reviewing future changes. The review should judge whether this plan is complete enough to guide implementation without visual guesswork.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 0 | — | — |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR | score: 8/10 -> 10/10, 7 decisions |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

**UNRESOLVED:** 0 design decisions.
**VERDICT:** DESIGN CLEARED. Eng review is still required before treating this as ship-ready.
