# 2026-10-16 記事「JCの議案は『年度ごとの共有ドライブ』へ」（OneDrive記事の続編）

## 何をしたか

- 新しい記事 `src/content/blog/jc-gian-google-shared-drive.md` を書いた（公開前・ブランチ `feature/gdrive-jc-gian`）
- 前の記事 `onedrive-desktop-jc-agenda.md` の「作業はパソコン、保管はGoogleドライブ」の節の最後に、続編への案内を1行足した
- 画面の図 3枚と図解 1枚を HTML で組み立て、Chrome の headless で2倍の解像度で撮った（道具は `docs/figures/jc-gian-google-shared-drive/`。前回の `base.css`・`icons.js` を写し、Googleドライブ用の `drive.css` とアイコンを足した）
- キャラクターの挿絵 3枚（ヒーロー1・本文2）を Codex CLI で生成した（下の「画像」）

## 玉城さんから聞いた運用（2026-10-16）

- 議案はパソコンの Excel・Word で作り、上程が終わったら Google ドライブに上げている
- 共有ドライブは委員会ごとに1つ。委員はコンテンツ管理者
- 使っているのは T&L で契約している Google Workspace の一部。LOM のルールではなく個人のやり方。宜野湾JC が勧めているわけでもない
- LOM には Google Workspace を契約する予算がない。だから記事は「提案」として書く
- アジェンダの見積書リンクに Google ドライブのリンクは使っていない

## 記事で決めたこと（玉城さんの OK 済み）

- 共有ドライブは委員会ごとより「年度ごとに1つ」をすすめる（JC は毎年委員会が組み替わるため）
- 委員は投稿者、委員長・副委員長はコンテンツ管理者、管理者は事務局長・専務理事など2人以上
- 議案フォルダの名前は `日付_協議か審議_事業名_議案の種類`（例 `2027-03-12_審議_4月例会_事業計画`）。フォルダの中のファイル名は変えない（見積書リンクが切れるため）
- 置き場所は「いちばん安心なのは LOM の持ち物。予算がなければ非営利向けの無料プランを調べる（審査あり）。それまでは委員長のアカウントで始め、年度末の渡し方を先に決める」の3段
- アジェンダには今までどおり ZIP で上げ、Google ドライブのリンクは貼らない
- 書いている途中で気づいて足したこと：年度の替わり目の手順4に「前の年度のメンバーでなかった人は、閲覧者で足す」。足さないと、新しい委員長にリンクを送っても開けない

## 公式で確かめたこと（2026-10-16）

- 共有ドライブの権限ごとにできること：Google「共有ドライブのファイルへのアクセスの仕組み」 https://support.google.com/a/users/answer/12380484?hl=ja
  - 投稿者は、ファイルの作成・追加・編集はできる。ゴミ箱への移動と、共有ドライブ内での移動はできない
  - パソコン版 Google ドライブでは、投稿者はファイルを読み取りだけ
  - フォルダを共有ドライブ「へ」動かせるのは管理者だけ（ブラウザでのフォルダのアップロードは作成・追加にあたる）
- Google for Nonprofits の参加資格（日本）：一般社団法人・公益社団法人などが挙がっている https://support.google.com/nonprofits/answer/3215869?hl=ja
- Google Workspace for Nonprofits は 1人あたり月0円 https://www.google.com/intl/ja/nonprofits/offerings/workspace/
- 無料のプランでも共有ドライブを作れる（比較表）https://knowledge.workspace.google.com/admin/billing/compare-google-workspace-features-for-nonprofits
- フォルダのアップロードの手順と「アップロードしたファイルを Google ドキュメント エディタ形式に変換する」の設定 https://support.google.com/drive/answer/2424368?hl=ja
- 確かめきれなかったので書かなかったこと：別の組織の共有ドライブへ、ファイルをそのまま移せるか。記事では「まるごとダウンロードして渡す」とだけ書いた

## 画像

- キャラクターの挿絵 3枚（Codex CLI・`generate_character_image.sh`。参照に渡した正本は tamashiro-yusuke-character-sheet-v5.png・2026-09-19_style-unified/tl-four-character-style-master-v2.png・worried-business-owner-character-sheet-v1.png）
  - ヒーロー `hero-tamashiro-yusuke-worried-business-owner-yearly-shelves.webp`：年度ごとに色の違うファイルが並ぶ棚の前で、玉城さんが悩める社長へファイルを手渡す
  - 本文 `worried-business-owner-tamashiro-yusuke-searching-last-year.webp`：去年の議案を探して困る社長に、玉城さんが声をかける
  - 本文 `tamashiro-yusuke-worried-business-owner-year-handover.webp`：鍵のかかったガラス戸の去年の棚と、新しい年度の棚
  - 3枚とも Read で正本と見比べた（髪・眉・笑顔、紺のスーツと青いネクタイと黒い革靴／無精ひげ・灰色の作業ブルゾン・縞のポロ・ベージュのズボン・茶色のブーツ、約2頭身、文字なし）。作り直しは0回
- 画面の図 4枚（HTML で組み立て）：`screen-yearly-shared-drives`・`screen-member-roles`・`screen-folder-upload`・`diagram-year-handover`。組み立て中に、タブの文字の折り返し・吹き出しの重なり・ダイアログのはみ出しを直した

## 確かめたこと

- 機械検査 `check_product_article.py`：警告 0。エラー 8件は、画面の図 4枚が「本文の画像はすべて正本キャラクター入り」に当たったもの（前の OneDrive の記事と同じ扱い。挿絵 3枚には出ていない）
- `npm run build` 成功。og:image はヒーロー画像、canonical は https://ysk.life/blog/jc-gian-google-shared-drive/
- `npm run check` エラー 0、`npm run test:engagement` 8件すべて成功、`npm run check:affiliate` 問題なし
- 手元の画面（worktree のビルドを 4332番で表示）：1440px と 390px で画像の読み込み失敗 0・横のはみ出しなし・共有ボタン 4つが 46px で1列・前の記事へのリンクあり。コンソールのエラーは /api/engagement の 404 だけ（静的な表示では動かない仕組みで、記事の不具合ではない）
- 見出し（H1）は 1440px で6行。前の記事は5行。このサイトは見出しを大きく折り返す作り

## 残っていること

- 玉城さんの確認と公開の OK。まだコミットしていない（作業場所は `~/Cursor/_worktrees/tamashiro-blog-gdrive`、ブランチ `feature/gdrive-jc-gian`）
- 公開するときは `git-main-release` で main に合流。元のフォルダ `~/Cursor/tamashiro-blog` では、別のセッションが前の記事に図を1枚足す変更（未コミット）を進めている。同じ記事の近い場所に今回の1行を足したので、合流の前に main の変化を見てから重ねる
- Google Workspace 紹介プログラムへの登録がまだなので、紹介リンクは入れていない
