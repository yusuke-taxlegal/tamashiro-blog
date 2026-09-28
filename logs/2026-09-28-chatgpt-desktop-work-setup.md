# 2026-09-28 記事「ChatGPTデスクトップ版の入れ方と初期設定。Workに仕事を任せる準備」

- ブランチ: `article/chatgpt-desktop-work-setup`（未コミット・未公開）
- 記事: `src/content/blog/chatgpt-desktop-work-setup.md`（category: AIの使い方 / accent: coral）
- 依頼: 有料版契約者向けに、デスクトップ版のインストールからWorkを活用できる環境構築までを解説。導入用プロンプト付き。メモリ等を使い「その人に沿ったChatGPT」にする設定を含める
- 記事の役割: `ChatGPT有料プランの契約者に：デスクトップ版を入れる場面で：Workへ仕事を任せられる状態まで自分で設定できる記事`
- 使用スキル: tamashiro-product-article（アフィリエイトリンクなし。購入枠は置いていない）

## 構成
先に結論（準備7つ）→ Chat/Work/Codexの違い → 始める前の確認 → ステップ1〜7 → つまずきやすいところ → まだ急がなくてよい人 → FAQ → 今日やること → 公式情報

## プロンプト（11本のコードブロック。うち1本はフォルダ構成図）
1. 設定の伴走役を頼む
2. 作業フォルダの小分けをWorkに作らせる
3. メモリの棚卸し
4. メモリの修正・使わない情報の指定
5. カスタム指示の下書き
6. 作業フォルダ用の説明書（AGENTS.md）の下書き
7. 自分の情報が伝わっているかの確認
8. 議事メモから報告書を作る（目的・材料・形・守ること）
9. 作業後に説明書への追記案を出させる
10. 定期タスクの予定を組む

## 公式確認（2026-09-28。help.openai.com はブラウザで原文を確認）
- ChatGPT ワークと Codex: モードの違い、対応プラン、デスクトップでの始め方、ローカル実行でもコンテキストがクラウド保存され得る点、クラウドチャットの同期
- 新しい ChatGPT デスクトップアプリへの移行: 7月9日提供、ChatGPT Classic との併存
- macOS システム要件: macOS 14、Appleシリコン（M1以降）または Intel
- ダウンロードページ（日本語）: 「ChatGPT ワークは、Plus、Pro、Business、Enterprise プランで利用できます」
- ChatGPT のメモリ: 設定 > パーソナライズ > メモリ、「保存したメモリを参照する」「チャット履歴を参照する」
- ChatGPT カスタム指示: Free/Go 1,500文字、Plus以上 5,000文字、「カスタマイズを有効にする」
- ChatGPT のデータ管理: 「すべての人のためにモデルを改善する」、法人向けは既定で学習に使わない
- learn.chatgpt.com: get-started-with-work / projects（Edit project、Add folder、Make primary）/ permission-modes（Ask for approval、Approve for me、Full access、Settings > General > Permissions）/ customization/memories（Enable memories、/memories、既定オフ）/ plugins / prompting（Goal・Context・Output・Boundaries）

## 確認できなかった点（記事では断定を避けた）
- Windows版の新アプリの対応バージョン。ヘルプの記載（Windows 10 17763.0以降）は旧アプリの説明ページのため、記事では「ストアのページで確認」とした
- Work が作業フォルダの AGENTS.md を自動で読むかどうか。公式は Codex について明記。記事では依頼文の冒頭で名指しする方法を案内
- デスクトップ版の設定画面の日本語表記。公式ドキュメントの英語表記（Work locally、Ask for approval、Enable memories など）をそのまま記載
- 玉城本人のWorkの利用状況は未確認のため、使用体験としての記述は入れていない

## 競合調査（本文には不掲載）
- 「ChatGPT Work 使い方」で上位の国内記事6件ほどを確認（Zenn、note、AI系メディア）。共通構成は「Workとは → 料金 → 使い方 → Codexとの違い」
- メモリ・カスタム指示をWorkの準備として扱う記事は見当たらず、本記事はそこを主題にした

## 画像（Codex CLI で生成、1536x1024 → WebP。比率は3:2のまま）
- hero-tamashiro-yusuke-worried-business-owner.webp（玉城v5＋悩める社長）
- rira-worried-business-owner-chat-vs-work.webp（Rira v3＋悩める社長）
- tamashiro-yusuke-accounting-staff-work-folder.webp（玉城v5＋総務・経理担当者）
- tamashiro-yusuke-rira-profile-note.webp（Rira v3＋玉城v5）
- 全画像で集合見本 tl-four-character-style-master-v2.png を併用
- Readで正本と目視照合済み（玉城の髪型・スーツ・黒い紐付き革靴、社長の無精ひげ・ブルゾン・ワークブーツ、Riraの花の数と位置・イヤーピース右、経理担当者のサイドポニーテール・ローファー。文字・ロゴ・余分な人物なし）

## 検証
- check_product_article.py: OK（警告0）/ check:affiliate: 問題なし（既存記事の注意3件のみ）/ npm run build: 成功（34ページ）
- 画像の取りこぼし検査: 4項目とも0件
- ビルド成果物プレビュー（4331）
  - 1440px: 横はみ出しなし、pre 11個とも横はみ出しなし、共有アイコン列と本文左端が一致（177px）、H1は4行
  - 390px: 横はみ出しなし、pre 横はみ出しなし、共有ボタン4つが46×46pxで横一列
  - 画像は全件 naturalWidth>0、og:type=article、og:image はヒーロー画像、canonical は https://ysk.life/blog/chatgpt-desktop-work-setup/
  - /api/engagement の404は静的プレビューのため（Pages Functions未起動）
- `lib/engagement/articles.json` は prebuild が自動で新しいslugを追記

## 未実施
- コミット、mainへのマージ、push、本番反映は行っていない
