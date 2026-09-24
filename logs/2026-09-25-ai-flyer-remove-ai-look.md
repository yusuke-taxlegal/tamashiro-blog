# 2026-09-25 記事「AIチラシの「AI臭さ」はなぜ出る？ 原因と消し方とプロンプト例」

- ブランチ: `article/ai-flyer-remove-ai-look`（未コミット）
- 記事: `src/content/blog/ai-flyer-remove-ai-look.md`（category: AIの使い方 / accent: olive）
- 元ネタ: 玉城の気づき（町議選のAIチラシの違和感）と、その後のClaudeとの壁打ち。ユーザーが添付した他者のチラシ4枚は記事に掲載せず、共通パターンだけを文章化。
- 構成: 結論（誰も決めていない部分をAIが平均で埋める）→ 5つの原因 → 問題になる場面・ならない場面 → 解決策3つ（素材を渡す／使わないものを禁止／素材だけAI・仕上げは人）→ 3割削る確認 → 参考サイト → デザイナーの役割
- プロンプト例: 5本（素材を渡す、癖を禁止、質感指定、文字なし素材、最終チェック）

## 参考サイト（2026-09-25確認）
- OpenAI「Image prompting」: 文字は引用符で囲み書体・位置を指定、参照画像ごとに役割を分ける
- Google Cloud公式ブログ「Nano Banana のプロンプト方法の究極ガイド」（2026-03-12）: 参照画像、文字描画
- Canvaヘルプ「Set up Brand Kits」
- LIFULL CREATIVE note（2026-07-21）: 生成っぽさを消す9つの設計術
- Qiita koheisato（2026-07-20）: 角丸枠と過剰表現を禁止
- 上田写真製版所ブログ（2025-12-18）: レイアウトと原稿を分離した検証。結論は仕上げに人の手直しが必要
- ITmedia ビジネスオンライン（2026-09-15）: GeminiとCanvaでチラシ作成。WebFetchの要約が不安定だったため、記事内の説明は「GeminiとCanvaで作る過程とプロンプト紹介」に留めた

## 画像（Codex CLI で生成、1536x1024 → WebP）
- hero-tamashiro-yusuke-worried-business-owner.webp（玉城v5＋悩める社長）
- tamashiro-yusuke-rira-ai-look-causes.webp（玉城v5＋Rira v3）
- tamashiro-yusuke-accounting-staff-brand-materials.webp（玉城v5＋総務・経理担当者）
- riku-worried-business-owner-finish-by-hand.webp（Riku v3＋悩める社長）
- 全画像で集合見本 tl-four-character-style-master-v2.png を併用
- Readで正本と目視照合済み（Riraの花・イヤーピース右、Rikuイヤーピース右、社長の無精ひげ・ワークブーツ、玉城の黒革靴、文字化けなし）

## 共通CSS
- `src/styles/global.css` に `.prose pre.astro-code` の折り返し（pre-wrap）を追加。スマホでプロンプト例が横スクロールになるため。コードブロックを使う記事は現時点で本記事のみ

## 検証
- check_product_article.py: OK / check:affiliate: 本記事OK / npm run build: 成功
- ビルド成果物プレビュー（4331）: 挿絵4枚 naturalWidth=1536、375px・1440pxとも横はみ出しなし、pre 5つとも横はみ出しなし、共有アイコン列と本文左端が一致（177px）、og:image にヒーロー画像
- タイトルが1440pxで5行になったため短縮し4行（既存記事と同程度）に

## 自己紹介の削除（2026-09-25）
- ユーザー指示で、記事冒頭の「T&Lサポート株式会社の玉城祐輔です。」を削除（本記事＋公開済み3記事: ai-adoption-cost-and-skills / ai-business-data-sharing / organizational-ai-repeatable-work）
- 再発防止として CLAUDE.md と tamashiro-product-article の article-template.md 推敲チェックに禁止ルールを追記
