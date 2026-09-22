# 2026-09-23 Fungoal 番号入りビブス紹介記事の作成

ブランチ: `claude/basketball-bibs-blog-post-f75d67`（worktree）
スキル: `tamashiro-product-article`（Claude Code版・経路A＝画像ハンドオフ）

スキル: `gpt-image-2.5`（Codex CLI経由の画像生成）

## 依頼

長男がバスケ部、玉城は父母会の連絡係。ビブス購入にあたり、カラーが豊富で手軽に買えるAmazon商品を記事にしたい。
指定リンク: `https://amzn.to/3TePjyn`（玉城個人のアフィリエイトリンク）

## 購入の経緯（ユーザーからの追加情報。記事の芯をここへ差し替えた）

- 既存のビブスは白と緑の2色。緑が数枚紛失しており、残り10枚程度
- 汗でびっしょりのビブスを次の子がそのまま着る場面があり、子どもたちに抵抗があった
- 21枚あれば1人1枚に固定でき、使い回しの問題も解決するため、青を新調することにした
- 今後は部員ごとに番号を割り振り、その番号のビブスを個人に持たせる運用を検討中
- 部員は20名以下のため、この運用で回る

初稿では「コーチが番号で部員を呼べる」を結論に置いたが、**実際にはコーチが番号で呼ぶことはない**との指摘を受けて全面的に書き直した。
差し替え後の結論は「番号入り21枚は、1人1枚を固定するために買う」。

## 商品の確認

- 短縮URLの最終遷移先: `https://www.amazon.co.jp/.../dp/B0FTSFJQ8N?...&tag=tamashirotool-22`
- ASIN: `B0FTSFJQ8N`（親ASIN `B0GL1HQQTZ`）。リンク先の組み合わせは スカイブルー / Free Size / 1-21番
- 商品名: `[Fungoal] ビブス 番号入り ゼッケン 5枚/11枚/21枚セット [1-11 12-16 17-21番] 3サイズ 11色 サッカー バスケ`
- バリエーション3軸（Amazonのページ内データから確認）
  - 番号: 1-11番 / 1-21番 / 12-16番 / 17-21番
  - サイズ: Free Size / ジュニア / ユース
  - 色: スカイブルー、イエロー、オレンジ、グリーン、グレー、ピンク、ブラック、ブルー、ホワイト、レッド、パープル（11色）
- 商品画像はAmazon提供URLを直接参照（自サイトへ再アップロードしない）
  - `https://m.media-amazon.com/images/I/71tIgJKCDoL._AC_SL1200_.jpg` / 実寸 1196x1131 / image-jpeg

## メーカー公式で確認した内容（2026年9月23日）

出典: `https://fungoal.com/products/bib` と `https://fungoal.com/blogs/bib/00_bib-guide_pillar`

- サイズ表: ジュニア 55x45cm（〜10歳）、ユース 60x55cm（11〜13歳）、フリー 70x60cm（14歳〜）。男性基準、女子は高校生以上でもユースが適当
- 素材: メッシュのポリエステル。適度な伸縮性、通気性・速乾。下の衣類がやや透ける
- 番号: 前は高さ134mm、背は高さ204mm
- 色分けに向かない組み合わせ: イエローとグリーン / ブルーとスカイブルー / レッドとピンク / グレーとホワイト
- 洗濯: ネットに入れ、裏返して中性洗剤。乾燥機とアイロンは避けて陰干し
- 名入れ: 公式サイトのみ。シルクスクリーン、インクは白か黒、版代なし。Amazon販売分は番号のみ
- 22番以上は公式の「番号指定ビブス」
- 公式サイトのレビュー要約に「生地が薄め」という声がある旨の記載あり

## 競合調査（記事本文には載せていない内部メモ）

検索語: `ビブス 選び方 番号入り ミニバス バスケ 部活 デメリット 洗濯` / `ビブス 購入 父母会 チーム 枚数 色 失敗 後悔`

上位に出るのは、ランキング系メディア、オリジナルビブスの製作業者、メーカー自身の選び方ガイドの3種類。
共通する検索意図は「何枚・何色買えばいいか」「サイズをどう選ぶか」「洗濯で傷まないか」の3点で、
どの記事も購入後の管理（誰が持ち帰ったか、次年度への引き継ぎ）には触れていない。
そこを父母会視点で埋めることを、この記事の役割にした。

## 記事の役割（内部メモ）

バスケ部・ミニバスの父母会や連絡係に、練習用ビブスを何色・何枚買うかと、
Amazonで買うか公式サイトで名入れするかを判断してもらう記事。

## 成果物

- `src/content/blog/fungoal-bibs-number-basketball.md`（新規）
- `docs/image-handoff/fungoal-bibs-number-basketball.md`（新規。ヒーロー1枚＋本文3枚）
- `src/assets/blog/fungoal-bibs-number-basketball/`（空ディレクトリ。画像投入先）
- `.claude/launch.json`（新規。ビルド成果物のプレビュー用。未コミット）
- `lib/engagement/articles.json`（`npm run build` のprebuildで自動更新）

玉城本人の使用体験は書いていない。父母会の連絡係として買う側の立場と、公式仕様・公式ガイドの内容だけで構成した。

## 画像（4枚とも生成・設置済み）

ユーザー指示により、画像ハンドオフ（経路A）ではなく Codex CLI での生成（経路B）に切り替えた。

生成は `codex exec` 経由の標準画像生成ツール。モデル名は指定しない（指定するとOPENAI_API_KEYを要求されて失敗する）。
正本シート3枚を `view_image` で読み込ませ、参照画像として渡すようプロンプトで明示した。

| ファイル | 場面 |
| --- | --- |
| `hero-tamashiro-yusuke-gym-bibs.webp` | 体育館で青い番号入りビブスを1枚ずつ並べる（ヒーロー） |
| `tamashiro-yusuke-color-sort.webp` | 白と緑と青を並べて色の見分けやすさを確かめる |
| `tamashiro-yusuke-order-check.webp` | 自宅でタブレットとメモを見比べて注文内容を確認 |
| `tamashiro-yusuke-assign-numbers.webp` | 用具室で番号ごとに1枚ずつ分け、個人に渡す準備をする |

- 参照した正本: `tamashiro-yusuke-character-sheet-v5.png` / `2026-09-19_style-unified/tl-four-character-style-master-v2.png` / `tamashiro-yusuke-business-casual-character-sheet-v3.png`
- 目視照合: 生成した4枚と正本シートを並べて確認。顔・髪・眉・目・笑顔、ネイビージャケットと白Tシャツ、**黒い紐付き革靴**、約2頭身、手指の破綻なし、日本語・チーム名・ロゴ・透かしの混入なし、写真調の混入なしを確認
- 全カット玉城祐輔ひとり。子どもは描かせていない（正本に子どもキャラクターが無いため）
- 比率は4枚とも3:2（1536x1024）。CLAUDE.mdが認める横長2種のうち、生成物を切らずに済む方を選んだ
- WebPへ変換（sharp、quality 82）。82KBから131KB
- 4枚目の生成直後にCodexの利用枠上限に達した（次回リセットは2026-09-24 6:10）。4枚とも保存は完了している

## 検証

- `check_product_article.py` → `[OK]`（Amazonリンク4件、警告0件）
- `npm run build` 成功（27ページ）
- `npm run check:affiliate` 問題なし（出典リンクに関する警告2件のみ。紹介料の出ない素のURLを出典として貼っているため想定どおり）
- `npx astro preview --port 4331` でビルド成果物を実ブラウザ確認
  - 購入枠2か所とも商品画像が実表示（`complete: true` / `naturalWidth 1196` / `naturalHeight 1131`）
  - 画像リンクと購入ボタンのURLが完全一致（`https://amzn.to/3TePjyn`）
  - 両方に `target="_blank" rel="sponsored noopener noreferrer"` と広告表記
  - canonical `https://ysk.life/blog/fungoal-bibs-number-basketball/`
  - `og:image` と `twitter:image` は生成したヒーロー画像（`/_astro/hero-tamashiro-yusuke-gym-bibs.*.webp`）
  - 本文の挿絵3枚とヒーローがすべて実表示（1536x1024で読み込み完了）
  - 共有欄はLINE・Facebook・Instagram・リンクコピーの4つ。本文左端と座標一致（1440px / 390px とも 14px）
  - 390pxで横はみ出しなし（`scrollWidth 390` = `innerWidth 390`）
  - コンソールエラーは `/api/engagement` の404のみ。Cloudflare Pages Functionsが静的プレビューに無いためで、この記事とは無関係

## スキル側の修正

`check_product_article.py` の `CANONICAL_CHARACTER_SHEETS` が、2026-09-19の画風統一より前（v4世代）で止まっていた。
`CHARACTER_GUIDE.md` が正本なので、現行の5ファイル（v5 / 共通見本v2 / Rira v3 / Riku v3 / Nana v2）を**追加**する形で更新した。
旧版は削除していないため、既存記事の証跡は壊れない。

- 対象: `~/.codex/skills/tamashiro-product-article/scripts/check_product_article.py`
- バックアップ: `/tmp/check_product_article.py.bak`
- スキル同梱のテスト `test_check_product_article.py` は4件すべて成功
- 既存の商品記事5本で回帰確認。`switchbot-lock-pro.md` のみ失敗するが、修正前のスクリプトでも同じ6件が出るため、この修正とは無関係（キャラクター証跡の運用より前に書かれた記事）

## 残っている判断事項

1. Git操作と公開は未実施（明示依頼待ち）
2. `switchbot-lock-pro.md` はキャラクター証跡コメントと画像ファイル名が現行ルールに合っていない。別作業として対応するか要判断
