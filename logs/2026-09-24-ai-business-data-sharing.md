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
