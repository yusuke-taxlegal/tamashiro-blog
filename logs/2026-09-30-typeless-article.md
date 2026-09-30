# 2026-09-30 Typeless紹介記事の作成

- 記事: `src/content/blog/typeless-ai-voice-typing.md`（カテゴリ: AIの使い方、accent: ink）
- 公式確認（2026-09-30）: typeless.com トップ、pricing、help/quickstart/dictate、speak-to-edit、faqs、privacy
  - 起動キー: Mac=fn、Windows=右Alt（1回押して開始、もう1回で終了）
  - 無料プランは週ごとの語数上限あり（公式に具体数の記載なし。第三者記事では4,000語/8,000語と食い違い → 記事では数字を書かない）
  - Pro: 年払い/月払いの米ドル建て。価格は固定表示せず公式リンクへ誘導
  - 声と周辺情報はクラウドでリアルタイム処理後に破棄、学習利用なし（プライバシーポリシー 2026-08-25版）
- 構成調査: Lifehacker Japan、miralab、digirise等。本文には載せていない
- 本人の使用体験は書いていない（公式情報ベースの紹介）
- アフィリエイトリンクなし（Typelessにアフィリエイト制度はあるが、リンク未取得）

## 画像（Codex CLI・標準画像生成で生成、1536x1024）
| ファイル | キャラ | 参照した正本 |
|---|---|---|
| hero-tamashiro-yusuke-rira.webp | 玉城祐輔・Rira | tamashiro-yusuke-character-sheet-v5.png、rira-character-sheet-v3.png、tl-four-character-style-master-v2.png |
| worried-business-owner-tamashiro-yusuke-voice-message.webp | 悩める社長・玉城祐輔 | worried-business-owner-character-sheet-v1.png、v5、style master v2 |
| accounting-staff-tamashiro-yusuke-cloud-check.webp | 総務・経理担当者・玉城祐輔 | accounting-staff-character-sheet-v1.png、v5、style master v2 |

- ヒーロー初回生成はノートPCが2台描かれたため作り直し
- 全画像をReadで正本と照合（Riraの花配置・イヤーピース右側、玉城の黒革靴、社長の無精ひげ・ワークブーツ、経理担当のサイドポニー）

## 検証
- check_product_article.py: OK / check:affiliate: 本記事の問題なし / npm run build: 成功
- astro preview（4331）: 記事内3画像の naturalWidth=1536、375px幅で横はみ出しなし、共有UIあり、canonical・og:image出力
- 404は /api/engagement（静的プレビューではPages Functionsが動かないため、既知）
