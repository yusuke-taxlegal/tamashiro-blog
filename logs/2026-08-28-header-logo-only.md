---
title: ヘッダーをロゴのみへ変更（「玉城祐輔」表示の削除）
date: 2026-08-28
status: pr-open
owner: 玉城祐輔
tags:
  - ysk-life
  - design
  - header
---

# ヘッダーをロゴのみへ変更

## 結果

サイト左上のブランド表示から文字の「玉城祐輔」を外し、ロゴマークのみのヘッダーにした。
変更は `src/components/Header.astro` の1ファイルに閉じている。

- ブランチ: `claude/tamaki-blog-logo-design-ute2lx`
- `npm run build` 成功（19ページ）

## 変更内容

- `<strong>玉城祐輔</strong>` を削除し、`.brand` の中身をロゴマークだけにした。
- 文字が消えて余白が目立つため、ロゴを `2.25rem` → `2.5rem`（620px以下は `2rem` → `2.15rem`）へわずかに拡大した。
- 文字と並べるための `.brand { gap: 0.8rem }` と `.brand strong` のスタイルを削除した。
- 幅390px以下で文字を視覚的に隠していたメディアクエリを削除した（対象が無くなったため）。

## 判断の記録

- リンク側に `aria-label="玉城祐輔 ホーム"` が元々あるため、文字を消してもスクリーンリーダーには名前が読み上げられる。ロゴ画像は `alt=""` ＋ `aria-hidden` のままでよい。
- サイト全体としての名乗りはフッターの `© Yusuke Tamashiro` が担っており、ヘッダーから名前が消えても匿名のサイトにはならない。
- ロゴファイル（`public/images/tamashiro-yusuke-logo.svg`）自体は変更していない。「玉」の字を象ったマークで、単独でも記号として成立する。
