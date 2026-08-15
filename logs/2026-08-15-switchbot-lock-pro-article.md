---
title: SwitchBot Lock Pro紹介記事 作成・本番公開ログ
date: 2026-08-15
updated: 2026-08-15 11:44 JST
status: production-deployed-git-pending
owner: 玉城祐輔
tags:
  - ysk-life
  - blog
  - switchbot
  - affiliate
  - cloudflare-pages
---

# SwitchBot Lock Pro紹介記事 作成・本番公開ログ

## 結果

SwitchBot ロックProを、子育て家庭と小さな会社の総務担当者へ紹介する記事を作成し、2026年8月15日に `ysk.life` へ公開した。

- 本番記事: https://ysk.life/blog/switchbot-lock-pro/
- Cloudflare固定デプロイURL: https://d1c095b8.tamashiro-blog.pages.dev/blog/switchbot-lock-pro/
- Cloudflare Pagesプロジェクト: `tamashiro-blog`
- デプロイID: `d1c095b8-3599-4d92-9eb6-4676b21cb8d3`
- デプロイ時のGit HEAD: `3905a8d6afb78bb240a1efe76674a99ebf12b329`
- 公開方式: 検証済み静的成果物のWrangler直接アップロード
- Gitコミット・プッシュ: 未実施

2026年8月15日11:44 JSTの再確認で、本番記事はHTTPS 200、最新デプロイはProduction・`main`として稼働している。

## 記事の方針

- 検索上位の類似記事から、先に結論を示す構成、購入前の不安、FAQ、設置時の確認事項を抽出した。
- 実閲覧数が公開されていない記事は、検索順位、専門性、具体性、更新日を人気の代替指標として扱った。
- 製品仕様、設置条件、電池、オートロック、ハブ、遠隔管理はSwitchBot公式情報と公式サポートを正本にした。
- 玉城本人が使ったと確認できない内容を、使用体験として書いていない。
- 家庭では、子ども、荷物、雨、締め出し、物理鍵へ戻る方法を重視した。
- 会社では、管理アカウント、登録・削除、退職時の対応、台帳、非常時の物理鍵を重視した。
- 製品仕様の確認日は記事末尾へ `2026年8月15日` と明記した。

## 実装内容

### 記事と挿絵

- `src/content/blog/switchbot-lock-pro.md`
- `src/assets/blog/switchbot-lock-pro/hero-family-entry.webp`
- `src/assets/blog/switchbot-lock-pro/before-install.webp`
- `src/assets/blog/switchbot-lock-pro/office-entry.webp`

挿絵は実際の商品写真ではなく、利用場面を伝えるイメージイラストとした。記事のヒーロー、家庭・設置前確認、会社の鍵管理の場面に使用している。

### 記事レイアウト

- `src/layouts/BlogPost.astro`
- `src/pages/blog/[...slug].astro`
- `src/styles/global.css`

変更内容:

- 記事横の「この記事の内容」と「情報の確認」を削除し、本文幅を760pxへ整理した。
- Amazon商品画像、商品名、説明、購入ボタン、広告表記をまとめた購入枠を追加した。
- 長い記事のため、同じ購入枠を冒頭と末尾へ配置した。
- 広告表記は購入リンクの近くに残し、本文より目立ちすぎない表示にした。
- `Amazon.co.jp` と遷移先を文字で明示した。
- 商品画像と購入ボタンは、同じAmazon特別リンクへ設定した。

記事レイアウトの変更は共有レイアウトへ入っているため、Gitへ反映すると既存ブログ記事にも「この記事の内容」と「情報の確認」を表示しない状態が適用される。

## Amazon購入導線

- 特別リンク: `https://amzn.to/4hszTQF`
- 購入枠: 2か所
- Amazonリンク: 4件
- リンク属性: `rel="sponsored noopener noreferrer"`
- 表示: `Amazon.co.jp`、`広告・アフィリエイトリンクです。`
- 固定価格、在庫、割引、配送条件: 記載なし
- Amazon商品画像: Amazon提供元のリモート画像URLを使用し、自サイトへの再アップロードはしていない

紹介料の帰属は玉城祐輔個人として扱い、T&Lサポート株式会社の法人収益と混同していない。

## 作成したスキル

今回の記事作成フローを、次の個人スキルとして保存した。

- スキル名: `$tamashiro-product-article`
- 保存先: `/Users/tamashiro_yusuke/.codex/skills/tamashiro-product-article/`

内容:

- 類似記事と公式情報の調査
- 玉城祐輔らしい文章への再構成
- イメージイラストの作成
- Amazon購入枠と広告表示
- Astro実装
- モバイル・PC・本番確認
- 公開とGitを別の承認単位にする運用

`quick_validate.py` でスキル形式を検証し、合格している。記事検査スクリプトも現在の記事へ実行し、Amazonリンク4件・警告0件だった。

## ビルドと表示確認

### ローカル

- `npm ci`: 成功
- `npm run build`: 成功
- Astro生成: 13ページ
- 記事検査: Amazonリンク4件、警告0件

ブラウザ確認:

| 確認項目 | 390px | 1440px |
|---|---:|---:|
| 横はみ出し | 0px | 0px |
| 画像破損 | 0件 | 0件 |
| コンソール警告・エラー | 0件 | 0件 |
| H1 | 確認済み | 2行 |
| Amazon購入枠 | 2か所 | 2か所 |
| CTA | 1列・全幅 | 1行 |

「この記事の内容」と「情報の確認」は表示されず、Amazon.co.jp表記と広告表記は表示されることを確認した。

### 本番

- `https://ysk.life/blog/switchbot-lock-pro/`: HTTPS 200
- 固定デプロイURL: HTTPS 200
- カスタムドメインと固定デプロイURLのHTML SHA-256: 一致
- HTML SHA-256: `8802a3b84dd99424f797d83c8200fd419e118688c546f52baaae8a44d768efa0`
- 記事内のローカル画像、ロゴ、Amazon商品画像: すべてHTTP 200
- 本番ブラウザの横はみ出し: 390px・1440pxとも0px
- 本番ブラウザのコンソール警告・エラー: 0件
- Amazonリンクの属性不備: 0件
- 購入枠内で画像とボタンの遷移先が異なる箇所: 0件

## 本番公開時の保全対応

公開前の作業ツリーには、記事とは別の未コミット変更があった。また、本番の道具箱はGit HEADだけから生成した内容と一致していなかった。

そのため、Git HEADをそのままビルドして公開せず、次の手順で成果物を作った。

1. Git HEAD `3905a8d` から一時worktreeを作成
2. SwitchBot記事に必要なファイルだけを適用
3. 記事検査とAstroビルドを実行
4. 直前の本番成果物を取得
5. 本番成果物へ、ブログ関連の生成物だけを重ねる
6. 道具箱HTMLとOG画像のSHA-256が公開前と一致することを確認
7. 66ファイルの成果物をCloudflare Pagesへ直接アップロード
8. `ysk.life` と固定デプロイURLを読み返して検証

保全確認:

- 道具箱HTML SHA-256: `2ee281b2dc292f5fcb01b55e5f2fae796b8e8c499d4071243b3d6184edfcc9f0` のまま
- `public/images/ysk-life-og.png` SHA-256: `1c94485862bd521405453c5ec5452590f4089e31c9683d584859696c7f9b94d8` のまま

## 現在のGit状態と注意

2026年8月15日11:44 JST時点で、ローカル `main` と `origin/main` はどちらも次のHEADで一致している。

`3905a8d6afb78bb240a1efe76674a99ebf12b329`

作業ツリー:

```text
 M public/images/ysk-life-og.png
 M src/components/ToolboxPage.astro
 M src/layouts/BlogPost.astro
 M src/pages/blog/[...slug].astro
 M src/styles/global.css
?? public/images/ogp-options/
?? src/assets/blog/switchbot-lock-pro/
?? src/content/blog/switchbot-lock-pro.md
```

今回の記事公開に必要な変更:

- `src/layouts/BlogPost.astro`
- `src/pages/blog/[...slug].astro`
- `src/styles/global.css`
- `src/assets/blog/switchbot-lock-pro/`
- `src/content/blog/switchbot-lock-pro.md`

今回の公開対象へ含めなかった別作業の変更:

- `public/images/ysk-life-og.png`
- `src/components/ToolboxPage.astro`
- `public/images/ogp-options/`

## 次に行う場合の注意

本番記事は公開済みだが、記事と共有レイアウトの変更はGitへコミット・プッシュされていない。Git連携や別の直接デプロイでGit HEADから本番を作り直すと、この記事が消える可能性がある。

Gitへ反映するときは、上記の「今回の記事公開に必要な変更」だけを対象にし、道具箱とOG画像の別作業を混ぜない。特に `git add .` は使用しない。

Git操作は別途、対象ファイルを確認してから行う。
