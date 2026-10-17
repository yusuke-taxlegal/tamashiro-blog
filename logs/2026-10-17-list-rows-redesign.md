# 2026-10-17 記事の一覧を1行型にそろえる（トップ・読む・ジャンル・記事ページの下）

- 間取りと決めたこと：`design/layout.md`
- 玉城さんの要望：「最近よく読まれている記事」の形を標準に。本数は不要。ジャンルが分かりにくい。ジャンル選びは冒頭に無くてよい
- 調べたこと：ほかのブログ10サイト（ライフハッカー・北欧、暮らしの道具店・note・SWELL/JIN:R のデモ・tokumoto.jp・ゴリミー・Josh Comeau・Simon Willison・Paul Graham）と NN/g の記事。小さい画像を左に置く1行型が日本でいちばん多い形
- 選んだ案：トップはA案（区画を分ける）、読むはD案（小さなジャンルボタン＋人気が先）、ジャンルは3つにそろえる、一番上を小さくする、ジャンルのボタンはジャンルのページへ、記事ページの下もそろえる

## 変えたこと

- 記事の `category` を5種類から3つに（仕事の道具・家と仕事の道具 → 仕事と暮らしの道具／仕事の仕組み・経営の現場 → 経営と仕事の仕組み）
- `/blog/ai/`・`/blog/tools/`・`/blog/management/` を新しく作った
- 大きなカード（ArticleCard）と横に送る一覧（ArticleCarousel）を外した
- `tamashiro-product-article` スキルの記事のひな形の category も直した（保管庫側）

## 確かめたこと

- `npm run build`（40ページ）・`npm run check`（エラー0）・`npm run check:api`・`npm run test:engagement`（8件成功）・`npm run check:affiliate`
- 390px と 1440px：横はみ出しなし、画像の読み込み失敗なし。人気の一覧は本番の `/api/popular` の中身を借りて表示を確かめた
- スマホでのページの長さ：読む 約17,900px → 約5,100px、トップ 約5,600px → 約3,600px

## 別に直すこと

- 人気の一覧を集計する Worker（`ysk-life-engagement-sync`）が 2026-09-19 から公開し直されていない（別の作業として提案済み）
