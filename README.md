# Jash Patel · Software Developer

**Portfolio:** https://jash65571.github.io/JashPortfolio/

A custom portfolio for production systems, full-stack products, and practical engineering work. It replaces the former local-business demo collection.

## What's here

- A recruiter-focused homepage featuring TASKONO, a live set of 20 browser tools, client work, and interactive system layers.
- Eight complete case studies: ABC Imaging, TASKONO, Careview Specialty Pharmacy, SpareMeet, ReplyProof, ONE FAVOR, Network Discovery, and TryApplyNow.
- A searchable project index with twelve selected projects, including Manuscript Reviewer.
- A readable, printable resume and the original downloadable resume PDF.
- Three playable ONE FAVOR starter boards, with current-state hints, undo, restart, and keyboard controls.
- Direct email, email-copy, LinkedIn, and GitHub contact paths.
- Mobile navigation, reduced-motion support, semantic HTML, metadata, social card, sitemap, and a custom 404 page.

## Design and build

The layout, CSS, content, and interactions are custom. The public pages use plain HTML and CSS with small JavaScript modules. There is no runtime framework, remote font request, analytics SDK, tracking cookie, API key, database, or paid backend.

Node builds the pages from shared templates and content. Generated HTML is committed at the repository root so the existing GitHub Pages branch deployment can serve it directly.

```sh
npm run build
npm run check
npm test
npm run dev
```

Requires Node 22 or newer. There are no npm dependencies to install. Open the local address printed by the server; the site uses the `/JashPortfolio/` base path.

## Edit content

- `src/content.mjs`: career facts, case studies, project data.
- `scripts/build.mjs`: shared page structure and homepage content.
- `assets/site.css`: visual system and responsive layouts.
- `assets/site.js`: navigation, system layers, search, copy, and print controls.
- `assets/game.mjs` and `assets/puzzle.js`: the portfolio puzzle demo.
- `assets/Jash-Patel-Resume.pdf`: original resume supplied by Jash.

Run `npm run build` after editing source templates or content. Commit both the sources and generated pages.

## Publish

GitHub Pages serves `main` from `/` at the public URL above. Push a normal commit to `main`; the Pages workflow deploys the committed static files. `.nojekyll` keeps the site out of Jekyll processing. No custom domain or paid plan is required.

The former site remains in Git history at commit `b26f2c1`. The rebuild does not rewrite that history.

## Content and assets

Employer work is described at a high level. No employer source, customer data, internal screenshots, credentials, or private-repository source trees are included. Performance outcomes are attributed to Jash's supplied resume. Independent projects and client work are labeled by their reviewed status, not assumed commercial success. TASKONO is live at https://taskono.com/. Careview and SpareMeet are described as pre-launch; private repositories stay private.

Project screenshots come from Jash's own work. Fonts are self-hosted Manrope and Instrument Serif, distributed under their included SIL Open Font License files. No generated portraits or stock project images are used.

See [research and content decisions](docs/RESEARCH.md) and [verification](docs/VERIFICATION.md).
