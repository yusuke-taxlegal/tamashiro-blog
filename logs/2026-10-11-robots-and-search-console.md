# 2026-10-11 robots.txt の追加とサーチコンソールの整理

## なぜ
- サーチコンソールで、記事24本のうち Google に載っていたのは1本だけ（トップ・広告について・Typeless の3ページ）
- サイトマップの目次 `sitemap-index.xml` は 8/13 に送信・10/4 に読み込み済みだが、中身の `sitemap-0.xml` を Google が一度も読んでいなかった（「読み込まれたサイトマップ」が空・検出ページ数 0）
- `robots.txt` が無く 404 だった（Google への立ち入り案内とサイトマップの場所を書く所が無い）
- サイト側の配信は正常（Googlebot の名前で取りに行っても `sitemap-0.xml` は 200・application/xml）

## やったこと
- `public/robots.txt` を追加（全体を許可・/admin/ と /api/ は除外・Sitemap の場所）
- サーチコンソールで `sitemap-0.xml` を直接送信し、主な記事の登録を依頼（玉城さんの了承済み）

## このあと
- 1週間ほどで「ページ」の登録済み数が増えたか、`site:ysk.life` に記事が並ぶかを見る
- www.ysk.life は転送されずそのまま表示される（正規URLは ysk.life を指しているので実害は小さい）。直すなら Cloudflare の転送ルール
