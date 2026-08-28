# ysk.life（tamashiro-blog）｜Claude Code コンテキスト

## サイト概要

- **ドメイン**: https://ysk.life
- **位置づけ**: 玉城祐輔の**個人**サイト（発信・道具箱・アフィリエイト）
- **構成**: Astro + Cloudflare Pages（production branch: `main`、build: `npm run build`、output: `dist`）
- **移行・インフラの経緯**: `HANDOFF.md` を参照（DNS・Cloudflare移行は完了済み。再実行しないこと）

### ブランドの区別（重要）

`ysk.life`（個人）、個人アフィリエイト、T&Lサポート株式会社（法人）、顧客サイトのブランドを**混同しない**。
ysk.lifeの記事にT&Lの法人CTA・サービス紹介をそのまま流用しないこと。

## 記事の作り方

### ファイル配置

| 用途 | パス |
|------|------|
| 記事本文 | `src/content/blog/<slug>.md` |
| 記事の画像 | `src/assets/blog/<slug>/<name>.webp` |
| スキーマ定義 | `src/content.config.ts` |
| 記事レイアウト | `src/layouts/BlogPost.astro` |
| 作業ログ | `logs/YYYY-MM-DD-<topic>.md` |

### フロントマター

```yaml
---
title: '記事タイトル'
description: '一覧・OGPに出る説明文'
pubDate: '2026-08-15'
category: '家と仕事の道具'   # 既存値: AIの使い方 / 仕事の道具 / 家と仕事の道具 / 仕事の仕組み / 経営の現場
accent: 'olive'              # olive | coral | ink のみ
heroImage: '../../assets/blog/<slug>/hero-xxx.webp'   # 任意。画像が実在する時だけ書く
---
```

- `updatedDate` は任意。
- `heroImage` は `z.optional(image())`。**未指定でもビルドは通り、記事も一覧も正常に表示される**（`ArticleCard.astro` / `BlogPost.astro` は `&&` でガード済み）。

### 本文中の画像

```markdown
![日本語の具体的なalt](../../assets/blog/<slug>/office-entry.webp)
```

- 形式は `.webp`、実寸は横1500〜1700px程度（ヒーローは 1536x1024 実績あり）。表示は Astro の `<Image>` が最適化する。
- 商品写真は Amazon 提供元のリモートURLを直接使い、自サイトへ再アップロードしない。
- 挿絵は実物写真ではなく「利用場面を伝えるイメージイラスト」とする。

---

## 画像ハンドオフルール（Claude Code環境）

**Claude Code には画像生成機能が無い。** 画像は後日ユーザーが **ChatGPT（GPT Image 2）** で生成する。
記事執筆は先に完了させ、画像は引き継ぎ資料を残して分離する。「生成したふり」をしない。

### ⚠️ ysk.life固有の最重要制約：存在しない画像パスを書かない

Astro は `heroImage` と本文の相対画像パスをビルド時に解決する。
**実在しないファイルを指すパスを書くと `npm run build` が失敗し、Cloudflare Pages のデプロイも落ちる。**
したがって、画像が未生成の段階では次を厳守する。

1. **`heroImage` はフロントマターから丸ごと省略する**（空文字やダミーパスを書かない）。
2. **本文の画像は `![]()` 記法を書かず、HTMLコメントのプレースホルダーにする**。

```markdown
<!-- 画像プレースホルダー: 会社の玄関での鍵運用シーン
     生成後の保存先: src/assets/blog/<slug>/office-entry.webp
     alt: 小さな会社の入口で総務担当者が指紋認証パッドを使い、社長が見守っているイメージイラスト
     → 画像設置後、この行を ![alt](../../assets/blog/<slug>/office-entry.webp) に置き換える -->
```

### 引き継ぎファイルを作る

記事ごとに `docs/image-handoff/<slug>.md` を作成し、以下を画像1枚ごとに記載する。

- 保存先パス（`src/assets/blog/<slug>/xxx.webp`）
- 用途（ヒーロー／本文セクション名）
- alt文言（記事本文のプレースホルダーと完全一致させる）
- 生成プロンプト（`CHARACTER_GUIDE.md` のコピペ用プロンプト全文 ＋ `Scene/action` `Expression` `Background` `Aspect ratio` を埋めたもの。ユーザーがそのまま貼れる完成形で書く）
- 添付する正本シートのファイル名
- 完了チェックボックス `- [ ]`

冒頭に使い方メモを置く:

> ChatGPTで GPT Image 2 を選び、記載の正本シートを画像添付のうえ、下記プロンプトをそのまま貼り付けて生成してください。
> 生成後は `CHARACTER_GUIDE.md` の「生成後の確認項目」で崩れがないか確認し、`.webp` に変換して指定パスへ保存し、チェックを入れてください。

### キャラクター参照画像（正本）

イラストは**約2頭身のちびキャラ**で統一する（写真ベースにしない）。
**正本と、キャラごとのコピペ用プロンプトは、Obsidian Vault側の下記ガイドが唯一の正本**（このリポジトリには含まれない）。

**ガイド**: `00_Obsidian/01_T&L_収益化プロジェクト/brand-assets/tl-support/character-sheets/CHARACTER_GUIDE.md`
**正本画像**: 同ディレクトリ

| キャラクター | 正本ファイル | 主な用途 |
|---|---|---|
| 玉城祐輔（標準） | `tamashiro-yusuke-character-sheet-v4.png` | 講師、専門家、公式な場面 |
| 玉城祐輔（ビジネスカジュアル） | `tamashiro-yusuke-business-casual-character-sheet-v3.png` | DX支援、SNS、親しみやすい解説 |
| Rira | `rira-character-sheet-v2.png` | AI秘書、案内、整理、提案 |
| Riku | `riku-character-sheet-v2.png` | PC操作、ファイル操作、現場実行 |
| 悩める社長 | `worried-business-owner-character-sheet-v1.png` | 経営課題、資金繰り、相談前後の変化 |
| 総務・経理担当者 | `accounting-staff-character-sheet-v1.png` | 経理、書類整理、バックオフィス改善 |

**ysk.life では上記6キャラすべてを使ってよい。** 記事の場面に合うキャラを選ぶ。

- ※ 古い `01_T&L_Projects/T&L_マーケ02/キャラ画像/` は「元設定」であり正本ではない。**参照しない**（ガイド内で元設定として明示されている）。
- プロンプトは**自作しない**。`CHARACTER_GUIDE.md` の各キャラ「コピペ用プロンプト」（英語の同一性固定ブロック）をそのまま使い、末尾の
  `Scene/action:` / `Expression:` / `Background:` / `Aspect ratio:` だけを記事の場面に合わせて埋める。
  複数キャラを同時に出す場合は、ガイド末尾の「3人を同時に出す場合」のブロックを使う。
- ChatGPTには**該当キャラの正本シートを画像添付**する（プロンプト本文が添付ファイル名を参照している）。
- **Aspect ratio**: ysk.lifeは横長。ヒーローは 3:2（1536x1024 実績）、本文挿絵は 16:9（1672x941 実績）のいずれかに合わせる。
- ※ note向けの「白い正方形キャンバス＋上下ホワイトレターボックス」制約は **Nano Banana Pro 固有のもの。GPT Image 2 では付けない**。
- 生成後は `CHARACTER_GUIDE.md` の「生成後の確認項目」チェックリストで確認する（Riraの花の位置、Rira/Rikuのイヤーピースが視聴者から見て右側、頭身、靴の種類など、崩れやすい箇所が列挙されている）。

### 画像がそろった後の手順

1. 画像を `src/assets/blog/<slug>/` に配置する。
2. フロントマターに `heroImage` を追加する。
3. 本文のプレースホルダーコメントを `![alt](../../assets/blog/<slug>/xxx.webp)` へ置換する。
4. `docs/image-handoff/<slug>.md` のチェックを埋める。
5. **`npm run build` を実行し、成功を確認してからコミットする**（画像パス解決の検証を兼ねる）。

---

## note記事（T&L_マーケ02）との関係

Obsidian Vault の `01_T&L_Projects/T&L_マーケ02/T&L支援_統合マスタープロンプト_V39.md` は、
**note・SNS向けのT&L法人コンテンツ**を生成するフロー（C1〜C10）で、**このリポジトリには適用されない**。

| | note（T&L_マーケ02） | ysk.life（本リポジトリ） |
|---|---|---|
| 主体 | T&Lサポート株式会社 | 玉城祐輔 個人 |
| 成果物 | Vault内Projectフォルダの `.md` | Astroのcontent collection |
| 画像パス | `Image/thumbnail/`・`Image/sections/` | `src/assets/blog/<slug>/` |
| 未生成時 | プレースホルダーでも実害なし | **ビルドが落ちる**（上記制約を厳守） |
| 画像比率 | 1:1キャンバス＋16:9レターボックス | 横長そのまま |
| CTA | T&L法人CTA必須 | 法人CTAを流用しない |

同じテーマを両方で出す場合も、記事は書き分ける。

## Git運用

- 作業ブランチで進め、`main` へ直接コミットしない。
- **`git add .` を使わない**（未追跡の引き継ぎメモ等を巻き込むため、対象ファイルを明示して `git add` する）。
- 記事公開の変更と、道具箱・OGP画像などの別作業を同じコミットに混ぜない。
- 作業内容は `logs/YYYY-MM-DD-<topic>.md` に記録する。
