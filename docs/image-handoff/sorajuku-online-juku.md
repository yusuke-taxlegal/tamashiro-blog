# 画像引き継ぎ｜そら塾（オンライン個別指導）紹介記事

対象記事: `src/content/blog/sorajuku-online-juku.md`
作成日: 2026-08-29

## 使い方

ChatGPTで GPT Image 2 を選び、記載の正本シートを画像添付のうえ、下記プロンプトをそのまま貼り付けて生成してください。
生成後は `CHARACTER_GUIDE.md` の「生成後の確認項目」で崩れがないか確認し、`.webp` に変換して指定パスへ保存し、チェックを入れてください。

正本シートの場所（Obsidian Vault側）:
`00_Obsidian/01_T&L_収益化プロジェクト/brand-assets/tl-support/character-sheets/`

この記事は全カット「玉城祐輔（ビジネスカジュアル）」で統一します。
添付する正本シートは `tamashiro-yusuke-business-casual-character-sheet-v3.png` の1枚だけです。

### この記事固有の注意

- **子ども（息子）は描かせない。** 正本シートに中学生キャラクターが存在しないため、勝手に子どもを生成させると正本管理から外れます。全カット玉城祐輔ひとりの場面にしてあります。プロンプト末尾の否定指定（`child identity`）もそのまま残してください。
- **画面の中に文字・ロゴを描かせない。** そら塾のロゴや実在サービスの画面を描かせないでください。タブレットやPCの画面は無地、または簡単な図形程度にとどめます。
- 衣装は正本どおり（濃紺のジャケット＋白Tシャツ＋濃紺のパンツ＋茶色の紐付き革靴）から変更しません。

---

## 1. ヒーロー画像

- 保存先パス: `src/assets/blog/sorajuku-online-juku/hero-desk-setup.webp`
- 用途: 記事のヒーロー画像（フロントマターの `heroImage`）
- alt文言: 記事本文には書かず、フロントマターの `heroImage` に指定する
- 添付する正本シート: `tamashiro-yusuke-business-casual-character-sheet-v3.png`
- アスペクト比: 3:2（1536x1024 実績）
- 完了: - [ ]

```text
Use the attached tamashiro-yusuke-business-casual-character-sheet-v3.png as the canonical illustration identity and outfit reference. Do not use a portrait photo to regenerate his face.
Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine dark-brown lace-up Derby shoes. Every visible full-body pose, including seated poses, must use the same compact proportions and masculine lace-up shoes. No long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, logo, watermark, photorealism, or 3D.

Scene/action: Full body, standing at a small home study desk in the evening, setting up for an online lesson. He is placing a tablet on a stand with both hands. Wired earphones, an open notebook, and a pencil are already laid out on the desk, and a sports bag rests on the floor beside the desk. He is alone. Do not draw any child or student. The tablet screen is blank with no text, no interface, and no logo.
Expression/pose: friendly broad tooth-showing smile, calm and careful hands-on posture
Background: simple Japanese home study corner in the evening, simple flat illustration style, plain wall, desk lamp with warm light, window showing dark sky, uncluttered, plenty of empty space on one side
Aspect ratio: 3:2
```

---

## 2. 本文｜自宅の学習環境を確認する場面

- 保存先パス: `src/assets/blog/sorajuku-online-juku/study-corner-check.webp`
- 用途: 本文「親の私から見て、良かったこと」の冒頭
- alt文言: `玉城祐輔が自宅の学習コーナーでWi-Fiルーターと机の位置を確認しているイメージイラスト`
- 添付する正本シート: `tamashiro-yusuke-business-casual-character-sheet-v3.png`
- アスペクト比: 16:9（1672x941 実績）
- 完了: - [ ]

```text
Use the attached tamashiro-yusuke-business-casual-character-sheet-v3.png as the canonical illustration identity and outfit reference. Do not use a portrait photo to regenerate his face.
Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine dark-brown lace-up Derby shoes. Every visible full-body pose, including seated poses, must use the same compact proportions and masculine lace-up shoes. No long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, logo, watermark, photorealism, or 3D.

Scene/action: Full body, crouching slightly beside a small white Wi-Fi router on a low shelf next to a home study desk, checking it with one hand while looking back toward the desk and empty chair to judge the distance. He is alone. Do not draw any child or student. Screens must be blank with no text, no interface, and no logo.
Expression/pose: friendly broad tooth-showing smile, attentive checking posture
Background: simple Japanese home study corner in daytime, simple flat illustration style, plain wall, small desk with an empty chair, low shelf, soft daylight from a window, uncluttered
Aspect ratio: 16:9
```

---

## 3. 本文｜1年分の費用を書き出す場面

- 保存先パス: `src/assets/blog/sorajuku-online-juku/yearly-cost.webp`
- 用途: 本文「費用は「月謝」ではなく「1年分」で見る」の冒頭
- alt文言: `玉城祐輔がノートとカレンダーを広げ、1年分の塾費用を書き出して確認しているイメージイラスト`
- 添付する正本シート: `tamashiro-yusuke-business-casual-character-sheet-v3.png`
- アスペクト比: 16:9（1672x941 実績）
- 完了: - [ ]

```text
Use the attached tamashiro-yusuke-business-casual-character-sheet-v3.png as the canonical illustration identity and outfit reference. Do not use a portrait photo to regenerate his face.
Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine dark-brown lace-up Derby shoes. Every visible full-body pose, including seated poses, must use the same compact proportions and masculine lace-up shoes. No long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, logo, watermark, photorealism, or 3D.

Scene/action: Seated at a home dining table at night, writing in an open notebook with a pencil. A simple wall calendar hangs behind him and a small calculator sits on the table beside the notebook. He is alone. Do not draw any child or student. Keep the notebook and calendar pages blank with no readable text, numbers, or logo.
Expression/pose: calm friendly smile, focused thinking posture with one hand on the notebook
Background: simple Japanese home dining room at night, simple flat illustration style, plain wall, wall calendar, warm pendant light, uncluttered
Aspect ratio: 16:9
```

---

## 画像がそろった後の手順

1. 画像を `src/assets/blog/sorajuku-online-juku/` に配置する。
2. フロントマターに `heroImage: '../../assets/blog/sorajuku-online-juku/hero-desk-setup.webp'` を追加する。
3. 本文のプレースホルダーコメントを差し替える。
   - ヒーロー用（記事冒頭）のコメントは**削除する**（本文には貼らない）。
   - 本文2か所は `![alt](../../assets/blog/sorajuku-online-juku/xxx.webp)` へ置換する。
4. このファイルのチェックボックスを埋める。
5. `npm run build` を実行し、成功を確認してからコミットする。
