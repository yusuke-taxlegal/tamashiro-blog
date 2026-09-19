# About page roles and JC consultation — 2026-09-19

- Scope: src/pages/about.astro only; existing uncommitted changes preserved. Pre-edit snapshot and incremental patch are in this directory.
- Added all five user-provided roles/qualifications. JC roles explicitly grouped under 2026年度.
- Added JC AI-use and meeting/seminar consultation examples, inquiry guidance, and direct T&L contact links.
- Production contact.js confirms type=seminar and type=ai query presets. Browser clicks confirmed matching selected options; no form submitted.
- npm run build: passed, 24 pages. git diff --check: passed.
- Browser: 1440px and 390px scrollWidth equals viewport, images loaded, no local error console entries. Mobile buttons 350 x 53.5px.
- Preview: http://127.0.0.1:4391/about/
- Not deployed. No Git commit/push performed.

## Production deployment completed

- User explicitly requested deployment. Published final JC and chamber youth division equal-role presentation.
- Baseline production: 558cbfb3; 124 HTML/assets matched current ysk.life before changes.
- Isolated release modifies only about/index.html. No other files changed or added.
- Candidate: https://91816690.tamashiro-blog.pages.dev
- Production fixed: https://04d54dfa.tamashiro-blog.pages.dev
- Public: https://ysk.life/about/
- Candidate, production fixed, and public domain: 124 HTML/assets match release (privacy email protection normalized).
- Production browser 1440px and 390px: no horizontal overflow, all images loaded, no console errors. Roles and inquiry links confirmed.
- Build and git diff --check passed. No Git commit/push or DNS changes.
