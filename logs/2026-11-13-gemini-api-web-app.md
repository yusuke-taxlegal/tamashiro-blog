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

