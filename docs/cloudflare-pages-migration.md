# Cloudflare Pages 移行手順

更新日: 2026-08-12

## 現在のローカル準備

- Astroは静的出力のまま利用する。CloudflareアダプターやPages Functionsは追加しない。
- 本番URLは `https://ysk.life` に統一する。
- ビルドは `npm run build`、出力先は `dist`。
- `public/_headers` をビルド成果物へ含める。
- ローカルのPages互換確認は `npm run pages:dev` で行う。

## Cloudflare Pages作成時の設定

| 項目 | 値 |
|---|---|
| GitHub repository | `yusuke-taxlegal/tamashiro-blog` |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node.js | `22` 系（`package.json` の `engines` に従う） |

## 外部操作の承認単位

1. Cloudflare Pagesプロジェクト作成とGitHub接続
2. 現在のDNSレコードの完全な移行表作成と照合
3. ネームサーバー変更
4. `ysk.life` / `www.ysk.life` の接続と本番切替
5. Amazonアソシエイト登録媒体の更新

各工程はreadbackで成功を確認してから次へ進む。結果が不明な操作は再送しない。

## DNS移行前の停止条件

- `@ysk.life` メールの利用有無が未確認
- Google Workspaceの対象ドメインが未確認
- MX、TXT、SPF、DKIM、DMARCを含む既存レコードの移行表が未照合
- 新しいPagesプレビューを本人が未確認

`www` からapexへの転送は、Pagesの `_redirects` ではなくCloudflareのBulk Redirectsで設定する。既存Vercel版とSurge版は、新本番の検証が完了するまで削除しない。
