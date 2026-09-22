# 2026-09-22 楽天アフィリエイト受け入れ準備

## 目的

Amazonアソシエイトと同じ形で楽天市場の商品も紹介できるよう、サイト側の仕組みを先に整える。
楽天の契約（サイト登録）が済んだあとは、設定1か所を変えるだけで使える状態にする。

ブランチ: `feature/rakuten-affiliate-prep`

## やったこと

### 1. アフィリエイト設定の正本を作った

`src/lib/affiliate.ts`（新規）。販売先ごとに次を持つ。

- 表示名・購入ボタンの文言・注意書き
- 許可するリンクのホスト（Amazon: `amzn.to` / `tag=`付きURL、楽天: `hb.afl.rakuten.co.jp` / `a.r10.to`）
- 商品画像の扱い（Amazon=リモートURL直参照、楽天=ダウンロードして自サイト）
- 広告表記の一文と `enabled` フラグ

楽天は `enabled: false`、`RAKUTEN_AFFILIATE_ID` は空のまま。契約後にここだけ変える。

### 2. 広告表記をこの設定から生成するようにした

- `src/components/ToolboxPage.astro` のページ下部の広告表記をハードコードから `disclosureNotice` に変更
- `src/pages/affiliate-disclosure.astro` に「現在参加しているプログラム」の一覧を追加（`enabledStores` から生成）

`enabled: true` にすると、両ページの文言が自動で楽天を含む形になる。

### 3. 表示部品を楽天対応にした

- `src/styles/global.css`: `.affiliate-buy-row`（Amazon＋楽天の2ボタン並べ）と `.affiliate-product-button.secondary`（白地・枠線の2つ目のボタン）を追加。560px以下では縦積み。
- `src/components/ToolboxPage.astro`: `tools` に `Tool` 型を明示し、`rakutenUrl` / `rakutenButton` を任意項目として追加。入れると購入ボタンが1つ増える。

### 4. リンクのチェックスクリプトを追加した

`scripts/check-affiliate-links.mjs` ＋ `npm run check:affiliate`。

- 購入リンクが紹介料の出る形になっているか
- `rel="sponsored"` が付いているか
- 楽天の画像を楽天サーバーから直接読み込んでいないか

設定は `src/lib/affiliate.ts` を esbuild で読み込んで使うため、二重管理にならない。
ビルドには組み込んでいない（デプロイが突然落ちないように手動実行）。

### 5. 手順書とスキルを更新した

- `docs/rakuten-affiliate.md`（新規）: 楽天側の申込み手順、設定変更箇所、リンク形式、画像ルール、貼り方、公開前チェック
- `CLAUDE.md`: 「アフィリエイト（Amazon・楽天）」セクションを追加。画像ルールがAmazonと逆である点を明記
- `~/.codex/skills/tamashiro-product-article/`: `references/rakuten-affiliate.md` を追加し、SKILL.mdから参照（このリポジトリ外）

## 検証

- `npm run build` 成功
- `npm run check` エラー0（`ShareButtons.astro` の `execCommand` 警告は従来どおり）
- 道具箱に楽天リンクを仮で足してビルドし、2つ目の購入ボタンが出力されることを確認（確認後に元へ戻した）

## 見つかった既存の問題（未修正）

`src/content/blog/healsio-hotcook-kn-hw24g.md` の購入リンク4か所が `https://amzn.asia/d/077N50rI` になっている。
これはAmazonアプリの共有用短縮URLで、アソシエイトタグが含まれないため**紹介料が発生しない**。
さらにこのURLへのリクエストは404を返した。SiteStripeで作り直した `amzn.to` リンクへの差し替えが必要。
（玉城さんのアカウントでの作業になるため、このブランチでは手を付けていない）

`src/content/blog/avakyo-tank-dishwasher-av-01.md` の出典リストにある素のAmazon商品URLは、出典表示なので問題なし（チェックスクリプトでは warn どまり）。

## 次にやること

1. 楽天アフィリエイトで `https://ysk.life` をサイト登録する
2. `src/lib/affiliate.ts` にアフィリエイトIDを入れ、`enabled: true` にする
3. ホットクック記事のAmazonリンクを作り直す
