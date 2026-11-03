# 2026-11-04 スターリンク申し込みの記事

## やったこと

- 記事 `src/content/blog/starlink-applied.md` を作成（届く前の記録。届いたら続きを書く前提）
- 紹介リンク `https://starlink.com?referral=RC-DF-16541981-74598-14` を、冒頭と本文の紹介枠2か所に入れた（`rel="sponsored noopener noreferrer"`・広告表記あり）
- 図2枚（HTMLで組んで撮影。元は `docs/figures/starlink-applied/`）
  - `diagram-campaign-price.webp`：11月28日までの50%オフと、割引の料金の期間の数え方
  - `diagram-referral-flow.webp`：紹介特典7,000円の流れと対象外になるとき
- キャラクター挿絵2枚（Codex CLI で生成）
  - ヒーロー `hero-tamashiro-yusuke-order.webp`：玉城祐輔（ビジネスカジュアル）が沖縄の家の前で屋根のアンテナを思い浮かべる
  - 本文 `tamashiro-yusuke-rira-checklist.webp`：玉城祐輔と Rira が届いたら確かめることのチェック表を見る
  - 参照した正本：tamashiro-yusuke-character-sheet-v5.png、tl-four-character-style-master-v2.png、tamashiro-yusuke-business-casual-character-sheet-v3.png、rira-character-sheet-v3.png。生成後に Read で正本と見比べた（Rira の花の数と位置、イヤーピースが見る人から見て右、玉城の黒い紐付き革靴、約2頭身、文字・ロゴなし）
  - 紹介枠の画像は、ヒーローを縮小した `public/images/blog/starlink-applied/card-tamashiro-yusuke.webp`（切らずに 720x480）

## 公式で確かめたこと（2026-11-04・アプリ内ブラウザで starlink.com を表示して読んだ）

- 公式トップ（日本）：「Starlinkハードウェアとサービスプランの50%オフ（自宅および旅行用）オファーは11月28日で終了」。ホーム ¥3,550/月、ROAM ¥3,460/月（一部地域、11/29まで有効）。30日間トライアル（満足できなければ全額返金）
- 紹介リンクで開くと「このコードでサインアップすると￥7,000—現金またはStarlinkサービスクレジットがもらえます」と出る
- 公式ヘルプ「Starlinkには紹介プログラムがありますか？」：双方が同じ金額、相手が2か月契約した後。アクティベーションから60日後に発行。新規のみ、starlink.com で注文した分だけ、販売店のキットは対象外、リンクなしの注文はあとから追加不可
- 公式ヘルプ「プロモーションサービス料金利用規約」：割引の期間は「6か月間または12か月間など」、使い始めた日か配送30日後の早いほうから。最低利用期間なし。プラン変更・一時停止・解約で割引はなくなる

## 確かめられなかったこと

- キットの価格・レンタルの有無・送料：住所を入れた注文画面でしか出ないため、記事に書いていない（teskas.net の投稿にはホームのアンテナ0円・配送料3,000円とあるが、公式で未確認）
- teskas.net の投稿の「ずっと半額」は、公式の規約（決まった期間）と合わないため採らなかった

## 検査

- `check_product_article.py`：OK（警告0）
- `npm run check:affiliate`：問題なし（既存記事の注意3件のみ）
- `npm run build`：成功。`og:image` はヒーロー画像
- ビルド成果物のプレビュー（4331番）：画像がすべて読み込まれる、canonical は https://ysk.life/blog/starlink-applied/、共有ボタンあり、375px幅で横はみ出しなし

## メモ

- Codex の設定（`~/.codex/config.toml`）のモデル `gpt-6.1-sol` が ChatGPT のアカウントでは使えず、最初の生成が失敗した。設定は変えず、生成スクリプトの写しで `-m gpt-6-astra` を付けて生成した
- 公開（main への合流）はしていない
