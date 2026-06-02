# Cloud & Core Studio TODOs

## Create `DESIGN.md`

**Status:** Done. `DESIGN.md` now exists at the repo root and is safe from Netlify public serving because Netlify publishes `site/`.

**What:** Create a standalone design-system document for Cloud & Core Studio.

**Why:** The design rules currently live inside `DESIGN_PLAN.md`, which is useful for planning but weak as a durable source of truth.

**Pros:** Future edits get clear rules for colors, typography, RTL Hebrew spacing, layout, motion, accessibility, component patterns, and AI-slop prevention.

**Cons:** Adds another document to maintain, and docs should not be published from the Netlify root.

**Context:** The repo history shows repeated restyling and mobile fixes. A dedicated design-system document reduces regressions like bad Hebrew tracking, generic gradients, decorative filler, and horizontal overflow.

**Depends on / blocked by:** Completed after Netlify publish structure changed to `site/`.

## Protect Docs From Netlify Publish

**Status:** Done. Netlify now publishes `site/`, so planning docs can live at the repo root without being served as public site pages.

**What:** Change the deploy structure so planning and design docs are not publicly served by Netlify.

**Why:** Netlify currently publishes the repo root, so files like `DESIGN_PLAN.md`, `TODOS.md`, and future `DESIGN.md` can become public URLs if committed.

**Pros:** Internal planning docs stay private while the public site remains clean.

**Cons:** Requires a small deploy-structure change, usually moving public site files into a `site/` or `public/` folder and updating `netlify.toml`.

**Context:** The project now has design-planning artifacts that are useful for work but not meant for the public marketing site.

**Depends on / blocked by:** Decide whether to restructure the Netlify publish directory or keep docs uncommitted/manual.
