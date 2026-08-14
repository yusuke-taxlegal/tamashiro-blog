---
title: ysk.life リニューアル・Cloudflare移行 引き継ぎメモ
date: 2026-08-12
updated: 2026-08-12 13:12 JST
status: migration-complete
owner: 玉城祐輔
domain: ysk.life
tags:
  - handoff
  - ysk-life
  - astro
  - cloudflare-pages
  - dns-migration
---

# ysk.life リニューアル・Cloudflare移行 引き継ぎメモ

> [!summary]
> デザイン刷新、GitHub PRマージ、Cloudflare Pages本番デプロイ、ネームサーバー移行、`ysk.life` / `www.ysk.life` のカスタムドメイン接続、本番検証、旧Vercelプロジェクト削除まで完了した。2026-08-12 13:12 JST時点で `ysk.life` はCloudflare PagesからHTTPS 200で配信され、主要ルート・画像・canonical・メールDNSも合格している。

## 最初に読むファイル

1. `/Users/tamashiro_yusuke/Cursor/tamashiro-blog/HANDOFF.md`（このメモ）
2. `/Users/tamashiro_yusuke/Cursor/tamashiro-blog/logs/2026-08-12-ysk-life-plan.md`（初期計画。現況部分はこのメモを優先）
3. `/Users/tamashiro_yusuke/Cursor/tamashiro-blog/astro.config.mjs`
4. `/Users/tamashiro_yusuke/Cursor/tamashiro-blog/src/`

## ユーザー承認

- サイトのデザイン刷新とCloudflare移行を依頼済み。
- DNS変更、本番ドメイン接続、対象Vercelプロジェクト削除まで明示的に依頼済み。
- GitHub PRのマージを明示的に承認済み。
- お名前.comの最終確認画面で、対象 `ysk.life` と下記2NSをユーザーへ提示し、ユーザーの `ok` を受けて最終実行した。
  - `gemma.ns.cloudflare.com`
  - `lars.ns.cloudflare.com`
- ただし、結果不明の操作は再送しない。Vercel削除はCloudflare本番の正常稼働確認後に限定する。

## 完了した作業

### 1. Astroサイトのデザイン刷新

- 玉城祐輔個人の発信を主役に、沖縄・現場・AI/経営支援を軸としたデザインへ刷新。
- 本人写真は黒背景2048pxの正本を使用し、AI改変していない。
- トップ、ブログ一覧、記事、プロフィール、道具箱、プライバシー、アフィリエイト表示、404を整備。
- 日本語UI、モバイル対応、読みやすい記事カード、文脈別CTA、canonical/OGP/RSS/sitemap、セキュリティヘッダーを整備。
- `astro.config.mjs` の `site` は `https://ysk.life` に変更済み。
- 2026-08-12 08:38 JSTに `npm run build` 成功。10ページ生成、エラーなし。

主要な新規・更新ルート:

- `/`
- `/blog/`
- `/about/`
- `/toolbox/`
- `/privacy/`
- `/affiliate-disclosure/`
- `/rss.xml`
- `/404.html`

### 2. GitHub

- 作業ブランチ: `codex/ysk-life-cloudflare-migration`
- 実装コミット: `a0549cc1ca661a89a9b1a8d2afc27dd307d26333`
- PR: `https://github.com/yusuke-taxlegal/tamashiro-blog/pull/1`
- PR #1はMERGED。
- `origin/main`: `5a8ce45261531e9c661cef6ce2eff446b594673e`
- マージ日時: `2026-08-11T22:08:14Z`（GitHub表示、UTC）
- ローカルは作業ブランチのまま。既存の未追跡ファイル `HANDOFF.md` と `logs/2026-08-12-ysk-life-plan.md` は意図的にコミットしていない。

### 3. Cloudflare Pages

- アカウント: `Tamashiro@taxlegal.jp's Account`
- Account ID: `042e5a365510f394d8181f19eb620ea8`
- Pagesプロジェクト: `tamashiro-blog`
- GitHub連携: `yusuke-taxlegal/tamashiro-blog`
- GitHub Appのアクセス範囲はこのリポジトリだけに限定。
- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main`
- 本番デプロイID: `9092c199-e62b-43de-b10d-faf64d00f757`
- 本番コミット: `5a8ce45`
- Pages本番URL: `https://tamashiro-blog.pages.dev/`
- 固定デプロイURL: `https://9092c199.tamashiro-blog.pages.dev/`
- 両URLとも2026-08-12 08:38 JSTにHTTP 200、新デザインのtitleを確認。
- プレビューURL: `https://5c7a8a4d.tamashiro-blog.pages.dev/`

### 4. Cloudflare DNSの移行先レコード

- Cloudflareゾーン: `ysk.life`
- Zone ID: `2e1e385219dcbaaa89857770de3c2783`
- プラン: Free
- Cloudflare権威NSへ直接問い合わせ、次の6レコードが存在することを確認済み。

| 種別 | 名前 | 内容 | Proxy |
|---|---|---|---|
| A | `mail` | `157.120.209.14` | DNS only |
| A | `www` | `160.251.71.118` | Proxied（Pages接続前の旧値） |
| A | apex | `160.251.71.118` | Proxied（Pages接続前の旧値） |
| MX | apex | `mail1041.onamae.ne.jp` priority 10 | DNS only |
| TXT | apex | SPF `include:_spf.onamae.ne.jp` | DNS only |
| TXT | `default._domainkey` | DKIM公開鍵あり | DNS only |

重要: `mail` は当初Cloudflareの自動スキャンでProxiedになっていたため、DNS onlyへ修正済み。MX・SPF・DKIMもDNS only。

### 5. お名前.comのネームサーバー変更

- 変更前:
  - `ns-rs1.gmoserver.jp`
  - `ns-rs2.gmoserver.jp`
- 変更先:
  - `gemma.ns.cloudflare.com`
  - `lars.ns.cloudflare.com`
- 対象は `ysk.life` だけであることを最終確認画面で確認。
- 2026-08-12 07:15 JST頃に最終OKを実行。
- お名前.com画面で `お手続きが完了しました。` をreadback済み。
- DNSSECのDSレコードは存在しない（DNSSECは切替阻害要因ではない）。
- Cloudflare側の `Check nameservers now` も実行済み。同じ操作を再送しない。

## 移行完了確認

確認日時: 2026-08-12 13:12 JST

- `.life` 親ゾーンとシステムリゾルバはCloudflare NSを返す。
  - `gemma.ns.cloudflare.com`
  - `lars.ns.cloudflare.com`
- Cloudflareダッシュボードで `ysk.life` はActive。
- Pages `tamashiro-blog` のカスタムドメインは `ysk.life` と `www.ysk.life`。
- DNSはapex・`www`とも `tamashiro-blog.pages.dev` 向けCNAME、Proxied、TTL Auto。
- apex・`www`とも専用TLS証明書が発行済みでHTTPS 200。
- HTTP apexはHTTPS apexへ301転送。
- `/blog/`、`/about/`、`/toolbox/`、`/privacy/`、`/affiliate-disclosure/`、`/rss.xml` は200。
- 存在しないURLは404。
- apex・`www`ともcanonicalとOG URLは `https://ysk.life/`。
- faviconと本人写真は200で、実ブラウザでも新デザイン・本人写真・ナビ・主要導線を確認済み。
- MX、SPF、DKIM、`mail` Aは移行前の値を維持。

`www` はapexへ転送せず同じPagesサイトを表示する。canonicalはapexに統一されており、引き継ぎで定めた最低合格条件を満たす。恒久転送を追加する場合は、別のCloudflare Redirect Rule変更として扱う。

## Vercel削除結果

- 削除した対象は `tamashiro-taxlegaljps-projects/tamashiro-blog` の1件だけ。
- Project ID: `prj_C1AhKBAv0WgqHOtorGlqlnxEkFRE`
- 2026-08-12 13:11 JST、対象を再照合してから削除。
- 削除後の `vercel project inspect tamashiro-blog --scope tamashiro-taxlegaljps-projects` は `There is no project`。
- 旧URL `https://tamashiro-blog.vercel.app/` はHTTP 404、`x-vercel-error: DEPLOYMENT_NOT_FOUND`。
- 削除後もCloudflare本番と主要ルートは200を維持。

## 次セッションの開始手順

```bash
cd /Users/tamashiro_yusuke/Cursor/tamashiro-blog
git -c core.quotePath=false status --short --branch
git fetch origin --prune
git log -1 --oneline origin/main
npx wrangler pages project list
curl -L -sS -o /dev/null -w '%{http_code} %{url_effective}\n' https://ysk.life/
curl -L -sS -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.ysk.life/
dig +short MX ysk.life
dig +short TXT ysk.life
dig +short TXT default._domainkey.ysk.life
dig +short A mail.ysk.life
```

現時点で必須の移行残作業はない。任意の次候補は `www` → apex の恒久転送、Amazonアソシエイト登録媒体への `ysk.life` 追加、記事内容の事実確認・更新である。これらは互いに独立した変更として扱う。

## Git作業ツリーの注意

2026-08-12 13:12 JST時点:

```text
## codex/ysk-life-cloudflare-migration...origin/codex/ysk-life-cloudflare-migration
?? HANDOFF.md
?? logs/2026-08-12-ysk-life-plan.md
```

- 上記2ファイルは意図的な未追跡ファイル。`git add .` を使わない。
- 実装PRはすでにマージ済み。ローカルmainへ強制的に切り替えたり、reset/clean/checkout-discardしない。
- 引き継ぎメモをコミットする場合も、ユーザーに対象ファイルを明示し、別承認で行う。

## 次セッションへの依頼文

```text
/Users/tamashiro_yusuke/Cursor/tamashiro-blog/HANDOFF.md を最優先で読み、
Git・Cloudflare Pagesの登録ドメイン・ysk.life / www.ysk.life・メールDNSをread-onlyで再確認してください。
Cloudflare移行と旧Vercel削除は完了済みです。ネームサーバー変更やVercel削除を再送しないでください。
新しい変更は、www恒久転送、Amazonアソシエイト登録媒体、記事更新を独立した作業・承認単位として進めてください。
```
