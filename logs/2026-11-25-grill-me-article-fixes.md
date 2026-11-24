# 2026-11-25 grill-me の記事の直し

## なぜ直したか

保管庫で tsuzuri（文章の組み立てのスキル）を試したとき、流れを知らないAIに記事の前半を読ませた。すると、事情を知らないと読めない所がいくつも見つかった。yasashii-bunsho に同じ点検（流れを知らない読み手に読ませる）を足し、記事の全文で2回読ませて直した。比べた記録は保管庫の `06_Personal_Learning/tsuzuri-yomiyasu-tameshi/比較メモ.md`。

## 確かめた事実

- コミュニティの「名前」：保管庫の `decisions/2026-08-06_AI活用コミュニティ設立方針.md` に「名義は玉城祐輔個人名義を前面に出す」。そのため「会社と私個人のどちらの名前で開くか」にした
- 玉城さんの grill-me（`00_AI共通/skills/grill-me/SKILL.md`）は 10/27 に、1回4問までのラウンド制・AIが自分から呼べる形に変わっていた。`disable-model-invocation` の行は無い。記事の「1回に1問だけ聞く説明書を使っている」を今の形に直した
- 作者の説明（mattpocock/skills の docs/productivity/grill-me.md・grilling.md）：「わからない」はちゃんとした答え。決めにくい質問は prototype のスキルで試作品を作ってから答える。「わからない」と答えたらおすすめで進めてよいかを聞き返すのは、記事の見本の説明書の動き
- 作者の README の入れ方は Claude Code・Codex・Copilot・VS Code・Gemini・skills.sh。記事で紹介する4つのうち、作者の方法は3つ
- vercel-labs は Vercel の組織（GitHub の説明「Creators of Next.js」・blog vercel.com）

## 主な直し（20か所）

- 「自分で調べればわかる事実は、AIが調べる」→「調べればわかる事実は、AIが自分で調べる」
- 決まりに書いていることと、自分用の grill-me がAIから呼べることを書いた
- 入れ方4つのうち作者の方法は3つと書いた。「同じ道具に」→「同じAI（Claude Code か Codex）に」
- skills の道具が Vercel Labs のものだと書いた。作者の README の手順の言い方を直した
- 見本の行番号（3行目→4行目）を直し、`disable-model-invocation` の行を消すとAIが自分から使えると足した
- 試作品は「AIに作ってもらう」と書いた。Codex の部分の念押しの重なりを1つ削った
- updatedDate を 2026-11-25 にした

## 検査

- `npm run build`：成功（46ページ）
