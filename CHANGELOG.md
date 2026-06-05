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
- **D5 — SEO is a dedicated next pass.** Highest-priority follow-up (the owner wants
  strong Google + LLM discoverability). Will add: keyword title/meta, Open Graph +
  share image, LocalBusiness structured data, sitemap.xml, robots.txt (incl. AI
  crawlers), canonical, favicon.

## Known issues / backlog (not yet addressed)

- SEO foundation missing (see D5).
- "How it works" section is functional but plain — owner wants it spruced up.
- Instagram reels are a hard-coded placeholder video (×4); to be replaced with real
  reels once available.
- Fonts: `styles.css` references "Glacial Indifference" but it's never loaded, so
  non-Apple visitors get a fallback system font. Decide whether to self-host it.
- Performance / cleanup: `logo_text.svg` is ~332 KB; duplicate SVGs and a 7.4 MB
  placeholder video exist at both the repo root and in `assets/`; unused `demo/`
  folder. Consolidate later.

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
  decisions D1–D5 above. Implementation pending owner sign-off on the spec.
