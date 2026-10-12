# 2026-10-13 部品（依存パッケージ）の既知の弱点をなくした

## なぜ
- 記事タイトルの改行を直したとき（`logs/2026-10-13-h1-line-break.md`）に `npm audit` をかけたら、もとから既知の弱点が11件あった（重大1・高9・中1）
- 重大は Astro（サイトを組み立てる仕組み）で、画像の最適化まわりで外からプログラムを動かされるおそれがあるもの。ysk.life はビルドのときに画像を最適化している

## やったこと
- 作業ブランチ `chore/deps-security-2026-10` で `npm audit fix` を実行（メジャー更新なし。`package.json` の指定は変えず、`package-lock.json` だけが変わった）
  - astro 7.2.1 → 7.3.8
  - sharp 0.35.3 → 0.35.5
  - wrangler 4.121.0 → 4.149.0（開発用。本番の配信には使っていない）
  - ほかに devalue・http-cache-semantics・js-yaml・miniflare・smol-toml・source-map-js・svgo・undici（ほかの部品が中で使っているもの）
- `npm audit`：11件 → 0件

## 確かめたこと
- `npm run check`（型の検査）：エラー0
- `npm run check:api`（記事の反応機能の型の検査）：通過
- `npm run test:engagement`：8件すべて通過
- `npm run check:affiliate`：問題なし（注意3件は、もとからある出典用のAmazonの素のURL）
- 画像の作り置き（キャッシュ）を消してからの `npm run build`：成功（33ページ）。画像222枚をすべて作り直し、壊れたものなし。共有用画像（og:image）も出力
- プレビューで、トップ・記事一覧・記事3本・道具箱2ページ・自己紹介を開き、390pxと1440pxで横はみ出しなし。画像はサイト内・外部（Amazonなど）ともすべて表示。記事タイトルの文節の折り返しもそのまま
