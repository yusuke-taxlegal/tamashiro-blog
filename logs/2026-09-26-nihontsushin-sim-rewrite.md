# 2026-09-26 日本通信SIM記事のリライトと挿絵の作り直し

ブランチ: `article/nihontsushin-sim-rewrite`（別セッションが `tamashiro-blog` 本体で作業中のため、worktree `../tamashiro-blog-sim` で作業）

## 1. リライト方針（`src/content/blog/nihontsushin-sim-minna-plan.md`）

- 冒頭に「一言でいうと、スマホ1台の契約で外のパソコン仕事の通信までまかなえる月1,390円のSIM」を置いた。
- テザリング、格安SIM／MVNO、eSIM、MNP、ベストエフォート、VoLTE に一言解説を付けた。
- 「しくみは『ドコモの電波 → スマホ → パソコン』」の節を新設し、スマホとパソコンの通信量が同じ20GBから引かれることを明示。
- 「料金で覚えるのは三つだけ」の節を新設し、月額・超過・初期手数料を先に整理。通話の選択肢と超過通話料もここにまとめた。
- 「申込み前に、この四つを確認する」を番号付き小見出しに分け、端末／マイナンバーカード／クレジットカード／MNP名義の順にした。
- 旧記事の「この記事は…公式仕様を分けてまとめたものです」という制作事情の段落は削除（スキルの方針）。
- `updatedDate: '2026-09-26'` を追加。`pubDate`・`title`・URL は据え置き。
- 購入枠の商品画像を、190x300pxしかない日本通信公式パッケージ画像から Amazon提供のリモート画像（1200px）へ変更。

## 2. 公式情報の再確認（2026-09-26）

- 月額基本料1,390円／20GB、超過1GB 220円、上限20〜50GBを1GB単位でマイページ設定、上限到達で低速、請求は実使用量ベース（例: 上限22GB・使用20.8GB → 1,610円）。
- 通話: 5分かけ放題 or 月70分無料通話（契約後もマイページで変更可）。超過30秒11円。かけ放題オプション +1,600円。フリーダイヤルは無料通話を消費しない。0570等は対象外。
- 初期手数料3,300円。スターターパックの申込コードは初期手数料に充当（公式の表現は「充当」に変わっていたため記事も合わせた）。申込コードに期限あり。SIM同梱なし。
- 最低利用期間・解約金・MNP転出手数料なし。月途中解約の日割りなし。
- 端末: SIMロック解除済（2021年10月以降発売は不要）、ドコモ周波数帯、VoLTE対応。申込みにはマイナンバーカードを読み取れる端末が必要。本人名義クレカ、Wi-Fi、メールアドレス。
- eSIM発行・再発行は1年3回まで無料、4回目以降1,100円。
- 海外データ通信は不可（通話・SMSは条件付き）。
- 通信はベストエフォート。大容量DLや連続ストリーミングは時間帯で制限の場合あり。
- 3Gは2026年3月31日で終了（記事本文では触れていない）。

## 3. 画像

旧画像4枚（`hero-tethering-illustration.webp` ほか）は旧画風で、ファイル名にキャラクター識別子が無く機械検査も通らないため削除し、現行の正本で5枚を作り直した（Codex CLI 標準画像生成、1536x1024、3:2）。

| ファイル | 用途 | 登場キャラ | 参照した正本 |
|---|---|---|---|
| `hero-tamashiro-yusuke-tethering.webp` | ヒーロー。カフェでスマホのテザリングでPC仕事 | 玉城祐輔（ビジネスカジュアル） | v5 / style-master-v2 / casual-v3 |
| `tamashiro-yusuke-tethering-how-it-works.webp` | 電波塔→スマホ→パソコンの3カード図 | 玉城祐輔 | 同上 |
| `tamashiro-yusuke-rira-20gb-usage.webp` | 20GBの使い道ゲージと注意アイコン | 玉城祐輔＋Rira | 同上＋rira-v3 |
| `worried-business-owner-riku-busy-time-fallback.webp` | 昼の混雑と戻り先（Wi-Fi・別回線） | 悩める社長＋Riku | style-master-v2＋worried-v1＋riku-v3 |
| `accounting-staff-rira-application-check.webp` | 申込み前の4項目チェック | 総務・経理担当者＋Rira | style-master-v2＋accounting-v1＋rira-v3 |

プロンプトは `CHARACTER_GUIDE.md` の各キャラのコピペ用プロンプトを使い、Scene/Expression/Background/Aspect ratio のみ記入。複数キャラは各ブロックを連結し、共通見本v2を画風参照に指定。

### 目視照合の結果

- hero: 顔・髪・眉・笑顔が正本どおり。約2頭身。黒い紐靴。スマホからPCへの電波弧あり。文字なし。採用。
- how-it-works: 顔・髪・黒い紐靴が正本どおり。電波塔＋SIM／スマホ／パソコンの3カードと矢印。文字なし。採用。
- rira-20gb-usage: 玉城は正本どおり。Riraはイヤーピースが視聴者から見て右、花は右側2輪＋左側1輪、白ブラウス・薄紫の襟と袖・プラムのスカートとローヒール。ゲージと禁止アイコンは指示どおり。採用。
- worried-business-owner-riku-busy-time-fallback: 悩める社長（乱れ髪・無精ひげ・グレーブルゾン・縞ポロ・茶ブーツ）、Riku（イヤーピース右・パーカー・黄Tシャツ・白スニーカー黄アクセント・上向き前髪）とも正本どおり。時計に数字なし。採用。
- accounting-staff-rira-application-check: 総務・経理担当者（低いサイドポニー・水色ブラウス・紺ベスト・グレーカーディガン）、Rira（右イヤーピース・花配置）とも正本どおり。IDカード・クレカに文字なし。採用。
- 5枚とも 1536x1024（3:2）のまま切らずにWebP化（sharp, quality 82）。

## 4. 検証

- `check_product_article.py`: OK（Amazonリンク4件、0 warning）
- `npm run check:affiliate`: 問題なし
- `npm run build`（worktree）: 成功（30ページ）
- `astro preview --root ../tamashiro-blog-sim --port 4333` で実ブラウザ確認（`.claude/launch.json` に一時追加し、確認後に元へ戻した）
  - 記事内の全画像19枚に読み込み失敗なし。`og:image` は新ヒーロー画像。
  - 375px幅で横はみ出しなし。デスクトップで検出した横幅超過は共通の記事カルーセル（横スクロール部品）で、ページ自体の scrollWidth は clientWidth と一致。
  - コンソールの404は `/api/engagement`（静的プレビューでは Pages Functions が動かないため。既知）。

## 5. Git

- `article/nihontsushin-sim-rewrite` に1コミット（記事・画像5枚・旧画像4枚の削除・作業ログ）。main へのマージ・push は未実施。
