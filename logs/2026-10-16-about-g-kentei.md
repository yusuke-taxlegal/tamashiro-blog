# 2026-10-16 紹介ページ（/about/）に G検定合格を載せる

## やったこと

- 「役職・資格」の先頭に G検定のカードを足した（ロゴ・検定名・回・説明・公式ページへのリンク）。業務DX推進士は下の一覧に残した
- ロゴは JDLA から届いた `logo_DLforG2026#5/Normal/svg/general2026#5_regular.svg` をそのまま写した（`src/assets/about/g-kentei-2026-5.svg`。ファイル名の `#` は URL で切れるので外した）
- ページの説明文（description）に「G検定（ジェネラリスト検定）合格」を足した
- リンク先は公式の https://www.jdla.org/certificate/general/ （新しいタブ）

## ロゴの決まり（G_regulation_v1.1.pdf）で守ったこと

- 横長の基本形を使用。最小サイズ 34mm（画面でおよそ 128px）より大きく表示（パソコン 300px・スマホ 260px）
- 色は変えない（#1c59a8 とホワイト）。白い背景のカードに置き、SVG に含まれる余白をそのまま残して周りに文字を寄せない

## 確かめたこと

- `npm run build` が通る
- パソコン幅（1280px）とスマホ幅（375px）で表示を確認。横のはみ出しなし。見出しと説明文に `word-break:auto-phrase` を足して「合／格」の割れを直した

## 公開（2026-10-16 09:3x JST）

- `feat/about-g-kentei` を main へ早送りで合流 → push（main 499cc0a）。Cloudflare Pages の GitHub 連携で自動公開（Production `7dd30329-47d2-44b3-adf0-ed530fbb4155`・source 499cc0a）。wrangler からの直接公開はしていない
- 公開前の点検：`npm run check` 0 errors・`check:affiliate` 問題なし・`test:engagement` 8件合格・`npm run build` 成功
- 本番 https://ysk.life/about/ と固定URL https://7dd30329.tamashiro-blog.pages.dev/about/ がともに HTTP 200・本文に「G検定（ジェネラリスト検定）合格」・canonical は https://ysk.life/about/ ・ロゴ SVG は 200（image/svg+xml）・ブラウザでロゴ表示・コンソールのエラーなし

## 残り（業務DX推進士）

- 認定証の有効期限が「2025年8月」（2023年8月取得・認定番号 DX01032）。認定は2年有効で、更新テストに合格すると新しい認定証が出る（https://wppo.work/dx.html）。更新していなければ、ページの「業務DX推進士」は今のまま載せられない。玉城さんに更新の有無を確かめる
- 公式ロゴは見当たらない（ページにも検索にも、認定者向けのマークや使い方の決まりが無い）。主催は 一般社団法人ワークパフォーマンス推進機構（旧 IT顧問化協会）。協会のロゴは認定者用ではないので使わない
