# Codexスキルを Claude Code から使えるようにする

日付: 2026-09-21
作業ブランチ: `main`（このリポジトリのファイル変更はこの作業ログのみ。コードは未変更）
作業対象: `~/.codex/skills/`、`~/.claude/skills/`（リポジトリ外）

## 依頼

- Codexで使っているスキルを Claude Code でも使えるようにする。
- ysk.life（玉城祐輔のブログ）のスキルと、ウェブデザインのスキルを含めて、実際に動く状態にする。

## 監査と判断

- Codex側の置き場 `~/.codex/skills/` と Claude Code側の `~/.claude/skills/` を突き合わせ、Claude Code に無いスキルは6つと確認した。
  `git-main-release` / `professional-flyer-design` / `tamashiro-product-article` / `tamashiro-web-design` / `tl-inbox-drive-sort`、
  および Obsidian側にあって未登録だった `kicho-daiko`。
- 既存のObsidian系スキルが `~/.claude/skills/` からのシンボリックリンクで運用されていたため、同じ方式に揃える。
  コピーすると二重管理になり、片方だけ古くなる。
- Codex専用の道具に依存している箇所があった。
  - `tamashiro-web-design`: 手順の中核が Codex の Product Design プラグイン。Claude Code には存在しない。
  - `tamashiro-product-article`: 挿絵生成が `imagegen`、目視が `view_image`、編集が `apply_patch`。いずれも Claude Code には無い。
- 読み替えは SKILL.md 本文を環境ごとに分岐させず、`references/claude-code-runtime.md` に分離する。
  SKILL.md は Codex と Claude Code で共有されるため、本文を書き換えると Codex側の挙動まで変わる。
- `tamashiro-product-article` は「ysk.lifeの商品記事では `heroImage` を原則設定する」と書いているが、
  本リポジトリの `CLAUDE.md` は「画像未生成の段階で存在しないパスを書くとビルドが落ちるため `heroImage` を省略する」と定めている。
  ysk.life では `CLAUDE.md` の画像ハンドオフ運用を優先する、と読み替え側に明記した。
- `~/.codex/skills/.system/`（skill-creator・imagegen・skill-installer・openai-docs・plugin-creator・review-agent）は移さない。
  Claude Code に同等品（`anthropic-skills:skill-creator`、`gpt-image-2.5` など）がある。
- `~/.codex/AGENTS.md` は Codex のモデル振り分け（Sol/Terra）専用の設定であり、Claude Code には当てはまらないため移さない。

## 変更

- `~/.claude/skills/` に6本のシンボリックリンクを作成。
  - `git-main-release`、`professional-flyer-design`、`tamashiro-product-article`、`tamashiro-web-design`、`tl-inbox-drive-sort`
    → `~/.codex/skills/<name>`
  - `kicho-daiko` → `~/Cursor/00_Obsidian/.claude/skills/kicho-daiko`
- `~/.codex/skills/tamashiro-web-design/references/claude-code-runtime.md` を新規作成。
  Product Design の各工程（`get-context` / `ideate` / `image-to-code` / `design-qa`）を、
  既存コード読解・`gpt-image-2.5` スキル・Edit/Write・ブラウザペインへ対応付けた。
  視覚検証は mobile(375x812) と desktop の両方でスクリーンショットを撮り、採用画像と比較してから完了とする。
- `~/.codex/skills/tamashiro-web-design/SKILL.md` に、上記の読み替えを先に読む旨を1行追記。
- `~/.codex/skills/tamashiro-product-article/references/claude-code-runtime.md` を新規作成。
  - 経路A（ysk.lifeの既定）: `CLAUDE.md` の画像ハンドオフ。`heroImage` 省略、本文はHTMLコメントのプレースホルダー、
    `docs/image-handoff/<slug>.md` を作成し、画像設置後に機械検査と `npm run build` で仕上げる。
  - 経路B（ユーザーが明示したときのみ）: `gpt-image-2.5` スキルで生成。正本キャラクターの必須条件と証跡コメントは本編どおり。
  - `apply_patch` → Edit/Write、`view_image` → Read、実ブラウザ確認 → ブラウザペイン。
- `~/.codex/skills/tamashiro-product-article/SKILL.md` に、上記の読み替えを先に読む旨を1行追記。
- Claude Code のプロジェクトメモリに、この共有方式（正本は `~/.codex/skills/`）を記録。
- 本ファイル（作業ログ）を追加。

## 検証

- リンク経由で6本すべての `SKILL.md` が読め、`name` と `description` が有効であることを確認。
  ファイル数は professional-flyer-design 32、kicho-daiko 16、tamashiro-product-article 11、tl-inbox-drive-sort 10、
  tamashiro-web-design 5、git-main-release 3。
- 新規の `claude-code-runtime.md` が Claude Code側のパスからも相対リンクで解決することを確認。
- Claude Code のスキル一覧が再起動なしで6本を認識した。
- `tamashiro-product-article` の機械検査を実記事で実行し、動作を確認。
  `python3 ~/.claude/skills/tamashiro-product-article/scripts/check_product_article.py src/content/blog/wws-workwear-suit-ankle-pants.md`
  → `[OK]`（Amazonリンク1件、警告1件: 購入枠のクラス未検出）
- `professional-flyer-design` の書き出し前提を確認。Pillow 10.3.0 導入済み、Google Chrome 実在。

## 残り

- 本リポジトリのコードは未変更。この作業ログはコミットしていない（`main` への直接コミットは禁止のため）。
  記録として残す場合は作業ブランチを切ってこのファイルだけを `git add` する。
- `tamashiro-product-article` の機械検査が出した「購入枠のクラス未検出」の警告は、既存記事側の課題であり本作業の対象外。
- 今後 Codex にスキルを追加したときは、`~/.claude/skills/` に同名のシンボリックリンクを張れば Claude Code でも使える。
