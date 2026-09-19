# ysk.life 記事の反応・人気記事機能 — 2026-09-19

## 現在の状態

ユーザーの「提案通りに進めて」に基づき本番反映済み。2026-09-19 21:24 JSTにGA4接続も完了。実データ同期・同期間の再同期・公開ランキングの表示を確認済み。以下の接続待ち記録は作業履歴であり、末尾の完了記録を優先する。

- 本番: https://ysk.life/
- 管理画面: https://ysk.life/admin/engagement/
- 管理アクセスキー: `/Users/tamashiro_yusuke/.config/ysk-life/engagement-admin.txt`（600、値はGitやログへ記載しない）
- Pages deployment: `bdd9081f-93f8-4bcb-bc73-493306e1562f`
- 元の本番deployment: `04d54dfa-926a-4523-b559-12fd445dd476`
- Preview deployment: `9257b0ab` / https://engagement-preview.tamashiro-blog.pages.dev
- Worker production version: `722d59f7-f965-4c83-8d98-49fd1a7710fb`
- Worker preview version: `936da699-3e75-4466-9c1f-2f6e0f4c754f`
- Cloudflare account: `042e5a365510f394d8181f19eb620ea8`
- D1 production: `ysk-life-engagement` / `b88737c5-a1f5-4dd1-b581-eb0b6bc2d210`
- D1 preview: `ysk-life-engagement-preview` / `c04961d0-05f3-49de-bf60-6b9e7e4de7f8`

## 挙動

記事末尾に「参考になった」「試してみたい」。署名付きHttpOnly Cookieで同じブラウザーからの重複を抑止。Cookieを消す・別端末を使うと別扱いになり、本人単位の厳密な投票ではない。生IPは保存せず短期のHMACレート制限に使用する。記事上の反応数は累計。

GA4は分析同意かつ本番ホストのみ。共有先リンクのクリック、リンクコピー成功、OS共有操作、60秒の表示・フォーカス時間かつ本文80%到達を記録する。SNSの実投稿完了・全共有数や、本当に理解したことを保証する指標ではない。反応イベントもGA4同意がある場合だけ送る。D1の明示的な反応保存はGA4同意から独立。

管理画面は昨日までの30日間（日本時間）。D1反応総数とGA4由来の指標を区別し、率の分子・分母はGA4内でそろえる。管理ログインは8時間、no-store。管理画面にGA4は読み込まない。

人気記事: 30日で5PV以上、上位3件。参考になった記事: 同期間で3反応以上かつ20PV以上、反応数順の上位3件。最終同期が72時間以上前なら公開欄を隠す。閾値は `lib/engagement/reports.ts`。

同期は毎日04:15 JST。GA4過去30完了日を置換し、日別集計は365日保持。失敗・不完全レポート時は既存データと成功時刻を維持する。Workerはpublic routeなし、Pagesのservice binding経由のみ。GA4未認証時は503 `awaiting_ga4_connection`。

## GA4接続の再開

1. Chrome「🔎 ysk.life 計測確認」のGoogle Cloud SDK画面をユーザーにログイン完了してもらう。パスワードや認証コードをチャットに求めない。
2. 実行中の `gcloud auth login --force --no-launch-browser` はPTY session 12767（セッションが失効していれば再認証）。ユーザーの完了返答はまだ受けていない。
3. GA4専用のサービスアカウントを用意し、Analytics Data APIを有効化。GA4 property `550976520`（ysk.life、measurement `G-752CVHZQNC`）だけに読み取り権限を設定する。ブラウザー経由の新規権限付与はブラウザー確認ポリシーに従い、具体的な付与先・権限を示して操作直前に確認する。
4. サービスアカウントJSONをWorker secret `GA4_SERVICE_ACCOUNT_JSON`へ安全に保存。汎用ユーザーrefresh tokenをCloudflareへ送らない。現在のADCは別案件fir-asato関連かつAnalyticsスコープ不足なので流用しない。
5. 管理画面から同期し、GA4実データ、Asia/Tokyo、公開ランキング、再同期の冪等性を検証する。過去のPVは取り込めるが新規カスタムイベントの履歴は実装後から。

GA4管理UIではアクセスデータが存在することを確認済み。自動接続成功は未確認。専用Google Cloud project/サービスアカウントはまだ作成していない。

## デプロイ範囲の注意

作業開始前から多数の未コミット記事・デザイン変更がある。commit/pushはしていない。今回、公開中の静的資産 `/tmp/ysk-engagement-baseline` に対象変更だけを重ね、`/tmp/ysk-engagement-release` からPagesへ配備した。公開済み14記事の本文を保持。未公開 `ai-driven-school-completion` とカルーセル変更は配備していない。

ローカル `dist` の直接デプロイは未公開変更を含む。`scripts/prepare-engagement-release.py` の入力・出力を確認し、候補を作ってから配備する。ソースmanifestはローカル15記事、公開releaseのmanifestは14記事。次回公開時に意図的に更新する。

## 検証

- `npm run check`: Astro 0 errors / 0 warnings / 既存execCommand非推奨hint 1件。
- `npm run check:api`: passed。
- `npm run build`: passed（ローカル25ページ、直接配備しない）。
- `npm run test:engagement`: 8 passed。
- `npm run test:engagement:sync`: 2 passed。json_eachの実ローカルD1検証と、SQLiteを使った同期の原子性・空結果・失敗保持検証。
- Preview実API: 14項目passed。成功投票・再送・Cookie・CSRF・非公開記事除外・認証・同期未接続・ログアウト。
- 本番readback: 144/144資産一致（Cloudflare beacon/email正規化のみ）。`production-readback.json`。
- 本番管理API: 未認証401、正しいキーで14記事、no-store、Secure/HttpOnly/SameSite cookie、ログアウト確認。`production-admin.json`。
- 本番記事1440px/390px: 横はみ出しなし、画像欠損なし、反応ボタン表示。管理ログイン画面表示。
- Previewの検証用投票・GA集計・sync_state・rate_limitsは全削除済み。本番の人工投票は作成していない。

`.dev.vars` / `.dev.vars.preview` / Worker `.dev.vars` と生成型はGit除外。認証値をログへ出力しない。

## 接続作業の進捗（同日、ログイン完了後）

- ユーザーのGoogleログイン完了を受け、gcloud認証成功を確認。
- 専用GCP project `ysk-life-analytics-20260919`（number `408495913891`）作成済み。Analytics Data API / IAM API有効化。gcloud既定projectは変更していない。
- サービスアカウント `ga4-reader@ysk-life-analytics-20260919.iam.gserviceaccount.com` 作成済み。プロジェクト内のロール付与なし。
- キーは `/Users/tamashiro_yusuke/.config/ysk-life/ga4-reader.json` に600で保管。本番Worker secret `GA4_SERVICE_ACCOUNT_JSON` 登録済み。Previewには実データアクセス用secretを登録していない。
- GA4「ysk.life」のプロパティアクセス管理で権限追加フォームまで移動済み。ここでChrome拡張機能UIが操作をブロックした。ユーザーへ拡張機能UIを閉じることと、上記アカウントへの閲覧者権限付与の直前確認を依頼中。まだ権限は付与していない。
- 次: ユーザー返答後ブラウザーで閲覧者のみ・メール通知なしを設定して追加し、管理API経由の同期を2回、実PV・公開ランキング・同期間再同期の非重複を検証。

## GA4接続完了（2026-09-19 21:24 JST）

ユーザーが専用サービスアカウントをysk.lifeプロパティの閲覧者として追加し、画面でも確認。追加の権限変更は不要。

- 本番管理APIから同期成功（HTTP 200 / ok true / 16日別記事行）。status=ok、Asia/Tokyo。
- 同期間を2回同期し、全記事の集計値が完全一致。重複加算なし。
- 昨日までの30日間: 記事PV合計45。WWS 14、UPSIDER 9、Gmail/Gemini 7、HiDock 6、SeminarFlow 6、AVAKYO 2、ChatGPT入門1。
- 公開APIと本番ブラウザーの「最近よく読まれている記事」が、WWS → UPSIDER → Gmailの順で一致。
- 「参考になった」ランキングはまだ表示条件未達のため非表示。
- 毎日04:15 JSTのCron設定済み。今回確認したのは手動の本番同期であり、次回定期実行はまだ未観測。
- 検証結果は ga4-live-sync.json。秘密鍵や管理キーは含まない。
- 接続・実データ検証の残作業なし。今後の共有・読了イベントは計測開始後に蓄積される。
