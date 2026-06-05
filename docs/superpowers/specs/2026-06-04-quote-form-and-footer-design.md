# Haus of Balloons — Quote Form + Footer (Design Spec)

**Date:** 2026-06-04
**Scope of this pass:** Build out the empty "Get in touch" section as a working Netlify quote/inquiry form, add a thank-you page, and add a site footer. Match the existing static-site aesthetic (deep red `#8d0b0b` on white).

**Explicitly out of scope (next pass):** SEO / Open Graph / structured data / sitemap / robots.txt / favicon; "How it works" polish; Instagram reel replacement; performance cleanup (332 KB logo, duplicate assets). The contact details captured here will feed the SEO pass.

---

## 1. Business facts (source of truth for copy)

- **Name:** Haus of Balloons
- **Tagline (new, placeholder, no confirmation needed):** *"Bespoke balloon garlands & installations for unforgettable events."*
- **Locations / service area:** Based in **Toronto** and **Vancouver**; serving the **Greater Toronto Area (GTA)** and **Greater Vancouver**. One site covers both — no per-location routing logic yet.
- **Email:** `hausofballoons.ca@gmail.com` (form notifications + displayed publicly)
- **Phone:** none
- **Instagram:** `@hausofballoons.ca` → `https://instagram.com/hausofballoons.ca`
- **Other socials:** none yet

---

## 2. Architecture & approach

Stays a plain static site. No build step, no JS framework, no new dependencies.

- **Contact form:** native **Netlify HTML form** (no JavaScript needed). Netlify detects the form at deploy time from the `data-netlify="true"` attribute and processes POSTs server-side.
- **Spam protection:** invisible **honeypot** (`netlify-honeypot="bot-field"` + a hidden `bot-field` input). No CAPTCHA unless spam becomes a real problem later.
- **Success flow:** form `action="/thank-you"` → Netlify redirects to a custom branded thank-you page after a valid submission.
- **Footer:** a site-wide `<footer>` that also doubles as secondary navigation (mitigates the current "nav disappears after you scroll past the hero" gap; a full sticky header is deferred to a later pass).

### Files touched
| File | Change |
|---|---|
| `index.html` | Fill in `#get-in-touch` with intro copy + Netlify form; add `<footer>`; add `id="top"` to the hero for the back-to-top link |
| `thank-you/index.html` | **New** — branded confirmation page (uses root-absolute asset paths: `/styles.css`, `/assets/...`) |
| `styles.css` | Add styles for the form, the footer, and the thank-you page |
| `main.js` | **No change** (native form POST + smooth-scroll anchor handle everything) |

---

## 3. Contact form (`#get-in-touch`)

### Copy
- Keep existing `<h2>Get in touch</h2>`.
- Intro paragraph below it:
  > "Tell us about your event and we'll send a custom quote within 48 hours. Based in Toronto and Vancouver, we design balloon garlands, backdrops, and full installations across the GTA and Greater Vancouver."
- Below the form, a fallback line: *"Prefer email? Reach us at hausofballoons.ca@gmail.com."* (mailto link)
- Submit button label: **"Request my quote"**

### Fields
| Field | `name` | Type | Required |
|---|---|---|---|
| Name | `name` | text | ✅ |
| Email | `email` | email | ✅ |
| Phone | `phone` | tel | optional |
| Event date | `event-date` | date | ✅ |
| Event type | `event-type` | select: Birthday · Baby shower · Wedding · Corporate / Brand · Anniversary · Other | ✅ |
| Event location / city | `event-location` | text | ✅ |
| Package of interest | `package` | select: Basic · Premium · Luxury · Corporate · Not sure / custom | optional |
| Estimated budget | `budget` | select: Under $500 · $500–$1,000 · $1,000–$2,000 · $2,000+ · Not sure | optional |
| Colors / theme / inspiration | `theme` | text | optional |
| Message / event details | `message` | textarea | ✅ |

Plus the required Netlify plumbing:
- `<form name="quote" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you">`
- `<input type="hidden" name="form-name" value="quote">`
- Hidden honeypot: `<p class="hidden"><label>Don't fill this out: <input name="bot-field"></label></p>`

### Layout & styling
- Two-column responsive grid on desktop; full-width for the message field and the submit row. Single column under 780 px.
- Inputs/selects/textarea: white background, 1 px border in `rgba(141, 11, 11, 0.24)`, `border-radius: 8px`, brand-red text, comfortable padding, visible red focus outline (consistent with existing focus styles).
- Labels sit above each field, brand red.
- Required fields marked with a red asterisk and `required` + `aria-required="true"`.
- Submit button: filled brand red, white text, rounded, hover/focus state matching existing nav-link motion.
- Centered within `.section-shell`, max width ~720 px so the form doesn't sprawl on wide screens.

### Accessibility
- Every input has an explicit `<label for>`.
- Honeypot uses `.hidden { display: none; }` (hidden from everyone; bots still fill it).
- Native `required`/type validation; correct input types (`email`, `date`, `tel`) for mobile keyboards.

---

## 4. Thank-you page (`thank-you/index.html` → URL `/thank-you`)

- Reuses `styles.css` and the existing logo, via root-absolute paths.
- Centered, brand-styled layout:
  - Small logo wordmark
  - H1: **"Thank you — your request is in."**
  - Sub: *"We'll be in touch within 48 hours with a custom quote for your event. In the meantime, see our latest work on Instagram."*
  - Buttons: **"Follow @hausofballoons.ca"** (→ Instagram) and **"Back to home"** (→ `/`)
- `<title>Thank you · Haus of Balloons</title>`; `<meta name="robots" content="noindex">` (no reason to index the confirmation page).

---

## 5. Footer (site-wide `<footer>`)

Placed after `</main>`. White background, brand-red text, thin red top divider (consistent with the section dividers). Responsive grid, single column on mobile.

- **Column 1 — Brand:** small red logo SVG (`assets/logo_text.svg`, reused so no extra download) + tagline.
- **Column 2 — Explore:** links to How it works / Packages / Get a quote (`#get-in-touch`). Restores navigation for visitors who've scrolled.
- **Column 3 — Contact:** email (mailto), Instagram link, and a service-area line: *"Serving Toronto (GTA) & Vancouver (Greater Vancouver)."*
- **Bottom bar:** `© 2026 Haus of Balloons` + a discreet **"Back to top"** link (`href="#top"`, smooth-scrolls via existing `scroll-behavior`).

---

## 6. Netlify deployment notes (for the owner, documented — not code)

1. Netlify **form detection** is on by default; the `quote` form will appear under **Site → Forms** after the first deploy.
2. To get submissions emailed: **Site configuration → Forms → Form notifications → Add notification → Email**, set to `hausofballoons.ca@gmail.com`.
3. Submissions are also stored in the Netlify dashboard as a backup.
4. (Domain `hausofballoons.ca` connection is a separate deployment task, handled later.)

---

## 7. Verification / testing

- **Local:** serve the site, confirm the form renders, validates required fields, and the footer/back-to-top/thank-you page render correctly on desktop + mobile widths. (Netlify form submission itself can only be fully verified on a deploy preview, since processing is server-side.)
- **Post-deploy:** submit a test inquiry, confirm redirect to `/thank-you`, confirm it lands in the Netlify Forms dashboard and triggers the email notification.

---

## 8. Open items / assumptions

- Response-time promise set to **"within 48 hours"** (adjustable).
- Budget dropdown brackets are an assumption — easy to change.
- Tagline is a placeholder chosen by the builder, per owner's instruction.
