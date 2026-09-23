# 2026-09-23 そら塾記事に画像を設置する

## 状況
https://ysk.life/blog/sorajuku-online-juku/ に画像が1枚も表示されていなかった。

原因は「画像が無かった」のではなく、**生成済みの画像が記事に結び付けられていなかった**こと。
`src/assets/blog/sorajuku-online-juku/` には3枚が2026-08-29にコミット済みだったが、
記事本文はプレースホルダーのHTMLコメントのままで、フロントマターにも `heroImage` が無かった。

引き継ぎメモ（`docs/image-handoff/sorajuku-online-juku.md`）に書かれた保存先と、
実際のファイル名がずれていたことも、放置された一因と思われる。

| 引き継ぎメモの記載 | 実際のファイル |
|---|---|
| hero-desk-setup.webp | hero-tamashiro-yusuke-desk-setup.webp |
| study-corner-check.webp | tamashiro-yusuke-study-corner-check.webp |
| yearly-cost.webp | tamashiro-yusuke-yearly-cost.webp |

## 事前確認（正本との照合）
3枚ともReadツールで開いて目視した。いずれも約2頭身のちびキャラ、濃紺ジャケット＋白T＋
濃紺パンツ＋茶の紐付き革靴で正本どおり。子どもは描かれておらず、画面内の文字・ロゴも無い
（この記事固有の注意事項をいずれも満たしている）。

## 変更内容
- `src/content/blog/sorajuku-online-juku.md`
  - `heroImage` を追加（hero-tamashiro-yusuke-desk-setup.webp）
  - ヒーロー用のプレースホルダーコメントを削除
  - 本文2か所のプレースホルダーを `![alt](...)` に置換（alt文言はメモの記載と一致させた）
  - キャラクター証跡コメントを2行追加（他の商品記事と同じ形式）
- `docs/image-handoff/sorajuku-online-juku.md`
  - 保存先を実際のファイル名に修正し、完了チェックを記入

## 確認
- `npm run check:affiliate` … この記事の指摘なし（注意2件は別記事の既存分）
- `npm run build` 成功（画像パスの解決を兼ねる）
- ブラウザで目視：ヒーローが見出し横に表示、本文2枚も表示。
  実際に読み込まれた画像サイズも確認（ヒーロー900x600、本文1672x941）
