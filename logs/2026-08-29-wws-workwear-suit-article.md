---
title: WWSワークウェアスーツ アンクルパンツ紹介記事 作成ログ
date: 2026-08-29
status: article-written-images-pending
owner: 玉城祐輔
tags:
  - ysk-life
  - blog
  - wws
  - workwearsuit
  - referral
---

# WWSワークウェアスーツ アンクルパンツ紹介記事 作成ログ

## 結果

玉城が仕事の日に毎日履いているWWS（ワークウェアスーツ）のアンクルパンツを紹介する記事を作成した。
画像は未生成のため、引き継ぎ資料だけを残し、記事本文は先に完成させた。

- 記事: `src/content/blog/wws-workwear-suit-ankle-pants.md`
- 画像引き継ぎ: `docs/image-handoff/wws-workwear-suit-ankle-pants.md`
- スラッグ: `wws-workwear-suit-ankle-pants`
- 公開予定URL: https://ysk.life/blog/wws-workwear-suit-ankle-pants/
- ブランチ: `claude/tamaki-blog-workwear-suit-jkodck`
- 本番デプロイ: 未実施

## 記事の方針

- 玉城本人から確認できた体験は「仕事の日は毎日アンクルパンツを履いている」「ガシガシ動いてもほつれがなく持ちが良い」の2点のみ。この範囲を超える使用体験を書いていない。
- 着用年数、購入本数、購入モデル名、色、サイズは本人未確認のため書いていない。
- 素材ultimexの機能、ブランドの成り立ち、お手入れ方法は公式サイトの案内として記載し、玉城の感想と表で列を分けた。
- 「ほつれない」は個人の実感であり耐久性の保証ではない、と本文で明示した。
- 火気・薬品・高所・機械を扱う現場では、規格に適合した作業服や保護具の代わりにならない旨を注意として入れた。
- ysk.lifeは個人サイトのため、T&Lサポート株式会社の法人CTA・サービス紹介は入れていない。「小さな会社で制服として考えるなら」は一般論として扱った。
- 記事末尾に、公式サイトの案内をもとにした日付（2026年8月29日）と、購入前に公式ページで確認する旨を明記した。

## 紹介コードの扱い

- 紹介コード: `wws-U9YOF`
- 掲載箇所: 記事冒頭と末尾の2か所
- リンク先: https://www.workwearsuit.com/contents/friends/
- リンク属性: `rel="sponsored noopener noreferrer"`、`target="_blank"`
- 表示: 紹介コードであること、紹介した玉城にもポイントが入ること、対象は公式オンラインストアでの初回購入であること、対象外商品と付与条件が変更されうることを `affiliate-product-disclosure` で明記した。
- ポイントの帰属は玉城祐輔個人として扱い、T&Lサポート株式会社の法人収益と混同していない。

商品画像は掲載していない。WWSの公式商品画像URLを直接確認できなかったため、実在を確認できないリモート画像を貼らない判断とした。
既存記事の `affiliate-product-card`（画像必須の2カラムグリッド）は使わず、既存CSSのblockquoteと `affiliate-product-button` / `affiliate-product-disclosure` だけで導線を作り、global.cssは変更していない。

## 情報源についての注意

この作業環境では、外部ドメインへの直接アクセスがegress proxyでブロックされ、`workwearsuit.com` および `oasys-inc.jp`、`prtimes.jp` のページを直接取得できなかった。

そのため、次の情報をもとにしている。

- 玉城から提供された公式サイトのスクリーンショット2枚（お友達紹介キャンペーンの内容、紹介コード発行画面、対象外商品の案内）
- Web検索の結果に含まれる公式ページの記述（ultimex、お手入れ方法、ブランドの成り立ち、Bizアンクルパンツの価格・サイズ・カラー）

記事中の価格（Bizアンクルパンツ 税込15,400円）とキャンペーン条件は、公開前に公式ページで直接確認することを推奨する。
記事に貼った公式リンク6件も、公開前に到達確認を行う。

## 画像

未生成。`docs/image-handoff/wws-workwear-suit-ankle-pants.md` に3枚分の引き継ぎを作成した。

| 保存先 | 用途 | 比率 |
|---|---|---|
| `hero-workday-start.webp` | ヒーロー | 3:2 |
| `workday-move.webp` | 本文・1日の移動 | 16:9 |
| `laundry-care.webp` | 本文・洗濯とお手入れ | 16:9 |

- 全カット「玉城祐輔（ビジネスカジュアル）」正本 `tamashiro-yusuke-business-casual-character-sheet-v3.png` で統一。
- プロンプトは `CHARACTER_GUIDE.md` のコピペ用プロンプトをそのまま使い、`Scene/action` `Expression/pose` `Background` `Aspect ratio` のみ記事の場面に合わせて埋めた。
- 衣装は正本どおり（濃紺ジャケット＋白T＋濃紺パンツ＋茶色の紐付き革靴）から変更しない。商品そのものを描き分けさせず、ロゴ・商品名も描かせない指示を引き継ぎに記載した。
- ysk.life固有の制約どおり、`heroImage` はフロントマターから省略し、本文画像はHTMLコメントのプレースホルダーにしている。

## ビルド確認

- `npm ci`: 成功
- `npm run build`: 成功（20ページ生成）
- 生成物 `dist/blog/wws-workwear-suit-ankle-pants/index.html` を確認し、紹介コード2か所、`affiliate-product-button` 2か所が意図どおり出力されていることを確認した。

## 次にやること

1. `docs/image-handoff/wws-workwear-suit-ankle-pants.md` の3枚をChatGPT（GPT Image 2）で生成する。
2. `src/assets/blog/wws-workwear-suit-ankle-pants/` へ `.webp` で配置する。
3. フロントマターへ `heroImage` を追加し、本文2か所のプレースホルダーを `![alt](...)` へ置換する。
4. 価格・キャンペーン条件・公式リンク6件を公式サイトで直接確認する。
5. `npm run build` を再実行してから公開する。
6. 道具箱（`src/components/ToolboxPage.astro`）へWWSを追加するかは別作業として判断する。記事公開のコミットには混ぜない。
