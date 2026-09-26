# 2026-09-26 CIO NovaPort SLIM DUOII 45W2C 記事の新規作成（仕事の道具）

ブランチ: `article/cio-novaport-slim-duo2-45w`（`main` から分岐）
記事: `src/content/blog/cio-novaport-slim-duo2-45w2c.md`
スキル: `tamashiro-product-article`（画像は Codex CLI の標準画像生成ツール）

## 記事の役割（内部メモ）

セミナー講師や外回りの多い小規模事業者に、ノートPCとスマホを外出先で充電する「鞄に入れる2ポート充電器」として、この薄型45Wで足りるかを判断してもらう記事。

- 玉城本人の利用状況: 購入済み（Amazon注文履歴 2026-09-13、ブラック）。使用期間が短いため、実測値や長期使用の感想は書かず、購入理由と運用の考え方を本人の意見として書いた。
- 商品名・型番: CIO NovaPort SLIM DUOII 45W2C / CIO-G45W2C-N2-S（ブラック -BK、ホワイト -WH）
- ASIN: B0H3278SLM
- 紹介リンク: `https://www.amazon.co.jp/dp/B0H3278SLM?tag=tamashirotool-22`
  - ユーザーから渡された `https://link.amazon/B0fg62zBR` は HTTP 404 で解決できなかったため、ASIN＋アソシエイトタグ付きURLを使用。アソシエイトツールバーの「リンク生成」で amzn.to を発行した場合は差し替える。
- 商品画像: Amazon商品ページの提供画像URL（`m.media-amazon.com/images/I/61AaI2Z+mkL._AC_SL1500_.jpg`、678x945、HTTP 200 image/jpeg）。再アップロードしない。

## 公式確認（2026-09-26）

CIO公式製品ページ（https://connectinternationalone.co.jp/cioproduct/adapter/novaport/novaport-slim-duo-ii-45w2c/）

- USB-C×2、単ポート最大45W（5V3A/9V3A/12V3A/15V3A/20V2.25A、PPS 5-11V 4.05A）
- 2ポート同時: 30W+15W / 15W+30W / 20W+20W（合計45W）
- 入力 100-240V 50/60Hz 1.2A
- 約44.2×78.8×12.5mm（プラグ部除く）、約70g、180°スイングプラグ
- ブラック／ホワイト、付属品は本体と取扱説明書（ケーブルなし）
- NovaIntelligence（電力自動配分）、NovaSafety2.0（温度監視）、NovaEngine／平面トランス
- 希望小売価格は記事に載せない（価格固定表示禁止）

CIO公式 65W2C 製品ページ: 約46.4×87.4×12.5mm、約90g、45W+20W / 20W+45W / 30W+30W。

CIO公式 製品延長保証サービス（2023-07-12発表）: 標準1年、会員登録＋延長保証登録で最大2年、無料、購入履歴が必要、フリマ・譲り受けは対象外。

## 競合調査（本文には載せない）

検索語: 商品名 ＋ レビュー／デメリット／2台同時／出力配分。閲覧数は非公開のため、検索上位・専門メディア・具体性を代替指標にした。

- マクリン（makuring.jp）: 外観→単ポート→2ポート配分→向いている人→まとめ。実測 MacBook Air 40W超、iPhone 17 Pro 約25W、同時で約26.6W+約13.6W。デメリットはケーブル非付属。
- でこにく（dcy284.jp）: 薄さ→スイングプラグ→仕様→実測→長所短所→推奨。45Wはスマホ・タブレット併用、65WはノートPCまで、という選び分け。
- YASUO-JP（note）: 保証→仕様→世代差→プラグ→45Wの実用性。発熱・同時使用・耐久は短期評価と明記。
- 価格.com: 型番・仕様の照合のみ。レビュー0件。

共通する読者の不安: 2台同時で何Wになるか、MacBookを充電しながら使えるか、ケーブル・USB-Aの有無、65Wとどちらを選ぶか、発熱。記事の「2台同時に差すと何が起きるか」「購入前に確認したいこと」「FAQ」に反映した。第三者の実測値は1か所だけ、主張の直後に最小限のリンクで示した。

## 画像

生成: `scripts/generate_character_image.sh`（Codex CLI 標準画像生成ツール、1536x1024、3:2）。生成後にReadツールで開き、正本シートと並べて目視照合した。

| ファイル | 用途 | 登場キャラ | 参照した正本 |
|---|---|---|---|
| `hero-tamashiro-yusuke-seminar-outlet.webp` | ヒーロー（セミナー会場の壁ぎわで充電器を挿す） | 玉城祐輔（ビジネスカジュアル） | tamashiro-yusuke-character-sheet-v5.png, tl-four-character-style-master-v2.png, tamashiro-yusuke-business-casual-character-sheet-v3.png |
| `tamashiro-yusuke-slim-pouch.webp` | 本文「薄さは、鞄の中と壁ぎわの両方で効く」 | 玉城祐輔（ビジネスカジュアル） | 同上 |
| `worried-business-owner-laptop-battery.webp` | 本文「2台同時に差すと、何が起きるか」 | 悩める社長 | worried-business-owner-character-sheet-v1.png |
| `accounting-staff-outlet-check.webp` | 本文「購入前に確認したいこと」 | 総務・経理担当者 | accounting-staff-character-sheet-v1.png |

目視確認の結果は下記「検証」に記載。

### 目視確認（正本シートとの照合）

- ヒーロー／ポーチ（玉城祐輔）: 顔・髪型・太い眉・歯を見せた笑顔が v5 と一致。ネイビージャケット＋白丸首Tシャツ＋ネイビーパンツ、黒い紐付き革靴。約2頭身。文字・ロゴ・余分な人物なし。
- 悩める社長: 頭頂部の立ち上がりと横へ流れる前髪、目の下の疲れ、薄い無精ひげ、チャコールの作業ブルゾン（胸ポケット2つ）、縞ポロ、ベージュのパンツ、茶色の紐付きワークブーツが一致。電池アイコンは数字・文字なし。
- 総務・経理担当者: 低いサイドポニーテール、水色ブラウス、紺ベスト、グレーカーディガン、チャコールのスカート、茶色のフラットローファーが一致。チェックリストは空欄のみ。
- 4枚とも 1536x1024（3:2）のまま WebP 化（quality 82、90〜117KB）。切り抜きなし。

## 検証（2026-09-26）

- `check_product_article.py`: OK（Amazonリンク4、警告0）
- 画像の取りこぼし検査: 4項目すべて（なし）
- `npm run check:affiliate`: 問題なし（既存3記事の注意は従来どおり）
- `npm run build`: 成功、31ページ。`dist/blog/cio-novaport-slim-duo2-45w2c/index.html` 生成
- OGP: `og:type=article`、`og:image` と `twitter:image` がヒーロー画像の絶対URL（1536x1024）。ビルド成果物の画像は HTTP 200 / image/webp
- 実ブラウザ（`astro preview` の成果物、別チャットが起動していた 4331 番を共用）
  - 1440px: 共有アイコン列の左端 177px ＝ 本文カラム左端 177px（差0）。4操作とも 46x46、アクセシブル名あり。LINE/Facebook の共有先に canonical URL がエンコード済み。横はみ出しなし
  - 390px: 横はみ出しなし、共有アイコン4つが横一列（x=14/69/124/178、各46px）。購入枠2か所の Amazon 画像は `naturalWidth` 678 / `naturalHeight` 945 で表示
  - Amazon リンク4本すべて `target="_blank" rel="sponsored noopener noreferrer"`、tag=tamashirotool-22。購入枠に「Amazon.co.jp」と広告表記あり
  - リンクコピーは自動操作環境ではクリップボードが使えず「コピーできませんでした」の案内が `aria-live` で出た（失敗時の案内が機能している）
  - console error は `/api/engagement` の404のみ（静的プレビューで Pages Functions が動かないため。記事の不具合ではない）
- 既知の逸脱
  - H1 はデスクトップで3行。製品名 `CIO NovaPort SLIM DUOII 45W2C` が本文幅（629px）に1行で収まらないため、どの言い回しでも最短3行になる。既存記事も2〜5行が混在しているので現状のタイトルを採用
  - 記事下部の関連記事カルーセルで、非表示スライドの画像1枚が `naturalWidth` 0（共通コンポーネントの遅延読込。今回の記事固有ではない）

## Git

- 作業中に別チャットが同じ作業ツリーで `article/hidock-p1-rewrite` を `main` へマージしたため、本ブランチを最新の `main`（874527a）へ付け直してから作業内容を載せた。
- `.claude/launch.json` の変更（`ysk-life-preview-cio-worktree` 追加）は別チャットのものなので、このブランチには含めない。
- `lib/engagement/articles.json` は `prebuild` が再生成したもので、新記事のスラッグ追加のみ。記事と一緒にコミットする。
- 公開（`main` へのマージ、push、デプロイ）は行っていない。

## 残っている判断事項

- Amazonリンクを、アソシエイトツールバー「リンク生成」の短縮URL（amzn.to）へ差し替えるか（現状はASIN＋tag付きURLで紹介料は出る形）
- トップページ「使ってよかった道具」へ追加するか（別コミットで行う）
- 実際に使った感想（会場での使い勝手、発熱の体感など）を本人の言葉で追記するか

## マージ・公開（2026-09-26 追記）

- ユーザーの依頼で `main` へマージし公開した。
- 先に `origin/main`（dc90892、ケーブル記事・日本通信SIMリライトなどのマージ後）を作業ブランチへ取り込んだ。衝突は `lib/engagement/articles.json` のみで、`scripts/generate-article-manifest.mjs` を再実行して解消（22記事）。
- 取り込み後に `npm run build`（32ページ）、機械検査、アフィリエイト検査を再実行して問題なし。
- `main` へ `--no-ff` でマージ（16cdbbc）し、`origin/main` へ push。
- Cloudflare Pages の自動デプロイ後、約40秒で本番 https://ysk.life/blog/cio-novaport-slim-duo2-45w2c/ が HTTP 200。canonical、`og:type=article`、`og:image`（HTTP 200 / image/webp / 92,072 bytes）、tag 付き Amazon リンク4本を本番HTMLで確認。

## トップページ「使ってよかった道具」への追加（2026-09-26 追記）

- ブランチ `home/cio-novaport-slim-duo2-tool` で `src/pages/index.astro` の `tools` 配列に追加（HiDock P1 の次、2番目）。画像は Amazon 提供のリモートURL（`m.media-amazon.com/images/I/61AaI2Z+mkL._AC_SL1500_.jpg`）を直接参照し、再アップロードしない。
- ビルド成果物を 1440px / 390px で確認。7件目として画像（678x945）が読み込まれ、横はみ出しなし。3列グリッドのため 3+3+1 の並びになる。
- `main` へ `--no-ff` でマージ（cf116c6）し push。本番トップページに7件目として反映済み。
