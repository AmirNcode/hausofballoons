# Launch Party event page — design spec

**Date:** 2026-07-07
**Status:** Approved (Phase 1 build)

## Goal

A hidden, reusable event page with a Netlify RSVP form. First use: the Haus of
Balloons launch party. The link is shared privately (not in site nav, not
indexed). The page structure is reusable for future events.

## Routing & files

Static site, publish root. New files:

```
events/
  event.css                     # shared events stylesheet (reused by future events)
  launch-party/
    index.html                  # RSVP page  → hausofballoons.ca/events/launch-party/
    thank-you/index.html        # post-RSVP confirmation
```

- Each future event = a new subfolder under `events/`, reusing `event.css`.
- Pages also link the existing root `/styles.css` for brand tokens, reset,
  `.btn`, `.balloon`/`.confetti`, `@keyframes float`, `.quote-form` inputs, and
  the global `prefers-reduced-motion` killswitch. No token duplication.

## Visual direction — bright & airy white party

- White/cream base (already the brand surface). Colourful balloons + slowly
  falling confetti as the pop. Matches the "all white rooftop party" theme.
- Reuse brand accent tokens: `--coral --marigold --pink --mint --lilac`.
- Animations kept light, **CSS only, no JS, no libraries**:
  - Floating balloons — reuse `.balloon--float` + `@keyframes float`.
  - Falling confetti — new `.confetti-fall` fixed full-viewport layer, ~14
    pieces, staggered `fall` keyframe (translateY + rotate), colored via
    `:nth-child`. Hidden entirely under `prefers-reduced-motion`.

## Page content (single scroll, no site nav)

1. **Hero** — deco layer (floating balloons + confetti) behind:
   - "Please join us for the launch of" → **logo** (`/assets/logo_text.webp`,
     alt "Haus of Balloons") → **Sunday, July 12 · 3–10 PM** → tagline
     "An all-white rooftop party."
2. **Details** — cards, plain text (no external links except the map):
   - Music by DJ DAFO
   - Drinks & Vancouver sunset views
   - Catering by Velvet Spoon
   - 701-107 East 3rd Street, Vancouver — links to Google Maps directions
3. **RSVP form** — Netlify, reuses the proven `quote` pattern
   (`data-netlify="true"`, `netlify-honeypot="bot-field"`, hidden `form-name`,
   `action` → thank-you). Form name: `launch-party-rsvp`.
   - **Name** — required
   - **Total attending, including you** — required, `type="number"`, `min="1"`
     (field name `total-attending`)
   - **Email** — required, `type="email"`
   - **Note** — optional textarea, "Anything we should know?"
4. **Confirmation** — `/events/launch-party/thank-you/`:
   - Thank-you copy + details recap
   - **Add to Calendar**: `.ics` file download + Google Calendar link
   - Google Maps link

## Event facts (verified)

- Date: **Sunday, July 12, 2026** (weekday verified). Time 3:00 PM–10:00 PM.
- Timezone: America/Vancouver (PDT, UTC−7) for the `.ics` / calendar link.
- Location string: `701-107 East 3rd Street, Vancouver` (Unit 701, 107 East 3rd St).
- No RSVP cut-off, no guest cap. DJ / caterer are plain text (no links).

## Discoverability

- `<meta name="robots" content="noindex">` on both pages.
- Not added to `sitemap.xml`. Not linked from the main site.
- No robots.txt change needed (noindex on the pages is enough; site-wide
  `Allow: /` stays for the marketing site).

## Local testing

- Page + animations render locally via `python3 -m http.server`.
- The form POST + thank-you redirect only fire on a Netlify deploy (same
  limitation as the existing `quote` form). Verify markup/layout/animation
  locally; verify submission after deploy.

## Constraints

- Nothing pushed to GitHub yet (user testing locally first). Local commits OK.
- No new runtime dependencies. No build-step change (gallery script untouched).

## Deferred — Phase 2 (Resend confirmation email)

After Phase 1 is working: on RSVP, email the guest their details + calendar
invite via Resend. Requires a Netlify Function on the `submission-created`
event calling the Resend API (RESEND_API_KEY env var). Designed separately.
