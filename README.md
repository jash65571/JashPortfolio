# JashPortfolio

A collection of fully built, production-quality demo websites — one folder per demo,
each a self-contained static site. Built for outreach: real local businesses without a
website get sent the closest-matching live demo link.

**Live site:** `https://jash65571.github.io/JashPortfolio/` (once GitHub Pages is enabled
on this repo — see below).

## Structure

```
JashPortfolio/
├── index.html          ← portfolio landing page, links to every demo
├── localpro/            ← universal local-service template (plumbing/electrical/HVAC)
│   ├── index.html
│   ├── css/styles.css
│   └── js/main.js
└── (more folders added per demo — one per business vertical)
```

Each demo folder is fully self-contained (its own CSS/JS, no shared dependencies), so
any folder can be copied out into its own repo later without breaking anything.

## Demos

| Folder | Concept | Status |
|---|---|---|
| [`localpro/`](localpro/) | Ironclad Home Services — universal trades template (plumbing, electrical, HVAC) | ✅ Built |
| [`restaurant/`](restaurant/) | Ember & Ash — editorial fine-dining concept | ✅ Built |
| [`dental/`](dental/) | Harbor Dental — calming modern clinic concept | ✅ Built |
| [`salon/`](salon/) | The Lockwood Salon — editorial luxury salon concept | ✅ Built |
| [`auto-repair/`](auto-repair/) | Precision Auto Works — trust-focused shop concept | ✅ Built |
| [`electrician/`](electrician/) | Volt Electric Co. — high-contrast industrial concept | ✅ Built |
| [`roofing/`](roofing/) | Summit Roofing — photography-led concept | ✅ Built |
| [`spa/`](spa/) | Still Water Spa — serene wellness concept | ✅ Built |

## Reskinning a demo for a new lead

Each site's CSS uses a small set of design tokens at the top of `css/styles.css`:

```css
:root {
  --color-primary: #1e3a5f;
  --color-primary-dark: #142c48;
  --color-accent: #f2a93b;
  --color-accent-dark: #d9910f;
  --color-bg: #ffffff;
  --color-bg-alt: #f6f8fb;
}
```

Swap these 6 values (and the Google Fonts import in `index.html` if you want a different
typeface pairing), update the business name/copy/service area in the HTML, and the whole
site rethemes consistently — no other CSS edits needed.

## Local preview

Each demo is plain HTML/CSS/JS — no build step. Open `index.html` directly in a browser,
or serve the folder with any static server, e.g.:

```
npx serve localpro
```

## Hosting

GitHub Pages serves this repo from the `main` branch root, so:
- `https://jash65571.github.io/JashPortfolio/` → the landing page (`index.html`)
- `https://jash65571.github.io/JashPortfolio/localpro/` → the Ironclad demo

To enable: repo **Settings → Pages → Source: Deploy from a branch → `main` / `/(root)`**.
