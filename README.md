# Haus of Balloons

Marketing website for **Haus of Balloons** — a balloon-decor business creating
garlands, backdrops, and full event installations across the **Greater Toronto
Area** and **Greater Vancouver**.

🌐 **Live (planned):** [hausofballoons.ca](https://hausofballoons.ca) · 📷 [@hausofballoons.ca](https://instagram.com/hausofballoons.ca)

## Tech stack

Plain **static HTML + CSS + JavaScript** — no framework, no build step, no
dependencies. Hosted on **Netlify** (contact form uses Netlify Forms).

## Project structure

```
.
├── index.html              # The whole one-page site
├── styles.css              # All styles (brand tokens at the top)
├── main.js                 # Hero animation, Instagram embeds, and carousel controls
├── instagram-posts.js      # Editable Instagram reel/post URLs
├── thank-you/index.html    # Form submission confirmation page (/thank-you)
├── assets/                 # Logo, balloon/circle SVGs, and gallery pictures
├── CHANGELOG.md            # What changed and why — read this first
└── docs/superpowers/specs/ # Design specs
```

## Local development

No build step — just serve the folder with any static server:

```bash
python3 -m http.server 4321
# then open http://localhost:4321
```

> **Note:** the contact form posts to Netlify, so form submission and the
> redirect to `/thank-you` only work on a Netlify deploy, not locally.

## Changing Instagram posts

Edit `instagram-posts.js` and replace the URLs inside `window.HOB_INSTAGRAM_POSTS`.
The page automatically renders those links in the Instagram carousel.

## Deployment (Netlify)

1. Connect this repo to a Netlify site (build command: none; publish directory: root).
2. Add the custom domain `hausofballoons.ca`.
3. **Enable form notifications:** Site configuration → Forms → Form notifications →
   add email notifications for `toronto@hausofballoons.ca` and
   `vancouver@hausofballoons.ca`.

Form detection is on by default, so the `quote` form appears under **Site → Forms**
after the first deploy. Submissions are stored in the dashboard and emailed.

## Docs

- **[CHANGELOG.md](CHANGELOG.md)** — running log of changes, key decisions, and
  current business facts (the best starting point for context).
- **[docs/superpowers/specs/](docs/superpowers/specs/)** — design specs.
