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

## 追加：前の2本から3本目へのリンク（2026-10-17 玉城さんの依頼と公開の OK）

- OneDrive の記事：「作業はパソコン、保管はGoogleドライブ」の節の最後に、決まりではないことと3本目へのリンクの一文を足した
- 共有ドライブの記事：冒頭の「提案です。」のあとに、3本目へのリンクの一文を足した

## 言い方の直し：「決まりにしにくい」→「どのLOMでも同じようにはいかない」（2026-10-17 玉城さんが3案から選んだ）

- 「決まりにしにくい」は、誰が決まりにするのかが抜けていて、言葉としてもぎこちなかった
- 3本目の題・冒頭・結論の見出し、結論の段落（「どのLOMでも同じように回せるとは限らない理由も3つあります」）、前の2本のリンクの文を直した
- 「全国の決まりにする前に」「全国の決まりにするなら」は自然なので残した

## 2本目を「現年のメンバーでの共有」に書き直し（2026-10-17 玉城さんの依頼と公開の OK）

- きっかけ: 完成した議案はアジェンダシステムに全部残り、前の年度の分もダウンロードできる。2本目の「去年の議案が見つからない」という前提が弱かった。玉城さん自身も、委員長から LINE で議案の ZIP を受け取っていた
- 2本目の新しい題: 「JCの議案づくりは『委員会の共有ドライブ』で。LINEでZIPを送り合わない進め方」（URLはそのまま・updatedDate 2026-10-17）
- 形: 年度ごとの共有ドライブ > 委員会 > 事業 > 「01_材料」「02_上程した版」。委員は材料を上げるだけ、組み立てとアジェンダへの上げ下ろしは委員長が Cドライブで（1本目の「作るのはパソコン」と食い違わないように）
- パソコン版Googleドライブの中で組み立てたときに Excel のリンクがどう記録されるかは、玉城さんも未確認。記事ではすすめず「まだ確かめていない」と書いた
- 「Googleドキュメントで文案を一緒に書く」は、玉城さんは未経験。提案として書き、体験談にはしていない
- 画像: 新しい挿絵3枚（ヒーロー・LINEでZIPが行き交う場面・組み立てて戻す場面。正本 v5 と悩める社長 v1 で照合済み）、画面の図2枚を作り直し（`docs/figures/jc-gian-google-shared-drive/fig5-committee-folders.html`・`fig6-upload-joutei.html`）。使わなくなった6枚は外した（git の履歴には残る）
- 3本目: 題を「JCの議案づくりをGoogleドライブで共有する案。便利だけれど、どのLOMでも同じようにはいかない理由」に。便利なところ・手引きの節・試し方を「現年の共有」に合わせた
- 1本目: 2本目と3本目へのリンクの文を新しい題に合わせた

## 「版」をやめる（2026-10-17 玉城さんの指摘と公開の OK）

- 「版」は分かりにくい、と玉城さんから。3本の記事と画面の図で言い換えた：フォルダ名「02_上程した版」→「02_上程した議案」、「最新の版」→「最新のファイル」、「OneDriveの版によって」→「OneDriveのバージョンによって」など
- 撮り直した図：2本目の screen-committee-project-folders・screen-upload-joutei-version、1本目の screen-onedrive-settings・screen-backup-toggle・screen-desktop-before-after
- 製品の正式な名前「パソコン版Googleドライブ」は残した
- ミス帳に feedback_ban_word_unclear.md を足した

## ほかの記事7本の「版」も言い換え（2026-10-17 玉城さんの指示と公開の OK）

- ChatGPT・Claude の記事：「デスクトップ版」→「デスクトップアプリ」（題も）、「ブラウザ版」→「ブラウザ」、「無料版」→「無料プラン」、「最新版」→「最新のバージョン」。URLはそのまま
- ほか5本：古い版と最新版→古いファイルと最新のファイル、note版の記事→noteで公開した記事、1m版→1mのケーブル、200米ドル版→200米ドルの区分、無料版→無料プラン
- 残したもの：「macOS 版をダウンロード」（ボタンの文字）、版画風、上田写真製版所、版代、決定版
