# 画像引き継ぎ｜grill-me の解説と Claude Code・Codex への入れ方

対象記事: `src/content/blog/grill-me-skill-claude-code-codex.md`
作成日: 2026-10-26

## 状態

画面の図・図解3枚（`diagram-grill-flow`・`screen-grill-round`・`diagram-install-routes`）は、HTMLで組んで Chromium で撮影し、設置済みです。道具は `docs/figures/grill-me-skill-claude-code-codex/`（`base.css`・図ごとのHTML・`shot.cjs`）。

キャラクターの挿絵3枚（ヒーロー1枚＋本文2枚）は**設置済み**です（2026-10-27、PC の Codex CLI で正本シートを参照画像に渡して生成し、正本と見比べて設置。記録は `logs/2026-10-26-grill-me-skill-article.md`）。記事を書いたクラウドの環境には Codex CLI が無かったため、PC で仕上げました。

## 使い方

ChatGPTで GPT Image 2 を選び（または Codex CLI の `generate_character_image.sh`）、記載の正本シートを画像添付のうえ、下記プロンプトをそのまま貼り付けて生成してください。
生成後は `CHARACTER_GUIDE.md` の「生成後の確認項目」で崩れがないか確認し、`.webp` に変換して指定パスへ保存し、チェックを入れてください。

正本シートの場所（Obsidian Vault側）:
`00_Obsidian/01_T&L_収益化プロジェクト/brand-assets/tl-support/character-sheets/`

設置したら、次の順で仕上げます。

1. ヒーロー：フロントマターに `heroImage: '../../assets/blog/grill-me-skill-claude-code-codex/hero-tamashiro-yusuke-rira-question-cards.webp'` を足し、本文先頭のヒーロー用プレースホルダーのコメントを消す
2. 本文2枚：プレースホルダーのコメントを `![alt](…)` に置き換える（altは下記と同じ文）
3. frontmatter の直後に証跡コメントを足す（実際に添付した正本だけを書く）
   - `<!-- product-article-character-sheets: tamashiro-yusuke-character-sheet-v5.png, tl-four-character-style-master-v2.png, tamashiro-yusuke-business-casual-character-sheet-v3.png, rira-character-sheet-v3.png, worried-business-owner-character-sheet-v1.png -->`
   - `<!-- product-article-character-check: hero-and-body-verified -->`
4. `npm run build` が通ることを確かめてからコミットする

### この記事固有の注意

- 質問カードには**読める文字を描かせない**。「Q1」「Q2」のような短い英数字だけ、または記号（？）だけにする。日本語は崩れるので入れない
- 画面に Claude Code や Codex のロゴ・実在の画面を描かせない
- 玉城祐輔は本文の雰囲気に合わせてビジネスカジュアル衣装。靴は黒い紐付き革靴

---

## 1. ヒーロー画像

- 保存先パス: `src/assets/blog/grill-me-skill-claude-code-codex/hero-tamashiro-yusuke-rira-question-cards.webp`
- 用途: 記事のヒーロー画像（フロントマターの `heroImage`）
- alt文言: 記事本文には書かず、フロントマターの `heroImage` に指定する
- 添付する正本シート: `tamashiro-yusuke-character-sheet-v5.png`、`2026-09-19_style-unified/tl-four-character-style-master-v2.png`、`tamashiro-yusuke-business-casual-character-sheet-v3.png`、`rira-character-sheet-v3.png`
- アスペクト比: 3:2（1536x1024）
- 完了: - [x] 2026-10-27 設置

```text
Use tamashiro-yusuke-character-sheet-v5.png and tl-four-character-style-master-v2.png as the current identity and style references. Use the old tamashiro-yusuke-business-casual-character-sheet-v3.png ONLY for the casual clothing design, overriding its brown shoes with BLACK lace-up leather shoes. Do not use a portrait photo to regenerate his face.
Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine black lace-up Derby shoes. Every visible full-body pose, including seated poses, must use the same compact proportions and masculine lace-up shoes. No long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, logo, watermark, photorealism, or 3D.

Use the attached rira-character-sheet-v3.png as the canonical identity reference.
Draw the exact same Rira: an approximately 2.0-head-tall cute-pop Japanese chibi AI secretary. Her oversized head occupies about half her total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve her rounded short dark-brown bob, side-swept bangs, large deep plum-brown eyes, peach cheeks, and gentle smile. Keep the canonical asymmetry unchanged: on the viewer-right hair side, a compact cluster of TWO pale-lilac five-petal blossoms, one large above and one small below, with mint leaves; on the viewer-left side, one tiny pale-lilac blossom and two small mint leaves. The slim silver-lilac earpiece must always remain on the viewer-right ear area. Preserve the white long-sleeve blouse, rounded pale-lilac collar and cuffs, deep-plum A-line midi skirt, and dark-plum low heels. No long legs, tall or slim proportions, child identity, mirrored accessories, costume variant, logo, watermark, photorealism, or 3D.
Do not blend the two characters' faces or exchange clothing. Use one consistent outline weight and shading across both.

Scene/action: Tamashiro Yusuke sits at a simple desk with an open laptop (blank screen, no logo), one hand on his chin, thinking. Rira stands beside the desk and holds out a small fan of three white question cards toward him. Each card shows only a large simple "?" mark or the short labels "Q1", "Q2", "Q3"; no other text. A small sticky note with a simple check mark sits on the desk.
Expression: Tamashiro: thoughtful, slightly smiling. Rira: gentle smile.
Background: simple bright home office, flat illustration style, plain light wall, a plant, uncluttered, plenty of empty space on one side
Aspect ratio: 3:2
```

---

## 2. 本文｜「おすすめの答えに、1つだけ『いいえ』と言った日」の末尾

- 保存先パス: `src/assets/blog/grill-me-skill-claude-code-codex/rira-worried-business-owner-question-cards.webp`
- 用途: 本文「私はこんな場面で使っています」の終わり
- alt文言: AI秘書のRiraが番号の付いた質問カードを1枚ずつ差し出し、悩める社長がカードを手に持って首をかしげながら答えを考えているイラスト
- 添付する正本シート: `rira-character-sheet-v3.png`、`worried-business-owner-character-sheet-v1.png`、`2026-09-19_style-unified/tl-four-character-style-master-v2.png`
- アスペクト比: 16:9（1672x941）
- 完了: - [x] 2026-10-27 設置

```text
Use the attached rira-character-sheet-v3.png as the canonical identity reference.
Draw the exact same Rira: an approximately 2.0-head-tall cute-pop Japanese chibi AI secretary. Her oversized head occupies about half her total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve her rounded short dark-brown bob, side-swept bangs, large deep plum-brown eyes, peach cheeks, and gentle smile. Keep the canonical asymmetry unchanged: on the viewer-right hair side, a compact cluster of TWO pale-lilac five-petal blossoms, one large above and one small below, with mint leaves; on the viewer-left side, one tiny pale-lilac blossom and two small mint leaves. The slim silver-lilac earpiece must always remain on the viewer-right ear area. Preserve the white long-sleeve blouse, rounded pale-lilac collar and cuffs, deep-plum A-line midi skirt, and dark-plum low heels. No long legs, tall or slim proportions, child identity, mirrored accessories, costume variant, logo, watermark, photorealism, or 3D.

Use the attached worried-business-owner-character-sheet-v1.png as the canonical identity and outfit reference.
Draw the exact same worried business owner: an adult Japanese small-business owner rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and especially the legs short, with a low center of gravity and compact rounded adult silhouette. Preserve his tousled medium-dark brown hair with its lifted crown tuft and side-swept fringe, large warm-brown eyes, thick eyebrows, subtle under-eye tiredness, and light short stubble along the upper lip and jaw. Preserve the charcoal-gray functional work blouson with collar, two chest pockets and two lower slanted pockets, gray-and-white striped polo, beige work trousers, and masculine dark-brown lace-up work boots with broad rounded toes and flat sturdy soles. Keep the same face, hair, stubble, proportions, and clothing in every pose. No long legs, tall or slim proportions, child identity, elderly identity, suit, tie, dress shoes, loafers, pumps, high heels, logo, watermark, photorealism, or 3D.
Use tl-four-character-style-master-v2.png only as the shared drawing-style reference. Do not blend the two characters' faces.

Scene/action: Rira hands one white card labeled only "Q2" to the business owner, while she holds a small stack of more cards labeled "Q3" and "Q4". The business owner already holds a card labeled "Q1" in one hand and tilts his head, thinking about his answer, the other hand scratching his head. No other text anywhere.
Expression: Rira: gentle smile. Business owner: confused but thinking.
Background: simple small office counter, flat illustration style, plain pale wall, uncluttered
Aspect ratio: 16:9
```

---

## 3. 本文｜「grill-me をうまく使うコツ」の末尾

- 保存先パス: `src/assets/blog/grill-me-skill-claude-code-codex/tamashiro-yusuke-answer-in-own-words.webp`
- 用途: 本文「grill-me をうまく使うコツ」の終わり（自分の言葉で答える）
- alt文言: 玉城祐輔がノートパソコンの前で、画面に並んだ質問カードの1枚を指さし、自分の言葉で答えを書き足しているイラスト
- 添付する正本シート: `tamashiro-yusuke-character-sheet-v5.png`、`2026-09-19_style-unified/tl-four-character-style-master-v2.png`、`tamashiro-yusuke-business-casual-character-sheet-v3.png`
- アスペクト比: 16:9（1672x941）
- 完了: - [x] 2026-10-27 設置

```text
Use tamashiro-yusuke-character-sheet-v5.png and tl-four-character-style-master-v2.png as the current identity and style references. Use the old tamashiro-yusuke-business-casual-character-sheet-v3.png ONLY for the casual clothing design, overriding its brown shoes with BLACK lace-up leather shoes. Do not use a portrait photo to regenerate his face.
Draw the exact same Tamashiro Yusuke: a petite 160 cm Japanese adult business professional rendered as an approximately 2.0-head-tall cute-pop chibi. His oversized head occupies about half the total height; keep the torso, arms, and legs visibly short, with a low center of gravity, small rounded feet, and compact round silhouette. Preserve the exact broad rounded-square face, neatly swept short dark-brown hair silhouette, thick straight brows, large warm-brown eyes, medium ears, peach cheeks, and friendly broad tooth-showing smile from the reference. Preserve the open deep-navy two-button blazer, plain white crew-neck T-shirt, matching short deep-navy trousers, and masculine black lace-up Derby shoes. Every visible full-body pose, including seated poses, must use the same compact proportions and masculine lace-up shoes. No long legs, tall or slim proportions, child identity, pumps, ballet flats, high heels, sneakers, tie, dress-shirt collar, lapel pin, logo, watermark, photorealism, or 3D.

Scene/action: Tamashiro sits at a desk in front of a laptop. Floating beside the laptop are three simple white cards in a row, each with a small green check mark, except the third card which has a small pencil icon. He points at the third card with one hand and holds a pen in the other, as if writing his own answer. No readable text anywhere, no logos on the laptop.
Expression/pose: confident, friendly smile
Background: simple bright office, flat illustration style, plain light wall, uncluttered, plenty of empty space
Aspect ratio: 16:9
```
