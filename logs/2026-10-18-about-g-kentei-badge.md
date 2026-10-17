# 2026-10-18 紹介ページ（/about/）の G検定のリンクを合格の証明（オープンバッジ）へ差し替える

## やったこと

- 玉城さんの指示：「G検定の行に公開ページへのリンクを付けたい。試験の公式ページは不要」
- `src/pages/about.astro` の G検定の行で、ロゴとリンクの行き先を JDLA の公式ページ（https://www.jdla.org/certificate/general/ ）から、オープンバッジの公開ページに差し替えた
  - https://www.openbadge-global.com/ns/portal/openbadge/public/assertions/detail/RnZUMEtBblQ4cXc1cE9remdPQjdLQT09
  - 2026-10-18 朝に LecoS でバッジの受け取りが終わり、ログインなしで開けるようになったページ
- リンクの文言を「G検定の公式ページ」から「合格の証明（オープンバッジ）を見る」に変えた。新しいタブで開く作りはそのまま
- 公式ページへのリンクはページから無くなった（変数 `gKenteiUrl` を `gKenteiBadgeUrl` に置き換え）

## 確かめたこと

- `npm run check` 0 errors・`check:affiliate` 問題なし・`test:engagement` 8件合格・`npm run build` 成功
- 作業場所（worktree `../tamashiro-blog-badge`）のビルド結果をパソコン幅とスマホ幅（375px）で表示。リンクは1行に収まり、横のはみ出しなし

## 公開（2026-10-18 08:1x JST）

- `feat/about-g-kentei-badge` を main へ早送りで合流 → push（main 4d86c62）。Cloudflare Pages の GitHub 連携で自動公開（Production `4f359457-b8c3-478c-9ade-ce36768a79c7`・source 4d86c62）
- 本番 https://ysk.life/about/ と固定URL https://4f359457.tamashiro-blog.pages.dev/about/ がともに HTTP 200・canonical は https://ysk.life/about/ ・本文に「合格の証明（オープンバッジ）を見る」・ロゴとリンクの行き先がバッジの公開ページ（jdla.org へのリンクは 0 件）
- ブラウザで本番を表示し、ロゴの表示とコンソールのエラーなしを確認
- 使い終わった worktree と branch は消した
