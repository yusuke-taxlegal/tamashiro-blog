# 商工会の魅力3選 記事作成ログ（2026-09-28）

- 記事: `src/content/blog/shokokai-miryoku-3.md`（カテゴリ: 経営の現場 / accent: olive）
- 素材: 子ども育成会YouTube出演の台本たたき台（00_Obsidian/01_T&L_収益化プロジェクト/drafts/2026-09-28_子ども育成会YouTube_①商工会編_台本たたき台.md）
- 事実確認: マル経融資の条件（原則6か月以上の経営指導・沖縄は沖縄公庫）を沖縄振興開発金融公庫の公式ページで確認。様式4が申請に必須であることは商工会議所の案内で確認（2026-09-28）。
- 挿絵: Codex CLIで3枚生成（1536x1024・3:2）。参照正本 = tamashiro-yusuke-character-sheet-v5.png, worried-business-owner-character-sheet-v1.png。3枚とも正本と目視照合済み。
  - hero-tamashiro-yusuke-worried-business-owner-festival-tent.webp（祭りのテント設営を一緒に）
  - tamashiro-yusuke-worried-business-owner-consultation.webp（相談室）
  - tamashiro-yusuke-worried-business-owner-seminar.webp（セミナー）
- 検証: check_product_article.py OK（警告0）/ npm run build 成功 / astro preview で1024px・390px表示、本文画像の読込、og:image・canonical、横はみ出しなしを確認。
- 公開: 2026-09-28 玉城さんの指示で article/shokokai-miryoku-3 ブランチからmainへマージしてpush（Cloudflare Pagesで本番反映）。
- 補足: build により lib/engagement/articles.json が自動更新される（新記事の追加分）。
- 2026-09-28 追記: 相談室の挿絵で悩める社長の腕が不自然だったため、両手でメモを持つポーズで再生成し差し替え（同じファイル名・正本v5/悩める社長v1で目視照合済み）。
- 2026-09-28 追記: 「人が仕事を頼むまでの4段階」に階段の図解挿絵を追加（tamashiro-yusuke-worried-business-owner-four-steps.webp・正本v5/悩める社長v1で目視照合、日本語ラベル4つの表記も確認）。
- 2026-09-28 追記: 玉城さんの指示で、魅力3冒頭の挿絵を「祭りのテント設営（汗をかく）」画像に変更。セミナー画像は「今まさに起きていること」の講師依頼の直後へ移動し、「一緒に汗をかいた時間が仕事になって返ってきた」の2文を追加。
