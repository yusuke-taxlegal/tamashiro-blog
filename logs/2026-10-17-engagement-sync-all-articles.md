# 2026-10-17 人気ランキングに新しい記事が出ない件を直す

## 分かったこと

- 集計の Worker `ysk-life-engagement-sync` は、公開した時点の `lib/engagement/articles.json` を抱えていて、そこに無い記事の閲覧数を D1 に書かなかった
- 最後の公開は 2026-09-19。D1 の `ga_daily` には、それ以降に足した記事（typeless・chatgpt/claude デスクトップ・OneDrive・JC の議案の3本など）の行が1件も無かった（読み取りだけで確かめた）
- 毎朝の集計自体は動いていた（`last_success` 2026-10-16T19:15Z）

## 直したこと

- Worker は記事の一覧を持たず、`/blog/記事名/` の形（英小文字・数字・ハイフン、120字まで）のページを全部記録する。ジャンルの一覧ページ（ai・tools・management）は除く
- どの記事をランキングに出すかは、これまでどおり表示する側（Pages の `lib/engagement/reports.ts`）が `articles.json` で決める。Pages は記事を公開するたびに作り直されるので、記事を足すだけで集計の対象になる
- テスト：`npm run test:engagement`（8件）・`npm run test:engagement:sync`（2件）・`npm run check:api` が通った

## 公開

- Worker を公開し直した（下に版の番号）
- 集計は毎回「過去30日分を取り直す」方式なので、過ぎた日の分を取り直す作業は要らない。次の集計（日本時間の朝4時15分）から、新しい記事も入る
