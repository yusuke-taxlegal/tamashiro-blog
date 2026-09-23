# 2026-09-23 スケーター パンどろぼう弁当箱（360ml）記事の作成

ブランチ: `feature/pandorobou-bento-article`
記事: `src/content/blog/skater-pandorobou-lunchbox-360ml.md`

## 依頼の背景

知人から「保育園用の弁当箱の記事を書いてほしい」と依頼。1歳の子の保育園用に
270mlか360mlで迷い、最終的に360mlのパンどろぼう柄を選んだ、という実際の相談。
玉城さんの指示は「子ども4人を育てて、360mlなら結構長く使えた、という話で良い」。

## 記事の切り口

「1歳に360mlは大きい。それでも360mlを選んでいい」。
容量は"今ちょうどいい大きさ"ではなく"何年使うか"で選ぶ、という判断軸。

玉城本人がこの商品を使っている事実は未確認のため、商品固有の使用体験は書いていない。
書いたのは「360mlという容量を子ども4人で長く使えた」という容量についての実感のみ。

## 裏取り（2026-09-23）

- スケーター公式オンラインショップの当該商品ページ（JAN 4973307646942）で全仕様を確認
  - 360ml / 130mlの中子1個付き / 幅148×奥行123×高さ56mm
  - 耐熱: フタAS樹脂 -20〜100度、本体・中子・仕切PP -20〜140度、止具ABS -20〜100度、
    パッキンシリコーン -20〜140度
  - 抗菌は無機抗菌剤の「練込」、加工部位は全体、SIAAマーク
  - 日本製、名前シール付き、食洗機可、フタを外して電子レンジ可
  - 交換用パッキンが単品で購入可（品番556302、抗菌加工、187円）
    → 「なくしても本体ごと買い直さなくていい」という戻り方として記事に採用
- Amazon商品ページ（ASIN B0C93TQY6N）で
  - 「お弁当箱半分に入るご飯の量はお茶碗(約200ml)約0.9杯分」
    → 1歳には半分でも多い → 中子と高い仕切りで少なく詰める、という論の根拠
  - SIAA認証番号 JP0122581X0010B
- 短縮URL `https://amzn.to/4y6woF3` の最終URLが
  ASIN B0C93TQY6N / tag=tamashirotool-22 であることを確認
- 年齢別の容量目安は mamanoko の記事を最小限リンクして引用
  （3歳ごろまで270ml前後 / 3〜4歳ごろ360ml / 5歳ごろ450ml）
  → 当初もっと細かい表を書いていたが、出典で裏が取れる粒度に落とした
  → 「年長まで足りる」も「年中あたりまでは足りる」に修正

## 競合調査（記事本文には載せない）

「1歳 保育園 お弁当箱 サイズ 270ml 360ml 選び方 失敗」等で検索。
共通して出てくる読者の不安は次の4つで、これを記事の節に対応させた。

1. サイズが大きすぎる／小さすぎる → 「サイズの目安を、そのまま受け取らない」
2. 子どもが自分でフタを開けられるか → 「買う前に、園に2つ確認する」
3. 園のルール（保温庫・形の指定） → 同上
4. 洗いにくさ・パッキンの管理 → 「買ったその日にやること」

多くの記事が「1歳なら270ml」で終わっているため、
「満杯にしない前提なら360mlでいい」という逆の結論を軸にして差別化した。

## 画像

ElevenLabsコネクター（creative_generate_image / gemini-3-pro-image）で生成。
Codex CLIではなくElevenLabsを使うのはユーザー指示による。

正本シートはローカルPNGのため、当初 `creative_upload_flow_reference` の
ファイル選択に頼ろうとしたが機能せず。最終的に
`creative_create_asset_upload` → curlでPUT → `creative_finalize_asset_upload`
で3枚とも直接アップロードして参照ノード化した。次回もこの手順を使う。

参照した正本シート:
- tamashiro-yusuke-character-sheet-v5.png（顔・画風）
- tl-four-character-style-master-v2.png（共通画風）
- tamashiro-yusuke-business-casual-character-sheet-v3.png（衣装）

衣装をビジネスカジュアルにしたのは、既存のホットクック記事のヒーロー画像が
ネイビージャケット＋白Tシャツで、家の場面の既存表現に合わせるため。

比率は16:9（gemini-3-pro-imageの出力）。切らずにそのまま使う。

フロー: https://elevenlabs.io/app/flows/ktR4GVZhb42OCOg9bx3x

## 失敗と学び

- 参照画像を渡すために claude.ai 側に作業用Artifact（正本シート置き場）を作ったが、
  Artifactのアセットは外部から取得できず使えなかった。
  Artifactの削除は確認ダイアログが必要でセッションからは実行できないため、
  ユーザーに手動削除を依頼した。
- ElevenLabsの `creative_upload_flow_reference` は、ユーザーが選んだファイルが
  ワークスペースのライブラリには入るが、待機中の参照ノードには自動で付かなかった。
  `creative_get_available_assets` → `creative_add_flow_asset_node` で拾い直せる。

## 挿絵の生成結果（全4枚、gemini-3-pro-image）

| ファイル | 場面 | 生成回数 |
|---|---|---|
| hero-tamashiro-yusuke-morning-bento.webp | 朝の台所で少なめに詰める | 1回で採用 |
| tamashiro-yusuke-size-compare.webp | 大小2つを見比べる | 1回で採用 |
| tamashiro-yusuke-lid-check.webp | 留め具を親指で開ける | 3回目で採用 |
| tamashiro-yusuke-wash-gasket.webp | パッキンを外して洗う | 2回目で採用 |

いずれも1376x768（16:9）。切らずにそのまま使用。全4枚をReadツールで開き、正本シートと
並べて目視照合した（顔・髪・眉・目・笑顔・衣装・黒い紐靴・頭身・手指・文字混入）。

### gemini-3-pro-image で起きた崩れと対処

1. **半ズボン・素足になる**
   ガイドのプロンプトにある "matching short deep-navy trousers" の "short" を
   「半ズボン」と解釈された。座りポーズで特に出やすい。
   → `FULL-LENGTH ... trousers that cover the legs all the way down to the ankles`
     `NO shorts, NO bare legs` と書き足して解消。
   → **ガイドの英語プロンプトをそのまま使うときは、この1点だけ補強する。**

2. **正本シートのレイアウトを真似して2コマ分割の画像になる**
   参照画像が多ポーズのキャラクターシートなので、出力までシート風の並べ方になった。
   → `One single continuous illustration of one room, containing exactly one adult man.`
     `do not reproduce their multi-pose grid layout` を冒頭に置いて解消。

3. **髪が黒くなり画風が平板になる**
   → `medium DARK BROWN with soft lighter-brown highlight patches` と
     `thick deep purple-brown outlines, flat anime cel shading` を明記して解消。

4. **セーフティフィルタで停止**
   否定表現を並べた書き方（"No ... , no ... , no ..." の羅列）で1回ブロックされた。
   → 肯定文中心の平易な英語に書き直して通過。

### 費用

1枚あたり約3,045クレジット（約0.67ドル）。作り直しを含めて10回生成したので、
概算で約6.7ドル。**作り直しは1回ずつ課金される**ので、
枚数を増やすより1枚を丁寧にプロンプト指定するほうが安い。

## 検証（ビルド成果物 localhost:4331）

- `npm run build` 成功。`npm run check:affiliate` 問題なし
- スキルの機械検査 `[OK]`（Amazonリンク4件、警告0件）
- Amazon商品画像2か所とも実表示（naturalWidth 974 x 720、ホットリンク制限なし）
- 挿絵4枚とも実表示（1376x768）
- 購入リンク4本すべて `rel="sponsored noopener noreferrer"` `target="_blank"`
- canonical `https://ysk.life/blog/skater-pandorobou-lunchbox-360ml/`
- og:image はヒーロー画像
- 共有欄はLINE・Facebook・Instagram・リンクコピーの4つ。記事上下の2か所
- 1440px: 横スクロールなし。共有アイコン列と本文左端の座標差0px
- 375px: 横スクロールなし。共有ボタン46x46px。表2つとも347pxに収まる
