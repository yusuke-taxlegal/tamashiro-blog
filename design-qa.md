# ysk.life ホームデザイン QA — 2026-09-16

final result: passed

## Visual truth / evidence

- Source: `logs/design-2026-09-16/selected-design.png` (841 × 1870 px, the user-approved full-page mock; interpreted at intended desktop width 1440 CSS px, proportional height approximately 3202 px).
- Implementation: `http://127.0.0.1:4322/` (built Astro static output).
- Desktop viewport: 1440 × 1000 CSS px; captured PNGs 1440 × 1000. Source-to-desktop proportional scale 1440/841. Compare section proportions, not literal raster text pixels.
- Full-view evidence: the source and four successive browser viewport images were opened together in the same comparison input: `desktop-top.png`, `desktop-middle.png` (scroll 900), `desktop-apps.png` (scroll 1800), `desktop-bottom.png` (page bottom), all under `logs/design-2026-09-16/`. Together these cover the entire page. Browser fullPage capture produced duplicated/scaled stitching artifacts and was excluded from evidence; viewport captures are authoritative.
- Focused evidence: those 1440px region captures show readable headings, imagery, link styling and footer. Mobile captures: `mobile-top.png`, `mobile-apps.png`, `mobile-bottom.png` (390 × 844).
- State: homepage; no modal. Sticky header stays visible. Some scrolled captures show pointer hover color; that is an intentional interaction state.

## Findings / comparison history

1. Initial implementation used a full-length hero underline, unlike the short rule in the selected image. Fixed to a 42% underline. Post-fix desktop-top.png confirms short coral rule.
2. At 390px, the hero support copy left a short trailing fragment on its own line. Fixed by grouping the two phrases in inline-block spans. Post-fix mobile-top.png confirms two clean lines.
3. Header links now have 44px minimum target height on the homepage, including the brand.
4. Post-fix comparison found no actionable P0/P1/P2 visual or functional findings.

## Required fidelity surfaces

- Typography: bold Japanese sans-serif hierarchy, two-line hero, section headings and readable body. Retained existing system Japanese font stack (Hiragino on this Mac) rather than adding a remote font. Minor glyph/weight differences from generated Noto Sans-style mock are accepted P3; real Japanese text wraps naturally.
- Layout: dark compact hero, white three-column latest posts, pale topic strip, three products, two featured apps, compact biography and dark footer match approved hierarchy. 390px uses one column, a 180px square portrait, wrapped footer links. No horizontal overflow at 320, 390, 768, 1440px.
- Colors: dark #11160f, white and warm #f7f5f0 surfaces; coral rule #ed735b. Text links use darker #bf4a2f for readability on light backgrounds.
- Assets: original square author photo, existing logo, actual article heroImage values, existing app OGP files, original product images copied from URLs already in ToolboxPage. No generated replacement faces/logos/product imagery. All 11 homepage images loaded successfully. Product images use contain, article images retain 3:2, app images retain 1200:630.
- Copy: approved hero and support copy, no handwriting beside portrait. All requested sections present. Recent stories use current content sorted by publication date, so the AI school completion post appears first rather than the mock's fixed WWS/HiDock/SeminarFlow trio; all three show their own thumbnails.

## Functional verification

- `npm run build`: passed, 21 pages.
- `git diff --check`: passed.
- Built-home parser validated all 33 internal/external link entries; local route and fragment targets resolve in dist. RSS/sitemap present. Homepage OGP title and absolute image URL verified.
- Browser interaction: theme link → /blog/#genre-ai → actual AI school article. Correct article heading and existing LINE/Facebook/Instagram/copy share controls present (no external sharing sent).
- Browser console: no errors or warnings returned.
- Responsive: 320/390/768/1440px document width checks passed; desktop and 390px visual checks completed.
- Existing BaseHead analytics consent implementation, article sharing layout and toolbox legal content were not edited. No claim of a new analytics consent audit.

## Follow-up polish / limits

- Native font rendering varies by OS; an exact cross-platform typeface package could be a future refinement.
- No production deployment or Git operations. Existing unrelated changes and unpublished content remain in this checkout.

## Implementation checklist

- [x] Approved layout and copy implemented.
- [x] Real assets and functioning links.
- [x] Post-fix browser comparison and mobile review.
- [x] Build and static-link verification.
- [x] Local preview remains running.

## Production addendum — 2026-09-16

Explicit user deployment request completed. Published isolated production baseline + approved homepage changes, excluding unrelated local work. Release source and proof: logs/design-2026-09-16/README.md, production-readback.json, production-smoke.json. Public home now uses published-only latest posts. Production at https://ysk.life/ verified at 1440px and 390px; all 11 images load, no overflow or console errors. Screenshots: production-desktop.png, production-mobile.png. Final result remains passed.
