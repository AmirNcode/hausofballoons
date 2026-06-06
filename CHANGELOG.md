# Haus of Balloons — Changelog & Project Context

> **Purpose of this file:** a running log of *what* changed and *why*, plus the
> standing context (stack, decisions, business facts) needed to pick this project
> back up cold. Read this first when starting a new chat about this site.

---

## Project snapshot

- **What:** One-page marketing site for **Haus of Balloons**, a balloon-decor
  business (garlands, backdrops, full event installations).
- **Stack:** Plain **static HTML + CSS + JS**. No framework, no build step.
  (It was *described* as Astro, but the actual code Codex generated is static —
  see decision D1.)
- **Hosting (planned):** **Netlify**, custom domain **hausofballoons.ca**.
- **Key files:**
  - `index.html` — the whole site (hero, Instagram reels, packages, how-it-works, get-in-touch)
  - `styles.css` — all styles
  - `main.js` — scroll-circle hero animation + lazy-loads the Instagram embed
  - `assets/` — optimized logo (`logo_text.webp`, ~28 KB), `balloon.svg`, `og-image.png`
  - `docs/superpowers/specs/` — design specs; `docs/reference/` — design PDF
- **Brand:** deep red `#8d0b0b` on white. Headings in Georgia serif; the logo is a
  custom display wordmark (`logo_text.webp`, with the balloon as the "O").

## Business facts (current source of truth)

- **Name:** Haus of Balloons
- **Tagline (placeholder):** "Bespoke balloon garlands & installations for unforgettable events."
- **Locations / service area:** Toronto + Vancouver; serving the Greater Toronto
  Area (GTA) and Greater Vancouver. One site for both (Vancouver handled by a
  partner). No per-location routing yet — deferred until volume justifies it.
- **Email:** `hausofballoons.ca@gmail.com` (interim; pro email planned later)
- **Phone:** none yet
- **Instagram:** `@hausofballoons.ca` — https://instagram.com/hausofballoons.ca
- **Other socials:** none yet

## Key decisions (with rationale)

- **D1 — Keep it static (not Astro).** The site is already plain HTML/CSS/JS and is
  a single page. Static is lighter, faster, has zero build step, and works perfectly
  with Netlify + Netlify Forms. Revisit Astro only if it grows (extra pages, blog).
- **D2 — Netlify Forms for contact.** Native HTML form (`data-netlify="true"`),
  invisible honeypot for spam, custom `/thank-you` success page. No backend to run.
- **D3 — Quote/inquiry form (not direct booking).** Visitor describes their event;
  the owner replies with a custom quote. No online payment.
- **D4 — Footer doubles as nav.** The primary nav lives only in the hero and
  disappears once you scroll, so the footer carries quick links + back-to-top.
  A full sticky header is deferred.
- **D5 — SEO is a dedicated pass.** Highest-priority work (the owner wants strong
  Google + LLM discoverability). **Done 2026-06-04** — keyword title/meta, Open Graph
  + share image, `LocalBusiness` JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt`,
  favicons. See `docs/superpowers/specs/2026-06-04-seo-pass.md`.
- **D6 — Allow AI crawlers (don't block).** Visibility is the goal and there's no
  proprietary content, so `robots.txt` + `llms.txt` welcome both AI training bots and
  search/citation bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.).

## Known issues / backlog (not yet addressed)

- SEO foundation: **done** (2026-06-04). Remaining: post-deploy steps (submit the
  sitemap in Google Search Console; swap the placeholder OG image for a real photo).
- "How it works": **done** (2026-06-05) — icons, ghost numerals, flow arrows, tinted
  cards, expectations line, 4th "Enjoy & tag us" step, end CTA, and scroll-reveal.
- Instagram section now shows the first real reel via the **official Instagram
  embed**. More reels are coming over the next couple of weeks — add each as another
  `<blockquote class="instagram-media" …>` inside the `.reel-embeds` container (the
  layout already centers/wraps multiple embeds).
- Fonts: `styles.css` references "Glacial Indifference" but it's never loaded, so
  non-Apple visitors get a fallback system font. Decide whether to self-host it.
- Performance / cleanup: **done** (2026-06-05) — logo → 28 KB WebP, removed ~15.5 MB
  of unused files, lazy-loaded `embed.js`. Remaining nice-to-have: a `<picture>` PNG
  fallback for the logo (currently WebP-only) for very old browsers.

---

## Changelog

### 2026-06-05

- **Mobile fixes + polish (round 2):**
  - **Section headers** ("As seen on Instagram", "Packages", "How it works") sized
    relative to the logo's letter (cap) height, then dialed down 20% per request —
    `clamp(2.4rem, 5.75vw, 5.2rem)` on desktop, `clamp(2.25rem, 12.4vw, 3.5rem)` on
    mobile.
  - **iOS viewport:** `overflow-x: clip` on `html`/`body` removes the horizontal scroll
    and auto-zoom-out caused by the expanding `.scroll-circle`; switched hero/Instagram
    min-heights to `svh` so the iOS address bar no longer reflows the layout mid-scroll
    (smoother circle).
  - **Circle animation:** gentler ease-out on ≤780px (quadratic vs the desktop quartic)
    so it expands smoothly instead of popping during fast touch scrolling.
  - **Form fields:** normalized inputs (`-webkit-appearance: none`, `min-width: 0`,
    shared `min-height: 48px`) so the iOS `type="date"` field is the same size as every
    other field (all 10 fields measured equal width).
  - **Packages:** Luxury & Corporate now show a **"Get a quote →"** link to the form
    (`#get-in-touch`) instead of a starting price.
- **"How it works" section upgrade** (all the brainstormed options):
  - Restyled the steps into **cards** on a tinted section (`#f9f1f1`), which breaks the
    all-white run across Packages / How it works / Get in touch.
  - Per-step **line icons** (gift, chat, balloon arch, camera), **oversized ghost
    numerals** (01–04), and **connecting flow arrows** (horizontal on desktop, downward
    when stacked on mobile).
  - Added an **expectations line** ("Most quotes within 48 hours…"), a **4th step
    "Enjoy & tag us"** linking Instagram (UGC nudge), and an end **CTA**
    ("Start your quote →") to `#get-in-touch`.
  - **Scroll-reveal** for the steps via IntersectionObserver in `main.js` (staggered
    fade/slide-in; gated off under `prefers-reduced-motion`). Decoupled the old
    `.process-list` styles from the shared package-card selectors.
  - **Refined per feedback (same day):** the first version felt crowded/squished —
    one icon rendered skewed and the chevrons lacked margin on narrow screens. Removed
    the per-step **icons** and the connecting **arrows**, moved the step **numbers to
    the top-left** as solid brand-red anchors, and gave the cards more padding + softer
    borders for a cleaner look.
- **Nav reorder:** site-nav (and the footer "Explore" list) now read **Packages ·
  How it works · Get in touch** (matches the section order on the page).
- **Favicon rebuilt** from `assets/balloon.svg` as a rounded **white square** (`rx`)
  with the red balloon; regenerated `favicon-32.png`. `apple-touch-icon.png` stays a
  full white square (iOS applies its own rounding).
- **Performance / cleanup pass:**
  - **Logo: 332 KB → 28 KB.** `logo_text.svg` was actually an embedded base64 PNG +
    recolor filters (not vector). Rasterized it (filters intact) and replaced it with
    `assets/logo_text.webp` everywhere (hero, footer, thank-you, preload, JSON-LD).
    **WebP-only** — universal in 2026; very old browsers fall back to alt text.
  - **Removed ~15.5 MB of dead weight:** root duplicate `logo_text.svg` / `balloon.svg`,
    both 7.4 MB `demo_ig_video.mp4` copies, `assets/circle.svg`, and the `demo/`
    prototype folder. Moved `hob_web.pdf` → `docs/reference/`. (All confirmed unreferenced.)
  - **Lazy-loaded Instagram `embed.js`** via IntersectionObserver in `main.js` (loads
    only when the Instagram section nears the viewport; never on hero-only visits) and
    removed the now-dead `<video>`-playback code.
  - Added `loading="lazy"`/`decoding="async"` to the footer logo; `decoding="async"`
    on the hero/thank-you logos.
  - Verified in-browser: deleted assets 404, WebP logo + rounded favicon render
    correctly, the lazy-embed render path works, nav order correct.
- **Follow-up fixes (same day):**
  - **Logo transparency:** the first WebP came out **opaque** — `qlmanage` flattened
    the transparent background to white, which showed as a white box over the
    expanding red circle. Re-rendered it **transparent** with `sharp` (37 KB, alpha
    preserved, filters/colour intact), restoring the logo dissolving into the red
    circle. (Lesson: `qlmanage` composites SVGs on white; use `sharp` for alpha.)
  - **Favicon:** flattened the SVG (removed a nested `<svg>` that some browsers'
    tab-icon renderers don't handle) and regenerated `favicon-32.png`. The red balloon
    shows clearly on the white rounded tile. Note: browser favicon caching is sticky —
    a hard refresh may be needed to see it locally; first Netlify deploy is unaffected.

### 2026-06-04

- **Initialized git** repository (`main` branch) to baseline the existing
  Codex-generated site and start tracking changes.
- **Added** `CHANGELOG.md` (this file) and `.gitignore`.
- **Reviewed the full site** and documented findings (see "Known issues" above):
  confirmed it's static (not Astro), flagged the missing SEO, empty "Get in touch"
  section, absent footer, disappearing nav, unloaded font, and asset bloat.
- **Wrote design spec** for the quote form + footer:
  `docs/superpowers/specs/2026-06-04-quote-form-and-footer-design.md`. Captured
  decisions D1–D5 above. Spec approved by owner.
- **Pushed to GitHub:** added the `origin` remote and pushed `main` to
  `github.com/AmirNcode/hausofballoons`.
- **Implemented the quote form + footer:**
  - `index.html`: built the Netlify quote form inside `#get-in-touch` (name,
    email, phone, event date, event type, location, package, budget, colors/theme,
    message; invisible honeypot; `action="/thank-you"`; mailto fallback). Added the
    site `<footer>` (brand + tagline, quick links, contact, service area,
    back-to-top) and gave the hero `id="top"` for the back-to-top anchor.
  - Added `thank-you/index.html` — branded confirmation page (`noindex`) with
    Instagram + back-home buttons; uses root-absolute asset paths.
  - `styles.css`: added reusable `.btn` styles, the quote-form styles, the footer
    styles, the thank-you-page styles, and mobile stacking — all built on the
    existing brand tokens. `main.js` unchanged (form is native Netlify POST).
  - Verified rendering on desktop + mobile via local preview. The Netlify form
    submission/redirect itself can only be fully verified after deploy.
- **Replaced the Instagram placeholder videos** with the first real reel
  (`instagram.com/reel/DZJktStBcoI/`) using the official Instagram embed
  (blockquote + `embed.js`), per owner's choice. Swapped the 4-up `<video>` grid
  for a centered `.reel-embeds` container that wraps multiple embeds, added a
  "See more on Instagram" CTA (white-outline `.btn--on-red` variant), and loaded
  `embed.js` once before `</body>`. `assets/demo_ig_video.mp4` is now unused.
  Verified the embed renders the live reel on desktop + mobile.
- **SEO & discoverability pass** (spec: `docs/superpowers/specs/2026-06-04-seo-pass.md`):
  - `index.html` `<head>`: keyword/location title + meta description, canonical,
    `robots` (`max-image-preview:large`), `theme-color`, full Open Graph + Twitter
    cards, favicons, and **JSON-LD** (`WebSite` + `LocalBusiness` with `areaServed`
    for GTA + Greater Vancouver and an `OfferCatalog` of the 4 packages). Set
    `lang="en-CA"` and a keyword-rich screen-reader `<h1>`.
  - New `robots.txt` (welcomes AI crawlers + sitemap), `sitemap.xml`, and `llms.txt`.
  - Generated `assets/og-image.png` (1200×630, + `.svg` source) and
    `favicon.svg` / `favicon-32.png` / `apple-touch-icon.png` from the balloon SVG
    via `qlmanage` + `sips`.
  - Added favicons + `theme-color` to the thank-you page.
  - Validated the JSON-LD parses and all new files serve with correct content-types.
