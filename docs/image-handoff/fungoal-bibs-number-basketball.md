# 画像引き継ぎ｜Fungoal 番号入りビブス（バスケ部・父母会）紹介記事

対象記事: `src/content/blog/fungoal-bibs-number-basketball.md`
作成日: 2026-09-23
更新日: 2026-09-23（**4枚とも生成・設置済み**。以下は再生成が必要になったときの記録）

## 状態

4枚とも生成・設置済みです。生成は Codex CLI（`gpt-image-2.5` スキル）で行い、正本シート3枚を `view_image` で参照画像として渡しました。
生成後に全4枚と正本シートを並べて目視照合し、顔・髪・眉・衣装・黒い紐付き革靴・約2頭身・手指・余分な文字とロゴの有無を確認しています。

## 使い方（再生成するとき）

Codex CLI か、ChatGPTで GPT Image 2 を選び、記載の正本シートを参照画像として渡したうえで、下記プロンプトをそのまま使ってください。
生成後は `CHARACTER_GUIDE.md` の「生成後の確認項目」で崩れがないか確認し、`.webp` に変換して指定パスへ保存してください。

正本シートの場所（Obsidian Vault側）:
`00_Obsidian/01_T&L_収益化プロジェクト/brand-assets/tl-support/character-sheets/`

この記事は全カット「玉城祐輔（ビジネスカジュアル衣装）」で統一します。
`CHARACTER_GUIDE.md`（2026-09-19更新）の「ビジネスカジュアル版コピペ用プロンプト」に従い、**3枚を添付**してください。

1. `tamashiro-yusuke-character-sheet-v5.png`（現行の顔・画風の正本）
2. `2026-09-19_style-unified/tl-four-character-style-master-v2.png`（現行の共通画風見本）
3. `tamashiro-yusuke-business-casual-character-sheet-v3.png`（カジュアル衣装のデザイン参考。靴は黒へ上書き）

### この記事固有の注意

- **子どもや中高生を描かせない。** 正本シートに子どもキャラクターが存在しないため、勝手に生成させると正本管理から外れます。全カット玉城祐輔ひとりの場面にしてあり、プロンプト末尾の否定指定（`child identity`）もそのまま残してください。
- **ビブスの数字は簡単な1桁か2桁まで。** 日本語、チーム名、ブランドロゴ、読める文字は描かせません。
- **ビブスは無地のメッシュベスト**として描かせます。実在商品の形状を正確に再現したつもりの偽画像にしないでください。
- 靴は正本どおり**黒い紐付き革靴**です。スニーカーにしないこと（`CHARACTER_GUIDE.md` の統一ルール）。

---

## 1. ヒーロー画像

- 保存先パス: `src/assets/blog/fungoal-bibs-number-basketball/hero-tamashiro-yusuke-gym-bibs.webp`
- 用途: 記事のヒーロー画像（フロントマターの `heroImage`）
- alt文言: 記事本文には書かず、フロントマターの `heroImage` に指定する
- 添付する正本シート: 上記3枚
- アスペクト比: 3:2（1536x1024 実績）
- 完了: - [x]

```text
Use tamashiro-yusuke-character-sheet-v5.png and tl-four-character-style-master-v2.png as the current identity and style references. Use the old tamashiro-yusuke-business-casual-character-sheet-v3.png ONLY for the casual clothing design, overriding its brown shoes with BLACK lace-up leather shoes. Do not use a portrait photo to regenerate his face.
Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine black lace-up Derby shoes. Every visible full-body pose, including seated poses, must use the same compact proportions and masculine lace-up shoes. No long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, logo, watermark, photorealism, or 3D.

Scene/action: Full body, standing in an empty school gymnasium before practice, holding a folded stack of simple sleeveless mesh training bibs in both arms. Two small piles of bibs in different flat colors are already laid out neatly on the wooden floor beside him, with a simple drawstring pouch next to them. He is alone. Do not draw any child, student, or other person. The bibs may show one simple printed numeral each, one or two digits only, and must carry no Japanese text, no team name, no brand logo, and no watermark.
Expression/pose: friendly broad tooth-showing smile, calm and prepared standing posture
Background: simple Japanese school gymnasium interior, simple flat illustration style, pale wooden floor with plain court lines, plain wall with wall bars, a basketball hoop far in the background, bright daylight, uncluttered, plenty of empty space on one side
Aspect ratio: 3:2
```

---

## 2. 本文｜白と緑と青を並べて色を見比べる場面

- 保存先パス: `src/assets/blog/fungoal-bibs-number-basketball/tamashiro-yusuke-color-sort.webp`
- 用途: 本文「色は「今あるビブスと並べて」決める」の冒頭
- alt文言: `玉城祐輔が体育館の床に白と緑と青のビブスを並べ、色の見分けやすさを確かめているイメージイラスト`
- 添付する正本シート: 上記3枚
- アスペクト比: 3:2（1536x1024。CLAUDE.mdが認める横長2種のうち、生成物を切らずに済む方を選択）
- 完了: - [x]

```text
Use tamashiro-yusuke-character-sheet-v5.png and tl-four-character-style-master-v2.png as the current identity and style references. Use the old tamashiro-yusuke-business-casual-character-sheet-v3.png ONLY for the casual clothing design, overriding its brown shoes with BLACK lace-up leather shoes. Do not use a portrait photo to regenerate his face.
Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine black lace-up Derby shoes. Every visible full-body pose, including seated poses, must use the same compact proportions and masculine lace-up shoes. No long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, logo, watermark, photorealism, or 3D.

Scene/action: Full body, crouching on a school gymnasium floor, comparing three sleeveless mesh training bibs laid side by side: one white, one green, and one blue. He points at the blue one with one hand while looking at the row. He is alone. Do not draw any child, student, or other person. The bibs may show one simple printed numeral each, one or two digits only, and must carry no Japanese text, no team name, no brand logo, and no watermark.
Expression/pose: friendly broad tooth-showing smile, focused counting posture
Background: simple Japanese school gymnasium interior, simple flat illustration style, pale wooden floor with plain court lines, plain wall, bright daylight, uncluttered, plenty of empty space on one side
Aspect ratio: 3:2
```

---

## 3. 本文｜注文内容を確認する場面

- 保存先パス: `src/assets/blog/fungoal-bibs-number-basketball/tamashiro-yusuke-order-check.webp`
- 用途: 本文「注文前に3つ選ぶ。ここを取り違えやすい」の冒頭
- alt文言: `玉城祐輔が自宅の机でタブレットとメモを見比べ、ビブスの番号とサイズと色を確認しているイメージイラスト`
- 添付する正本シート: 上記3枚
- アスペクト比: 3:2（1536x1024。CLAUDE.mdが認める横長2種のうち、生成物を切らずに済む方を選択）
- 完了: - [x]

```text
Use tamashiro-yusuke-character-sheet-v5.png and tl-four-character-style-master-v2.png as the current identity and style references. Use the old tamashiro-yusuke-business-casual-character-sheet-v3.png ONLY for the casual clothing design, overriding its brown shoes with BLACK lace-up leather shoes. Do not use a portrait photo to regenerate his face.
Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine black lace-up Derby shoes. Every visible full-body pose, including seated poses, must use the same compact proportions and masculine lace-up shoes. No long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, logo, watermark, photorealism, or 3D.

Scene/action: Seated at a home dining table in the evening, holding a tablet upright with one hand and pointing at an open paper notepad with the other, comparing the two before placing an order. He is alone. Do not draw any child, student, or other person. The tablet screen and the notepad must be completely blank, with no text, no numbers, no interface, and no logo.
Expression/pose: friendly broad tooth-showing smile, careful double-checking posture
Background: simple Japanese home dining corner in the evening, simple flat illustration style, plain wall, warm ceiling light, a folded sleeveless mesh bib resting on the table edge, uncluttered, plenty of empty space on one side
Aspect ratio: 3:2
```

---

## 4. 本文｜番号ごとに1枚ずつ分けて個人に渡す準備をする場面

- 保存先パス: `src/assets/blog/fungoal-bibs-number-basketball/tamashiro-yusuke-assign-numbers.webp`
- 用途: 本文「1人1枚の運用を、どう回すか」の冒頭
- alt文言: `玉城祐輔が体育館の用具室で、番号入りビブスを1枚ずつ分けて部員に渡す準備をしているイメージイラスト`
- 添付する正本シート: 上記3枚
- アスペクト比: 3:2（1536x1024。CLAUDE.mdが認める横長2種のうち、生成物を切らずに済む方を選択）
- 完了: - [x]

```text
Use tamashiro-yusuke-character-sheet-v5.png and tl-four-character-style-master-v2.png as the current identity and style references. Use the old tamashiro-yusuke-business-casual-character-sheet-v3.png ONLY for the casual clothing design, overriding its brown shoes with BLACK lace-up leather shoes. Do not use a portrait photo to regenerate his face.
Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine black lace-up Derby shoes. Every visible full-body pose, including seated poses, must use the same compact proportions and masculine lace-up shoes. No long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, logo, watermark, photorealism, or 3D.

Scene/action: Full body, standing in front of a simple metal storage shelf in a school equipment room, sorting folded blue sleeveless mesh bibs into separate individual piles, one bib per pile, arranged in number order on the shelf. He places one bib onto a pile with one hand and holds a blank sheet of paper in the other. He is alone. Do not draw any child, student, or other person. The bibs may show one simple printed numeral each, one or two digits only, and the clipboard must stay completely blank, with no Japanese text, no team name, no brand logo, and no watermark.
Expression/pose: friendly broad tooth-showing smile, tidy and methodical posture
Background: simple Japanese school equipment storage room, simple flat illustration style, plain metal shelving, a few plain balls and cones on a lower shelf, plain wall, soft indoor light, uncluttered, plenty of empty space on one side
Aspect ratio: 3:2
```

---

## 画像がそろった後の手順

1. 4枚を `src/assets/blog/fungoal-bibs-number-basketball/` に `.webp` で配置する。
2. フロントマターに `heroImage: '../../assets/blog/fungoal-bibs-number-basketball/hero-tamashiro-yusuke-gym-bibs.webp'` を追加する。
3. 本文3か所のプレースホルダーコメントを、コメント内に書いてある `![alt](パス)` へ置き換える。
4. 記事のフロントマター直後へ、制作証跡の非表示コメントを追加する。

```md
<!-- product-article-character-sheets: tamashiro-yusuke-character-sheet-v5.png, tl-four-character-style-master-v2.png, tamashiro-yusuke-business-casual-character-sheet-v3.png -->
<!-- product-article-character-check: hero-and-body-verified -->
```

5. 機械検査を実行する。

```bash
python3 ~/.claude/skills/tamashiro-product-article/scripts/check_product_article.py src/content/blog/fungoal-bibs-number-basketball.md
```

> **解消済み（2026-09-23）**
> 検査スクリプトが正本として認めるファイル名の一覧が、2026-09-19の画風統一より前の版で止まっていました。
> `CHARACTER_GUIDE.md` の現行正本（v5・共通見本v2・Rira v3・Riku v3・Nana v2）を**追加**する形で更新済みです（旧版は既存記事のために残しています）。
> 対象ファイル: `~/.codex/skills/tamashiro-product-article/scripts/check_product_article.py`


6. `npm run build` を実行し、成功を確認してからコミットする。
