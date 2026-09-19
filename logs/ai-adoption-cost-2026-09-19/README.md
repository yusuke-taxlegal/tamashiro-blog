# AI導入費用の記事制作

## 本番公開完了（2026-09-19）

- ユーザーの「デプロイ」指示で公開。
- 本番: https://ysk.life/blog/ai-adoption-cost-and-skills/
- 候補: https://e0c102f8.tamashiro-blog.pages.dev
- 本番固定: https://b03f223e.tamashiro-blog.pages.dev
- 前回配備用コピーは消失していたため、別ディレクトリで本番構成を復元。BlogPost.astroの未公開カルーセル変更をコピー内だけで除外し、既存21 HTMLが前回本番固定URLとバイト一致することを確認後、対象記事を追加。
- 既存記事本文、About・道具箱・privacy等を保全。未公開AIスクール記事は除外、公開後も404。
- 候補・本番固定・ysk.lifeで117 HTML/画像等を照合。本番privacyのみCloudflareのメール難読化を復号して一致、それ以外はバイト一致。
- 候補390px/1440pxの画面を目視確認。本番390pxも横はみ出しなし、本文画像2枚はnaturalWidth=1440/complete=true、ヒーロー表示、ブラウザwarn/errorなし。
- OGPは本番トップ画像、画像HTTP 200 image/webp。
- Git commit/push・DNS変更なし。元の作業ディレクトリの無関係なdirty変更は保全。

以下は制作時の記録。

2026-09-19。公開・commit・pushなし。既存dirtyファイルは編集せず、記事、画像3枚、本ログのみ追加。

- 原文: Downloads/2026年9月19日 AI導入に関するコストとスキルの影響.md
- 記事: src/content/blog/ai-adoption-cost-and-skills.md
- 読者: AI導入の予算を考える小規模事業者。自分で試す部分と外部支援を受ける部分を判断する。
- 本人の発言を一人称記事へ整理。「玉代」等の文字起こし誤認識は修正。
- 20〜30万円・月5〜6万円は本人が想定する予算例として採用。相場や正式価格として扱わない。
- 一律のトークン単価上昇、仕事消滅、CopilotとGrokの将来の一体化、組織別の普及予測は断定せず、記事の費用判断に絞った。

## 公式確認

確認日2026-09-19。本文の該当箇所に公式リンクあり。

- https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus — 20米ドル/月、API別課金、利用上限。3,000円は1ドル150円の仮定計算で実請求額ではない。
- https://help.openai.com/en/articles/9793128-what-is-chatgpt-pro — 100/200米ドル区分、200米ドルの新規・アップグレード一時停止。
- https://workspace.google.com/pricing?hl=ja — プランごとのGemini機能の比較。

## 類似記事の構成確認

検索語「AI 導入 費用 中小企業 月額 伴走 スキル」で発見した5ページを閲覧。閲覧数は不明で人気順位とは扱わない。費用の内訳、支援範囲、社内定着、引継ぎが共通論点。各社価格を本記事の相場の根拠には使わず、原文と公式情報を優先した。

- https://totono.sc-consulting.co.jp/ai-bansou.html
- https://nk-krypton.tokyo/column/ai-donyu-hiyou-soba/
- https://yokusimasu.jp/ai/first-step/plan/
- https://oz-ing.co.jp/ai-komon.html
- https://ai-setting.jp/ai-introduction/

## 挿絵

全3枚とも tamashiro-yusuke-business-casual-character-sheet-v3.png を実画像入力。ガイドと正本を読み、view_imageで正本と各出力を確認。髪・眉・顔・紺ジャケット・白Tシャツ・茶色紐靴を照合。画像はWebP、横幅1440px、縦横比保持。

- ヒーロー: 費用の3要素。3:2。
- 本文1: 一つの作業と時間の比較。16:9。
- 本文2: 人による確認と継続運用。16:9。

## 検証

- 記事チェッカー: エラー・警告0。
- npm run build: 成功、23ページ。build.txt参照。
- git diff --check: 成功。
- ビルド成果物をAstro preview 4391で確認。
- 1440px: 横はみ出しなし、H1は2行。共有欄上下の左端176.796875pxは本文と一致。
- 390px: scrollWidth=390、表幅362px、共有4操作は各46px四方で横1列。
- ヒーローと本文2枚の画像表示を確認。本文のnaturalWidthは各1440、complete=true。
- ブラウザwarn/errorログ0。
- LINE/Facebookのリンク先はcanonical URL。コピー完了のaria-live表示を確認。ブラウザのclipboard読取は空で、OSの貼付け結果は未確認。Instagramボタン操作はエラーなしだが、OS共有先への送信と非対応環境のコピー分岐は未確認。
- og:type=article、og:imageはトップ画像、HTTPS absolute URL。ローカルの同一画像パスHTTP 200 image/webp。詳細はhttp-checks.json。本番は未公開のため本番画像HTTPは対象外。
- 共通レイアウト・共有CSSは未編集。

## プレビュー

http://127.0.0.1:4391/blog/ai-adoption-cost-and-skills/

公開時は既存の無関係なdirty変更を含めず、対象記事と画像だけを公開する必要がある。
