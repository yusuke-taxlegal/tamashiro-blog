# 2026-09-28 記事「Claudeデスクトップ版の入れ方と初期設定。Coworkに仕事を任せる準備」

- ブランチ: `article/claude-desktop-cowork-setup`（未コミット・未公開）
- 記事: `src/content/blog/claude-desktop-cowork-setup.md`（category: AIの使い方 / accent: coral）
- 依頼: ChatGPT版（chatgpt-desktop-work-setup）と同様に、Claudeのデスクトップ版のインストールからCoworkを活用できる環境構築までを解説。導入用プロンプト付き。メモリ等を使い「その人に沿ったClaude」にする設定を含める
- 記事の役割: `Claude有料プランの契約者に：デスクトップ版を入れる場面で：Coworkへ仕事を任せられる状態まで自分で設定できる記事`
- 使用スキル: tamashiro-product-article（アフィリエイトリンクなし。購入枠は置いていない）

## 依頼文との用語の整理
- 依頼は「Claude Codeのデスクトップ版」「Claude Codeへのプロンプト」だったが、公式の名称はアプリが「Claude（Claude Desktop）」、機能が「Chat／Cowork／Code」。Claude Code は開発者向けの Code 画面を指す
- 記事はアプリ名を「Claudeデスクトップ版」、任せる機能を「Cowork」と表記し、冒頭に「名前の整理」の節を置いた。Code 画面は FAQ で補足

## 構成
先に結論（準備7つ）→ 名前の整理・新旧の画面・作業が動く場所 → 始める前の確認 → ステップ1〜7 → つまずきやすいところ → まだ急がなくてよい人 → FAQ → 今日やること → 公式情報

## プロンプト（12本のコードブロック。うち1本はフォルダ構成図）
1. 設定の伴走役を頼む
2. 作業フォルダの小分けを作らせる
3. メモリの棚卸し
4. メモリの修正・忘れてほしい情報の指定
5. ChatGPT側で記憶を書き出させる（Claudeへの取り込み用）
6. Claudeの指示（グローバル指示）の下書き
7. 作業フォルダ用の説明書（CLAUDE.md）の下書き
8. 自分の情報が伝わっているかの確認
9. 見積書3枚から比較表を作る
10. 作業後に説明書への追記案を出させる
11. /schedule で定期タスクを組む

## 公式確認（2026-09-28。support.claude.com / privacy.claude.com / code.claude.com をブラウザで原文確認）
- Claude Desktopをインストール: 対応プラン表（Coworkは有料プランのみ）、macOS 11以上、Windows 10以上、claude.com/download
- Claude Coworkを始める: クラウド実行（ベータ）、ローカルファイルはデスクトップ版経由、承認モード（手動／自動／スキップ）、削除保護、グローバル指示（設定 > Cowork）、/schedule、使用量（設定 > 使用状況）、トラブルシューティング
- Claude Coworkとチャットが1つのClaudeに統合: Pro・Maxから段階的に切り替え、承認は自動／手動（既定）、グローバル指示は 設定 > 一般 の「Claudeの指示」へ、依頼文の3要素（結果・形式・入力）
- Claude Coworkを安全に使用する: プロンプトインジェクション、専用作業フォルダの推奨、スケジュール済みタスクの注意、利用者の責任
- プロジェクト: 「＋」→ 最初から開始／プロジェクトからインポート／既存フォルダを使用、プロジェクトごとのメモリ、既存フォルダ由来のプロジェクトはそのパソコンに残る
- ウェブ・デスクトップ・モバイル: ローカルファイルはデスクトップ版が開いている間だけ
- メモリ: 設定 > メモリ、「チャットからメモリを生成」「チャットを検索して参照」、Free/Pro/Maxは既定オン・Team/Enterpriseは既定オフ、ChatとCoworkで共有（クラウド実行時のみ）、機密トピックは既定で保存しない、シークレットチャット
- メモリのインポート・エクスポート: 他社AIからの取り込み手順と書き出し用の依頼文
- プライバシーセンター: 個人向けプランは改善への利用を選択、評価ボタンを押した会話は保存される
- Claude Code ドキュメント: デスクトップ版の3タブの説明、CLAUDE.md は毎回の開始時に読み込まれる、短く具体的に書く

## 確認できなかった点（記事では断定を避けた）
- 学習設定のトグルの日本語表記。公式ページで文言を確認できず、記事は「プライバシー」の中の「Claudeの改善への協力についての項目」と書いた
- Cowork が作業フォルダの CLAUDE.md を自動で読むかどうか。公式ヘルプは「フォルダ指示」とだけ説明しファイル名を明記していない。Claude Code のドキュメントには Cowork セッションで CLAUDE.md を読む前提の記述がある。記事では依頼文の冒頭で名指しし、プロジェクトの指示欄にも同じ文章を貼る方法を案内
- 「Work in a folder」の日本語表記。英語表記を併記
- 新しい画面への切り替えの開始日。時期は書かず「いま順番に進んでいる」とした
- 玉城本人のCoworkの利用状況は未確認のため、使用体験としての記述は入れていない

## 競合調査（本文には不掲載）
- 「Claude Cowork 使い方」で上位の国内記事を確認（メーカー系メディア、AI系メディア、個人の導入手順記事）。共通構成は「Coworkとは → 料金 → 使い方 → 活用例」
- ChatとCoworkの統合、メモリがクラウド実行時だけ共有される点、指示と説明書を併用する準備を扱う記事は少なく、本記事はそこを主題にした

## 画像（Codex CLI で生成、1536x1024 → WebP。比率は3:2のまま）
- hero-tamashiro-yusuke-accounting-staff.webp（玉城v5＋総務・経理担当者）
- rira-worried-business-owner-one-window.webp（Rira v3＋悩める社長）
- riku-worried-business-owner-approval.webp（Riku v3＋悩める社長）
- tamashiro-yusuke-rira-three-layers.webp（Rira v3＋玉城v5）
- 全画像で集合見本 tl-four-character-style-master-v2.png を併用
- Readで正本と目視照合済み（玉城の髪型・スーツ・黒い紐付き革靴、経理担当者のサイドポニーテール・ローファー、Riraの花の数と位置・イヤーピース右、Rikuの前髪・イヤーピース右・パーカー・スニーカー、社長の無精ひげ・ブルゾン・ワークブーツ。文字・ロゴ・余分な人物なし）

## 検証
- check_product_article.py: OK（警告0）/ check:affiliate: 問題なし（既存記事の注意3件のみ）/ npm run build: 成功（35ページ）
- 画像の取りこぼし検査: 4項目とも0件
- ビルド成果物プレビュー（4331）
  - 1440px: 横はみ出しなし、pre 12個とも横はみ出しなし、共有アイコン列と本文左端が一致（177px）、H1は4行
  - 390px: 横はみ出しなし、pre 横はみ出しなし、共有ボタン4つが46×46pxで横一列
  - 本文挿絵3枚とヒーローは naturalWidth>0、og:type=article、og:image はヒーロー画像、canonical は https://ysk.life/blog/claude-desktop-cowork-setup/
  - 記事内リンク（ChatGPT版記事、AI業務情報の記事）はビルド済みページに存在
  - 404は /api/engagement のみ（静的プレビューのため）

## 未実施
- コミット、mainへのマージ、push、本番反映は行っていない（この記事についての公開指示は未受領）
