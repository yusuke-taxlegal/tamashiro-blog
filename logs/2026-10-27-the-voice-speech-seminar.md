# 2026-10-27 スピーチ研修「The Voice」の記事

## 作ったもの

- 記事: `src/content/blog/the-voice-speech-seminar.md`（カテゴリ「経営と仕事の仕組み」・accent coral）
- 元: 2026-10-25 の JC 沖縄ブロック協議会 アカデミー委員会の表現力向上研修「The Voice」の要約と書き起こし（玉城さんが会話に貼ったもの）
- 読む人: 人前で話すのが苦手な人全般（玉城さんが選択）
- 締めの「私が明日から試すこと」は、玉城さんが選んだ「えー」をやめて黙る
- 講師・メンバーの名前は出さない（JC向けスライドで玉城さんが講師名を省く指示をしたのに合わせた）
- 「覚えてもらえるのは1%ほど」は講師の言葉として書いた（調べた数字ではない）
- 画像: `src/assets/blog/the-voice-speech-seminar/`（Codex CLI の標準画像生成ツール・3:2）
  - `hero-tamashiro-yusuke-open-arms-seminar.webp`（玉城祐輔 標準v5＋共通見本v2）
  - `tamashiro-yusuke-pause-before-key-message.webp`（玉城祐輔 標準v5＋共通見本v2）
  - `tamashiro-yusuke-worried-business-owner-nodding-listener.webp`（玉城祐輔 標準v5＋悩める社長v1＋共通見本v2）

## 確かめたこと

- `check_product_article.py` は OK（出典リンクの注意2件は商品記事向けで、この記事には当てはまらない）、`npm run check:affiliate` は問題なし、`npm run build` は成功
- `astro preview`（4331）で、パソコン幅とスマホ幅（375px）で表示を確認。挿絵は読み込み済み、横のはみ出しなし。og:image はヒーロー画像
- `/api/engagement` の 404 は静的プレビューで Functions が動かないためで、記事の不具合ではない
- うなずく場面の挿絵は1回目が玉城さんが読者のほうを向いた絵になり、「体を相手に向ける」と合わなかったので作り直した

## 気づいたこと

- `~/.codex/config.toml` の model が `gpt-6.1-sol` で、ChatGPT の契約では使えずに画像生成が止まった。設定は変えず、この作業のときだけ `-c model="gpt-6-astra"` を付けて動かした。設定を直すかは玉城さんの判断待ち
- 同じ研修の JC 向けまとめスライドは https://jc-thevoice-261025.surge.sh に公開済み（この記事からはリンクしていない）
