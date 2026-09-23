# 2026-09-23 メールだより（記事更新のメール配信）を実装

ブランチ: `feature/newsletter-subscribe`

## 決めたこと

- **やる価値はある**と判断。検索流入で1記事読んで帰る読者に対して、こちらから再訪を促せる唯一の手段がメールであるため。
- 方式は**自前（Resend＋Cloudflare）**。ysk.life のドメイン認証がResendで済んでおり、サイト側にすでにPages Functions＋D1があるため追加費用0円で作れる。名簿は自分のD1に置く。
- 記事にアフィリエイトリンクを含むため、配信は**広告宣伝メールとして扱う**（特定電子メール法）。登録はダブルオプトイン、全通に送信者名・住所・配信停止を記載。
- 法定表示の住所は「沖縄県中頭郡北谷町字桑江618番地7」を使用（ユーザー指定）。
- 配信は当面**手動**。RSSからの全自動配信は、文面の質が記事の書き出しに依存するため見送り。

## 作ったもの

| 役割 | ファイル |
|---|---|
| 設定の正本 | `lib/newsletter/config.ts` |
| メール本文＋Resend送信 | `lib/newsletter/email.ts` |
| 登録受付・確認・停止 | `functions/api/newsletter/{subscribe,confirm,unsubscribe}.ts` |
| 名簿・配信履歴 | `migrations/0002_newsletter.sql` |
| 登録フォーム | `src/components/NewsletterSignup.astro` |
| 案内・結果ページ | `src/pages/newsletter/{index,confirmed,unsubscribed,link-expired}.astro` |
| 配信コマンド | `scripts/send-newsletter.ts` / `npm run newsletter` |
| 運用手順 | `docs/newsletter.md` |

既存への差し込み: 記事末尾（`BlogPost.astro`）・トップ（`index.astro`）にフォーム、両フッターに導線、
プライバシーポリシーに「メール登録と配信」の節、`BaseHead.astro` に `noindex` を追加（結果ページ用）、
sitemapから結果ページを除外。

## 検証（wrangler pages dev + ローカルD1）

- 登録POST → `pending` 行と確認トークンが作成されることを確認。
- 確認リンク → `active` 化、`unsubscribe_token` 発行、完了ページへリダイレクト。
- 使用済みトークンの再利用 → 期限切れページへ。
- 配信停止 GET → 停止ページ、ワンクリック用 POST（RFC 8058）→ `{"ok":true}`。
- フォームの成功・失敗表示、スマホ幅（375px）で横スクロールなし。
- メールHTML（確認・記事）をブラウザで表示し、法定表示が入っていることを確認。
- `npm run build` 31ページ成功、`npm run check:api` 通過。
- ローカルの試験データは削除済み。本番へは未反映（下記が残作業）。

## 発見と対応

- 入力欄が2つ（メール＋自動登録対策の隠しフィールド）あると、Enterキーでの送信がブラウザ任せでは
  発火しない場合があった。`keydown` で `requestSubmit()` を呼ぶようにして確実に送信されるようにした。
- APIキー未設定時は登録フォームが503を返し「ただいま受け付けできません」と表示される。本番反映前に
  環境変数を入れること。

## 残作業（ユーザー操作が必要）

1. Resend で API キーを作成する。
2. Cloudflare Pages の環境変数に `RESEND_API_KEY` を登録する（Production / Preview 両方）。
3. `npx wrangler d1 migrations apply ysk-life-engagement --remote` で本番に表を作る。
4. `~/.zshenv` に `export RESEND_API_KEY=...` を追記する（配信コマンド用）。
5. 本番反映後、自分のアドレスで登録→確認→停止まで通しで試す。
