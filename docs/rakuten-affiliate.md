# 楽天アフィリエイト 導入・運用ガイド（ysk.life）

Amazonアソシエイトと同じ形で、楽天市場の商品も紹介できるようにするための手順書です。
サイト側の仕組み（表示部品・広告表記・チェック）は準備済みなので、**楽天側の申込みが済んだら設定を1か所変えるだけ**で使えます。

用語だけ先に整理します。

| 用語 | 意味 |
|---|---|
| アフィリエイトID | 「誰の紹介か」を楽天に伝える文字列。これが無いリンクは紹介料が発生しません。 |
| ステマ規制 | 広告なのに広告と分からない表示を禁止する法律（景品表示法）。「広告」「PR」等の明示が必要です。 |
| ホットリンク | 他社サーバー上の画像を、自分のページから直接読み込むこと。楽天では避ける運用にしています。 |

---

## 1. 楽天側でやること（玉城さんの作業）

1. 楽天会員IDで <https://affiliate.rakuten.co.jp/> にログインする。審査はなく、楽天IDがあれば使えます。
2. **サイト登録で `https://ysk.life` を登録する。**
   楽天アフィリエイトのガイドラインでは、登録していないサイトへのリンク掲載は禁止です。ここを飛ばすと規約違反になります。
3. 発行されたアフィリエイトIDを控える。
4. 成果の受取方法（楽天キャッシュ／銀行振込）を確認しておく。

> 参考: [楽天アフィリエイトガイドライン](https://affiliate.rakuten.co.jp/guideline/rule/) ／ [ステマ規制対応](https://affiliate.rakuten.co.jp/guideline/stealth_marketing_regulation/)
> 規約は変わります。実際に貼る前に最新版を確認してください。

---

## 2. サイト側でやること（設定1か所）

[`src/lib/affiliate.ts`](../src/lib/affiliate.ts) を開き、2か所だけ直します。

```ts
export const RAKUTEN_AFFILIATE_ID = '';   // ← 控えたアフィリエイトIDを入れる

	rakuten: {
		...
		enabled: false,                       // ← true にする
	},
```

`enabled: true` にすると、次の表示が自動で切り替わります。

- 道具箱ページ下部の広告表記に、楽天の一文が足される
- 「[広告・紹介について](../src/pages/affiliate-disclosure.astro)」ページの参加プログラム一覧に楽天が並ぶ

文言を個別に書き換える必要はありません。**広告表記の正本はこのファイル1つ**です。

---

## 3. リンクの作り方

1. 楽天アフィリエイトの管理画面で商品を検索し、リンクを作る。
2. 出てきたURLをコピーする。使ってよいのは次の形だけです。
   - `https://hb.afl.rakuten.co.jp/...`（通常リンク）
   - `https://a.r10.to/...`（短縮URL。発行から10年でアフィリエイト機能が切れる点に注意）
3. **`https://item.rakuten.co.jp/...` をそのまま貼らない。** 商品ページの素のURLでは紹介料が出ません。

貼り間違いは次のコマンドで検出できます。

```bash
npm run check:affiliate
```

---

## 4. 商品画像の扱い（Amazonとルールが逆）

| | Amazon | 楽天 |
|---|---|---|
| 自サイトへの画像アップロード | **禁止**。提供元URLを直接参照する | **こちらが原則**。ダウンロードして自サイトに置く |
| スクリーンショット | 禁止 | 禁止 |
| 画像への文字入れ | 禁止 | 禁止（サイズ変更と周辺の加工は可） |
| 必須条件 | — | リンク先が楽天市場だと分かる表示にする |

楽天は「楽天アフィリエイトのリンク作成ページ内の画像をダウンロードして使う」ことを許可しています。
一方で、楽天のサーバー上の画像（`thumbnail.image.rakuten.co.jp` など）を直接読み込む使い方は公式に明記がないため、このサイトでは採用しません。

保存先:

- 記事内: `src/assets/blog/<slug>/rakuten-<商品名>.jpg`
- 道具箱: `public/toolbox/<tool-id>-rakuten.jpg`（`<img src="/toolbox/...">` で参照）

---

## 5. 記事への貼り方

`.md` の記事では、Amazonと同じく生のHTMLを書きます。クラス名は共通です。

### 楽天だけを紹介する場合

```html
<div class="affiliate-product-card">
  <a class="affiliate-product-image" href="楽天アフィリエイトリンク" target="_blank" rel="sponsored noopener noreferrer" aria-label="楽天市場で商品名を見る">
    <img src="/画像パス" width="1000" height="1000" loading="lazy" alt="商品画像の説明" />
  </a>
  <div class="affiliate-product-body">
    <p class="affiliate-product-store">楽天市場</p>
    <h3>商品名</h3>
    <p>セット内容や一行説明</p>
    <a class="affiliate-product-button" href="楽天アフィリエイトリンク" target="_blank" rel="sponsored noopener noreferrer">楽天市場で商品を見る</a>
    <p class="affiliate-product-disclosure">広告・アフィリエイトリンクです。価格、在庫、送料、ポイント倍率は楽天市場の商品ページでご確認ください。</p>
  </div>
</div>
```

### Amazonと楽天を併記する場合

ボタンを `affiliate-buy-row` で囲み、2つ目を `secondary` にします（白地・枠線のボタンになります）。

```html
<div class="affiliate-product-card">
  <a class="affiliate-product-image" href="Amazonリンク" target="_blank" rel="sponsored noopener noreferrer" aria-label="Amazon.co.jpで商品名を見る">
    <img src="Amazon提供の画像URL" width="1000" height="1000" loading="lazy" referrerpolicy="no-referrer" alt="商品画像の説明" />
  </a>
  <div class="affiliate-product-body">
    <p class="affiliate-product-store">Amazon.co.jp／楽天市場</p>
    <h3>商品名</h3>
    <p>セット内容や一行説明</p>
    <div class="affiliate-buy-row">
      <a class="affiliate-product-button" href="Amazonリンク" target="_blank" rel="sponsored noopener noreferrer">Amazon.co.jpで商品を見る</a>
      <a class="affiliate-product-button secondary" href="楽天アフィリエイトリンク" target="_blank" rel="sponsored noopener noreferrer">楽天市場で商品を見る</a>
    </div>
    <p class="affiliate-product-disclosure">広告・アフィリエイトリンクです。価格、在庫、送料、付属品は各商品ページでご確認ください。</p>
  </div>
</div>
```

画像はどちらか一方の規約に合わせる必要があります。**画像をAmazon提供URLにしたなら、その画像のリンク先はAmazonにする**（楽天へ飛ばさない）。逆に楽天からダウンロードした画像を使うなら、リンク先は楽天にします。

---

## 6. 道具箱への追加

[`src/components/ToolboxPage.astro`](../src/components/ToolboxPage.astro) の `tools` 配列に、楽天用の項目を足すだけで2つ目のボタンが出ます。

```ts
	{
		id: 'example',
		channel: 'Amazon・楽天',           // カード上部のラベル
		url: 'https://amzn.to/xxxx',       // 1つ目のボタン
		button: 'Amazonで商品を見る',
		rakutenUrl: 'https://a.r10.to/xxxx',   // ← 足すとボタンが1つ増える
		rakutenButton: '楽天市場で商品を見る', // ← 省略時は「楽天市場で商品を見る」
		...
	},
```

---

## 7. 公開前チェック

- [ ] `npm run check:affiliate` がエラーなしで通る
- [ ] `npm run build` が通る
- [ ] 390pxと1440pxで購入枠を表示し、画像が崩れていない
- [ ] 購入ボタンとカード画像のリンク先が一致している
- [ ] 「広告・アフィリエイトリンクです」の一文が購入枠のすぐ下にある
- [ ] 価格・在庫・ポイント倍率を記事に固定で書いていない（変動するため景表法上のリスク）
- [ ] 楽天アフィリエイトの管理画面で ysk.life がサイト登録済み

---

## 8. 迷ったときの原則

- 紹介料の帰属は**玉城祐輔個人**。T&Lサポート株式会社の収益と混同しない。
- 報酬の有無で評価を変えない。良い点と注意点の両方を書く。
- Amazonと楽天でルールが違う項目（特に画像）は、**そのリンク先のストアのルールに従う**。
