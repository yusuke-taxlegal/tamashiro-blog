# 2026-10-17 記事「JCの議案をGoogleドライブで引き継ぐ案。便利だけれど、まだ決まりにしにくい理由」

- ブランチ: feature/jc-gian-drive-proposal（未コミット・未公開）
- 記事: src/content/blog/jc-gian-google-drive-proposal.md（OneDrive の記事・共有ドライブの記事に続く3本目）
- 玉城さんの依頼の要点: Googleドライブでの議案の保管・引き継ぎは規則ではなく玉城さんが1人でやっていること。1つの案として書く。便利だが、デジタルリテラシーが要る・本会のガイドラインが無くLOMで差が出る・Google Workspace for Nonprofits は審査に通るか分からない。本会もそこを懸念しているかもしれない
- 公式で確かめたこと（2026-10-17）
  - Workspace for Nonprofits は月0円、Business Standard は1年契約で月400円（75%引き）: https://www.google.com/intl/ja/nonprofits/offerings/workspace/
  - 日本の対象に一般社団法人・公益社団法人。審査は Goodstack: https://support.google.com/nonprofits/answer/3215869?hl=ja
  - 申請支援団体（ISVD）の案内には「非営利型の一般社団法人に限る」とする記述あり。本文ではリンクせず「そう書く案内もある」とだけ書いた
- 挿絵3枚（Codex CLI で生成、正本: tamashiro-yusuke-character-sheet-v5.png / worried-business-owner-character-sheet-v1.png、画風見本 tl-four-character-style-master-v2.png も参照）。Read で正本と並べて照合済み
- 確かめたこと: 機械検査 OK、npm run build OK、ローカルプレビューで画像3枚の読み込み・og:image・375px で横はみ出し無し

## 公開（2026-10-17 玉城さんの OK）

- コミット af0bf77 を main へ早送りで合流して push（2d129c1..af0bf77）。Cloudflare Pages が main から自動で本番に出した（Production 17eefdfc-0938-4802-9910-9e637e0226cc・source af0bf77）。wrangler からの直接公開はしていない
- 公開前の点検: `npm run check` エラー0・`test:engagement` 8件合格・`check:affiliate` 問題なし・`npm run build` 成功
- 本番 https://ysk.life/blog/jc-gian-google-drive-proposal/ が 200。canonical 正しい、og:image 200 image/jpeg、記事の画像すべて 200、ブラウザで読み込み失敗 0・コンソールのエラー 0・横はみ出しなし。記事一覧にも出ている
- ブランチ feature/jc-gian-drive-proposal は公開後に消した
- 前の2本の記事から、この3本目へのリンクはまだ無い（足すかは玉城さんに確認）
