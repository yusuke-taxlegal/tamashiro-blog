# 2026-10-17 記事「議案まるごとチェック」の紹介

- 記事：`src/content/blog/jc-gian-marugoto-check.md`
- 画像：`src/assets/blog/jc-gian-marugoto-check/`（キャラクター挿絵4枚＋画面の図5枚）
- ブランチ：`article/jc-gian-marugoto-check`（未コミット・未公開）

## 材料

- 紹介ページ https://kisoku-zaishin.com/ と思いの全文 https://kisoku-zaishin.com/why.html（2026-10-17 に読んだ）
- データの扱い https://kisoku-zaishin.com/check/data（最終更新 2026-10-17）
- 合言葉のメールの文面：`~/Cursor/gian-marugoto-check/src/worker/moushikomi.ts`（ボタンは30日間・別のパソコンは合言葉）

## 画像

- キャラクター挿絵：Codex CLI の標準画像生成で作成。正本 `tamashiro-yusuke-character-sheet-v5.png`・`worried-business-owner-character-sheet-v1.png`・`2026-09-19_style-unified/tl-four-character-style-master-v2.png` を参照画像として渡し、Read で正本と見比べた
  - ヒーロー：1枚目は玉城さんが机の上に立って見えたので作り直した
- 画面の図：`~/Cursor/gian-marugoto-check` を手元で起動し（pnpm dev・5186）、「見本の議案で試す」の架空の議案で撮影（Playwright・1.5倍）。入口の申し込み欄は本番の画面を撮影（送信はしていない）
- `diagram-start-steps`：申し込み欄の画面と3つの順番を HTML で組んで撮影

## 確かめたこと

- `check_product_article.py`：エラー・警告 0
- `npm run build`：成功（37ページ）
- `npm run check:affiliate`：問題なし（既存記事の注意3件のみ）
- 1440px・375px：画像がすべて表示・横はみ出しなし・共有ボタン4つ・og:image が 200（image/jpeg）
