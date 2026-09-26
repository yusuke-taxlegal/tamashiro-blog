# 2026-09-26 HiDock P1記事リライトと、トップページ「使ってよかった道具」への仕事の道具追加

ブランチ: `article/hidock-p1-rewrite`

## 1. トップページ「使ってよかった道具」に仕事の道具2点を追加

- 対象: `src/pages/index.astro` の `tools` 配列
- 追加した2点（先頭に配置）
  - HiDock P1 AIボイスレコーダー → `/blog/hidock-p1-ai-recorder/`
    - 画像: `public/images/home-tools/hidock-p1.jpg`（リポジトリ内の `src/assets/blog/hidock-p1/hidock-p1-official-front.jpg` を複製）
  - 日本通信SIM 合理的みんなのプラン → `/blog/nihontsushin-sim-minna-plan/`
    - 画像: Amazon提供のリモートURL（`m.media-amazon.com/images/I/610J5xujCfL._AC_SL1200_.jpg`）。CLAUDE.mdの「Amazon画像は再アップロードしない」に従う。
      日本通信公式のパッケージ画像は190x300pxしかなく、600x450のカードには小さすぎたため不採用。
- 既存3点（ホットクック、食洗機、SwitchBot）はそのまま。合計5点。3列グリッドなので 3+2 の2段表示になる。

## 2. HiDock P1記事のリライト（`src/content/blog/hidock-p1-ai-recorder.md`）

### 方針

- 「一言でいうと何か」を冒頭に置き、文字起こし・要約・クラウド・アップロード・BlueCatch などの用語に一言解説を付けた。
- 「しくみは3つの部品」（本体・パソコン・HiNotes）の節を新設し、「録音しただけでは文字起こしは始まらない」を明示。
- オンライン会議のつなぎ方を番号付き手順に分け、つまずきやすい「マイクとスピーカー両方をP1にする」を強調。
- 「無料でできること、有料になること」を独立した節にし、有料機能を箇条書きで列挙。
- 「導入初日に試しておくこと」を追加。
- `updatedDate: '2026-09-26'` を追加。`pubDate` と `title` は据え置き。

### 公式情報の再確認（2026-09-26）

- HiNotesプラン比較: 無料でもタイムスタンプ付き文字起こし時間は無制限。話者識別・テンプレート追加/カスタマイズ・要約翻訳・Word/PDF等の出力・Notion等連携はプロ。無料の出力は .txt のみ、テンプレートは8種類以上。
- P1 FAQ: 1録音最大4時間、本体連続動作8時間、64GB、75言語、iPhoneは15以降（USB-C）。HiNotesアプリはiOS/Android公開済み。
- 製品ページ: 3つの録音モード（通話・対面・呟き）、macOS/Windows、USB-C対応スマホ・タブレット。
- 紹介プログラム: 「おすすめ商品をご購入で、レジにて自動的に10%OFF」。旧記事の「HiDock全製品10%OFF」表現は「紹介ページに掲載の対象商品」へ修正。
- 旧記事にあった「クラウドストレージ無制限」は今回の製品ページ本文で確認できなかったため、記述を外した。

### 画像

既存4枚（ヒーロー、upload-review、recording-consent、referral-10off）は継続使用。新規4枚を Codex CLI の標準画像生成ツールで生成（1536x1024、3:2）。

| ファイル | 用途 | 登場キャラ | 参照した正本 |
|---|---|---|---|
| `tamashiro-yusuke-before-after.webp` | 録音の前後で会話中の動きが変わる | 玉城祐輔（ビジネスカジュアル） | v5 / style-master-v2 / casual-v3 |
| `tamashiro-yusuke-how-it-works.webp` | 3つの部品（本体・PC・HiNotes） | 玉城祐輔 | 同上 |
| `tamashiro-yusuke-online-meeting.webp` | オンライン会議のつなぎ方 | 玉城祐輔 | 同上 |
| `tamashiro-yusuke-worried-business-owner-free-vs-paid.webp` | 無料と有料の線引き | 玉城祐輔＋悩める社長 | 同上＋worried-business-owner-v1 |

プロンプトは `CHARACTER_GUIDE.md` のビジネスカジュアル版コピペ用プロンプトを使い、Scene/Expression/Background/Aspect ratio のみ記入。
生成後はReadツールで開き、正本シートと並べて目視照合した（結果は下記）。

### 目視照合の結果

- before-after: 顔・髪・眉・笑顔が正本どおり。約2頭身。黒い紐靴。文字なし。採用。
- how-it-works: 顔・髪が正本どおり、黒い紐靴、3カード＋矢印構成が指示どおり。文字なし。採用。
- online-meeting: イヤホン装着、USB-CでつないだP1、マイク／スピーカー記号、4分割の会議画面（顔なし）。顔・靴も正本どおり。採用。
- worried-business-owner-free-vs-paid: 悩める社長（乱れ髪・無精ひげ・グレーブルゾン・縞ポロ・茶色ワークブーツ）と玉城（黒い紐靴）がそれぞれ正本どおりで、顔の混ざりなし。ホワイトボードは記号のみ。採用。
- 4枚とも 1536x1024（3:2）のまま切らずにWebP化（sharp, quality 82）。

## 3. 検証

- `check_product_article.py`: OK（0 warning）
- `npm run check:affiliate`: 本記事は問題なし（他記事の既存注意3件のみ）
- `npm run build`: 成功（30ページ）
- `astro preview`（4331）で実ブラウザ確認
  - トップ「使ってよかった道具」: 5点すべて画像 `naturalWidth>0` で表示。3列＋2列の2段。
  - 記事: 本文の全画像（既存4＋新規4＋公式GIF＋公式商品画像2）が実表示。`og:image` はヒーロー画像。
  - 375px幅で横はみ出しなし（scrollWidth=clientWidth=375）。
  - コンソールの404は `/api/engagement`（静的プレビューではPages Functionsが動かないため。既知）。

## 4. Git

- ブランチ `article/hidock-p1-rewrite` にコミット2件（トップページ変更と記事変更を分離）。ユーザーの「マージして公開して」を受け、`--no-ff` で main へマージし origin へ push（d6c63ed）。
- 注意: 同時刻に別セッションが同リポジトリで `article/cio-novaport-slim-duo2-45w` へ checkout していたため、2コミットは一度そのブランチ上に乗った。コミット内容はHiDock関連ファイルのみだったので、`article/hidock-p1-rewrite` を 54c55fb へ付け直してからマージした。CIO側の未コミット変更（launch.json・CIO記事）には触れていない。
