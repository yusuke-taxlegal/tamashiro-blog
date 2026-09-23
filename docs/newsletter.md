# メールだより（記事更新のメール配信）の使い方

ysk.life の読者にメールで記事を届ける仕組みです。登録フォームと確認メールは自分のサイト側にあり、
メールの配送だけを Resend（メール配信サービス）に任せています。登録者の名簿は Cloudflare の
データベース（D1）に保存され、他社の管理画面には置きません。

## 全体の流れ

1. 読者が `/newsletter/` または記事末尾のフォームにメールアドレスを入れる
2. 確認メールが届く（この時点ではまだ未登録）
3. 読者がメール内のリンクを押す → 登録完了（`status = active`）
4. 記事を公開したら、パソコンから `npm run newsletter` で配信する
5. 読者はメール下部のリンクでいつでも配信停止できる（`status = unsubscribed`）

2番と3番の2段階にする方式を「ダブルオプトイン」と呼びます。本人以外が勝手に登録できず、
同意した記録も残るため、法律の求めに素直に応えられます。

## 最初に1回だけ必要な準備

| # | やること | 場所 |
|---|---|---|
| 1 | Resend で API キー（送信用の鍵）を作る。権限は Sending access で足りる | resend.com の管理画面 |
| 2 | そのキーを `RESEND_API_KEY` という名前で登録する | Cloudflare Pages → tamashiro-blog → Settings → Variables（Production と Preview の両方） |
| 3 | 本番データベースに表を作る（下のコマンド） | ターミナル |
| 4 | 手元で配信コマンドを使うため、`~/.zshenv` に `export RESEND_API_KEY=...` を追記する | ターミナル |

```bash
npx wrangler d1 migrations apply ysk-life-engagement --remote
```

## 記事を出したあとの配信手順

```bash
npm run newsletter -- <記事のslug>
```

まず本文と宛先数が表示されるだけで、**何も送りません**。内容を確認してから、次のどちらかに進みます。

```bash
npm run newsletter -- <記事のslug> --test tamashiro@taxlegal.jp
```

自分宛てに1通だけ試し送りします。見た目とリンクを実際のメールで確認できます。

```bash
npm run newsletter -- <記事のslug> --yes
```

購読者全員へ送ります。`--note "今回はこういう視点で書きました"` を付けると、記事の説明文の下に一言添えられます。

配信の記録は `newsletter_sends` テーブルに残ります。

```bash
npx wrangler d1 execute ysk-life-engagement --remote --command "SELECT COUNT(*) FROM subscribers WHERE status='active'"
npx wrangler d1 execute ysk-life-engagement --remote --command "SELECT * FROM newsletter_sends ORDER BY id DESC LIMIT 5"
```

## 費用と上限

Resend の無料枠は **1日100通・月3,000通** です。購読者が100人を超えると1回の配信で無料枠の
上限に当たるため、その時点で有料プラン（月20ドル・月50,000通）への切り替えを検討してください。
1回の送信は100件ずつに分けて送っています。

## 守っているルール（変更するときは注意）

- **広告表記**：記事にアフィリエイトリンクを含むため、メールは広告宣伝メールとして扱います。
  送信者の氏名・住所・配信停止の方法を、毎回すべてのメールに入れています。
- **表示の正本**は `lib/newsletter/config.ts` です。住所・差出人・約束の文言はここだけを直します。
  ページやメール本文に直接書かないでください。
- **開封追跡はしません**。誰がいつ開いたかは取得していません。
- **同意の記録**として、申込日時・完了日時・申込ページ・IPアドレスから作った復元できない識別値を
  保存しています。生のIPアドレスは保存していません。

## 仕組みの場所

| 役割 | ファイル |
|---|---|
| 設定の正本（住所・差出人・約束の文言） | `lib/newsletter/config.ts` |
| メール本文の組み立てとResendへの送信 | `lib/newsletter/email.ts` |
| 登録の受付（確認メール送信） | `functions/api/newsletter/subscribe.ts` |
| 登録の完了 | `functions/api/newsletter/confirm.ts` |
| 配信停止 | `functions/api/newsletter/unsubscribe.ts` |
| 登録フォーム | `src/components/NewsletterSignup.astro` |
| 案内・結果のページ | `src/pages/newsletter/` |
| 名簿と配信履歴の表 | `migrations/0002_newsletter.sql` |
| 配信コマンド | `scripts/send-newsletter.ts` |

## 困ったとき

- **確認メールが届かない**：迷惑メールフォルダを確認。それでも届かない場合は Resend の管理画面の
  Logs で、その宛先へ送信が試みられたかを確認します。
- **登録できない画面が出る**：Cloudflare の環境変数 `RESEND_API_KEY` が設定されているか確認します。
  未設定だと登録フォームは「ただいま受け付けできません」と表示します。
- **リンクの期限が切れていますと出る**：確認リンクは72時間で切れます。もう一度登録すれば新しい
  リンクが届きます。すでに登録済み・停止済みのリンクを再度押した場合も同じ画面になります。
