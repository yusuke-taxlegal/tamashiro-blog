# そら塾記事 画像生成記録

作成日: 2026-08-29  
生成方式: Codex組み込み画像生成  
正本: `tamashiro-yusuke-business-casual-character-sheet-v3.png`  
正本SHA-256: `17797a89e8010144c0632b3ce509b05ff87805373a49722f35841646e4129b7a`

## 共通の固定条件

- 正本と同じ玉城祐輔（ビジネスカジュアル）を使う。
- 約2頭身、短い胴体・腕・脚、低い重心、丸くコンパクトな成人男性として描く。
- 濃紺のジャケット、白い丸首Tシャツ、濃紺のパンツ、茶色の男性用紐付きダービーシューズを維持する。
- 子ども、生徒、先生、追加人物を描かない。
- 画面、ノート、カレンダー、電卓に読める文字・数字・ロゴを描かない。
- 写真調、写実的3D、透かしを使わない。

## 1. ヒーロー

ファイル: `hero-tamashiro-yusuke-desk-setup.webp`  
比率: 3:2（1536×1024）

```text
Use case: illustration-story
Asset type: ysk.life blog article hero image
Primary request: Create the hero illustration for a Japanese parent's article about preparing a home desk for an online middle-school lesson.
Input images: Image 1 is the strict canonical identity and outfit reference for Tamashiro Yusuke. Do not use a portrait photo to regenerate his face.
Subject: Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine dark-brown lace-up Derby shoes. Every visible full-body pose must use the same compact proportions and masculine lace-up shoes.
Scene/action: Full body, standing at a small home study desk in the evening, setting up for an online lesson. He is placing a tablet on a stand with both hands. Wired earphones, an open notebook, and a pencil are already laid out on the desk, and a sports bag rests on the floor beside the desk. He is alone. The tablet screen is blank with no text, no interface, and no logo.
Expression/pose: friendly broad tooth-showing smile, calm and careful hands-on posture.
Background: simple Japanese home study corner in the evening, plain wall, desk lamp with warm light, window showing dark sky, uncluttered, plenty of empty space on one side.
Style/medium: match the reference's cute-pop Japanese chibi illustration, dark plum-brown outlines, flat anime coloring, restrained highlights, soft warm shadows; editorial rather than advertising.
Composition/framing: landscape 3:2, full body and entire small desk visible, balanced asymmetrical composition with practical negative space.
Color palette: deep navy, white, dark brown, warm coral accents, soft cream wall, muted blue night window.
Constraints: Keep identity, face, hairstyle, clothing, body proportions, and shoe type identical to Image 1. Do not draw any child, student, teacher, or additional person. Do not draw a real service screen. No readable text, numbers, logos, watermark, branded marks, or school name.
Avoid: long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, photorealism, photography, realistic 3D, text artifacts, deformed hands, extra fingers.
```

## 2. 学習環境の確認

ファイル: `tamashiro-yusuke-study-corner-check.webp`  
比率: 16:9（1672×941）  
推奨alt: `玉城祐輔が自宅の学習コーナーでWi-Fiルーターと机の位置を確認しているイメージイラスト`

```text
Use case: illustration-story
Asset type: ysk.life blog article body illustration
Primary request: Illustrate a Japanese parent checking whether a home study corner has a suitable network connection and desk placement for an online lesson.
Input images: Image 1 is the strict canonical identity and outfit reference for Tamashiro Yusuke. Do not use a portrait photo to regenerate his face.
Subject: Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine dark-brown lace-up Derby shoes. Every visible full-body pose must use the same compact proportions and masculine lace-up shoes.
Scene/action: Full body, crouching slightly beside a small white Wi-Fi router on a low shelf next to a home study desk, checking it with one hand while looking back toward the desk and empty chair to judge the distance. He is alone. Screens must be blank with no text, no interface, and no logo.
Expression/pose: friendly broad tooth-showing smile, attentive checking posture.
Background: simple Japanese home study corner in daytime, plain wall, small desk with an empty chair, low shelf, soft daylight from a window, uncluttered.
Style/medium: match the reference's cute-pop Japanese chibi illustration, dark plum-brown outlines, flat anime coloring, restrained highlights, soft shadows; practical editorial illustration.
Composition/framing: landscape 16:9, full body, router, desk, and empty chair clearly visible, with calm negative space.
Color palette: deep navy, white, dark brown, soft cream wall, pale blue daylight, a restrained coral accent.
Constraints: Keep identity, face, hairstyle, clothing, body proportions, and shoe type identical to Image 1. Do not draw any child, student, teacher, or additional person. No readable text, numbers, logos, watermark, branded marks, or school name.
Avoid: long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, photorealism, photography, realistic 3D, text artifacts, deformed hands, extra fingers.
```

## 3. 1年分の費用確認

ファイル: `tamashiro-yusuke-yearly-cost.webp`  
比率: 16:9（1672×941）  
推奨alt: `玉城祐輔がノートとカレンダーを広げ、1年分の塾費用を書き出して確認しているイメージイラスト`

```text
Use case: illustration-story
Asset type: ysk.life blog article body illustration
Primary request: Illustrate a Japanese parent calculating the full annual cost of an online cram school rather than looking only at the monthly fee.
Input images: Image 1 is the strict canonical identity and outfit reference for Tamashiro Yusuke. Do not use a portrait photo to regenerate his face.
Subject: Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine dark-brown lace-up Derby shoes. Every visible full-body pose, including seated poses, must use the same compact proportions and masculine lace-up shoes.
Scene/action: Seated at a home dining table at night, writing in an open notebook with a pencil. A simple wall calendar hangs behind him and a small calculator sits on the table beside the notebook. He is alone. Keep the notebook, calculator display, and calendar pages blank with no readable text, numbers, or logo.
Expression/pose: calm friendly smile, focused thinking posture with one hand on the notebook.
Background: simple Japanese home dining room at night, plain wall, wall calendar, warm pendant light, uncluttered.
Style/medium: match the reference's cute-pop Japanese chibi illustration, dark plum-brown outlines, flat anime coloring, restrained highlights, soft warm shadows; practical editorial illustration.
Composition/framing: landscape 16:9, full compact seated body and brown lace-up shoes visible beneath the table, notebook, calculator, and calendar clearly legible as objects, generous uncluttered space.
Color palette: deep navy, white, dark brown, soft cream wall, warm amber light, a restrained coral accent.
Constraints: Keep identity, face, hairstyle, clothing, body proportions, and shoe type identical to Image 1. Do not draw any child, student, teacher, or additional person. No readable text, numbers, logos, watermark, branded marks, or school name.
Avoid: long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, photorealism, photography, realistic 3D, text artifacts, deformed hands, extra fingers.
```

## 目視確認

- 正本と同じ顔、髪型、服装、配色、茶色の紐付き靴を確認済み。
- 約2頭身、短い手足、成人男性としての同一性を確認済み。
- 子ども、追加人物、読める文字、数字、ロゴ、写真調、写実的3Dがないことを確認済み。
- 手指、耳、靴、比率、余白を確認済み。
