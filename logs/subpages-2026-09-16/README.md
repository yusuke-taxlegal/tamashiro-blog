# Subpages journal redesign — 2026-09-16

## Scope and result
Published `/blog/`, `/about/`, `/toolbox/`, `/toolbox/work/`, `/toolbox/home/` using the approved homepage direction: dark named header, white content, warm product backgrounds, coral links, compact footer, responsive layouts. Blog cards retain all 11 published article images. Existing main content and links preserved exactly. Toolbox details and share controls preserved.

New `src/styles/journal-pages.css` is scoped to these pages. Removed superseded inline styles rather than stacking new styles onto old light/dark themes. Main homepage and other routes are byte-identical to the previous production build.

## Illustration
Source: `src/assets/about/tamashiro-current-work.webp` plus canonical `tamashiro-yusuke-business-casual-character-sheet-v3.png` from T&L character-sheets. Viewed both and read CHARACTER_GUIDE.md. Imagegen edit puts pen in subject's right hand (viewer left); notebook moved left and laptop right. Background and hair were not mirrored. Original image retained. Generated PNG: `/Users/tamashiro_yusuke/.codex/generated_images/01a0a6be-ef40-7b21-a90a-c3f57a727dc9/exec-3e3d42b9-dbb8-491e-9a58-8b9fae1cd9ea.png`. WebP encoded at quality 90 without crop.

## Verification
- Local build: 21 pages (includes existing unpublished local article).
- Isolated release build: 20 pages, excludes unpublished article and unrelated dirty work. Five source changes enumerated in release-scope.json.
- All 20 previous HTML routes compared: target main text and links unchanged; other routes byte-identical. See content-preservation.json.
- Browser: 1440px and 390px layouts, image cards, About illustration, toolbox product images, details open/close, genre anchors. No horizontal overflow in inspected pages; no console warnings/errors.
- Corrected scoped CSS specificity for blog cards; confirmed computed display block and pictured PC/mobile layout.
- Corrected mobile toolbox headings to break between phrase and count instead of splitting 道具. Final candidate pictured at 390px.
- Existing GA consent retained.
- Candidate and production: 32 local HTML/CSS/JS/images match exact build bytes. Main public blog has 11 cards and 11 images; unpublished `/blog/ai-driven-school-completion/` remains 404.

## Deployment
Previous production: https://4cce5d3b.tamashiro-blog.pages.dev
Initial candidate: https://4cde92f1.tamashiro-blog.pages.dev
Initial production: https://7100c3f1.tamashiro-blog.pages.dev
Final candidate (mobile title polish): https://7c117732.tamashiro-blog.pages.dev
Final production: https://957cb34d.tamashiro-blog.pages.dev
Public: https://ysk.life/
Cloudflare Pages project: tamashiro-blog. Direct scoped deployment, no Git commit/push or DNS changes. Isolated release path in release-path.txt; based on previous isolated homepage release, not dirty working-tree output.
