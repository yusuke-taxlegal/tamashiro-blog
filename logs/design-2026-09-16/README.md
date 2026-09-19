# ysk.life homepage redesign — 2026-09-16

## Accepted direction

User selected initial option 2 (dark hero / white articles), requested option 3 hero copy, removed the handwritten phrase next to the portrait, required each article's hero image, then approved the full-page extension and requested implementation.

Visual truth: selected-design.png. Copy: 「仕事と暮らしの、役立つ実践ノート。」「AI、道具、経営の工夫を、玉城祐輔の経験から。」

## Implementation

- src/pages/index.astro: full approved homepage, latest 3 stories from actual collection, genre links, 3 tools, 2 featured apps + 2 text links, compact bio/footer, homepage metadata.
- src/styles/home.css: homepage-scoped responsive visual system. Existing Japanese system fonts reused; Remix icons via existing astro-icon.
- src/components/Header.astro: optional showName prop defaults false; only homepage opts in.
- public/images/home-tools/: product image originals from existing ToolboxPage source URLs, served locally. Homepage product links go to existing detailed articles.
- ArticleCarousel and blog navigation/helper/layout changes predated this task. They were left in place. The homepage carousel was superseded by the user-approved three-image layout; pre-edit index preserved as index-before.astro.txt. No checkout reset/staging/commit/push.
- Existing untracked AI school completion article remains part of this checkout, and therefore appears first among the new latest-three cards. No publication was performed.

## Assets

- Author: src/assets/people/tamashiro-yusuke-profile-black-2048.jpg; square, unchanged original.
- Logo: existing /images/tamashiro-yusuke-logo.svg?v=3.
- Latest stories: each post.data.heroImage, auto-optimized by Astro.
- Tools: same original image URLs used in src/components/ToolboxPage.astro (Sharp gallery-1.jpg; Amazon 51hQDbCYBOL and 61lQHV7vkFL).
- Apps: public/images/apps/seminarflow-ogp.png and jizoka-ogp.png.

## Verification

See ../../design-qa.md. Build passes (21 pages); 33 home links checked; 11 images loaded; no horizontal overflow at 320/390/768/1440px; browser errors/warnings none. Browser theme → list → article interaction passed. Desktop viewport sequence and mobile region screenshots retained here; stitched full-page browser capture was faulty and excluded.

## Resume / next action

Local static preview: http://127.0.0.1:4322/ (Astro preview daemon). Development server 4321 stopped. Confirm user feedback; production release needs its own scope check because unrelated dirty/untracked work is present. No deployment, DNS changes, or Git publication performed.

## Production release completed — 2026-09-16

User explicitly requested production implementation. Cloudflare account/project readback confirmed tamashiro-blog, production branch main, previous production 55118e90 (source 32d3a63).

- Isolated source snapshot from production commit 32d3a63, overlaid only this task's index, Header, home.css and product assets. Added only the pure sortPostsByRecency helper needed by homepage. Excluded unrelated dirty BlogPost/navigation carousel work and unpublished AI school article. Original working tree left intact.
- Isolated build passed: 20 pages. All 18 non-home index routes matched current production text/link/image-alt content; privacy difference was solely Cloudflare email obfuscation (decoded and matched).
- Preview: https://a8f663e6.tamashiro-blog.pages.dev/
- Production: https://4cce5d3b.tamashiro-blog.pages.dev/
- https://ysk.life/, https://www.ysk.life/, fixed production, project Pages URL and preview all matched built homepage bytes, SHA-256 aec6aaef2516b67320c09d7729f077829c5476b035ab5481652ee6ba086051f7.
- Candidate and production browser checks at 1440px/390px: no horizontal overflow; all 11 images loaded after scrolling, no console errors/warnings. Candidate analytics refusal kept GA unloaded.
- Production asset hashes and linked local route HTTP checks passed (production-smoke.json). Screenshots production-desktop.png and production-mobile.png.
- Source/release folder recorded in release-path.txt. No Git commit/push, DNS changes, or unrelated publication.
- Public latest articles are WWS / HiDock P1 / SeminarFlow, matching published content. Local preview at 4322 still includes untracked AI school article and is not the release source.
