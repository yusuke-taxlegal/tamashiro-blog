# 2026-10-16 記事「デスクトップが2つある？OneDriveの混乱と、JCの議案リンクが開かない理由」

## きっかけ

JCの仲間の議案で、アジェンダの予算書の見積書リンクが `https://d.docs.live.net/…/Desktop/…/yosan/….pdf` になり開けなかった。原因は Windows の更新後に OneDrive のデスクトップのバックアップがオンになり、議案フォルダが OneDrive のデスクトップに置かれていたこと。バックアップを止めて直った（アイコンの並びが変わった、とも）。玉城さんの依頼で記事にした。

## 作ったもの（ブランチ post/onedrive-desktop-jc-agenda → main に合流）

- 記事: `src/content/blog/onedrive-desktop-jc-agenda.md`（カテゴリ 仕事の道具・accent ink）
- キャラクターの挿絵 2枚（Codex CLI で生成。正本 tamashiro-yusuke-character-sheet-v5.png と worried-business-owner-character-sheet-v1.png を参照画像に渡し、目視で照合）
  - `hero-tamashiro-yusuke-worried-business-owner-two-desktops.webp`
  - `tamashiro-yusuke-worried-business-owner-fix-steps.webp`
- 画面の図 7枚（HTML で Windows 11 / OneDrive の画面を組み立て、Chrome の headless で 2 倍の解像度で撮影）。AI の画像生成だと日本語の画面の文字が崩れるため、この作り方にした
  - 元の HTML は `docs/figures/onedrive-desktop-jc-agenda/`（直すときは HTML を直して `./shot.sh <名前> <幅,高さ>` で撮り直し、WebP にする）
  - screen-two-desktops / diagram-two-desktops / screen-status-icons / screen-agenda-link / screen-onedrive-settings / screen-backup-toggle / screen-c-drive-desktop

## 公式で確かめたこと（2026-10-16）

- Microsoft「OneDrive でフォルダーをバックアップする」（d61a7930-a6fb-4b95-b28a-6552e77c3057）
  - Windows で止めるときは、トグルをオフにして「OneDrive にのみ保存（PCから削除）」か「自分の PC にのみ保存（OneDriveから削除）」を選ぶ
  - 雲のマーク（クラウドのみ）のファイルがあると「移動できないファイルがある」と出る。先に「このデバイス上で常に保持する」
  - 「個人用ファイルはどこにありますか」のショートカットは macOS の節に書かれている。記事では「OneDrive の版によっては」と書いた
- 日本語の画面の言葉は版で違うため、図には「画面のイメージです」と注記した

## 検証

- `npm run build` 成功（34ページ）
- 1440px と 390px で表示を確認。画像 9枚すべて読み込み、横のはみ出しなし、og:image はヒーロー画像、canonical は https://ysk.life/blog/onedrive-desktop-jc-agenda/
- 機械検査 `check_product_article.py`: 警告 0。エラー 14件は「本文の画像はすべて正本キャラクター入り」という商品記事の決まりが画面の図 7枚に当たったもの。図を隠す抜け道は使っていない

## 残り

- 玉城さんの確認（とくに「私は、フォルダごと人に渡すものはパソコンの中で作り…」の一文は玉城さんの意見として書いた）
- 検査スクリプトに、画面の図（screen- / diagram-）を挿絵の決まりから外す仕組みを足すかどうか

## 公開（2026-10-16 玉城さんの OK を受けて）

- コミット 53b3642（記事・画像・図の HTML・作業ログ・記事一覧 articles.json）を main に合流（3cad456）して push。Cloudflare Pages が main から自動で本番に出した（約1分）
- 合流後の確認: `npm run check` エラー0、`npm run test:engagement` 8件すべて成功、`npm run check:affiliate` 問題なし（注意3件はほかの記事）、`npm run build` 34ページ
- 本番 https://ysk.life/blog/onedrive-desktop-jc-agenda/ が 200。タイトル・canonical・og:image が正しく、記事の画像9枚と共有用の画像がすべて 200。ブラウザで画像の読み込み失敗0・コンソールのエラー0。記事一覧にも出ている
- 作業ブランチ post/onedrive-desktop-jc-agenda は削除した

## 追加：止める前と後のデスクトップの図（2026-10-16 玉城さんの依頼と公開の OK）

- 「止めたら、デスクトップのアイコンが消えたように見える」の節に `screen-desktop-before-after.webp` を足した（元の HTML は docs/figures/…/fig8-desktop-before-after.html）。止める前は OneDrive の印付きのアイコンが並び、止めたあとはごみ箱とショートカットだけで、もとの場所を点線で示す
- コミット 81f278f を main に合流（4b5fbfe）して push。`npm run check` エラー0・`test:engagement` 8件成功・build 成功
- 本番で新しい図が 200（image/webp）、ブラウザで記事の画像の読み込み失敗0・コンソールのエラー0

## 追加：「作業はパソコン、保管はGoogleドライブ」の一節（2026-10-16 玉城さんの依頼と公開の OK）

- 玉城さんは「データはクラウドに残す派」。外付けSSDのアフィリエイトではなく、Google Workspace（Google ドライブ）の導入支援につなげると決めた
- 「バックアップを止めたくない方へ」の後に一節を足した。作るのは C ドライブ、上程が終わった議案は Google ドライブ（共有ドライブ）に保管、という分け方。前に Claude が書いた「OneDrive に置く分け方がいちばん迷わない」の一文は食い違うので消した
- コミット d2c7549 を main に合流（74d5830）して push。main には別のセッションの紹介ページの変更（499cc0a・4b67ab9、公開済み）が先に入っていたので、その上に重ねた。`npm run check` エラー0・`test:engagement` 8件成功・build 成功
- 本番で一節があり、消した一文が無いことを確かめた。紹介ページ /about/ も 200 のまま
- 続き：Google Workspace 紹介プログラムの登録（玉城さん）と、JC向けに Google ドライブで議案を作って引き継ぐ続編の記事は、残タスク台帳に記載
