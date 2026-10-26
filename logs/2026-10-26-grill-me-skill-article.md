# 2026-10-26 grill-me スキルの解説と入れ方の記事

## 作ったもの

- 記事: `src/content/blog/grill-me-skill-claude-code-codex.md`（カテゴリ「AIの使い方」・accent ink）
- 目的: grill-me（Matt Pocock さんのスキル）が何をするかを、玉城さんの実際の使い方と一緒に説明し、Claude Code と Codex への最新の入れ方をまとめる
- 図3枚（HTMLで組み、Chromium（Playwright）で2倍の解像度で撮影 → sharp で横1700pxの WebP）
  - `diagram-grill-flow.webp`（いきなり頼む／grill-me を挟む の比較）
  - `screen-grill-round.webp`（質問のラウンドの見本。題材は架空のセミナー企画）
  - `diagram-install-routes.webp`（入れ方4つ）
- 図の元: `docs/figures/grill-me-skill-claude-code-codex/`（`node shot.cjs <名前> <出力先>`。クラウドの環境では Chrome が無いので Playwright を使った）
- キャラクター挿絵3枚は未生成。この環境に Codex CLI が無いため、`docs/image-handoff/grill-me-skill-claude-code-codex.md` に引き継いだ。記事では `heroImage` を省き、本文はHTMLコメントのプレースホルダー

## 確かめたこと（2026-10-26）

- 作者の GitHub mattpocock/skills（最新コミット 2026-10-19、プラグイン 1.3.1）
  - Claude Code: `claude plugin install mattpocock-skills@claude-plugins-official`
  - Codex: `codex plugin marketplace add mattpocock/skills` → `codex plugin add mattpocock-skills@mattpocock`
  - それ以外: `npx skills@latest add mattpocock/skills`。1つの道具に1つの入れ方（両方入れると二重になる）
  - grill-me の本体は「grilling を呼ぶ」だけの短いファイル（`disable-model-invocation: true`）。質問の進め方は grilling にある。grill-me だけ入れると動かない
  - grilling は「ラウンド」制（前提が決まった質問をまとめて、番号＋おすすめの答えつきで聞く。「はい」でおすすめを受け入れる聞き方）。1問ずつに戻すには CLAUDE.md に1行足す、と作者の説明にある
  - プラグインに入るスキルは27個（`.claude-plugin/plugin.json`）。フックは無く、中身は文章だけ
- Claude Code 公式「Install and manage plugins」: `/plugin install` は画面で範囲（user / project / local）を選ぶ。シェルの `claude plugin install` は user が既定。新しい機械では `claude plugin marketplace add anthropics/claude-plugins-official` が先に要ることがある。プラグインのスキルは `/<plugin>:<skill>` で出る。claude-plugins-official は自動更新が既定。ブラウザ版（クラウド）はプラグインを読まない
- Codex: developers.openai.com はこの環境から開けなかったので、openai/codex のソース（2026-10-23）で確かめた。`codex plugin add|list|remove`、`codex plugin marketplace add|list|upgrade|remove`、画面の `/skills`・`/plugins`、スキルを `$` で呼ぶ
- vercel-labs/skills: `--skill` は繰り返せる、`-a claude-code` / `-a codex`、`-g` は自分用（Claude Code `~/.claude/skills/`、Codex `~/.agents/skills/`）。Node.js 22.20 以上。`update`・`remove`

## 記事に使った玉城さんの体験（00_Obsidian の作業ログから。名前・団体は出していない）

- 2026-08-13 小さな教室の受領台帳アプリの要件を20問で決めた（運営者だけが使う・保護者はLINEのまま・月謝は「今月分を発行」を押す・受領の記録だけ）
- 2026-08-06 AI活用コミュニティの設立方針を8つ決め、判定基準まで決めた
- 2026-07-14 経理自動化の連携の仕組みを8問で決め、最初に声をかける人だけ玉城さんが直した
- 共通ルールに「計画を詰めるときは brainstorming より grill-me を使う」（2026-10-15）

## 検査

- `check_product_article.py`: エラー5件（heroImage なし・証跡コメントなし・プレースホルダーの中の画像の alt 2件）。すべてキャラクター挿絵が未設置のため。画像を置いて証跡コメントを足すと消える
- `npm run check:affiliate`: 問題なし（既存記事の注意3件のみ）
- `npm run build`: 成功（43ページ）。`lib/engagement/articles.json` に記事の id が1行増えた（コミットに含める）
- 手元の表示（astro preview）: 1440px・390px で横のはみ出しなし、図3枚の読み込み成功。コンソールのエラーは `/api/engagement` の404だけ（Cloudflare の関数なので手元のプレビューには無い）

## 残り

1. 玉城さんが記事を読んで OK を出す（題・体験の書き方・自作の SKILL.md の例）
2. キャラクター挿絵3枚を生成して置く（引き継ぎファイルの手順）
3. `git-main-release` で main に合流して公開
