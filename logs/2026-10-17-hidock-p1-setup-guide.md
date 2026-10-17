# 2026-10-17 HiDock P1 購入者向けの導入記事

## 作ったもの

- 記事: `src/content/blog/hidock-p1-setup-guide.md`（題名「HiDock P1の使い方。買ったら最初にやること」、カテゴリ「AIの使い方」）
- 画像: `src/assets/blog/hidock-p1-setup-guide/`（15枚）
  - キャラクター挿絵4枚（Codex CLI の画像生成。正本シートを参照画像として渡し、生成後に正本と目で照合）
    - `hero-tamashiro-yusuke-rira-setup.webp`（玉城・Rira🌸）
    - `worried-business-owner-tamashiro-yusuke-unopened.webp`（悩める社長・玉城）
    - `tamashiro-yusuke-rira-first-test.webp`（玉城・Rira🌸。1枚目は赤いBNCボタンを押す絵だったので、✓ボタンを押す絵に作り直した）
    - `accounting-staff-tamashiro-yusuke-daily-upload.webp`（総務・経理担当者・玉城）
  - 画面の図9枚（`screen-`）と図解2枚（`diagram-`）。HTMLで組んで Chrome のヘッドレスで撮影
- 図の元: `docs/figures/hidock-p1-setup-guide/`（`./shot.sh <名前> <幅,高さ>` で撮り直せる）

## 画面の図の正本

- 公式の日本語取扱説明書 PDF（2026-10-09 版。HiNotes v3.0.0 の画面写真）
- 公式のセットアップガイド（日本語版）の2026年4月以降の画像
- hinotes.hidock.com のログイン・登録画面は 2026-10-17 に実画面を見て、色と文言を写した（ログインはしていない）
- P1本体の図は、公式の正面画像の寸法から SVG で描いた

## 公式で確かめた主な事実（2026-10-17）

- 録音は ✓（HiDockボタン）の3秒長押し。赤い丸は BNC ボタン（雑音を抑える機能）で録音ボタンではない
- 関連付けると無料のメンバーシップが付く。製品ページに「文字起こし・要約が無制限かつ無料」「クラウドストレージ：容量無制限」
- 自動転送は初期オン。1時間の録音を1分未満で転送。要約は「今すぐ生成」を押す。1時間で約5〜6分
- 無料の書き出しは TXT のみ。話者識別・Word/PDF・外部連携・翻訳は有料

## 玉城さんの確認（2026-10-17）

- 録音を止める操作は「もう一度 ✓ を長押し」で合っている
- カテゴリは「AIの使い方」のままでよい
- コミットと公開を承認

## 検証

- 機械検査: エラー0件。警告9件は本文の「✓」（P1のボタンの印なので残した）
- `npm run check:affiliate`: 問題なし
- `npm run build`: 成功。`lib/engagement/articles.json` に記事が1行足された（記事と一緒にコミットする）
- プレビュー（astro preview 4331）: 1440px と 390px で画像28枚すべて表示、横のはみ出しなし、og:image 200 image/jpeg、canonical・og:type article、共有ボタン 46×46
- 公開・Git 操作はしていない
