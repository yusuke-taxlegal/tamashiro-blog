# 組織としてのAI活用 記事制作

## 2026-09-19 本番公開

- ユーザーの「デプロイ」指示に基づき公開。
- 本番: https://ysk.life/blog/organizational-ai-repeatable-work/
- 候補: https://572c8447.tamashiro-blog.pages.dev
- 本番固定: https://558cbfb3.tamashiro-blog.pages.dev
- 直前本番b03f223eと配備用コピーの117 HTML/assetsを照合後、コピーに対象記事と3画像だけ追加。既存記事本文は保持、未公開AIスクール記事等は除外。
- 候補・本番固定・ysk.life各124 HTML/assetsが配備成果物と一致。privacyのみCloudflareメール保護を復号して一致。
- 候補1440px/390px: HTTP200、横はみ出しなし、console/page errorなし、共有コピー・OGP画像HTTP200確認。
- 本番1440px/390pxも同項目を確認済み。共有上下の本文左端との差0px。結果はproduction-browser/verification.json。
- build成功。Git commit/push・DNS変更なし。

以下は制作時の記録。

- 本文: `src/content/blog/organizational-ai-repeatable-work.md`
- 著者本人の考えを一人称で整理。個人の効率化と組織の再現性、期待のすり合わせ、宜野湾JCの運用例を説明。
- 画像3枚: 玉城v4・Rira v2の正本をimage_genの参照に使用し、生成後に目視確認。WebP化。プロンプトは同フォルダに保存。
- 記事checker成功。公式出典・確認日の警告2件は製品仕様レビューではなく本人の方針記事のため追加不要と判断。
- Astro build成功。出力 `/tmp/organizational-ai-preview`。ローカルプレビュー `http://127.0.0.1:4387/blog/organizational-ai-repeatable-work/`。
- 1440px / 390px: HTTP200、横はみ出しなし、console/page errorなし。新規画像3枚読み込み成功。非表示サイドバーや横スクロール外の既存カルーセルは遅延読み込み対象。
- PCタイトル2行、共有上下2組×4操作、46px操作領域、本文左端との差0px。canonicalリンクコピー・Instagramコピー案内成功。
- OGPとTwitter画像は新しいヒーローの絶対HTTPS URL。ビルド済み画像をローカル取得しHTTP200・image/webpを確認。本番未公開のため本番画像URLの取得検証は未実施。
- `git diff --check`成功。既存の無関係な変更を保持。公開・commit・pushは未実施。
- 公開依頼を受けたら、既存dirty変更を含めない公開対象の切り分けと本番readbackが必要。
