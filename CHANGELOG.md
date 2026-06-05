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
  - `main.js` — scroll-circle hero animation + lazy video playback
  - `assets/` — logo (`logo_text.svg`), balloon/circle SVGs, placeholder reel video
  - `docs/superpowers/specs/` — design specs
- **Brand:** deep red `#8d0b0b` on white. Headings in Georgia serif; the logo is a
  custom display wordmark baked into `logo_text.svg` (balloon as the "O").

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

- SEO foundation: **done** (2026-06-04). Remaining: Core Web Vitals / performance
  (332 KB logo, lazy-load `embed.js`) and post-deploy steps (submit the sitemap in
  Google Search Console; swap the placeholder OG image for a real photo).
- "How it works" section is functional but plain — owner wants it spruced up.
- Instagram section now shows the first real reel via the **official Instagram
  embed**. More reels are coming over the next couple of weeks — add each as another
  `<blockquote class="instagram-media" …>` inside the `.reel-embeds` container (the
  layout already centers/wraps multiple embeds).
- Fonts: `styles.css` references "Glacial Indifference" but it's never loaded, so
  non-Apple visitors get a fallback system font. Decide whether to self-host it.
- Performance / cleanup: `logo_text.svg` is ~332 KB; duplicate SVGs and a 7.4 MB
  placeholder video (`demo_ig_video.mp4`, now **unused** after the embed swap) exist
  at both the repo root and in `assets/`; unused `demo/` folder. Safe to delete in a
  cleanup pass.

---

## Changelog

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
