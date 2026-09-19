# UPSIDER記事 制作・確認記録

## 本番公開完了（2026-09-18）

ユーザーの「デプロイ」指示により公開。

- 本番: https://ysk.life/blog/upsider-staff-card/
- 候補: https://7e701cae.tamashiro-blog.pages.dev
- 本番固定: https://6fe08813.tamashiro-blog.pages.dev
- 直前本番: https://957cb34d.tamashiro-blog.pages.dev
- 直前本番の配備用コピーと現行本番32ファイルの一致を確認後、別の配備用コピーに記事・3画像のみ追加。パスはrelease-path.txt。
- 配備用ビルド成功。既存記事本文、About・道具箱・privacyは変更なし。記事追加に伴うホーム・記事一覧・関連記事・件数・RSS・サイトマップの更新を含む。
- 候補、本番固定URL、ysk.lifeのそれぞれ44 HTML/画像/CSS等が配備ファイルとバイト一致。各readback.json参照。
- 候補390px/1440pxで横はみ出しなし、PCタイトル2行。候補スクリーンショットを目視確認。
- 本番ブラウザで記事と3画像の読込、canonical・og:image、横はみ出しなしを確認。page errorsなし。本番OG画像はHTTP 200 image/webp。
- 対象外の未公開AIスクール記事は引き続き404。ローカルの別件変更は配備対象外。
- Git commit/push、DNS変更は実施していない。

以下は公開前の制作記録。

- 作成日: 2026-09-18
- 記事: src/content/blog/upsider-staff-card.md
- タイトル: 立替払いを減らす。UPSIDER
- 対象: 地方の小規模法人。代表・スタッフの立替精算を減らせるか判断する記事。
- 本人が法人で契約した事実はユーザーの発言による。利用期間、削減実績、実際の設定値は創作していない。表の金額は運用例と明示。
- 公開・commit・pushなし。既存の未コミット変更は保全。共通CSS・レイアウトの追加変更なし。
- ローカルプレビュー: http://127.0.0.1:4338/blog/upsider-staff-card/
- Astroの既存previewは4322で稼働していたため停止せず、distを別ポート4338で配信。

## 調査

商品名＋レビュー・デメリット・中小企業・経費で検索。my-best、価格.com、idemae、クレジットカードおすすめ研究所、公式お役立ち記事の検索結果から、追加カード、申込対象、利用枠、使える支払先が主な関心事と確認。閲覧数や人気順位は未取得で、人気記事との断定なし。第三者の仕様は採用せず公式で照合。特に第三者のETC非対応記述は現在の公式案内と異なっていたため不採用。

公式確認日: 2026-09-18。

- https://up-sider.com/seminar/startguide/ — 通常カードの料金、リアル/バーチャル、追加発行、権限、即時ロック、外貨取引手数料。
- https://up-sider.com/media/card/147/ — 月間・日次・取引単位の上限、利用先指定。
- https://apps.apple.com/jp/app/upsider/id1658447002 — UPSIDER提供説明の明細確認、通知から領収書添付、管理画面反映。
- https://help.up-sider.com/support/solutions/articles/72000590491 — 個人事業主向けの提供なし。
- 公式ページはwebツールで読取済み。直接urllibではup-sider.comの3ページがHTTPErrorとなったため、全外部リンクの直接取得200は未確認。App Storeと公式ヘルプは直接HTTP 200。

## 画像

組み込みimage_genでヒーロー1枚＋本文2枚。すべて玉城祐輔。
正本: tamashiro-yusuke-business-casual-character-sheet-v3.png。
生成ごとに同正本をreferenced_image_pathsへ入力。正本と生成3枚をview_imageで目視照合。髪・顔・衣装・茶色の紐付き革靴、手、不要な装飾・文字・ロゴ・写真調がないことを確認。
正本シート自体は掲載していない。カード・画面は一般化したイメージで実物再現ではない。

保存先: src/assets/blog/upsider-staff-card/

- hero-tamashiro-yusuke.webp: 1440×960、92,260 bytes
- limits-tamashiro-yusuke.webp: 1440×810、59,024 bytes
- receipt-tamashiro-yusuke.webp: 1440×810、72,700 bytes

プロンプト全文: image-prompts.md。元の縦横比を保ってsharpでWebPへ最適化。

## 検証

- check_product_article.py: OK、警告0。
- npm run build: 成功、22ページ。ログ: build.txt。
- git diff --check: 成功。
- ビルド成果物のページHTTP 200。og:type=article、canonicalはhttps://ysk.life/blog/upsider-staff-card/。
- og:image/twitter:imageは新規ヒーローの絶対HTTPS URL。1440×960、altあり。対応するローカル配信用ファイルはHTTP 200 image/webp。本番は未配備のため本番画像200の確認対象外。
- 1440px: H1約2行、横はみ出しなし。本文と上下共有欄の左端はすべて176.796875px。
- 390px: 横はみ出しなし。共有ボタン8個すべて46×46px。
- 初回ブラウザ検証でページ内画像16個の読込成功を確認。本文挿絵2枚もnaturalWidth>0。
- 上下共有欄が各1組、4つのアクセシブル名、操作前テキスト空欄、LINE/Facebookのcanonicalを確認。
- 実クリックでリンクコピー成功案内、navigator.share非対応を再現してInstagramのコピー・貼付案内を確認。プログラムclickはブラウザの操作要件で失敗したため実クリックで再確認。
- 初回errors/console出力なし。
- desktop-final.png、mobile-final.pngが最終タイトルの画面。本文や共通UIの無関係な変更なし。
