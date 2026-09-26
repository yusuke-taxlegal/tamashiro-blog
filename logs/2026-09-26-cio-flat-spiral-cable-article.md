# 2026-09-26 CIO フラットスパイラルケーブル記事の作成

ブランチ: `article/cio-flat-spiral-cable`（`git worktree` で `../tamashiro-blog-cio-cable` に展開。
共有ツリーにはHiDock記事の未コミット変更が残っていたため、触らないよう分離した）
記事: `src/content/blog/cio-flat-spiral-cable.md`

## 依頼

Amazonの商品ページ（ASIN B0G6K4STRT、モスグリーン 1.5m）のスクリーンショットと
`https://link.amazon/B09LmCTkq` というURLを添えて、スキルで商品記事を作成する指示。
画像はCodex CLIの標準画像生成ツールで生成。

- 添えられたURLは404（`link.amazon` というホストは存在しない）。`amzn.to` の短縮リンクの貼り間違いと
  推定し、記事では `https://www.amazon.co.jp/dp/B0G6K4STRT?tag=tamashirotool-22` を使った。
  `npm run check:affiliate` と `isTrackedAffiliateLink` はこの形式を紹介料が出るリンクとして扱う。
  ユーザーが正しい `amzn.to` リンクを持っていれば差し替える。

## 読者と記事の役割

`ノートPCとスマホを持ち歩く小さな会社の経営者・担当者に、フラットスパイラルケーブルが
自分の持ち歩き方に合うか（重さ・取り回し・転送速度の交換条件を飲めるか）判断してもらう記事`

玉城本人の使用は未確認のため、一人称の使用体験は書いていない。仕様と判断材料を直接書いた。

## 裏取り（2026-09-26）

- CIO公式 製品ページ（CIO-NLSC-FL-CC15）: 最大240W（USB-PD3.1 EPR）、USB2.0 最大480Mbps（理論値）、
  映像出力非対応、ナイロン編み込み、磁石内蔵で渦巻き状にまとまる、6色、1m/1.5m。重量・厚みは非公表。
- Amazon商品ページ: 商品説明の箇条書き、色6種、サイズ2種、レビューのAI要約で「重量」が最多の不満。
  商品画像 `https://m.media-amazon.com/images/I/71rGWfVeHyL._AC_SL1500_.jpg`（1431x1225、JPEG）。
- 第三者レビュー（本文には最小限のリンクのみ）:
  - ROOMIE: 1m版の厚み7mm、61g → 厚み7mmのみ本文でリンク引用
  - note（さしみつ）: 1m実測63g、引き出した長さを固定する力がない
  - yoshi-jun: 片方だけ伸ばせず両端を持つ必要、コシが強い
  - Impress Watch: フレックススパイラル（TPE、戻る力が弱い）との使い分け、金属面に貼り付く

## 競合調査（記事本文には載せない）

「CIO フラットスパイラルケーブル レビュー デメリット」等で9件を確認。
共通する読者の不安は「重い」「片手で伸ばせない・硬い」「USB2.0で遅い」の3点で、
これを「買う前に知っておきたい3つのこと」の節に対応させた。
多くの記事が持ち歩きの快適さで終わっているため、「しまう手間を減らすために重さと取り回しを差し出す
交換条件」を判断軸に置いて差別化した。1m/1.5mの選び方と会社備品としての使い方は競合にない切り口。

## 画像（Codex CLI 標準画像生成ツール、1536x1024、3:2）

`scripts/generate_character_image.sh` で1枚ずつ生成。参照した正本シート:
- tamashiro-yusuke-character-sheet-v5.png（顔・画風）
- 2026-09-19_style-unified/tl-four-character-style-master-v2.png（共通画風）
- tamashiro-yusuke-business-casual-character-sheet-v3.png（衣装のみ。靴は黒に上書き）

プロンプトは CHARACTER_GUIDE.md の「ビジネスカジュアル版コピペ用プロンプト」をそのまま使い、
Scene/Expression/Background/Aspect ratio を記入。スケーター記事の学び（1シーン1人・長ズボン・髪は濃い茶）を
固定ルールとして追記した。

| ファイル | 場面 | 生成回数 | 目視照合 |
|---|---|---|---|
| hero-tamashiro-yusuke-coworking-plug-in.webp | コワーキングでポーチから引き出してPCに接続 | 1回 | 採用。顔・髪・眉・笑顔、ジャケット＋白T、長ズボン、黒紐靴、約2頭身、文字なし |
| tamashiro-yusuke-pouch-vs-tangled.webp | ポーチ内の渦巻きと、絡まった丸ケーブルの対比 | 2回 | 1回目は人物が机の上に立つ構図になり不採用。「床に立つ・机は胸の高さ」を明記して再生成し採用。顔・衣装・黒紐靴・約2頭身は両回とも正本どおり |
| tamashiro-yusuke-both-hands-stretch.webp | 両端を両手で引き伸ばす（片手で伸ばせない） | 1回 | 採用。考え中の表情、ジャケット＋白T、長ズボン、黒紐靴、約2頭身、文字なし。真ん中が戻ろうとするS字も表現できた |

3枚とも1536x1024（3:2）。切らずにそのまま使用。Codexの出力ログで「指定の参照画像3枚をすべて使用」を確認。

## 検証（ビルド成果物 localhost:4332、worktree用に `.claude/launch.json` へ一時追加した設定で起動し、確認後に元へ戻した）

- `npm run check:affiliate` 問題なし（Amazonリンク4本、`tag=tamashirotool-22`）
- スキルの機械検査 `[OK]`（Amazonリンク4件、警告0件）
- 画像の取りこぼし検査 4項目とも「なし」
- `npm run build` 成功（31ページ）
- canonical `https://ysk.life/blog/cio-flat-spiral-cable/`、`og:type` article
- `og:image` はヒーロー画像（1536x1024、alt=記事タイトル）。ビルド成果物に実在し HTTP 200
- Amazon商品画像2か所とも実表示（naturalWidth 1431 x 1225、`referrerpolicy=no-referrer` で表示可）
- 挿絵3枚とも実表示（1536x1024）
- 購入リンク4本すべて `rel="sponsored noopener noreferrer"` `target="_blank"`
- 共有欄はLINE・Facebook・Instagram・リンクコピーの4つ、記事上下に1組ずつ。可視テキストなし、アクセシブル名あり
- 1440px: 横スクロールなし。共有アイコン列の左端177px＝本文段落の左端177px（差0px）。表760px
- 390px: 横スクロールなし。共有ボタン46x46pxが横一列（x=14/69/124/178）。表362px。CTA1行
- console error は `/api/popular` と `/api/engagement` の404のみ（静的プレビューでPages Functionsが動かないため。記事の不具合ではない）
- H1はデスクトップで5行。既存のスケーター記事も同じ5行で、この記事レイアウトの仕様どおり

## 公開・Git（同日、ユーザーの「mainにマージしてデプロイまで」の指示で実施）

- worktree側で `main` を取り出し、`git merge --no-ff article/cio-flat-spiral-cable` → マージコミット `0f2c134`。
  競合なし。マージ後に `npm run build`、`check:affiliate`、機械検査を再実行して通過。
- push直前に再fetchし `origin/main` が `874527a` のまま（HiDock記事公開後）であることを確認してから一度だけpush。
  push後の読み戻し: local main / origin/main / GitHub live main いずれも `0f2c134`。
- Cloudflare Pages（GitHub連携、production branch `main`）の自動デプロイが起動。
  Production deployment `c88af648-3ab1-4851-a8f0-41a2d62d3081`（source `0f2c134`）。
  固定URL `https://c88af648.tamashiro-blog.pages.dev/` と `https://ysk.life/` の記事HTMLが同一ハッシュ（1f1b36bd…）、
  両方HTTP 200、canonical `https://ysk.life/blog/cio-flat-spiral-cable/`、`og:image` は HTTP 200 image/webp 106104 bytes。
  トップページと記事一覧にも新記事が載っている。
- wranglerからの直接デプロイはしていない（自動デプロイと二重にしない）。
- 共有フォルダ `~/Cursor/tamashiro-blog` は別セッションが `article/cio-novaport-slim-duo2-45w` で作業中のため、
  HEADもファイルも触っていない。

## 残っている判断事項

- Amazonリンクを `amzn.to` 短縮リンクに差し替えるか（現状は `tag=` 付き商品URLで紹介料は出る形）
- 玉城本人がこのケーブルを使っているなら、使用体験（重さの感じ方、ポーチでの収まり）を追記できる
- トップページ「使ってよかった道具」へ追加するかは別作業（本コミットには含めていない）
