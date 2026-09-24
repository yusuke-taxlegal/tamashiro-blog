# 2026-09-24 記事「AIに業務情報を渡していい？ 小さな会社の現実的な線引き」

- ブランチ: `article/ai-data-sharing-guide`（未コミット）
- 記事: `src/content/blog/ai-business-data-sharing.md`（category: AIの使い方 / accent: coral）
- 元ネタ: 士業事務所との質疑メモ（2026-09-24）。記事内では事務所名を出さず「ある士業事務所」と匿名化。
- スタンス: 学習オフ・法人プランは必須 → そのうえで業務情報は積極的に渡す。「渡す・置き換える・渡さない」の3区分。

## 公式確認（2026-09-24）
- 個人情報保護委員会「生成AIサービスの利用に関する注意喚起等」2023-06-02（別添1 (1)①② を原文確認）
- Anthropic 消費者規約更新 2025-08-28: Free/Pro/Max は学習可否を選択、許可時5年・不許可30日保存。Team/Enterprise/API は対象外
- OpenAI Data controls FAQ: Business/Enterprise/API は既定で学習に使わない。個人は「すべての人のためにモデルを改善する」をオフ

## 画像（Codex CLI で生成、1536x1024 → WebP）
- hero-tamashiro-yusuke-worried-business-owner.webp（玉城v5＋悩める社長）
- tamashiro-yusuke-accounting-staff-anonymize.webp（玉城v5＋総務・経理担当者）
- tamashiro-yusuke-worried-business-owner-checklist.webp（玉城v5＋悩める社長）
- 参照正本: tamashiro-yusuke-character-sheet-v5.png / tl-four-character-style-master-v2.png / worried-business-owner-character-sheet-v1.png / accounting-staff-character-sheet-v1.png
- Readで正本と目視照合済み（髪型・服装・靴・ポニーテール位置、文字化け・ロゴなし）

## 検証
- check_product_article.py: OK / check:affiliate: 本記事OK / npm run build: 成功
- ビルド成果物プレビュー: 画像3枚 naturalWidth>0、375px 横はみ出しなし、og:image にヒーロー画像

## 公開（2026-09-24）
- main へ --no-ff マージ（a70fb2f）し push。Cloudflare Pages で本番反映
- 本番確認: https://ysk.life/blog/ai-business-data-sharing/ が200、og:image（ヒーロー）も200 image/webp

## 追記（2026-09-24 午後）
- ユーザー意見を反映し「出てきた答えを、そのまま流さない」節を追加（出力の固有名詞混入、カスタム指示／プロジェクト指示での事前設定、人の最終確認、AIリテラシー）
- 「今日やる3つ」を4つに拡張、冒頭の結論と締め・descriptionにも出力確認を反映

## 挿絵追加（2026-09-24）
- 追加3枚（Codex CLI生成・正本と目視照合済み）
  - tamashiro-yusuke-accounting-staff-send-check.webp（漏洩経路の節：送信前に手を止める場面）
  - tamashiro-yusuke-worried-business-owner-service-compare.webp（クラウド会計との違いの節）
  - rira-worried-business-owner-output-check.webp（出力確認の節：Rira v3 使用）
- 証跡コメントに rira-character-sheet-v3.png を追記。本文挿絵は計5枚

## Gemini追記（2026-09-24）
- 個人向けGemini: 「アクティビティ」→保存をオフ（myactivity.google.com/product/gemini）。オフでも72時間保存、オン中は人のレビューあり、オフにすると履歴も残らない点を明記（Geminiアプリのプライバシーハブで確認）
- 法人: Google WorkspaceのGeminiは既定で学習なし・人のレビューなし（Workspace生成AIプライバシーハブで確認）

## 専門家としての補強（2026-09-24）
- 冒頭に「商工会などの公式見解ではなく私の考え」と明記
- 法人プラン節に最低契約人数の注意、「守秘義務のある仕事は法人プランを前提に」小節を追加
- 法律面に「設定だけで法律上十分とは限らない」小節（委託先の管理、外国事業者、プライバシーポリシー見直し・弁護士確認）
- 周辺見直しに「大手以外のAIツール」小節（無料議事録アプリ・拡張機能、ドライブ等の連携範囲を絞る）
- AIリテラシーの箇条を「信頼できるサービスを選び…」に修正

## クラウド会計との違いの節を削除（2026-09-25）
- ユーザー判断で「ネットショップやクラウド会計と、何が違うのか」節（3小節）を丸ごと削除
- 同節の挿絵 tamashiro-yusuke-worried-business-owner-service-compare.webp も削除（他記事で未使用を確認）
- description、「大手以外のAIツール」節、締めの文から「クラウド会計」への参照を外して言い換え
