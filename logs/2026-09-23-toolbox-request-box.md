# 2026-09-23 お願い箱を ysk.life に組み込む

## 依頼
`https://toolbox-request-box.pages.dev/` として別に動いていた「道具箱お願い箱」を、
専用URLではなく ysk.life のドメイン・サイト内に組み込む。

## 決めたこと（玉城さんの選択）
- 申込フォームは道具箱と同じ明るいデザインに作り直す
- URLは `/toolbox/request/`
- 窓口は道具箱ページからリンクを張って開く
- 旧 `toolbox-request-box.pages.dev` は ysk.life 側の動作確認後に閉じる

## 移設元
`00_Obsidian/01_玉城AI発信/アフィリエイト/玉城祐輔_愛用ガジェット紹介/request-box/`
（設計の正本は同ディレクトリの `お願い箱_設計と規約の整理.md` と引き継ぎメモ。**このリポジトリには移していない**）

## やったこと（`feature/toolbox-request-box`）

### 1. サーバー側の移植
| 移設元 | 移設先 |
|---|---|
| `server/*.js` | `lib/request-box/{amazon,sign,mail,requests}.js` |
| `functions/api/*.js` | `functions/api/request-box/{config,requests}.js`・`.../admin/{list,request}.js` |
| `migrations/0001_init.sql` | `migrations-request-box/0001_init.sql` |
| `tests/*.test.mjs` | `tests/request-box/*.test.mjs`（`npm run test:request-box`） |

ロジックは変えていない。変えたのは次の3点だけ。

- **名前のぶつかりを解消**：ysk.life 側が既に使っている `DB` と `ADMIN_TOKEN` と衝突するため、
  お願い箱側を `REQUESTS_DB` / `REQUEST_ADMIN_TOKEN` / `REQUEST_ADMIN_SECRET` に改名した
- **APIのパスを `/api/request-box/` 配下へ**（既存の `/api/admin`・`/api/engagement` と分ける）
- **通知メールの対応リンク**を `/toolbox/request/admin` に変更

### 2. Cloudflare Pages の1プロジェクトに同居させる
`wrangler.jsonc` に D1 バインディング `REQUESTS_DB`（既存の `toolbox-request-box` データベースを
そのまま使う。データ移行なし）と、お願い箱用の `vars` を追加した。

- `ALLOWED_ORIGINS` は `https://ysk.life,https://www.ysk.life`（www も200で配信されるため両方入れる）
- preview環境は `ALLOWED_ORIGINS` を空にして、プレビューURLから本番台帳へ書き込めないようにした

### 3. 画面
- `/toolbox/request/`：`src/pages/toolbox/request.astro`。道具箱と同じ明るいデザインで作り直した
- `/toolbox/request/admin`・`/dashboard`：`public/toolbox/request/` に元のHTML/CSS/JSのまま設置（管理画面なので黒いまま）
- 道具箱の各ページ下部にリクエスト導線（`.request-cta`）を追加

### 4. 気づいた罠
**Cloudflare Pages は `/xxx.html` を拡張子なしURLへ308で寄せる。**
`_headers` の指定を `admin.html` のまま書くと noindex も no-store も効かない。
配信される実際のパス（`/toolbox/request/admin`）で書くこと。メールのリンクも寄せ先を直接指すようにした。

## 確認（ローカル）
`wrangler pages dev ./dist` に `.dev.vars`（ダミー値・SITE_MODE=local）で実施。

- `/api/request-box/config` → `ready:true`
- 受付を1件通し → 他人の `tag=` が外れ、ASIN抽出、`local_test` で保存（メールは出ない）
- 画面から送信 → 受付番号つきの完了メッセージ、コンソールエラーなし
- 一覧API → トークンなし401 / ありで200
- 管理画面 → `X-Robots-Tag: noindex` と `Cache-Control: no-store` が付く
- 既存の `/api/popular` 200（`DB` バインディングは無事）
- 1280px / 375px、横スクロールなし

テスト：お願い箱31件・記事の反応8件すべて成功。`astro check` エラー0、ビルド29ページ成功。

## 残り（玉城さんの作業）
1. Pages secret 4本を `tamashiro-blog` プロジェクトへ登録（`TURNSTILE_SECRET_KEY` `RESEND_API_KEY`
   `REQUEST_ADMIN_SECRET` `REQUEST_ADMIN_TOKEN`）。**登録後は必ず再デプロイ**（前回踏んだ罠）
2. Turnstileウィジェットの許可ドメインに `ysk.life` と `www.ysk.life` を追加
3. 上記のあと本番で1件通しで確認 → 旧プロジェクトを閉じる

秘密値が入るまで、フォームは「いまは受付を準備中です」と出る（安全側に倒れる設計）。
