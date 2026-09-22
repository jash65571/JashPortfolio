# Verification

Checked September 22, 2026.

## Build and content

- The Node build generates ten complete HTML pages.
- Local URLs, fragments, images, fonts, resume PDF, and social-card references resolve to nonempty files.
- Every page has one H1, a document language, description, and canonical URL. IDs are unique.
- The content check finds no placeholder copy or empty link targets.
- Career details and project claims were checked against the sources recorded in [RESEARCH.md](RESEARCH.md).
- The original supplied resume is preserved as the PDF download. The HTML version includes TryApplyNow and the other selected projects.

## Browser checks

All ten routes were rendered in Chromium at 320, 390, 768, and 1360 CSS pixels: 40 combinations. The local audit loaded images before testing.

- No horizontal page overflow.
- No failed images.
- No application errors captured by the audit.
- No automated axe-core 4.10.3 violations for the WCAG 2 A/AA, 2.1 A/AA, and 2.2 AA rule tags.

The automated result is scoped to these pages, sizes, and rules. It is not a certification of full WCAG conformance. Desktop and phone layouts also received visual review.

## Interaction checks

- The homepage system-layer controls change the selected layer and explanatory text.
- Mobile navigation opens, closes with Escape, and closes after following a section link.
- Project search matches technology text. Combining a search with an incompatible category shows the empty state. Reset restores all ten projects.
- Copy email places `jash.code8@gmail.com` on the browser clipboard and announces success.
- The ONE FAVOR excerpt completes all three boards. Undo restores the previous holding; restart resets the move count. Hints work after a detour and return a shortest solution from the current state.
- Resume and project links use the repository's GitHub Pages base path.

## Rule tests

Five Node tests pass: expected shortest solutions, invalid-move immutability, the full win condition, solvability of every reachable starter-board state, and snapshot/item conservation.

## Performance and maintenance

The delivered pages are static HTML. Scripts are small, fonts are local, screenshots have dimensions, and lower-page images are lazy loaded. No third-party runtime scripts or APIs are required by the portfolio.

No Lighthouse score or real-user Core Web Vitals result is claimed. The GitHub Actions quality workflow reruns the build, structural checks, and rule tests on pushes and pull requests, and checks that generated files match their source.
