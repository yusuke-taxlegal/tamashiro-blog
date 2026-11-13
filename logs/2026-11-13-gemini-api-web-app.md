# 2026-11-13 Gemini の API の記事（アプリに組み込むAIの選び方）

## 作ったもの

- 記事 `src/content/blog/gemini-api-web-app.md`（カテゴリ：AIの使い方）
- 図3枚（HTMLで組んで撮影。元は `docs/figures/gemini-api-web-app/`）
  - `diagram-chat-vs-app.webp`：会話で使うAIと、アプリに組み込むAIの違い
  - `diagram-cost-1000-runs.webp`：同じ仕事を1,000回動かしたときの費用
  - `diagram-roles.webp`：役割ごとの使い分け
- ブランチ `claude/gemini-api-web-app`。公開（main への合流）はしていない

## 元になった玉城さんのメモと、変えたところ

玉城さんの音声メモの主張は「ChatGPT・Claude の API は賢いが高い。中国の会社のAIは大幅に安いが品質と日本語が弱い。だから Web アプリには Gemini の API が最適」。公式の料金表で見ると、この前提は半分しか合っていなかったので、記事の組み立てを変えた。

- 合っていたところ：上位のモデルどうしなら、Gemini（Gemini 4 Carbon）は OpenAI・Anthropic の4分の1〜5分の1
- 違っていたところ：小さいモデルでは gpt-6-luna と Claude Haiku 5.5（どちらも 0.10ドル／0.50ドル）のほうが、Gemini 3.5 Flash-Lite（0.30ドル／2.50ドル）より安い。DeepSeek の小さいモデルも、アメリカ3社の小さいモデルと大きな差がない
- 記事の結論：費用は「会社」より「モデルの大きさ」で決まる。そのうえで玉城さんが Gemini を選ぶ理由を、無料の枠・資料が Google にある・日本語の使用感・上位のモデルの安さ、として書いた
- 「中国の会社のAIは日本語に弱い」は、確かめられなかったので書いていない
- 「Google はエージェントの市場に乗れていない」は、10月8日に Gemini エージェントが発表されているので、「追いかける側に見える」という玉城さんの見方として書いた
- 会社名（T&Lサポート）は出さず「私の会社」とした

## 公式で確かめたこと（2026-11-13・アプリ内ブラウザで各ページを表示して読んだ）

値段は100万トークンあたり・標準の料金（入力／出力）。

- Google https://aistudio.google.com/docs/pricing
  - Gemini 4 Carbon：2ドル／10ドル（11月30日まで）。12月1日から 4ドル／20ドル。無料の枠なし
  - Gemini 4 Hydrogen：1.50ドル／7.50ドル。無料の枠あり
  - Gemini 3.8 Flash：0.75ドル／3.75ドル（12月31日まで）。2027年1月1日から 1.50ドル／7.50ドル。無料の枠あり
  - Gemini 3.5 Flash-Lite：0.30ドル／2.50ドル。無料の枠あり
  - 「Used to improve our products」は無料の枠が Yes、有料の枠が No。出力の値段は「including thinking tokens」
- OpenAI https://developers.openai.com/api/docs/pricing
  - gpt-6-astra：10ドル／50ドル、gpt-6.1-sol：2ドル／10ドル、gpt-6.1-terra：1ドル／5ドル、gpt-6-luna：0.10ドル／0.50ドル
- Anthropic https://platform.claude.com/docs/en/about-claude/pricing
  - Claude Fable 5.2：8ドル／40ドル、Opus 5.5：4ドル／20ドル、Sonnet 5.5：2ドル／10ドル、Haiku 5.5：0.10ドル／0.50ドル（10万トークンまでの入力。超えると 0.50ドル／2.50ドル）
- DeepSeek https://api-docs.deepseek.com/quick_start/pricing（調べもの用の読み取りで確認）
  - deepseek-flash：入力 0.15〜0.30ドル（キャッシュなし）、出力 0.60〜1.20ドル。時間帯で2倍の差

計算の置き方：1回あたり入力2,000トークン・出力1,000トークン × 1,000回（入力200万・出力100万トークン）、1ドル150円と仮定。

- gpt-6-astra 70ドル＝10,500円、Claude Fable 5.2 56ドル＝8,400円、Gemini 4 Carbon 14ドル＝2,100円（12月から28ドル＝4,200円）
- Gemini 3.5 Flash-Lite 3.10ドル＝465円、gpt-6-luna と Claude Haiku 5.5 0.70ドル＝105円、deepseek-flash 0.90〜1.80ドル＝135〜270円

## 報道で確かめたこと（2026-11-13・記事の本文を読んだ）

- Google：10月8日に Gemini エージェントを発表。まず企業向け、個人向けはその後（時期の記載なし）。他社のモデルも選べ、最初は Anthropic の Claude（TechCrunch 2026-10-08）
- Meta：6月3日に Business Agent を発表。WhatsApp と Messenger で動く（ロイター。The Star 掲載分を読んだ）
- SpaceXAI（旧 xAI）：8月11日ごろ Grok Bot を発表（ブルームバーグ。The Star 掲載分を読んだ）
- 「2月に xAI が SpaceX と一緒になった」は、検索結果の見出しで見ただけで発表の本文を読んでいないので、記事には書かず「イーロン・マスク氏のAIの会社。以前の名前はxAI」（読んだ記事の書き方）とした

## 文章の点検（yasashii-bunsho）

- 「AではなくB」の言い方は0か所。「〜することができます」「〜しましょう」「重要です」も0か所
- 直した主なところ：料金表の書き方を引用の形にしていたのをやめた／「水準」「単価」「完結」「用途」を和語に／短い言い切りが4つ続いていた段落をつなげた／「もう2つ、小さな理由があります」の前置きを消した
- 「調べる前の私は〜と考えていました」「私の目には、Google は追いかける側に見えます」「日本語が自然だと私は感じています」は、玉城さんの言葉として書いた文。公開前に本人が読んで確かめる

## 挿絵（Codex CLI の画像生成で作成・2026-11-13）

- ヒーロー `hero-tamashiro-yusuke-compare.webp`（1536x1024）：玉城祐輔（ビジネスカジュアル）が、会話の吹き出しのカードと、歯車のついたアプリ画面のカードを見比べる
- 本文 `tamashiro-yusuke-rira-cost-chart.webp`（1536x1024）：ホワイトボードの高い棒と低い棒の前で、Rira🌸 が低い棒を示し、玉城祐輔が電卓を持つ
- 参照した正本：tamashiro-yusuke-character-sheet-v5.png、tl-four-character-style-master-v2.png、tamashiro-yusuke-business-casual-character-sheet-v3.png、rira-character-sheet-v3.png。生成後に Read で正本と見比べた（玉城の髪型・太い眉・笑顔、白い丸首Tシャツ、黒い紐付き革靴、約2頭身／Rira の花が見る人から見て右に大小2つ・左に小さく1つ、イヤーピースが右、薄紫の襟と袖口／文字・数字・ロゴなし）
- プロンプトは `CHARACTER_GUIDE.md` のコピペ用プロンプトをそのまま使い、場面・表情・背景・比率だけを埋めた。2人の挿絵は、玉城のビジネスカジュアル用と Rira 用の2つを並べた

## 検査

- `check_product_article.py`：OK（警告0）
- `npm run check:affiliate`：問題なし（既存記事の注意3件のみ。この記事にアフィリエイトリンクはない）
- `npm run build`：成功（46ページ）。`og:image` はヒーロー画像
- ビルド成果物のプレビュー（4331番）：記事の画像5枚がすべて読み込まれる、canonical は https://ysk.life/blog/gemini-api-web-app/、共有ボタンあり、パソコン幅と375px幅でページの横はみ出しなし（料金の表は、スマホ幅では表の中だけ横に動かせる）

## メモ

- Codex の通信が不安定で、ヒーローの1回目は「Reconnecting」をくり返して27分止まった。止めてやり直したら14分でできた。本文の挿絵は3分ほど
- Codex の設定（`~/.codex/config.toml`）のモデルは `gpt-6.1-sol` のまま。前回と同じく設定は変えず、生成スクリプトの写しで `-m gpt-6-astra` を付けて生成した
- Gemini 4 Carbon は12月1日、Gemini 3.8 Flash は2027年1月1日に値上げの予定。公開が12月以降になるときは、表と図の数字を直す
- 公開（main への合流）はしていない

## 追記：公開した（2026-11-13）

玉城さんの「これでよい」「公開する」を受けて、main に合流して公開した。

- 合流：`claude/gemini-api-web-app` を main へ（合流コミット f8f503f）。合流後に `npm run build`・`check_product_article.py`・`npm run check:affiliate` をやり直して通った
- push：main を1回だけ送った。local main・origin/main・GitHub の main がどれも f8f503f
- 公開の経路：Cloudflare Pages の自動ビルド（main への push で動く）。手動のデプロイはしていない
- 本番の確かめ（09:12ごろ）：https://ysk.life/blog/gemini-api-web-app/ が 200。題名・canonical が正しい、`og:image` はヒーロー画像で 200、記事一覧にも出ている。ブラウザで開いて、ヒーロー・図3枚・挿絵1枚がすべて読み込まれ、横はみ出しなし、コンソールのエラーなし
- 後片付け：手元の作業ブランチは合流済みなので消した。GitHub 側の作業ブランチは残してある
